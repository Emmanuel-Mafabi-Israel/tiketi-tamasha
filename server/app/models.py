# models.py
# GLORY BE TO GOD,
# TIKETI TAMASHA MODEL FILE,
# BY ISRAEL MAFABI EMMANUEL,
# TAMASHA DEVELOPERS

from extensions import db
from sqlalchemy import ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import validates
from datetime import datetime, timedelta
import sqlalchemy.types as types
import json
import uuid


class User(db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)     # Store hashed passwords
    role          = db.Column(db.String(50), default='customer')  # 'customer', 'organizer'
    phone_number  = db.Column(db.String(20), nullable=True)       # Add the phone number for the mpesa Implementation
    reset_token = db.Column(db.String(255), unique=True, nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)


    # Relationships
    events        = db.relationship('Event', backref='organizer', lazy=True) # Organizers create events
    tickets       = db.relationship('Ticket', backref='customer', lazy=True) # Customers buy tickets
    profile       = db.relationship('UserProfile', back_populates='user', uselist=False, cascade='all, delete-orphan') # User Profile

    def __repr__(self):
        return f"<User id:{self.id}, email:{self.email}, role:{self.role}>"

    def generate_reset_token(self):
        self.reset_token = str(uuid.uuid4())
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)


class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    id      = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    # Additional profile information can be stored here
    name    = db.Column(db.String(120), nullable=True) #Can store username/name
    # Relationships
    user    = db.relationship('User', back_populates='profile')


# models.py
class Event(db.Model):
    __tablename__ = 'events'
    id             = db.Column(db.Integer, primary_key=True)
    organizer_id   = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    title          = db.Column(db.String(255), nullable=False)
    description    = db.Column(db.Text, nullable=True)
    location       = db.Column(db.String(255), nullable=False)
    category       = db.Column(db.String(100), nullable=True)
    tags           = db.Column(db.String(255), nullable=True)
    start_date     = db.Column(db.DateTime, nullable=False)
    end_date       = db.Column(db.DateTime, nullable=False)
    image_url      = db.Column(db.String(255), nullable=True)
    ticket_tiers   = db.Column(types.JSON)  # Use the built-in JSON type
    total_tickets  = db.Column(db.Integer, nullable=False, default=100)  # Default total tickets available
    tickets_sold   = db.Column(db.Integer, nullable=False, default=0)  # Default tickets sold

    # Relationships
    tickets        = db.relationship('Ticket', backref='event', lazy=True)

    def __repr__(self):
        return f"<Event id:{self.id}, title:{self.title}>"


class Ticket(db.Model):
    __tablename__ = 'tickets'
    id            = db.Column(db.Integer, primary_key=True)
    event_id      = db.Column(db.Integer, ForeignKey('events.id'), nullable=False)
    customer_id   = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    ticket_type   = db.Column(db.String(50), nullable=False)  # e.g., 'Early Bird', 'VIP', 'Regular'
    purchase_date = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Ticket id:{self.id}, event_id:{self.event_id}, type:{self.ticket_type}>"


# models.py
class Payment(db.Model):
    __tablename__ = 'payments'
    id             = db.Column(db.Integer, primary_key=True)
    ticket_id      = db.Column(db.Integer, ForeignKey('tickets.id'), nullable=False)
    payment_date   = db.Column(db.DateTime, server_default=db.func.now())
    amount         = db.Column(db.Float, nullable=False)
    transaction_id = db.Column(db.String(255), nullable=True)  # Store MPESA transaction ID/CheckoutRequestID
    payment_method = db.Column(db.String(50), nullable=False)  # e.g., "MPESA"
    status         = db.Column(db.String(50), nullable=False, default='pending')  # e.g., "pending", "completed", "failed"  <-- ADD DEFAULT

    # Relationship
    ticket         = db.relationship('Ticket', backref='payments', lazy=True)

    def __repr__(self):
        return f"<Payment id:{self.id}, ticket_id:{self.ticket_id}, amount:{self.amount}, status:{self.status}>"