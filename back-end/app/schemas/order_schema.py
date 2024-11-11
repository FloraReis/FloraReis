from marshmallow import Schema, fields, validate
from app.schemas.address_schema import AddressSchema
from app.schemas.person_schema import PersonSchema
from app.schemas.order_item_schema import OrderItemSchema

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    person_id = fields.Int(required=True)
    person = fields.Nested(PersonSchema, dump_only=True)
    delivery_address = fields.Nested(AddressSchema, required=True)
    status = fields.String(required=True, validate=validate.OneOf(["P", "C", "F"]))
    total_amount = fields.Float(required=True)
    delivery_date = fields.DateTime(required=False)
    items = fields.List(fields.Nested(OrderItemSchema), required=True)

    date_created = fields.DateTime(dump_only=True)
    date_modified = fields.DateTime(dump_only=True)