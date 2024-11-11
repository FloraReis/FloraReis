from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    status = db.Column(db.String(2), nullable=True)
    
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modifield = db.Column(db.DateTime, onupdate=datetime.utcnow)
    date_excluded = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Usuario {self.name}>'
    
    def mark_as_deleted(self):
        self.status = 'C'
        self.date_excluded = datetime.utcnow()