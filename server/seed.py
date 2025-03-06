import os
from app import app, db  # Ensure these are correctly set up in your Flask app
from models import Event, User
import cloudinary
from dotenv import load_dotenv
load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Sample Users (for event organizers)
users = [
    {"email": "organizer1@example.com", "password_hash": "hashedpassword1", "role": "organizer"},
    {"email": "organizer2@example.com", "password_hash": "hashedpassword2", "role": "organizer"}
]

# Sample Events
events = [
    {
        "title": "Nairobi Music Festival",
        "description": "The biggest music festival in East Africa!",
        "location": "Nairobi, Kenya",
        "category": "Music",
        "tags": ["concert", "festival", "live"],
        "start_date": "2025-07-10",
        "end_date": "2025-07-12",
        "image_url": "https://res.cloudinary.com/your_cloud_name/image/upload/v1700000000/music_festival.jpg"
    },
    {
        "title": "Kenya Tech Expo",
        "description": "A showcase of the latest AI and technology trends.",
        "location": "Mombasa, Kenya",
        "category": "Technology",
        "tags": ["AI", "robotics", "innovation"],
        "start_date": "2025-08-15",
        "end_date": "2025-08-18",
        "image_url": "https://res.cloudinary.com/your_cloud_name/image/upload/v1700000000/tech_expo.jpg"
    },
    {
        "title": "Food & Wine Tasting",
        "description": "A gourmet experience for food and wine lovers.",
        "location": "Kisumu, Kenya",
        "category": "Food & Drinks",
        "tags": ["wine", "food", "tasting"],
        "start_date": "2025-06-20",
        "end_date": "2025-06-22",
        "image_url": "https://res.cloudinary.com/your_cloud_name/image/upload/v1700000000/food_wine.jpg"
    }
]

def seed_database():
    with app.app_context():
        try:
            # Clear existing data (optional)
            db.session.query(Event).delete()
            db.session.query(User).delete()

            # Add sample users
            user_objects = []
            for user in users:
                new_user = User(
                    email=user["email"],
                    password_hash=user["password_hash"],  # Store properly hashed passwords in production
                    role=user["role"]
                )
                db.session.add(new_user)
                user_objects.append(new_user)

            db.session.commit()

            # Assign events to first organizer
            organizer_id = user_objects[0].id if user_objects else None

            # Insert new events
            for event in events:
                new_event = Event(
                    organizer_id=organizer_id,
                    title=event["title"],
                    description=event["description"],
                    location=event["location"],
                    category=event["category"],
                    tags=event["tags"],
                    start_date=event["start_date"],
                    end_date=event["end_date"],
                    image_url=event["image_url"]
                )
                db.session.add(new_event)

            db.session.commit()
            print("✅ Database seeded successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding database: {e}")
        finally:
            db.session.close()

if __name__ == "__main__":
    seed_database()
