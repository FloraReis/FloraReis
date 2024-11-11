from datetime import datetime
from app.extensions import db

class Order(db.Model):
    __tablename__ = 'order'

    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    delivery_address_id = db.Column(db.Integer, db.ForeignKey('address.id'), nullable=False)
    status = db.Column(db.String(1), nullable=False, default='P') 
    total_amount = db.Column(db.Float, nullable=False)
    delivery_date = db.Column(db.DateTime, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_modified = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    person = db.relationship('Person', backref='orders')
    delivery_address = db.relationship('Address', backref='orders')
    items = db.relationship('OrderItem', back_populates='order')

    def __repr__(self):
        return f'<Order {self.id}>'
