from marshmallow import Schema, fields
from app.schemas.product_schema import ProductSchema

class StockSchema(Schema):
    id = fields.Int(dump_only=True)
    product_id = fields.Int(required=True)
    product = fields.Nested(ProductSchema, dump_only=True)
    quantity = fields.Int(required=True)
    last_updated = fields.DateTime(dump_only=True)