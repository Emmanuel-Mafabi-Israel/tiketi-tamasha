import pytest
from app import create_app, db

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app("testing")  # Use the testing configuration
    with app.app_context():
        db.create_all()  # Create database tables
        yield app  # Provide the app to the test
        db.session.remove()
        db.drop_all()  # Clean up the database after tests

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()
