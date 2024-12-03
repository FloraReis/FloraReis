from datetime import datetime
from app.extensions import db

class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    type = db.Column(db.String(50), nullable=False)
    product_code = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(20), default="A")
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    supplier = db.relationship('Supplier')
    
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, onupdate=datetime.utcnow)
    date_excluded = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Product {self.name}>'

    def mark_as_deleted(self):
        self.status = 'F'
        self.date_excluded = datetime.utcnow()
