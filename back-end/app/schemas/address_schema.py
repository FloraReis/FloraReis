from marshmallow import Schema, fields

class AddressSchema(Schema):
    id = fields.Int(dump_only=True)
    logradouro = fields.Str(required=True)
    bairro = fields.Str(required=True)
    cidade = fields.Str(required=True)
    estado = fields.Str(required=True)
    cep = fields.Str(required=True)
    numero = fields.Str(required=True)
    complemento = fields.Str(required=False)
    date_created = fields.DateTime(dump_only=True)
    date_modified = fields.DateTime(dump_only=True)
