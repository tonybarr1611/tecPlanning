from datetime import datetime
from typing import Dict, List

from sqlalchemy import UniqueConstraint

from extensions import db


class Program(db.Model):
    __tablename__ = "programs"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    jornada = db.Column(db.String(64))
    sede_list = db.Column(db.Text)
    degree = db.Column(db.String(128))
    last_updated = db.Column(db.Date)
    total_credits = db.Column(db.Integer, default=0)
    number_of_semesters = db.Column(db.Integer, default=0)

    course_blocks = db.relationship("CourseBlock", backref="program", lazy=True)
    courses = db.relationship("Course", backref="program", lazy=True)

    def to_dict(self, include_blocks: bool = False) -> Dict:
        data = {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "jornada": self.jornada,
            "sedes": self.sedes,
            "degree": self.degree,
            "lastUpdated": self.last_updated.isoformat() if self.last_updated else None,
            "totalCredits": self.total_credits,
            "numberOfSemesters": self.number_of_semesters,
        }
        if include_blocks:
            data["blocks"] = [block.to_dict(include_courses=True) for block in self.course_blocks]
        return data

    @property
    def sedes(self) -> List[str]:
        if not self.sede_list:
            return []
        return [s.strip() for s in self.sede_list.split("|") if s.strip()]

    @sedes.setter
    def sedes(self, values: List[str]):
        self.sede_list = "|".join(values or [])


class CourseBlock(db.Model):
    __tablename__ = "course_blocks"

    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey("programs.id"), nullable=False)
    block_number = db.Column(db.Integer, nullable=False)

    courses = db.relationship("Course", backref="block", lazy=True)

    def to_dict(self, include_courses: bool = False) -> Dict:
        data = {
            "id": self.id,
            "blockNumber": self.block_number,
        }
        if include_courses:
            data["courses"] = [course.to_dict() for course in self.courses]
        return data


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey("programs.id"), nullable=False)
    block_id = db.Column(db.Integer, db.ForeignKey("course_blocks.id"), nullable=False)
    code = db.Column(db.String(16), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    credits = db.Column(db.Integer, default=0)
    hours = db.Column(db.Integer, default=0)
    requisitos = db.Column(db.Text)
    correquisitos = db.Column(db.Text)
    default_status = db.Column(db.String(16), default="not-coursed")

    sections = db.relationship("CourseSection", backref="course", lazy=True)
    statuses = db.relationship("UserCourseStatus", backref="course", lazy=True)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "credits": self.credits,
            "hours": self.hours,
            "requirements": self.requisitos,
            "corequisites": self.correquisitos,
            "defaultStatus": self.default_status,
        }


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    carne = db.Column(db.String(32), unique=True, nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey("programs.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    program = db.relationship("Program")
    course_statuses = db.relationship("UserCourseStatus", backref="user", lazy=True)
    schedule_entries = db.relationship("UserScheduleEntry", backref="user", lazy=True)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "carne": self.carne,
            "program": {
                "code": self.program.code if self.program else None,
                "name": self.program.name if self.program else None,
            },
        }


class UserCourseStatus(db.Model):
    __tablename__ = "user_course_statuses"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_user_course"),)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    status = db.Column(db.String(16), nullable=False, default="not-coursed")
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    VALID_STATUSES = {"not-coursed", "in-progress", "approved", "failed"}

    def to_dict(self) -> Dict:
        base = self.course.to_dict()
        base["status"] = self.status
        return base


class CourseSection(db.Model):
    __tablename__ = "course_sections"

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    term = db.Column(db.String(32), nullable=False)
    section_code = db.Column(db.String(16), nullable=False)
    professor = db.Column(db.String(255))
    location = db.Column(db.String(64))

    meetings = db.relationship("CourseMeeting", backref="section", lazy=True)
    user_entries = db.relationship("UserScheduleEntry", backref="section", lazy=True)

    def to_dict(self, include_meetings: bool = True) -> Dict:
        data = {
            "id": self.id,
            "courseCode": self.course.code if self.course else None,
            "courseName": self.course.name if self.course else None,
            "term": self.term,
            "section": self.section_code,
            "professor": self.professor,
            "location": self.location,
        }
        if include_meetings:
            data["meetings"] = [meeting.to_dict() for meeting in self.meetings]
        return data


class CourseMeeting(db.Model):
    __tablename__ = "course_meetings"

    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey("course_sections.id"), nullable=False)
    day_of_week = db.Column(db.String(16), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    def to_dict(self) -> Dict:
        return {
            "day": self.day_of_week,
            "startTime": self.start_time.strftime("%H:%M"),
            "endTime": self.end_time.strftime("%H:%M"),
        }


class UserScheduleEntry(db.Model):
    __tablename__ = "user_schedule_entries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey("course_sections.id"), nullable=False)
    term = db.Column(db.String(32), nullable=False)
    is_current_term = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self) -> Dict:
        return {
            "section": self.section.to_dict(include_meetings=True) if self.section else None,
            "term": self.term,
            "isCurrentTerm": self.is_current_term,
        }


class AcademicEvent(db.Model):
    __tablename__ = "academic_events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    event_date = db.Column(db.Date, nullable=False)
    severity = db.Column(db.String(32), nullable=False, default="info")
    program_id = db.Column(db.Integer, db.ForeignKey("programs.id"))

    program = db.relationship("Program")

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.event_date.isoformat(),
            "severity": self.severity,
            "programCode": self.program.code if self.program else None,
        }
