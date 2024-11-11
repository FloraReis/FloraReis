from app.models.order_model import Order, db
from app.models.order_item_model import OrderItem
from app.models.address_model import Address
from app.schemas.order_schema import OrderSchema
from marshmallow import ValidationError

def create_order_logic(data):
    try:
        order_data = OrderSchema().load(data)
        items_data = order_data.pop("items", [])
        address_data = order_data.pop("delivery_address")

        if address_data:
            delivery_address = Address(**address_data)
            db.session.add(delivery_address)
            db.session.flush() 

            order_data["delivery_address_id"] = delivery_address.id

        new_order = Order(**order_data)
        db.session.add(new_order)
        db.session.flush()

        for item in items_data:
            item["order_id"] = new_order.id
            item["total_price"] = item["quantity"] * item["price_per_unit"]
            order_item = OrderItem(**item)
            db.session.add(order_item)

        db.session.commit()
        
        return {
            "message": "Order created successfully",
            "data": OrderSchema().dump(new_order)
        }, 201
    
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_order_logic(id):
    order = Order.query.get(id)

    if not order:
        return {"error": "Order not found"}, 404
    return OrderSchema().dump(order), 200

def get_all_orders_logic():
    orders = Order.query.all()
    return OrderSchema(many=True).dump(orders), 200

def update_order_logic(id, data):
    order = Order.query.get(id)
    if not order:
        return {"error": "Order not found"}, 404

    try:
        updated_data = OrderSchema(partial=True).load(data)
        
        for key, value in updated_data.items():
            if key != "items":
                setattr(order, key, value)

        if "items" in updated_data:
            for item_data in updated_data["items"]:
                item = OrderItem.query.filter_by(order_id=id, product_id=item_data["product_id"]).first()
                if item:
                    item.quantity = item_data["quantity"]
                    item.price_per_unit = item_data["price_per_unit"]
                    item.total_price = item.quantity * item.price_per_unit
                else:
                    item_data["order_id"] = id
                    item_data["total_price"] = item_data["quantity"] * item_data["price_per_unit"]
                    new_item = OrderItem(**item_data)
                    db.session.add(new_item)

        db.session.commit()
        return {"message": "Order updated successfully", "data": OrderSchema().dump(order)}, 200

    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500