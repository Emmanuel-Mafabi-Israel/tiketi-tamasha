# GLORY BE TO GOD,
# TIKETI TAMASHA MODEL FILE,
# BY ISRAEL MAFABI EMMANUEL,
# TAMASHA DEVELOPERS

# app/models.py
from extensions import db
from sqlalchemy import ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import validates
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)     # Store hashed passwords
    role          = db.Column(db.String(50), default='customer')  # 'customer', 'organizer'
    phone_number  = db.Column(db.String(20), nullable=True)       # Add the phone number for the mpesa Implementation

    # Relationships
    events        = db.relationship('Event', backref='organizer', lazy=True) # Organizers create events
    tickets       = db.relationship('Ticket', backref='customer', lazy=True) # Customers buy tickets
    profile       = db.relationship('UserProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')

    def __repr__(self):
        return f"<User id:{self.id}, email:{self.email}, role:{self.role}>"
    
class UserProfile(db.Model):
    __tablename__ = 'user_profiles'
    id      = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    # Additional profile information can be stored here
    name    = db.Column(db.String(120), nullable=True) #Can store username/name
    # Relationships
    user    = db.relationship('User', back_populates='profile')

class Event(db.Model):
    __tablename__ = 'events'
    id           = db.Column(db.Integer, primary_key=True)
    organizer_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    title        = db.Column(db.String(255), nullable=False)
    description  = db.Column(db.Text, nullable=True)
    location     = db.Column(db.String(255), nullable=False)
    category     = db.Column(db.String(100), nullable=True)
    tags         = db.Column(db.String(255), nullable=True)
    start_date   = db.Column(db.DateTime, nullable=False)
    end_date     = db.Column(db.DateTime, nullable=False)
    image_url    = db.Column(db.String(255), nullable=True)

    # Relationships
    tickets = db.relationship('Ticket', backref='event', lazy=True)

    def __repr__(self):
        return f"<Event id:{self.id}, title:{self.title}>"

class Ticket(db.Model):
    __tablename__ = 'tickets'
    id            = db.Column(db.Integer, primary_key=True)
    event_id      = db.Column(db.Integer, ForeignKey('events.id'), nullable=False)
    customer_id   = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    ticket_type   = db.Column(db.String(50), nullable=False)  # e.g., 'Early Bird', 'VIP', 'Regular'
    price         = db.Column(db.Float, nullable=False)
    purchase_date = db.Column(db.DateTime, server_default=db.func.now())

    #Enforce that price is always positive.
    __table_args__ = (
        CheckConstraint('price >= 0', name='check_positive_price'),
    )

    @validates('price')
    def validate_price(self, key, price):
        if not isinstance(price, (int, float)):
            raise ValueError("Price must be a number")
        if price < 0:
            raise ValueError("Price cannot be negative")
        return price
    
    def __repr__(self):
        return f"<Ticket id:{self.id}, event_id:{self.event_id}, type:{self.ticket_type}, price:{self.price}>"

# table for storing payment transactions
class Payment(db.Model):
    __tablename__ = 'payments'
    id             = db.Column(db.Integer, primary_key=True)
    ticket_id      = db.Column(db.Integer, ForeignKey('tickets.id'), nullable=False)
    payment_date   = db.Column(db.DateTime, server_default=db.func.now())
    amount         = db.Column(db.Float, nullable=False)
    transaction_id = db.Column(db.String(255), nullable=True)  # Store MPESA transaction ID
    payment_method = db.Column(db.String(50), nullable=False)  # e.g., "MPESA"
    status         = db.Column(db.String(50), nullable=False)  # e.g., "pending", "completed", "failed"
    
    # Relationship
    ticket         = db.relationship('Ticket', backref='payments', lazy=True)

    def __repr__(self):
        return f"<Payment id:{self.id}, ticket_id:{self.ticket_id}, amount:{self.amount}, status:{self.status}>"

# class Role(db.Model): #Role Based Authorization
#     __tablename__ = 'roles'
#     id          = db.Column(db.Integer, primary_key=True)
#     name        = db.Column(db.String(80), unique=True, nullable=False)
#     description = db.Column(db.String(255), nullable=True)

#     # Relationships
#     users       = db.relationship('User', secondary='user_roles', backref='roles')

# # Association table for User and Roles (Many-to-Many)
# user_roles = db.Table('user_roles',
#     db.Column('user_id', db.Integer, ForeignKey('users.id'), primary_key=True),
#     db.Column('role_id', db.Integer, ForeignKey('roles.id'), primary_key=True)
# ) -> No Longer Needed!