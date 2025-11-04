import logging
import sys

from flask import Flask, jsonify

from config import Config
from extensions import db, init_extensions
from routes_auth import auth_bp
from routes_programs import programs_bp
from routes_users import users_bp
from seed_data import bootstrap_database


def configure_logging():
    """Ensure application logging is configured once for container stdout."""
    root_logger = logging.getLogger()
    if root_logger.handlers:
        # Respect existing configuration (e.g., when running under gunicorn)
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        "%(asctime)s %(levelname)s [%(name)s] %(message)s", "%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)

    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(handler)


def create_app() -> Flask:
    configure_logging()
    app = Flask(__name__)
    app.config.from_object(Config)

    init_extensions(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(programs_bp)
    app.register_blueprint(users_bp)

    @app.route("/health", methods=["GET"])
    def healthcheck():
        return jsonify({"status": "ok"}), 200

    with app.app_context():
        bootstrap_database()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
