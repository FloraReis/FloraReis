from marshmallow import Schema, fields
from app.schemas.product_schema import ProductSchema

class OrderItemSchema(Schema):
    id = fields.Int(dump_only=True)
    order_id = fields.Int(load_only=True)
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True)
    price_per_unit = fields.Float(required=True)
    total_price = fields.Float(dump_only=True)

    product = fields.Nested(ProductSchema, dump_only=True)