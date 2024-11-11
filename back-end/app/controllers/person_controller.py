from app.models.person_model import Person, db
from app.models.address_model import Address
from app.schemas.person_schema import PersonSchema
from marshmallow import ValidationError

def create_person_logic(data):
    try:
        person_data = PersonSchema().load(data)
        address_data = person_data.pop('address', None)

        if address_data:
            new_address = Address(**address_data)
            db.session.add(new_address)
            db.session.flush()
            
            person_data['address_id'] = new_address.id

        new_person = Person(**person_data)
        db.session.add(new_person)
        db.session.commit()

        return {
            "message": "Person created successfully", 
            "data": PersonSchema().dump(new_person)
        }, 201

    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def get_person_logic(id):
    person = Person.query.get(id)
    
    if not person or person.date_excluded:
        return {"error": "Person not found or has been deleted"}, 404
    return PersonSchema().dump(person), 200

def get_all_persons_logic(realm=None):
    query = Person.query.filter(Person.date_excluded.is_(None))

    if realm:
        query = query.filter_by(realm=realm)
    persons = query.all()
    return PersonSchema(many=True).dump(persons), 200

def update_person_logic(id, data):
    person = Person.query.get(id)

    if not person:
        return {"error": "Person not found"}, 404
    
    try:
        updated_data = PersonSchema(partial=True).load(data)
        address_data = updated_data.pop('address', None)

        if address_data:
            if person.address_id:
                address = Address.query.get(person.address_id)
                if address:
                    for key, value in address_data.items():
                        setattr(address, key, value)
                else:
                    return {"error": "Address not found for the provided address_id"}, 404
            else:
                new_address = Address(**address_data)
                db.session.add(new_address)
                db.session.flush()
                person.address_id = new_address.id

        for key, value in updated_data.items():
            setattr(person, key, value)
        
        db.session.commit()
        return {
            "message": "Person updated successfully",
            "data": PersonSchema().dump(person)
        }, 200

    except ValidationError as err:
        db.session.rollback()
        return {"errors": err.messages}, 400
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def delete_person_logic(id):
    person = Person.query.get(id)

    if not person:
        return {"error": "Person not found"}, 404
    
    person.mark_as_deleted()
    db.session.commit()
    return {"message": "Person marked as deleted"}, 200
