from app.models.stock_model import Stock, db
from app.schemas.stock_schema import StockSchema
from marshmallow import ValidationError

def create_stock_logic(data):
    try:
        stock_data = StockSchema().load(data)
        new_stock = Stock(**stock_data)
        
        db.session.add(new_stock)
        db.session.commit()
        return {"message": "Stock created successfully", "data": StockSchema().dump(new_stock)}, 201
    
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_stock_logic(id):
    stock = Stock.query.get(id)
    if not stock:
        return {"error": "Stock not found"}, 404
    return StockSchema().dump(stock), 200

def update_stock_logic(id, data):
    stock = Stock.query.get(id)
    if not stock:
        return {"error": "Stock not found"}, 404

    try:
        updated_data = StockSchema(partial=True).load(data)
        for key, value in updated_data.items():
            setattr(stock, key, value)
        db.session.commit()
        return {"message": "Stock updated successfully", "data": StockSchema().dump(stock)}, 200
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def delete_stock_logic(id):
    stock = Stock.query.get(id)
    if not stock:
        return {"error": "Stock not found"}, 404

    db.session.delete(stock)
    db.session.commit()
    return {"message": "Stock deleted successfully"}, 200