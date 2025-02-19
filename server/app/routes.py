# GLORY BE TO GOD,
# TIKETI TAMASHA - ROUTES FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os
import logging  # Import logging
from functools import wraps
from datetime import datetime
from dateutil import parser

from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db  # Import db instance
from .models import User, Event, Ticket, Payment, UserProfile  # Import models
from .schemas import UserSchema, EventSchema, TicketSchema, PaymentSchema,  UserProfileSchema # Import schemas

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define blueprints
auth_bp   = Blueprint('auth', __name__)   # Authentication endpoints
event_bp  = Blueprint('event', __name__)  # Event management endpoints
ticket_bp = Blueprint('ticket', __name__) # Ticket purchase endpoints

# Initialize schemas
user_schema         = UserSchema()
event_schema        = EventSchema()
ticket_schema       = TicketSchema()
payment_schema      = PaymentSchema()
user_profile_schema = UserProfileSchema()

# User Retrieval Decorator:  Gets the user object from the JWT identity (email)
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
    data         = request.get_json()
    email        = data.get('email')
    password     = data.get('password')
    role         = data.get('role', 'customer')  # Default role is 'customer'
    phone_number = data.get('phone_number')
    name         = data.get('name') # Getting the name from the payload.

    if not email or not password or not phone_number:
        return jsonify({'message': 'Email, password and phone number are required'}), 400

    if role not in ('customer', 'organizer'):
        return jsonify({'message': 'Invalid role specified'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    new_user        = User(email=email, password_hash=hashed_password, role=role, phone_number=phone_number)

    try:
        db.session.add(new_user)
        db.session.commit()
        #Create the user Profile once the user has been created.
        new_user_profile = UserProfile(user_id=new_user.id, name=name) #Passing in the name from the registration
        db.session.add(new_user_profile)
        db.session.commit()

        return jsonify(user_schema.dump(new_user)), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating user: {e}")
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    email    = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        # Add the user's role to the JWT claims
        access_token = create_access_token(identity=email, additional_claims={'role': user.role})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
@get_user_from_token
def get_user_details(user):
    return jsonify(user_schema.dump(user)), 200

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
    # retrieves a list of events, with support for searching, filtering and pagination.

    location = request.args.get('location')
    tag = request.args.get('tag')
    category = request.args.get('category')

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    query = Event.query

    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))  # Case-insensitive search

    if tag:
        query = query.filter(Event.tags.ilike(f"%{tag}%"))

    if category:
        query = query.filter(Event.category == category)

    pagination = query.paginate(page=page, per_page=per_page)
    events = pagination.items

    event_list = [event_schema.dump(event) for event in events] 

    return jsonify({
        'events': event_list,
        'total_pages': pagination.pages,
        'current_page': pagination.page,
        'total_events': pagination.total,
        'per_page': per_page
    }), 200

@event_bp.route('/events', methods=['POST'])
@jwt_required()
@get_user_from_token
def create_event(user):
    # Only organizers can create events
    claims = get_jwt() #Get the JWT Claims
    role   = claims.get('role')

    if role != 'organizer':
        return jsonify({'message': 'Unauthorized: Only organizers can create events'}), 403

    data = request.get_json()
    try:
        start_date_str = data.get('start_date')
        end_date_str   = data.get('end_date')
        ticket_tiers = data.get('ticket_tiers')
        start_date = parser.parse(start_date_str)
        end_date   = parser.parse(end_date_str)

        new_event = Event(
            organizer_id=user.id,
            title=data.get('title'),
            description=data.get('description'),
            location=data.get('location'),
            category=data.get('category'),
            tags=data.get('tags'),
            start_date=start_date,
            end_date=end_date,
            image_url=data.get('image_url'),
            ticket_tiers=ticket_tiers #Ticket tiers
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(event_schema.dump(new_event)), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating event: {e}")
        return jsonify({'message': f'Error creating event: {str(e)}'}), 500 

@event_bp.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
@get_user_from_token
def delete_event(user, event_id):
    """Deletes an event with the given ID.  Only the event organizer can delete the event."""

    claims = get_jwt()  # Get our JWT claims
    role = claims.get('role')

    if role != 'organizer':
        return jsonify({'message': 'Unauthorized: Only organizers can delete events'}), 403

    event = Event.query.get(event_id)

    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Check if the current user is the organizer of the event
    if event.organizer_id != user.id:
        return jsonify({'message': 'Unauthorized: You are not the organizer of this event'}), 403

    try:
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting event: {e}")
        return jsonify({'message': f'Error deleting event: {str(e)}'}), 500

@auth_bp.route('/my_events', methods=['GET'])
@jwt_required()
@get_user_from_token
def get_my_events(user):
    # Using the tickets relationship to get the events 🤯
    events = [ticket.event for ticket in user.tickets]  # Get all the tickets for the current user
    serialized_events = [event_schema.dump(event) for event in events]

    return jsonify(serialized_events), 200

# --- Ticket Routes ---
@ticket_bp.route('/tickets', methods=['POST'])
@jwt_required()
@get_user_from_token
def purchase_ticket(user):
    data        = request.get_json()
    event_id    = data.get('event_id')
    ticket_type = data.get('ticket_type')

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

     # Check if the ticket_type is valid for this event
    if ticket_type not in event.ticket_tiers:
        return jsonify({'message': 'Invalid ticket type for this event'}), 400

    try:
        new_ticket = Ticket(
            event_id=event_id,
            customer_id=user.id,
            ticket_type=ticket_type
        )
        db.session.add(new_ticket)
        db.session.commit()
        
        return jsonify(ticket_schema.dump(new_ticket)), 201
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