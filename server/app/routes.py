# GLORY BE TO GOD,
# TIKETI TAMASHA - ROUTES FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os  # For accessing environment variables
import logging  # Import logging
from functools import wraps
from dateutil import parser
from dotenv import load_dotenv

from . import services  # Import the services module
import base64  # Import Base64
from datetime import datetime

from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db  # Import db instance
from .models import User, Event, Ticket, Payment, UserProfile  # Import models
from .schemas import UserSchema, EventSchema, TicketSchema, PaymentSchema,  UserProfileSchema # Import schemas

load_dotenv()

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
    tag      = request.args.get('tag')
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
    # Only organizers can create events!
    claims = get_jwt() #Get the JWT Claims
    role   = claims.get('role')

    if role != 'organizer':
        return jsonify({'message': 'Unauthorized: Only organizers can create events'}), 403 # -> development purposes only!

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
@get_user_from_token #The first parameter will be a user.
def purchase_ticket(user):
    """Purchases a ticket for an event using MPESA STK push."""
    data         = request.get_json()
    event_id     = data.get('event_id')
    ticket_type  = data.get('ticket_type')
    phone_number = data.get('phone_number')  # Get phone number from the request
    amount       = data.get('amount')  # Get the ticket amount from the request.

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    if ticket_type not in event.ticket_tiers:
        return jsonify({'message': 'Invalid ticket type for this event'}), 400

    if not phone_number:
        return jsonify({'message': 'Phone number is required.'}), 400
    # 1. Create a *Pending* Ticket
    new_ticket = Ticket(
        event_id=event_id,
        customer_id=user.id,
        ticket_type=ticket_type
    )

    db.session.add(new_ticket)
    db.session.flush()  # Get the ticket ID immediately but do not commit

    # 2. Initiate MPESA STK Push
    account_reference = str(new_ticket.id)  # Use ticket ID as account reference
    transaction_description = f"Ticket purchase for {event.title} ({ticket_type})"

    callback_url = os.getenv("MPESA_CALLBACK_URL")

    success, message, checkout_request_id = services.initiate_mpesa_stk_push(
        phone_number=phone_number,
        amount=amount,  # The amount from the request
        callback_url=callback_url,
        account_reference=account_reference,
        transaction_description=transaction_description
    )

    if success:
        # 3. Create a *Pending* Payment Record
        # we'll change this once we receive the callback return
        # if the return is a success that is...
        # otherwise, we'll change it to failed.
        new_payment = Payment(
            ticket_id=new_ticket.id,
            amount=amount,
            payment_method='MPESA',
            status='pending',
            transaction_id=checkout_request_id  # Store checkout_request_id
        )

        db.session.add(new_payment)
        db.session.commit()  # Now commit both ticket and pending payment

        return jsonify({
            'message': 'MPESA STK push initiated.  Awaiting payment confirmation.',
            'checkout_request_id': checkout_request_id  # Return ID to frontend for potential status checks
        }), 200
    else:
        # If STK push fails, rollback the ticket creation
        db.session.rollback()
        return jsonify({'message': f'MPESA STK push failed: {message}'}), 500

@ticket_bp.route('/mpesa_callback', methods=['POST'])
def mpesa_callback():
    """
        MPESA callback URL to handle transaction confirmation.
        MPESA will POST data to this endpoint.
    """
    print("debug[callback return]: MPESA CALLBACK HIT")
    logging.info("MPESA CALLBACK WAS HIT! - entering the callback route")
    try:
        mpesa_data = request.get_json()
        logging.info(f"MPESA Callback data: {mpesa_data}") #Log to confirm that we are receiving the callback
        # Extract relevant information from the MPESA callback data
        checkout_request_id = mpesa_data['Body']['stkCallback']['CheckoutRequestID']
        result_code = mpesa_data['Body']['stkCallback']['ResultCode']
        result_desc = mpesa_data['Body']['stkCallback']['ResultDesc']

        # Find the corresponding payment record,
        payment = Payment.query.filter_by(transaction_id=checkout_request_id).first()

        if not payment:
            logging.warning(f"Payment record not found for CheckoutRequestID: {checkout_request_id}")
            return jsonify({'message': 'Payment record not found'}), 404

        if result_code == 0:  # Successful transaction
            # Extract MPESA transaction ID (Receipt Number)
            mpesa_receipt_number = mpesa_data['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value']
            # we've confirmed the payment, then let us update the
            # payment status -> completed...
            payment.status = 'completed'
            payment.transaction_id = mpesa_receipt_number # Store actual MPESA transaction ID
            db.session.commit()
            logging.info(f"Payment completed successfully. Ticket ID: {payment.ticket_id}, MPESA Receipt: {mpesa_receipt_number}")
            return jsonify({'message': 'Payment received successfully'}), 200
        else:
            # Payment failed
            payment.status = 'failed'
            db.session.commit()

            logging.error(f"Payment failed. CheckoutRequestID: {checkout_request_id}, ResultCode: {result_code}, ResultDesc: {result_desc}")

            return jsonify({'message': f'Payment failed: {result_desc}'}), 400

    except Exception as e:
        logging.error(f"Error processing MPESA callback: {e}")
        return jsonify({'message': f'Error processing MPESA callback: {str(e)}'}), 500

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
    metadata = db.metadata.tables  # Get all tables' metadata
    return render_template('models.html', metadata=metadata)

@auth_bp.route('/debug/users/', methods=['GET'])
def debug_users():
    # Retrieve and display all user emails for debugging
    users = User.query.all()
    emails = [(index + 1, user.email) for index, user in enumerate(users)]
    return render_template('emails.html', emails=emails)

@auth_bp.route('/mpesa_config', methods=['GET'])
def mpesa_config():
    config = {
        "MPESA_BUSINESS_SHORT_CODE": os.getenv("MPESA_BUSINESS_SHORT_CODE"),
        "MPESA_PASSKEY": os.getenv("MPESA_PASSKEY"),
        "MPESA_CONSUMER_KEY": os.getenv("MPESA_CONSUMER_KEY"),
        "MPESA_CONSUMER_SECRET": os.getenv("MPESA_CONSUMER_SECRET"),
        "MPESA_CALLBACK_URL": os.getenv("MPESA_CALLBACK_URL")
    }
    return jsonify(config), 200

@auth_bp.route('/mpesa_access_token', methods=['GET'])
def mpesa_access_token():
    return services.debug_access_token() #TODO: REMOVE IN PRODUCTION

# --- Error Handlers ---
@auth_bp.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@auth_bp.errorhandler(500)
def server_error(error):
    return render_template('500.html'), 500