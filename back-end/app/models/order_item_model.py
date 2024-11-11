from app.extensions import db

class OrderItem(db.Model):
    __tablename__ = 'order_item'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_per_unit = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', back_populates='items')
    product = db.relationship('Product')

    def __repr__(self):
        return f'<OrderItem {self.id} - Order {self.order_id} Product {self.product_id}>'
