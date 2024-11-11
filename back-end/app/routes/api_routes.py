from flask import Blueprint, request, jsonify
from app.controllers.user_controller import create_user_logic, get_user_logic, get_all_users_logic, update_user_logic, delete_user_logic
from app.controllers.person_controller import create_person_logic, get_person_logic, get_all_persons_logic, update_person_logic, delete_person_logic
from app.controllers.product_controller import create_product_logic, get_product_logic, get_all_products_logic, update_product_logic, delete_product_logic
from app.controllers.supplier_controller import create_supplier_logic, get_supplier_logic, get_all_suppliers_logic, update_supplier_logic, delete_supplier_logic
from app.controllers.stock_controller import create_stock_logic, get_stock_logic, update_stock_logic, delete_stock_logic
from app.controllers.order_controller import create_order_logic, get_order_logic, get_all_orders_logic, update_order_logic

api_bp = Blueprint('api', __name__)

@api_bp.route('/', methods=['GET'])
def home():
    return jsonify({"mensagem": "Bem-vindo a API da Floricultura!"})

@api_bp.route('/api/login', methods=['POST', 'GET'])
@api_bp.route('/api/login/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user_handler(id=None):
    if request.method == 'POST':
        response, status = create_user_logic(request)
        return jsonify(response), status
    
    elif request.method == 'GET':
        if id is not None:
            response, status = get_user_logic(id)
            return jsonify(response), status
        else:
            response, status = get_all_users_logic()
            return jsonify(response), status 
        
    elif request.method == 'PUT':
        response, status = update_user_logic(id, request)
        return jsonify(response), status
    
    elif request.method == 'DELETE':
        response, status = delete_user_logic(id)
        return jsonify(response), status


@api_bp.route('/api/person', methods=['POST', 'GET'])
@api_bp.route('/api/person/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def person_handler(id=None):
    if request.method == 'POST':
        data = request.get_json()
        response, status = create_person_logic(data)
        return jsonify(response), status

    elif request.method == 'GET':
        if id is not None:
            response, status = get_person_logic(id)
            return jsonify(response), status
        else:
            realm = request.args.get('realm')
            response, status = get_all_persons_logic(realm)
            return jsonify(response), status

    elif request.method == 'PUT':
        data = request.get_json()
        response, status = update_person_logic(id, data)
        return jsonify(response), status

    elif request.method == 'DELETE':
        response, status = delete_person_logic(id)
        return jsonify(response), status
    

@api_bp.route('/api/product', methods=['POST', 'GET'])
@api_bp.route('/api/product/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product_handler(id=None):
    if request.method == 'POST':
        data = request.get_json()
        response, status = create_product_logic(data)
        return jsonify(response), status

    elif request.method == 'GET':
        if id is not None:
            response, status = get_product_logic(id)
            return jsonify(response), status
        else:
            response, status = get_all_products_logic()
            return jsonify(response), status

    elif request.method == 'PUT':
        data = request.get_json()
        response, status = update_product_logic(id, data)
        return jsonify(response), status

    elif request.method == 'DELETE':
        response, status = delete_product_logic(id)
        return jsonify(response), status
    

@api_bp.route('/api/supplier', methods=['POST', 'GET'])
@api_bp.route('/api/supplier/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def supplier_handler(id=None):
    if request.method == 'POST':
        data = request.get_json()
        response, status = create_supplier_logic(data)
        return jsonify(response), status

    elif request.method == 'GET':
        if id is not None:
            response, status = get_supplier_logic(id)
            return jsonify(response), status
        else:
            realm = request.args.get('realm')
            response, status = get_all_suppliers_logic(realm)
            return jsonify(response), status

    elif request.method == 'PUT':
        data = request.get_json()
        response, status = update_supplier_logic(id, data)
        return jsonify(response), status

    elif request.method == 'DELETE':
        response, status = delete_supplier_logic(id)
        return jsonify(response), status
    

@api_bp.route('/api/stock', methods=['POST', 'GET'])
@api_bp.route('/api/stock/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def stock_handler(id=None):
    if request.method == 'POST':
        data = request.get_json()
        response, status = create_stock_logic(data)
        return jsonify(response), status

    elif request.method == 'GET':
        if id is not None:
            response, status = get_stock_logic(id)
            return jsonify(response), status

    elif request.method == 'PUT':
        data = request.get_json()
        response, status = update_stock_logic(id, data)
        return jsonify(response), status

    elif request.method == 'DELETE':
        response, status = delete_stock_logic(id)
        return jsonify(response), status
    

@api_bp.route('/api/order', methods=['POST', 'GET'])
@api_bp.route('/api/order/<int:id>', methods=['GET', 'PUT'])
def order_handler(id=None):
    if request.method == 'POST':
        data = request.get_json()
        response, status = create_order_logic(data)
        return jsonify(response), status

    elif request.method == 'GET':
        if id is not None:
            response, status = get_order_logic(id)
            return jsonify(response), status
        else:
            response, status = get_all_orders_logic()
            return jsonify(response), status

    elif request.method == 'PUT':
        data = request.get_json()
        response, status = update_order_logic(id, data)
        return jsonify(response), status