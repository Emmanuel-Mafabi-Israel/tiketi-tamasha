# GLORY BE TO GOD,
# TIKETI TAMASHA - ROUTES FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

from flask import Blueprint, request, jsonify
import cloudinary
import cloudinary.uploader
import os
import logging
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from .models import User, Event, Ticket
from .schemas import UserSchema, EventSchema, TicketSchema

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Cloudinary Config (Set in .env)
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Define blueprints
auth_bp   = Blueprint('auth', __name__)    
event_bp  = Blueprint('event', __name__)   
ticket_bp = Blueprint('ticket', __name__)  
upload_bp = Blueprint('upload', __name__)  # ✅ New blueprint for uploads

# Initialize schemas
user_schema   = UserSchema()
event_schema  = EventSchema()
ticket_schema = TicketSchema()

# User Retrieval Decorator
def get_user_from_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return func(user, *args, **kwargs)
    return wrapper

# --- Upload Image Route ---
@upload_bp.route("/", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Upload to Cloudinary
    upload_result = cloudinary.uploader.upload(file)

    # Return the Cloudinary URL
    return jsonify({"image_url": upload_result["secure_url"]})

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

    new_user = User(email=email, password_hash=password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error creating user: {e}")
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# --- Event Routes ---
@event_bp.route('/events', methods=['POST'])
@jwt_required()
@get_user_from_token
def create_event(user):
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

@event_bp.route('/events', methods=['GET'])
def get_all_events():
    events = Event.query.all()
    return jsonify([event_schema.dump(event) for event in events]), 200

@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event_details(event_id):
    event = Event.query.get(event_id)
    if event:
        event_details = {
            'title': event.title,
            'description': event.description,
            'start_date': event.start_date,
            'end_date': event.end_date,
            'location': event.location,
            'category': event.category,
            'image_url': event.image_url
        }
        return jsonify(event_details), 200
    return jsonify({'message': 'Event not found'}), 404

