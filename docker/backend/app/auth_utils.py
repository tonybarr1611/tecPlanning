from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Callable, Optional

import jwt
from flask import current_app, g, jsonify, request

from models import User


def _decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"],
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def generate_token(user: User, expires_in_hours: int = 12) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": now + timedelta(hours=expires_in_hours),
        "iat": now,
    }
    return jwt.encode(
        payload,
        current_app.config["JWT_SECRET_KEY"],
        algorithm="HS256",
    )


def auth_required(func: Callable):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization header missing or invalid"}), 401

        token = auth_header.split(" ", 1)[1]
        payload = _decode_token(token)
        if not payload:
            return jsonify({"message": "Invalid or expired token"}), 401

        user = User.query.get(int(payload["sub"]))
        if not user:
            return jsonify({"message": "User not found"}), 404

        g.current_user = user
        return func(*args, **kwargs)

    return wrapper
