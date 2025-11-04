from __future__ import annotations

import json
import logging
from datetime import date, datetime, time
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

from werkzeug.security import generate_password_hash

from extensions import db
from models import (
    AcademicEvent,
    Course,
    CourseBlock,
    CourseMeeting,
    CourseSection,
    Program,
    User,
    UserCourseStatus,
    UserScheduleEntry,
)

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent / "data"

CURRENT_TERM = "II-2024"
NEXT_TERM = "I-2025"

SPANISH_MONTHS = {
    "enero": 1,
    "febrero": 2,
    "marzo": 3,
    "abril": 4,
    "mayo": 5,
    "junio": 6,
    "julio": 7,
    "agosto": 8,
    "septiembre": 9,
    "octubre": 10,
    "noviembre": 11,
    "diciembre": 12,
}


def _load_json(name: str):
    with (DATA_DIR / name).open(encoding="utf-8") as handler:
        return json.load(handler)


def _parse_program_last_updated(value: str | None) -> date | None:
    if not value:
        return None
    value = value.strip()
    try:
        return datetime.fromisoformat(value).date()
    except ValueError:
        pass
    parts = value.replace(" de ", " ").split()
    if len(parts) == 3:
        day = int(parts[0])
        month = SPANISH_MONTHS.get(parts[1].lower())
        year = int(parts[2])
        if month:
            return date(year, month, day)
    return None


def _parse_iso_date(value: str) -> date:
    return datetime.fromisoformat(value).date()


def _parse_time(value: str) -> time:
    return datetime.strptime(value, "%H:%M").time()


def seed_program() -> Program:
    payload = _load_json("program_data.json")

    program = Program.query.filter_by(code=payload["code"]).first()
    if program:
        logger.info("Program '%s' already present; skipping creation", program.code)
        return program

    block_count = 0
    course_count = 0

    program = Program(
        code=payload["code"],
        name=payload["program"],
        jornada=payload.get("jornada"),
        degree=payload.get("grado_académico"),
        last_updated=_parse_program_last_updated(payload.get("última_actualización")),
        total_credits=payload.get("total_credits", 0),
        number_of_semesters=payload.get("number_of_semesters", 0),
    )
    program.sedes = payload.get("sedes", [])

    db.session.add(program)
    db.session.flush()

    for block_payload in payload.get("courses", []):
        block = CourseBlock(
            program_id=program.id,
            block_number=block_payload["bloque"],
        )
        db.session.add(block)
        db.session.flush()

        for course_payload in block_payload.get("courses", []):
            course = Course(
                program_id=program.id,
                block_id=block.id,
                code=course_payload["codigo"],
                name=course_payload["nombre"],
                credits=course_payload.get("creditos", 0),
                hours=course_payload.get("horas", 0),
                requisitos=course_payload.get("requisitos"),
                correquisitos=course_payload.get("correquisitos"),
                default_status=course_payload.get("status", "not-coursed"),
            )
            db.session.add(course)
            course_count += 1
        block_count += 1

    db.session.commit()
    logger.info(
        "Created program '%s' with %d blocks and %d courses",
        program.code,
        block_count,
        course_count,
    )
    return program


def _create_sections(course_map: Dict[str, Course], offerings: Sequence[Dict], term: str) -> int:
    created = 0
    for index, offering in enumerate(offerings, start=1):
        course = course_map.get(offering.get("code"))
        if not course:
            continue

        section = CourseSection(
            course_id=course.id,
            term=term,
            section_code=f"{index:02d}",
            professor=offering.get("professor"),
            location=(offering.get("location") or None),
        )
        db.session.add(section)
        db.session.flush()

        for meeting in offering.get("sections", []):
            db.session.add(
                CourseMeeting(
                    section_id=section.id,
                    day_of_week=meeting["day"],
                    start_time=_parse_time(meeting["startTime"]),
                    end_time=_parse_time(meeting["endTime"]),
                )
            )

        created += 1
    return created


