from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(max=150))
    email = fields.Email(required=True)
    password = fields.String(load_only=True, required=False, validate=validate.Length(min=6))
    cpf = fields.String(required=False, validate=validate.Regexp(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$'))
    status = fields.String(dump_only=True)
    date_created = fields.DateTime(dump_only=True)
    date_modifield = fields.DateTime(dump_only=True)
    date_excluded = fields.DateTime(dump_only=True)
    code = fields.String(required=False, load_only=True)
    reset_code_expiration = fields.DateTime(dump_only=True)
    newPassowrd = fields.String(required=False, load_only=True)