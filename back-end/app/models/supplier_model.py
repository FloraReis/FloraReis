from datetime import datetime
from app.extensions import db

class Supplier(db.Model):
    __tablename__ = 'supplier'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=True)
    company_name = db.Column(db.String(100), nullable=True)
    type_company = db.Column(db.String(50), nullable=False)
    cnpj_cpf = db.Column(db.String(20), unique=True, nullable=False)
    contact = db.Column(db.String(50), nullable=True)
    contact_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="A")
    address_id = db.Column(db.Integer, db.ForeignKey('address.id'))
    address = db.relationship('Address')
    
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, onupdate=datetime.utcnow)
    date_excluded = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Supplier {self.company_name}>'
    
    def mark_as_deleted(self):
        self.status = 'I'
        self.date_excluded = datetime.utcnow()
