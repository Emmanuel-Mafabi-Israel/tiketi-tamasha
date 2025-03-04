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
from .schemas import UserSchema, EventSchema, TicketSchema, PaymentSchema,  UserProfileSchema , ResetPasswordSchema, ForgotPasswordSchema #import schemas
from .services import send_reset_email, reset_password

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
def get_user_details():
    """
    Retrieves the details of the current user, including profile information.
    """
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Serialize the user
        user_data = user_schema.dump(user)

        # Add profile information to the response
        if user.profile:
            user_data['name'] = user.profile.name  # Include the user's name
            user_data['profile'] = user_profile_schema.dump(user.profile)  # Include all profile information
        else:
             user_data['name'] = None
             user_data['profile'] = None # No user Profile

        return jsonify(user_data), 200

    except Exception as e:
        logging.error(f"Error retrieving user details: {e}")
        return jsonify({'message': f'Error retrieving user details: {str(e)}'}), 500
    
@auth_bp.route('/user/tickets', methods=['GET'])
@jwt_required()
def get_user_tickets():
    """
    Retrieves all tickets purchased by the current user, including the event title.
    """
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Get all tickets purchased by the user
        tickets = Ticket.query.filter_by(customer_id=user.id).all()

        # Serialize the tickets AND add the event title
        ticket_list = []
        for ticket in tickets:
            ticket_data = ticket_schema.dump(ticket)  # Serialize the ticket data
            ticket_data['event_title'] = ticket.event.title  # Add the event title from the relationship
            ticket_list.append(ticket_data)

        return jsonify({'tickets': ticket_list}), 200

    except Exception as e:
        logging.error(f"Error retrieving user tickets: {e}")
        return jsonify({'message': f'Error retrieving user tickets: {str(e)}'}), 500
    
