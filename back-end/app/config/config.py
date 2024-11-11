import os

class Config:
    DEBUG = True
    SECRET_KEY = os.environ.get("SECRET_KEY", "minha_chave_secreta")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:root@localhost:5432/floriculture")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
