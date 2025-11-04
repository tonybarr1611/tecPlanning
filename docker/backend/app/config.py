import os
from dataclasses import dataclass


def _build_database_uri() -> str:
    """Construct the SQLAlchemy database URI from individual environment variables."""
    db_uri = os.getenv("DATABASE_URL")
    if db_uri:
        return db_uri

    host = os.getenv("DB_HOST")
    name = os.getenv("DB_NAME")
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    port = os.getenv("DB_PORT", "5432")

    if all([host, name, user, password]):
        return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}"

    # Fall back to an in-memory SQLite database to keep the app bootable without configuration.
    return "sqlite:///:memory:"


@dataclass
class Config:
    SQLALCHEMY_DATABASE_URI: str = _build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "please-change-me")
    CORS_ALLOWED_ORIGINS: str = os.getenv("CORS_ALLOWED_ORIGINS", "*")
