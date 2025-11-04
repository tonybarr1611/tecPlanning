from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_extensions(app):
    """Initialize Flask extensions."""
    cors_origins = app.config.get("CORS_ALLOWED_ORIGINS", "*")
    CORS(
        app,
        resources={r"/*": {"origins": cors_origins.split(",") if cors_origins != "*" else "*"}},
    )
    db.init_app(app)
