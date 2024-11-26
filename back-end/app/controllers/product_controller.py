from app.models.product_model import Product, db
from app.schemas.product_schema import ProductSchema
from marshmallow import ValidationError

def create_product_logic(data):
    try:
        product_data = ProductSchema().load(data)
        new_product = Product(**product_data)

        db.session.add(new_product)
        db.session.commit()
        return {"message": "Product created successfully", "data": ProductSchema().dump(new_product)}, 201
    
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
    
def get_product_logic(id):
    product = Product.query.get(id)
    if not product:
        return {"error": "Product not found"}, 404
    return ProductSchema().dump(product), 200

def get_all_products_logic():
    products = Product.query.all()
    return ProductSchema(many=True).dump(products), 200

def update_product_logic(id, data):
    product = Product.query.get(id)
    if not product:
        return {"error": "Product not found"}, 404
    
    data.pop('id', None)

    try:
        updated_data = ProductSchema(partial=True).load(data)
        for key, value in updated_data.items():
            setattr(product, key, value)
        db.session.commit()
        return {"message": "Product updated successfully", "data": ProductSchema().dump(product)}, 200
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def delete_product_logic(id):
    product = Product.query.get(id)
    if not product:
        return {"error": "Product not found"}, 404

    db.session.delete(product)
    db.session.commit()
    return {"message": "Product deleted successfully"}, 200