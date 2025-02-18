# GLORY BE TO GOD,
# TIKETI TAMASHA - MODELS SCHEMA,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from .models import User, Event, Ticket, Payment, Role

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  # though this is Optional 😜

class EventSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True

class TicketSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Ticket
        load_instance = True

class PaymentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True

class RoleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        load_instance = True