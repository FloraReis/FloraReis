from marshmallow import Schema, fields, validate
from app.schemas.address_schema import AddressSchema

class SupplierSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.String(required=False)
    company_name = fields.String(required=True, validate=validate.Length(max=100))
    type_company = fields.String(required=True, validate=validate.Length(max=50))
    cnpj_cpf = fields.String(required=True, validate=validate.Regexp(r'^\d{2,3}\.\d{3}\.\d{3}/\d{4}-\d{2}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$'))
    contact = fields.String(validate=validate.Length(max=50))
    contact_type = fields.String(required=True, validate=validate.Length(max=50))
    address_id = fields.Int(load_only=True)
    address = fields.Nested(AddressSchema, required=False)
    status = fields.String(dump_only=True)
    date_created = fields.DateTime(dump_only=True)
    date_modified = fields.DateTime(dump_only=True)
    date_excluded = fields.DateTime(dump_only=True)
