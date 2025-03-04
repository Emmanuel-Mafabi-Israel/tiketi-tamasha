# GLORY BE TO GOD,
# TIKETI TAMASHA - MODELS SCHEMA,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from .models import User, UserProfile, Event, Ticket, Payment
from pydantic import BaseModel, EmailStr

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  # though this is Optional 😜

class UserProfileSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = UserProfile
        load_instance = True

class EventSchema(SQLAlchemyAutoSchema):
    ticket_tiers = fields.Dict(keys=fields.String(), values=fields.Dict())
    class Meta:
        model = Event
        load_instance = True

    total_tickets = fields.Int()
    tickets_sold = fields.Int()

class TicketSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Ticket
        load_instance = True

class PaymentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str