from marshmallow import Schema, fields, validate
from app.schemas.address_schema import AddressSchema

class PersonSchema(Schema):
    id = fields.Int(dump_only=True)
    full_name = fields.String(required=True, validate=validate.Length(max=150))
    email = fields.Email(required=True)
    cpf = fields.String(required=True, validate=validate.Regexp(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$'))
    phone = fields.String(validate=validate.Length(max=15))
    birth_date = fields.Date()
    address_id = fields.Int(load_only=True)
    address = fields.Nested(AddressSchema, required=False)
    status = fields.String(dump_only=True)
    realm = fields.Str(required=True, validate=validate.OneOf(['C', 'F']),error_messages={"invalid": "Realm must be 'C' for client or 'F' for employee."})
    date_created = fields.DateTime(dump_only=True)
    date_modified = fields.DateTime(dump_only=True)
    date_excluded = fields.DateTime(dump_only=True)
