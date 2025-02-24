import pytest
from app import create_app  
from extensions import db
from app.models import User, Event, Ticket, Payment
from flask_jwt_extended import create_access_token
from datetime import datetime

@pytest.fixture
def app():
    app = create_app("testing")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["TESTING"] = True
    return app

@pytest.fixture
def client(app):
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

@pytest.fixture
def auth_token(app, client):
    with app.app_context():
        user = User(email="test@example.com", password_hash="hashedpassword", role="organizer")
        db.session.add(user)
        db.session.commit()
        
        token = create_access_token(identity=user.email)
        return {"Authorization": f"Bearer {token}"}

# --- User Tests ---
def test_register_user(client):
    response = client.post("/register", json={"email": "newuser@example.com", "password": "securepass"})
    assert response.status_code == 201
    assert "email" in response.get_json()

def test_login_user(client):
    test_register_user(client)  # Ensure user exists
    response = client.post("/login", json={"email": "newuser@example.com", "password": "securepass"})
    assert response.status_code == 200
    assert "access_token" in response.get_json()

# --- Event Tests ---
def test_create_event(client, auth_token):
    response = client.post("/events", json={
        "title": "Music Festival",
        "description": "A fun music event",
        "location": "Nairobi",
        "category": "Music",
        "start_date": datetime(2025, 6, 1, 18, 0).isoformat(),
        "end_date": datetime(2025, 6, 2, 23, 0).isoformat(),
        "tags": ["music", "festival", "live"]
    }, headers=auth_token)
    
    print("\nResponse:", response.get_json())
    print("\nStatus Code:", response.status_code)
    
    assert response.status_code == 201
    assert "title" in response.get_json()

def test_get_events(client):
    response = client.get("/events")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

# --- Ticket Tests ---
def test_purchase_ticket(client, auth_token):
    test_create_event(client, auth_token)
    response = client.post("/tickets", json={"event_id": 1, "ticket_type": "VIP"}, headers=auth_token)
    assert response.status_code == 201
    assert "ticket_type" in response.get_json()

def test_delete_user(client, auth_token):
    response = client.delete("/user", headers=auth_token)
    assert response.status_code == 200
    assert response.get_json()["message"] == "User account deleted successfully"
