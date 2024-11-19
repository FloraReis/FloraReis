import os

class Config:
    DEBUG = True
    SECRET_KEY = os.environ.get("SECRET_KEY", "minha_chave_secreta")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:root@localhost:5432/floriculture")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = "floricultura.uniube@gmail.com"
    MAIL_PASSWORD = "mqbw joae zpqc kyys"
    MAIL_DEFAULT_SENDER = ("Floricultura Flora Reis", "floricultura.uniube@gmail.com")