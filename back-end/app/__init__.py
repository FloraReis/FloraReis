from flask import Flask
from .config.config import Config
from .extensions import db, ma
from .blueprints import register_blueprints

from app.models.address_model import Address
from app.models.order_item_model import OrderItem
from app.models.person_model import Person
from app.models.supplier_model import Supplier
from app.models.order_model import Order


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        db.create_all()

    register_blueprints(app)

    return app