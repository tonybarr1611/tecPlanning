from flask import Blueprint, jsonify

from models import Program

programs_bp = Blueprint("programs", __name__, url_prefix="/programs")


@programs_bp.route("", methods=["GET"])
def list_programs():
    programs = Program.query.order_by(Program.name.asc()).all()
    return jsonify([program.to_dict(include_blocks=False) for program in programs]), 200


@programs_bp.route("/<program_code>", methods=["GET"])
def get_program(program_code: str):
    program = Program.query.filter_by(code=program_code).first()
    if not program:
        return jsonify({"message": "Program not found"}), 404

    return jsonify(program.to_dict(include_blocks=True)), 200
