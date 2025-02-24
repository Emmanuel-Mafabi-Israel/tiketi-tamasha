# GLORY BE TO GOD,
# TIKETI TAMASHA - ROUTES FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os
import logging  # Import logging
from functools import wraps
from datetime import datetime

from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db  # Import db instance
from .models import User, Event, Ticket, Payment, Role  # Import models
from .schemas import UserSchema, EventSchema, TicketSchema, PaymentSchema  # Import schemas

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define blueprints
auth_bp   = Blueprint('auth', __name__)     # Authentication endpoints
event_bp  = Blueprint('event', __name__)    # Event management endpoints
ticket_bp = Blueprint('ticket', __name__)   # Ticket purchase endpoints

# Initialize schemas
user_schema    = UserSchema()
event_schema   = EventSchema()
ticket_schema  = TicketSchema()
payment_schema = PaymentSchema()

# User Retrieval:  Gets the user object from the JWT identity (email)
def get_user_from_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return func(user, *args, **kwargs)
    return wrapper

# --- Authentication Routes ---
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating user: {e}")  # Log the error
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
@get_user_from_token
def get_user_details(user):
    return user_schema.dump(user), 200

#  ---- User Deletion -----
@auth_bp.route('/user', methods=['DELETE'])
@jwt_required()
@get_user_from_token
def delete_user(user):
    # Add checks to ensure the user is allowed to delete (e.g., only delete own account)
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User account deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting user: {e}")
        return jsonify({'message': f'Error deleting user: {str(e)}'}), 500

# --- Event Routes ---
@event_bp.route('/events', methods=['GET'])
def get_events():
    # TODO: Implement searching based on location, tags, or categories
    # TODO: Implement pagination
    events = Event.query.all()
    return jsonify([event_schema.dump(event) for event in events]), 200

@event_bp.route('/events', methods=['POST'])
@jwt_required()
@get_user_from_token  #Use decorator to ensure the user is fetched.
def create_event(user):
    # Only organizers can create events
    if user.role != 'organizer':
        return jsonify({'message': 'Unauthorized: Only organizers can create events'}), 403

    data = request.get_json()
    try:
        new_event = Event(
            organizer_id=user.id,
            title=data.get('title'),
            description=data.get('description'),
            location=data.get('location'),
            category=data.get('category'),
            tags=data.get('tags'),
            start_date=data.get('start_date'),
            end_date=data.get('end_date'),
            image_url=data.get('image_url')
        )

        db.session.add(new_event)
        db.session.commit()

        return event_schema.dump(new_event), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating event: {e}")

        return jsonify({'message': f'Error creating event: {str(e)}'}), 500

# --- Ticket Routes ---
@ticket_bp.route('/tickets', methods=['POST'])
@jwt_required()
@get_user_from_token
def purchase_ticket(user):
    data = request.get_json()
    event_id = data.get('event_id')
    ticket_type = data.get('ticket_type')

    event = db.session.get(Event, event_id) 
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Determine price based on ticket_type (Implement Pricing Logic)
    if ticket_type == 'Early Bird':
        price = 50.00
    elif ticket_type == 'VIP':
        price = 100.00
    else:
        price = 25.00

    try:
        new_ticket = Ticket(
            event_id=event_id,
            customer_id=user.id,
            ticket_type=ticket_type,
            price=price
        )

        db.session.add(new_ticket)
        db.session.commit()

        return ticket_schema.dump(new_ticket), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error purchasing ticket: {e}")
        return jsonify({'message': f'Error purchasing ticket: {str(e)}'}), 500

# --- Debug Routes ---
@auth_bp.route('/', methods=['GET'])
def index():
    return render_template('home.html')

@auth_bp.route('/debug/', methods=['GET'])
def debug():
    return render_template('debug.html')

@auth_bp.route('/debug/models/', methods=['GET'])
def debug_models():
    # This retrieves the metadata of the database tables for debugging
    metadata = db.metadata.tables # Get all tables' metadata
    return render_template('models.html', metadata=metadata)

@auth_bp.route('/debug/users/', methods=['GET'])
def debug_users():
    # Retrieve and display all user emails for debugging
    users = User.query.all()
    emails = [(index + 1, user.email) for index, user in enumerate(users)]
    return render_template('emails.html', emails=emails)

# --- Error Handlers ---
@auth_bp.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@auth_bp.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500