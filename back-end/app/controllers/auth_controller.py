from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
import jwt
from app.models.user_model import User
from app.extensions import db
from app.config.config import Config


def login_logic(data):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "E-mail e senha são obrigatórios."}, 400

    user = User.query.filter_by(email=email, status="A").first()

    if not user or not check_password_hash(user.password, password):
        return {"error": "Credenciais inválidas."}, 401

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(hours=1),
        },
        Config.SECRET_KEY,
        algorithm="HS256",
    )

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }, 200