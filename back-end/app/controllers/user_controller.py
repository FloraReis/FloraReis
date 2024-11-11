from flask import jsonify
from werkzeug.security import generate_password_hash
from app.models.user_model import User, db
from app.schemas.user_schema import UserSchema

user_schema = UserSchema()
users_schema = UserSchema(many=True)

def create_user_logic(request):
    dados = request.get_json()
    errors = user_schema.validate(dados)

    if errors:
        return {"errors": errors}, 400

    name = dados.get('name')
    email = dados.get('email')
    password = dados.get('password')
    cpf = dados.get('cpf')

    if User.query.filter_by(email=email).first():
        return {"erro": "E-mail já cadastrado!"}, 409

    password_hash = generate_password_hash(password)
    new_user = User(name=name, email=email, password=password_hash, cpf=cpf, status='A')

    try:
        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user), 201
    except Exception as e:
        db.session.rollback()
        return {"erro": f"Erro ao cadastrar usuário: {str(e)}"}, 500

def get_user_logic(id):
    user = User.query.filter_by(id=id, status='A').first()

    if not user:
        return {"erro": "Usuário não encontrado ou excluído"}, 404
    
    return user_schema.dump(user), 200

def get_all_users_logic():
    users = User.query.filter_by(status='A').all()

    return users_schema.dump(users), 200

def update_user_logic(id, request):
    user = User.query.get(id)

    if not user:
        return {"erro": "Usuário não encontrado"}, 404

    dados = request.get_json()
    
    errors = user_schema.validate(dados)

    if errors:
        return {"errors": errors}, 400

    user.name = dados.get('name', user.name)
    user.email = dados.get('email', user.email)
    user.cpf = dados.get('cpf', user.cpf)

    try:
        db.session.commit()
        return user_schema.dump(user), 200
    except Exception as e:
        db.session.rollback()
        return {"erro": f"Erro ao atualizar usuário: {str(e)}"}, 500

def delete_user_logic(id):
    user = User.query.get(id)
    
    if not user:
        return {"erro": "Usuário não encontrado"}, 404

    try:
        user.mark_as_deleted()
        db.session.commit()
        return {"mensagem": "Usuário marcado como excluído!"}, 200
    except Exception as e:
        db.session.rollback()
        return {"erro": f"Erro ao marcar usuário como excluído: {str(e)}"}, 500
