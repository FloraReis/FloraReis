from datetime import datetime
from app.extensions import db

class Person(db.Model):
    __tablename__ = 'person'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    birth_date = db.Column(db.Date, nullable=True)
    address_id = db.Column(db.Integer, db.ForeignKey('address.id'))
    address = db.relationship('Address')
    status = db.Column(db.String(2), default='A')
    realm = db.Column(db.String(1), nullable=False)
    
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, onupdate=datetime.utcnow)
    date_excluded = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Person {self.full_name}>'

    def mark_as_deleted(self):
        self.status = 'I'
        self.date_excluded = datetime.utcnow()
