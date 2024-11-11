from datetime import datetime
from app.extensions import db

class Address(db.Model):
    __tablename__ = 'address'

    id = db.Column(db.Integer, primary_key=True)
    logradouro = db.Column(db.String(100), nullable=False)
    bairro = db.Column(db.String(50), nullable=False)
    cidade = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.String(2), nullable=False)
    cep = db.Column(db.String(8), nullable=False)
    numero = db.Column(db.String(10), nullable=True)
    complemento = db.Column(db.String(100), nullable=True)

    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "logradouro": self.logradouro,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "estado": self.estado,
            "cep": self.cep,
            "numero": self.numero,
            "complemento": self.complemento,
            "date_created": self.date_created.isoformat() if self.date_created else None,
            "date_modified": self.date_modified.isoformat() if self.date_modified else None
        }

    def __repr__(self):
        return f'<Address {self.logradouro}, {self.cidade}>'
