from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from auth_utils import generate_token
from extensions import db
from models import CourseSection, Program, User, UserCourseStatus, UserScheduleEntry
from seed_data import CURRENT_TERM

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    payload = request.get_json() or {}
    required_fields = ["name", "email", "password", "programCode", "carne"]

    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return (
            jsonify({"message": f"Missing required fields: {', '.join(missing)}"}),
            400,
        )

    email = payload["email"].lower().strip()
    carne = payload["carne"].strip()

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    if User.query.filter_by(carne=carne).first():
        return jsonify({"message": "Carné already registered"}), 409

    program = Program.query.filter_by(code=payload["programCode"]).first()
    if not program:
        return jsonify({"message": "Program does not exist"}), 400

    user = User(
        name=payload["name"].strip(),
        email=email,
        password_hash=generate_password_hash(payload["password"]),
        carne=carne,
        program=program,
    )

    db.session.add(user)
    db.session.flush()  # Ensure user.id is available

    # Initialize course statuses for the selected program
    statuses = []
    in_progress_course_ids = []
    for course in program.courses:
        initial_status = course.default_status or "not-coursed"
        if initial_status == "in-progress":
            in_progress_course_ids.append(course.id)
        statuses.append(
            UserCourseStatus(
                user_id=user.id,
                course_id=course.id,
                status=initial_status,
            )
        )
    db.session.bulk_save_objects(statuses)

    if in_progress_course_ids:
        sections = CourseSection.query.filter(
            CourseSection.course_id.in_(in_progress_course_ids),
            CourseSection.term == CURRENT_TERM,
        ).all()
        for section in sections:
            db.session.add(
                UserScheduleEntry(
                    user_id=user.id,
                    section_id=section.id,
                    term=section.term,
                    is_current_term=True,
                )
            )

    db.session.commit()

    token = generate_token(user)

    return (
        jsonify(
            {
                "token": token,
                "user": user.to_dict(),
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json() or {}
    email = (payload.get("email") or "").lower().strip()
    password = payload.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_token(user)
    return jsonify({"token": token, "user": user.to_dict()}), 200
