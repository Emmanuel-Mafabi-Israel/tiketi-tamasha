# GLORY BE TO GOD,
# TIKETI TAMASHA - MODELS SCHEMA,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from .models import User, UserProfile, Event, Ticket, Payment

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  # though this is Optional 😜

class UserProfileSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = UserProfile
        load_instance = True

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

# class RoleSchema(SQLAlchemyAutoSchema):
#     class Meta:
#         model = Role
#         load_instance = True
# -> No Longer needed!