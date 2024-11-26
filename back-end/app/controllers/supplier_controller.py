from app.models.supplier_model import Supplier, db
from app.models.address_model import Address
from app.schemas.supplier_schema import SupplierSchema
from marshmallow import ValidationError

def create_supplier_logic(data):
    try:
        supplier_data = SupplierSchema().load(data)
        address_data = supplier_data.pop("address", None)
        
        if address_data:
            address = Address(**address_data)
            db.session.add(address)
            db.session.flush()

            supplier_data["address_id"] = address.id

        new_supplier = Supplier(**supplier_data)
        db.session.add(new_supplier)
        db.session.commit()
        
        return { 
            "message": "Supplier created successfully", 
            "data": SupplierSchema().dump(new_supplier)
        }, 201
    
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_supplier_logic(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return {"error": "Supplier not found"}, 404
    return SupplierSchema().dump(supplier), 200

def get_all_suppliers_logic():
    query = Supplier.query.filter(Supplier.date_excluded.is_(None))

    suppliers = query.all()
    return SupplierSchema(many=True).dump(suppliers), 200

def update_supplier_logic(id, data):
    supplier = Supplier.query.get(id)

    if not supplier:
        return {"error": "Supplier not found"}, 404
    
    data.pop('id', None)
    
    try:
        updated_data = SupplierSchema(partial=True).load(data)
        
        if "address" in updated_data:
            address_data = updated_data.pop("address")
            for key, value in address_data.items():
                setattr(supplier.address, key, value)
        
        for key, value in updated_data.items():
            setattr(supplier, key, value)

        db.session.commit()
        return {"message": "Supplier updated successfully", "data": SupplierSchema().dump(supplier)}, 200
    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def delete_supplier_logic(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return {"error": "Supplier not found"}, 404

    db.session.delete(supplier)
    db.session.commit()
    return {"message": "Supplier deleted successfully"}, 200
