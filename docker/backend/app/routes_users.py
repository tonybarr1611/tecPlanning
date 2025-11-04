from flask import Blueprint, g, jsonify, request

from auth_utils import auth_required
from extensions import db
from models import (
    AcademicEvent,
    Course,
    CourseSection,
    Program,
    User,
    UserCourseStatus,
    UserScheduleEntry,
)
from seed_data import CURRENT_TERM

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/me", methods=["GET"])
@auth_required
def get_profile():
    return jsonify(g.current_user.to_dict()), 200


@users_bp.route("/me", methods=["PUT"])
@auth_required
def update_profile():
    user = g.current_user
    payload = request.get_json() or {}

    name = payload.get("name")
    carne = payload.get("carne")
    program_code = payload.get("programCode")

    if name:
        user.name = name.strip()

    if carne and carne != user.carne:
        existing_carnet = User.query.filter_by(carne=carne).first()
        if existing_carnet and existing_carnet.id != user.id:
            return jsonify({"message": "Carné already registered"}), 409
        user.carne = carne.strip()

    if program_code and user.program and program_code != user.program.code:
        new_program = Program.query.filter_by(code=program_code).first()
        if not new_program:
            return jsonify({"message": "Program not found"}), 400
        user.program = new_program

        # Reset course statuses for the new program
        UserCourseStatus.query.filter_by(user_id=user.id).delete(synchronize_session=False)
        UserScheduleEntry.query.filter_by(user_id=user.id).delete(synchronize_session=False)
        db.session.flush()
        statuses = [
            UserCourseStatus(
                user_id=user.id,
                course_id=course.id,
                status=course.default_status or "not-coursed",
            )
            for course in new_program.courses
        ]
        db.session.bulk_save_objects(statuses)

        in_progress_course_ids = [
            course.id for course in new_program.courses if course.default_status == "in-progress"
        ]
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
    return jsonify(user.to_dict()), 200


@users_bp.route("/me/course-status", methods=["GET"])
@auth_required
def list_course_statuses():
    user = g.current_user
    statuses = (
        UserCourseStatus.query.join(Course)
        .filter(UserCourseStatus.user_id == user.id)
        .order_by(Course.code)
        .all()
    )

    response = []
    for status in statuses:
        course = status.course
        block_number = course.block.block_number if course.block else None
        response.append(
            {
                "course": course.to_dict(),
                "status": status.status,
                "blockNumber": block_number,
            }
        )
    return jsonify(response), 200


@users_bp.route("/me/course-status/<course_code>", methods=["PUT"])
@auth_required
def update_course_status(course_code: str):
    user = g.current_user
    payload = request.get_json() or {}
    new_status = payload.get("status")

    if new_status not in UserCourseStatus.VALID_STATUSES:
        return jsonify({"message": "Invalid status value"}), 400

    course = Course.query.filter_by(code=course_code).first()
    if not course:
        return jsonify({"message": "Course not found"}), 404

    status_record = UserCourseStatus.query.filter_by(
        user_id=user.id, course_id=course.id
    ).first()

    if not status_record:
        status_record = UserCourseStatus(
            user_id=user.id,
            course_id=course.id,
            status=new_status,
        )
        db.session.add(status_record)
    else:
        status_record.status = new_status

    db.session.commit()
    return jsonify({"message": "Status updated"}), 200


def _calculate_progress(user) -> dict:
    program = user.program
    total_credits = program.total_credits if program else 0
    approved_statuses = [
        status for status in user.course_statuses if status.status == "approved"
    ]
    completed_credits = sum(status.course.credits for status in approved_statuses)

    progress_percentage = (
        round((completed_credits / total_credits) * 100)
        if total_credits
        else 0
    )

    current_block = 0
    for status in user.course_statuses:
        if status.status in {"approved", "in-progress"} and status.course.block:
            current_block = max(current_block, status.course.block.block_number)

    current_semester = max(current_block, 1)
    remaining_semesters = max(
        (program.number_of_semesters or current_semester) - current_semester, 0
    )

    return {
        "progress": progress_percentage,
        "completedCredits": completed_credits,
        "totalCredits": total_credits,
        "currentSemester": current_semester,
        "remainingSemesters": remaining_semesters,
    }


def _serialize_schedule_entry(entry: UserScheduleEntry):
    section = entry.section
    if not section:
        return None

    meetings = [
        {
            "day": meeting.day_of_week,
            "startTime": meeting.start_time.strftime("%H:%M"),
            "endTime": meeting.end_time.strftime("%H:%M"),
        }
        for meeting in section.meetings
    ]

    return {
        "code": section.course.code if section.course else None,
        "name": section.course.name if section.course else None,
        "term": entry.term,
        "section": section.section_code,
        "professor": section.professor,
        "location": section.location,
        "meetings": meetings,
    }


@users_bp.route("/me/dashboard", methods=["GET"])
@auth_required
def get_dashboard():
    user = g.current_user
    progress = _calculate_progress(user)

    current_courses = [
        entry
        for entry in user.schedule_entries
        if entry.is_current_term and entry.section is not None
    ]
    serialized_courses = [
        data
        for entry in current_courses
        if (data := _serialize_schedule_entry(entry)) is not None
    ]

    events = (
        AcademicEvent.query.filter(
            (AcademicEvent.program_id == None) | (AcademicEvent.program_id == user.program_id)
        )
        .order_by(AcademicEvent.event_date.asc())
        .limit(10)
        .all()
    )

    return (
        jsonify(
            {
                "user": user.to_dict(),
                "progress": progress,
                "currentCourses": serialized_courses,
                "upcomingEvents": [event.to_dict() for event in events],
            }
        ),
        200,
    )


@users_bp.route("/me/schedule", methods=["GET"])
@auth_required
def get_schedule():
    user = g.current_user
    entries = [
        _serialize_schedule_entry(entry)
        for entry in user.schedule_entries
        if entry.section is not None
    ]
    return jsonify([entry for entry in entries if entry is not None]), 200


@users_bp.route("/me/curriculum", methods=["GET"])
@auth_required
def get_curriculum_with_status():
    user = g.current_user
    program = user.program
    if not program:
        return jsonify({"message": "Program not assigned"}), 400

    statuses_by_course = {
        status.course_id: status.status for status in user.course_statuses
    }

    blocks = []
    for block in sorted(program.course_blocks, key=lambda b: b.block_number):
        courses = []
        for course in sorted(block.courses, key=lambda c: c.code):
            courses.append(
                {
                    "code": course.code,
                    "name": course.name,
                    "credits": course.credits,
                    "hours": course.hours,
                    "requirements": course.requisitos,
                    "corequisites": course.correquisitos,
                    "status": statuses_by_course.get(course.id, "not-coursed"),
                }
            )
        blocks.append(
            {
                "blockNumber": block.block_number,
                "courses": courses,
            }
        )

    progress = _calculate_progress(user)

    return (
        jsonify(
            {
                "program": {
                    "code": program.code,
                    "name": program.name,
                    "jornada": program.jornada,
                    "degree": program.degree,
                    "sedes": program.sedes,
                    "lastUpdated": program.last_updated.isoformat()
                    if program.last_updated
                    else None,
                    "totalCredits": program.total_credits,
                    "numberOfSemesters": program.number_of_semesters,
                },
                "progress": progress,
                "blocks": blocks,
            }
        ),
        200,
    )
