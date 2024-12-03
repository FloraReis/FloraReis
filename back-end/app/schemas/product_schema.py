from marshmallow import Schema, fields, validate
from app.schemas.supplier_schema import SupplierSchema

class ProductSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(max=100))
    description = fields.String(validate=validate.Length(max=255))
    type = fields.String(required=False)
    product_code = fields.String(required=False)
    status = fields.String(required=False, validate=validate.Length(max=20))
    supplier_id = fields.Int(required=True, load_only=True)
    supplier = fields.Nested(SupplierSchema, dump_only=True)
    date_created = fields.DateTime(dump_only=True)
    date_modified = fields.DateTime(dump_only=True)