# ---- User Account Edit ----
# Profile Edit Route
@auth_bp.route('/user', methods=['PUT'])
@jwt_required()
@get_user_from_token
def update_user_profile(user):
    data = request.get_json()

    if 'email' in data:
        email = data['email']
        if User.query.filter(User.email == email, User.id != user.id).first():
            return jsonify({'message': 'Email already in use'}), 400
        user.email = email

    if 'phone_number' in data:
        user.phone_number = data['phone_number']

    if 'name' in data:
        user.profile.name = data['name']

    try:
        db.session.commit()
        return jsonify({'message': 'User profile updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating user profile: {e}")
        return jsonify({'message': f'Error updating user profile: {str(e)}'}), 500

#  ---- User Deletion ----
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

@auth_bp.route('/user/payments', methods=['GET'])
@jwt_required()
def get_user_payments():
    """
    Retrieves all payments made by the current user, including the event title.
    """
    try:
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Get all tickets purchased by the user
        user_tickets = [ticket.id for ticket in user.tickets]

        # Fetch all payments associated with those tickets
        payments = Payment.query.filter(Payment.ticket_id.in_(user_tickets)).all()

        # Serialize the payments AND add the event title
        payment_list = []
        for payment in payments:
            payment_data = payment_schema.dump(payment)  # Serialize the payment data
            payment_data['event_title'] = payment.ticket.event.title  # Access event title through relationships
            payment_list.append(payment_data)

        return jsonify({'payments': payment_list}), 200

    except Exception as e:
        logging.error(f"Error retrieving user payments: {e}")
        return jsonify({'message': f'Error retrieving user payments: {str(e)}'}), 500

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
            ticket_tiers=ticket_tiers, # Ticket tiers
            total_tickets=data.get('total_tickets', 100)  # Default total tickets available
        )

        db.session.add(new_event)
        db.session.commit()
        return jsonify(event_schema.dump(new_event)), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating event: {e}")
        return jsonify({'message': f'Error creating event: {str(e)}'}), 500

@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """
    Retrieves the details of a specific event by its ID.
    """
    try:
        event = Event.query.get(event_id)

        if event:
            return jsonify(event_schema.dump(event)), 200
        else:
            return jsonify({'message': 'Event not found'}), 404

    except Exception as e:
        logging.error(f"Error retrieving event: {e}")
        return jsonify({'message': f'Error retrieving event: {str(e)}'}), 500

# ---- edit event ----
@event_bp.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
@get_user_from_token
def update_event(user, event_id):
    claims = get_jwt()  # Get our JWT claims
    role = claims.get('role')

    if role != 'organizer':
        return jsonify({'message': 'Unauthorized: Only organizers can update events'}), 403

    event = Event.query.get(event_id)

    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Check if the current user is the organizer of the event
    if event.organizer_id != user.id:
        return jsonify({'message': 'Unauthorized: You are not the organizer of this event'}), 403

    data = request.get_json()
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'location' in data:
        event.location = data['location']
    if 'start_date' in data:
        event.start_date = parser.parse(data['start_date'])
    if 'end_date' in data:
        event.end_date = parser.parse(data['end_date'])

    try:
        db.session.commit()
        return jsonify({'message': 'Event updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating event: {e}")
        return jsonify({'message': f'Error updating event: {str(e)}'}), 500

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

# upcoming events... having it in calendar
@auth_bp.route('/user/upcoming_events', methods=['GET'])
@jwt_required()
@get_user_from_token
def get_user_upcoming_events(user):
    current_time = datetime.now()
    upcoming_events = []

    for ticket in user.tickets:
        event = ticket.event
        if event.start_date > current_time:
            upcoming_events.append(event_schema.dump(event))
    
    return jsonify({
        'message': 'Upcoming events retrieved successfully',
        'upcoming_events': upcoming_events
    }), 200

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

    print(f"mafabi: [{data}]")

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    if ticket_type not in event.ticket_tiers:
        return jsonify({'message': 'Invalid ticket type for this event'}), 400

    if not phone_number:
        return jsonify({'message': 'Phone number is required.'}), 400

    # Check ticket availability
    if event.tickets_sold >= event.total_tickets:
        return jsonify({'message': 'No tickets available for this event'}), 400

    # 1. Create a *Pending* Ticket
    new_ticket = Ticket(
        event_id=event_id,
        customer_id=user.id,
        ticket_type=ticket_type
    )

    db.session.add(new_ticket)
    db.session.flush()  # Get the ticket ID immediately but do not commit

    # 2. Initiate MPESA STK Push
    account_reference = str(f"TIKETITAMASHA Ticket ID:[{new_ticket.id}] for the event [{event.title}]")  # Use ticket ID as account reference
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
        new_payment = Payment(
            ticket_id=new_ticket.id,
            amount=amount,
            payment_method='MPESA',
            status='pending',
            transaction_id=checkout_request_id  # Store checkout_request_id
        )

        # Increment tickets sold
        # event.tickets_sold += 1 -> only after payment has been confirmed...

        db.session.add(new_payment)
        db.session.commit()  # Now commit both ticket and pending payment

        return jsonify({
            'message': 'MPESA STK push initiated. Awaiting payment confirmation.',
            'checkout_request_id': checkout_request_id,  # Return ID to frontend for potential status checks
            'account_reference': account_reference
        }), 200
    else:
        # If STK push fails, rollback the ticket creation
        db.session.rollback()
        return jsonify({'message': f'MPESA STK push failed: {message}'}), 500

@ticket_bp.route('/mpesa_transaction_status', methods=['POST'])
@jwt_required()
@get_user_from_token
def query_transaction_status(user):
    """
    Queries the status of an MPESA transaction by CheckoutRequestID.
    """
    data = request.get_json()
    checkout_request_id = data.get('checkout_request_id')

    if not checkout_request_id:
        return jsonify({'message': 'CheckoutRequestID is required'}), 400

    success, message, transaction_status = services.query_mpesa_transaction_status(checkout_request_id)

    if success:
        return jsonify({'message': message, 'transaction_status': transaction_status}), 200
    else:
        return jsonify({'message': message}), 500

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

        mpesa_receipt_number = None # just for initialization...
        items = None

        if 'CallbackMetadata' in mpesa_data['Body']['stkCallback']:
            items = mpesa_data['Body']['stkCallback']['CallbackMetadata']['Item']
            # Process the items
            for item in items:
                if item['Name'] == 'MpesaReceiptNumber':
                    mpesa_receipt_number = item['Value']
                    break
                        
        # Find the corresponding payment record,
        payment = Payment.query.filter_by(transaction_id=checkout_request_id).first()

        print(f"debug[callback metadata]: {items}")

        if not payment:
            logging.warning(f"Payment record not found for CheckoutRequestID: {checkout_request_id}")
            return jsonify({'message': 'Payment record not found'}), 404

        if result_code == 0:  # Successful transaction
            # we've confirmed the payment, then let us update the
            # payment status -> completed...
            payment.status = 'completed'
            payment.transaction_id = mpesa_receipt_number # Store actual MPESA transaction ID

            # we increment tickets sold...
            event = payment.ticket.event
            event.tickets_sold += 1

            db.session.commit()
            logging.info(f"Payment completed successfully. Ticket ID: {payment.ticket_id}, MPESA Receipt: {mpesa_receipt_number}")
            return jsonify({'message': 'Payment received successfully'}), 200
        else:
            if result_code == 1032:
                # cancelled request...
                payment.status = 'cancelled'
                db.session.commit()

                return jsonify({'message': f'Payment cancelled: {result_desc}'}), 200
            else:
                # Payment failed
                payment.status = 'failed'
                db.session.commit()

                return jsonify({'message': f'Payment failed: {result_desc}'}), 400

    except Exception as e:
        logging.error(f"Error processing MPESA callback: {e}")
        # Attempt to query the transaction status as a fallback
        success, message, transaction_status = services.query_mpesa_transaction_status(checkout_request_id)
        if success:
            logging.info(f"Transaction status query successful after callback error: {message}")
            # You might want to update the payment status based on the query result here
            # depending on your business logic.
            return jsonify({'message': f'Callback error, but transaction status query successful: {message}'}), 200
        else:
            logging.error(f"Transaction status query failed after callback error: {message}")
            return jsonify({'message': f'Error processing MPESA callback and status query failed: {str(e)}'}), 500

# --- Search and filter functions ---
@event_bp.route('/events/search', methods=['GET'])
def search_events():
    """
    Searches for events based on a search term across title, category, and tags.
    """
    search_term = request.args.get('q')  # 'q' is a common convention for search query parameters
    page        = request.args.get('page', 1, type=int) # Pagination
    per_page    = request.args.get('per_page', 10, type=int) # Pagination

    if not search_term:
        return jsonify({'message': 'Search term is required'}), 400

    # Construct the query: search across title, category, and tags
    query = Event.query.filter(
        db.or_(
            Event.title.ilike(f"%{search_term}%"),       # Case-insensitive search in title
            Event.category.ilike(f"%{search_term}%"),    # Case-insensitive search in category
            Event.tags.ilike(f"%{search_term}%")         # Case-insensitive search in tags
        )
    )

    # Paginate the results
    pagination = query.paginate(page=page, per_page=per_page)
    events = pagination.items

    # Serialize the events
    event_list = [event_schema.dump(event) for event in events]

    return jsonify({
        'events': event_list,
        'total_pages': pagination.pages,
        'current_page': pagination.page,
        'total_events': pagination.total,
        'per_page': per_page
    }), 200

##  --- Category count ---
@event_bp.route('/events/category_count/<string:category_name>', methods=['GET'])
def get_event_category_count(category_name):
    """
    Returns the total number of events in a specified category.
    """
    try:
        # Count the number of events in the specified category
        event_count = Event.query.filter_by(category=category_name).count()
        return jsonify({'count': event_count}), 200

    except Exception as e:
        logging.error(f"Error retrieving event category count: {e}")
        return jsonify({'message': f'Error retrieving event category count: {str(e)}'}), 500
    
# --- Popular events ---
@event_bp.route('/events/popular', methods=['GET'])
def get_popular_events():
    """
    Returns three random events from the database as "popular" events.
    """
    try:
        # Get all event IDs
        all_event_ids = [event.id for event in Event.query.all()]

        if not all_event_ids:
            return jsonify({'message': 'No events available'}), 404

        # Select three random event IDs
        popular_event_ids = random.sample(all_event_ids, min(3, len(all_event_ids)))  # Ensure we don't try to sample more than exist

        # Retrieve the actual events from the database
        popular_events = Event.query.filter(Event.id.in_(popular_event_ids)).all()

        # Serialize the popular events
        event_list = [event_schema.dump(event) for event in popular_events]

        return jsonify({'popular_events': event_list}), 200

    except ValueError as ve:  # Catch the error if len(all_event_ids) < 3
        logging.warning(f"Not enough events to select 3 random events: {ve}")
        # Return all available events or an empty list, depending on your requirements
        all_events = Event.query.all()
        event_list = [event_schema.dump(event) for event in all_events]
        return jsonify({'popular_events': event_list}), 200 #Return all the events.
    except Exception as e:
        logging.error(f"Error retrieving popular events: {e}")
        return jsonify({'message': f'Error retrieving popular events: {str(e)}'}), 500

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

@auth_bp.route("/forgot-password", methods=["POST", "OPTIONS"])
def forgot_password():
    if request.method == "OPTIONS":
        return "", 200  # Handle CORS preflight request

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    return jsonify({"message": "Reset link sent to your email"}), 200

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password_route():
    data = request.get_json()
    schema = ResetPasswordSchema(**data)

    if reset_password(schema.token, schema.new_password):
        return jsonify({"message": "Password reset successful."}), 200
    return jsonify({"error": "Invalid or expired token"}), 400