def seed_course_sections(program: Program):
    if CourseSection.query.count() > 0:
        logger.info("Course sections already seeded; skipping creation")
        return

    course_map = {course.code: course for course in program.courses}
    current_offerings = _load_json("current_term_sections.json")
    next_offerings = _load_json("next_term_sections.json")

    created_current = _create_sections(course_map, current_offerings, CURRENT_TERM)
    created_next = _create_sections(course_map, next_offerings, NEXT_TERM)
    db.session.commit()
    logger.info(
        "Seeded %d course sections (current term: %d, next term: %d)",
        created_current + created_next,
        created_current,
        created_next,
    )


def seed_academic_events(program: Program):
    if AcademicEvent.query.count() > 0:
        logger.info("Academic events already seeded; skipping creation")
        return

    events = _load_json("academic_events.json")
    for event in events:
        db.session.add(
            AcademicEvent(
                title=event["name"],
                description=None,
                event_date=_parse_iso_date(event["date"]),
                severity=event.get("type", "info"),
                program_id=program.id,
            )
        )
    db.session.commit()
    logger.info("Seeded %d academic events for program '%s'", len(events), program.code)


def _ensure_program(
    name: str,
    primary_program: Program,
    next_index: int,
) -> Tuple[Program, int]:
    if name == primary_program.name:
        return primary_program, next_index

    program = Program.query.filter_by(name=name).first()
    if program:
        return program, next_index

    program = Program(
        code=f"AUTO-{next_index:03d}",
        name=name,
        jornada="Diurno",
        degree="Bachillerato",
        total_credits=0,
        number_of_semesters=0,
    )
    program.sedes = []
    db.session.add(program)
    db.session.flush()
    logger.info("Created auxiliary program '%s' (%s)", program.name, program.code)
    return program, next_index + 1


def _seed_user_statuses(user: User, program: Program):
    if not program.courses:
        return

    statuses = [
        UserCourseStatus(
            user_id=user.id,
            course_id=course.id,
            status=(course.default_status or "not-coursed"),
        )
        for course in program.courses
    ]
    if statuses:
        db.session.bulk_save_objects(statuses)
        db.session.flush()


def _seed_user_schedule(user: User, program: Program):
    in_progress_ids = [
        course.id
        for course in program.courses
        if (course.default_status or "not-coursed") == "in-progress"
    ]
    if not in_progress_ids:
        return

    sections = CourseSection.query.filter(
        CourseSection.course_id.in_(in_progress_ids),
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
    db.session.flush()


def seed_demo_users(primary_program: Program):
    demo_users = _load_json("demo_users.json")
    next_index = 1
    created_count = 0
    skipped_count = 0

    for entry in demo_users:
        email = entry["email"].lower()
        if User.query.filter_by(email=email).first():
            skipped_count += 1
            continue

        program_name = entry.get("program") or primary_program.name
        program, next_index = _ensure_program(program_name, primary_program, next_index)

        user = User(
            name=entry["name"],
            email=email,
            password_hash=generate_password_hash(entry["password"]),
            carne=entry["carne"],
            program_id=program.id,
        )
        db.session.add(user)
        db.session.flush()

        _seed_user_statuses(user, program)
        if program.id == primary_program.id:
            _seed_user_schedule(user, program)
        created_count += 1

    db.session.commit()
    logger.info(
        "Seeded %d demo user(s); skipped %d existing user(s)",
        created_count,
        skipped_count,
    )
    return created_count, skipped_count


def seed_initial_data():
    logger.info("Starting seed workflow")
    primary_program = seed_program()
    seed_course_sections(primary_program)
    seed_academic_events(primary_program)
    created_users, skipped_users = seed_demo_users(primary_program)
    logger.info(
        "Seed workflow completed (new demo users: %d, skipped: %d)",
        created_users,
        skipped_users,
    )


def bootstrap_database():
    logger.info("Bootstrapping database (create tables + seed data)")
    try:
        db.create_all()
        seed_initial_data()
    except Exception as exc:
        logger.exception("Failed to bootstrap database: %s", exc)
        db.session.rollback()
        raise
    else:
        logger.info("Database bootstrap completed successfully")
