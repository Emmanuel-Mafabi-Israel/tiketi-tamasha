# server/seed.py
import os
import json
from datetime import datetime
from app import create_app
from app.models import Event
from extensions import db
from dateutil import parser
import logging

# Configure logging (adjust as needed)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def seed_data():
    """
    Seeds the database with event data from a JSON file.
    """
    app = create_app()  # Create the Flask app instance
    with app.app_context():

        # Construct the full path to the JSON file
        json_file_path = "H:\\Software Engineering - Group Projects\\tiketi-tamasha\\server\\events.json"

        try:
            with open(json_file_path, 'r') as f:
                event_data_list = json.load(f)

            for event_data in event_data_list:
                # Convert date strings to datetime objects
                start_date = parser.parse(event_data.get('start_date'))
                end_date = parser.parse(event_data.get('end_date'))

                # Create a new Event instance
                new_event = Event(
                    organizer_id=1,  # Assuming a default organizer, change as needed
                    title=event_data.get('title'),
                    description=event_data.get('description'),
                    location=event_data.get('location'),
                    category=event_data.get('category'),
                    tags=event_data.get('tags'),
                    start_date=start_date,
                    end_date=end_date,
                    image_url=event_data.get('image_url'),
                    ticket_tiers=event_data.get('ticket_tiers'),
                    total_tickets=event_data.get('total_tickets')
                )

                db.session.add(new_event)

            db.session.commit()
            logging.info("Data seeding completed successfully!")

        except FileNotFoundError:
            logging.error(f"Error: JSON file not found at {json_file_path}")
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error during data seeding: {e}")
        finally:
            db.session.remove() #Removes the current SQLAlchemy session for the current thread

if __name__ == '__main__':
    seed_data()