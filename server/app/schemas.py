# GLORY BE TO GOD,
# TIKETI TAMASHA - MODELS SCHEMA,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from extensions import db
from .models import User, Event, Ticket, Payment, Role

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        sqla_session = db.session
        load_instance = True
        include_relationships = True
        include_fk = True
        exclude = ('password_hash',)

class EventSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        sqla_session = db.session
        load_instance = True
        include_relationships = True
        include_fk = True

class TicketSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Ticket
        sqla_session = db.session
        load_instance = True
        include_relationships = True
        include_fk = True

class PaymentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        sqla_session = db.session
        load_instance = True
        include_relationships = True
        include_fk = True

class RoleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        sqla_session = db.session
        load_instance = True
        include_relationships = True
        include_fk = True