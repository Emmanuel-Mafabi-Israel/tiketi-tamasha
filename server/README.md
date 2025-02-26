# Tiketi Tamasha - Backend,

# By Israel Mafabi Emmanuel

## Project Overview

Tiketi Tamasha is a platform for event organizers to list and sell tickets for their events, and for customers to discover and purchase tickets. This document describes the backend of the Tiketi Tamasha platform, built using Flask, Flask-RESTful, SQLAlchemy, and JWT for authentication.

## Key Features

* **User Authentication:** Secure user registration and login with role-based access control (customer, organizer).
* **Event Management:** Event organizers can create, update, and delete events.
* **Ticket Purchasing:** Customers can browse events and purchase tickets via MPESA STK push.
* **MPESA Integration:** Seamless MPESA payment processing with callback handling.
* **RESTful API:** Provides a RESTful API for interacting with the backend.

## File and Folder Structure

TiketiTamasha/
├── server/
│   ├── .env
│   ├── extensions.py
│   ├── server.py
│   ├── app/
│   │   ├── __ init __.py
│   │   ├── config.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── services.py
│   └── migrations/
│       ├── versions/
│       │   └── <migration_files>.py
│       └── alembic.ini
├── tests/
│   └── (optional test files)
├── LICENSE
└── README.md

### File Descriptions

* **`.env`:**
  * Stores sensitive information like API keys, database URLs, and secret keys.
  * **Important:** Never commit this file to your repository! Use environment variables or a secrets management service in production.
* **`extensions.py`:**
  * Initializes and configures Flask extensions such as SQLAlchemy, JWTManager, and Migrate.
  * Provides a central place to access these extensions throughout the application.
* **`server.py`:**
  * The main entry point for the Flask application.
  * Creates the Flask application instance using the `create_app` function from `app/__init__.py`.
  * Starts the Flask development server.
* **`app/__init__.py`:**
  * A factory function `create_app` to initialize the Flask application instance.
  * Configures the application from the `app/config.py` file.
  * Initializes Flask extensions.
  * Registers blueprints for different parts of the application (authentication, events, tickets).
  * Sets up error handlers for 404 and 500 errors.
* **`app/config.py`:**
  * Contains configuration settings for the Flask application, such as the database URI, secret key, and JWT secret key.
  * Loads these settings from environment variables using the `dotenv` library.
* **`app/models.py`:**
  * Defines the SQLAlchemy database models for the application, such as `User`, `Event`, `Ticket`, and `Payment`.
  * Specifies the table structure, data types, relationships, and validation rules for each model.
* **`app/routes.py`:**
  * Contains the Flask routes and API endpoints for the application.
  * Handles user authentication, event management, ticket purchasing, and MPESA callback processing.
  * Uses Flask-RESTful to define API resources and handle requests.
  * Uses Flask-JWT-Extended for JWT-based authentication.
* **`app/schemas.py`:**
  * Defines Marshmallow schemas for serializing and deserializing data.
  * Used to convert database models to JSON format and vice-versa.
  * Provides data validation and type coercion.
* **`app/services.py`:**
  * Contains business logic and integrations with external services, such as MPESA.
  * Handles MPESA STK push requests and other payment processing tasks.
* **`migrations/`:**
  * Directory containing Alembic migration scripts for managing database schema changes.

## Technologies Used

* **Python 3.x:** The programming language.
* **Flask:** A micro web framework.
* **Flask-RESTful:** An extension for building REST APIs with Flask.
* **SQLAlchemy:** An ORM (Object-Relational Mapper) for interacting with databases.
* **Flask-SQLAlchemy:** An extension that integrates SQLAlchemy with Flask.
* **Flask-Migrate:** An extension for handling database migrations with Alembic.
* **Flask-JWT-Extended:** An extension for JWT-based authentication.
* **Marshmallow:** A library for serializing and deserializing data.
* **python-dotenv:** A library for loading environment variables from a `.env` file.
* **requests:** A library for making HTTP requests.
* **MPESA API:** Safaricom's mobile payment API.

## Setup and Installation

1. **Clone the repository:**
   
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Create a virtual environment:**
   
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   
   * **On Windows:**
     
     ```bash
     venv\Scripts\activate
     ```
   
   * **On macOS and Linux:**
     
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   
   ```bash
   pip install -r requirements.txt
   ```

5. **Create a `.env` file:**
   
   Create a `.env` file in the `server/` directory and populate it with the necessary environment variables.  See the `.env` file I gave you in the past as a guide.
   
   * **Important:** Get the correct values and never hard code anything!
     
     * `SECRET_KEY`: A secret key for your Flask application.
     * `SQLALCHEMY_DATABASE_URI`: The URI for your database (e.g., `sqlite:///tiketi_tamasha.db`).
     * `JWT_SECRET_KEY`: A secret key for JWT authentication.
     * `MPESA_BUSINESS_SHORT_CODE`: Your MPESA business short code.
     * `MPESA_PASSKEY`: Your MPESA passkey.
     * `MPESA_CONSUMER_KEY`: Your MPESA consumer key.
     * `MPESA_CONSUMER_SECRET`: Your MPESA consumer secret.
     * `MPESA_CALLBACK_URL`: The URL for your MPESA callback (use Ngrok for local testing).
     
     **Example `.env` file:**
     
     ```
     SECRET_KEY="your_secret_key"
     SQLALCHEMY_DATABASE_URI="sqlite:///tiketi_tamasha.db"
     JWT_SECRET_KEY="your_jwt_secret_key"
     MPESA_BUSINESS_SHORT_CODE="174379"
     MPESA_PASSKEY="your_mpesa_passkey"
     MPESA_CONSUMER_KEY="your_mpesa_consumer_key"
     MPESA_CONSUMER_SECRET="your_mpesa_consumer_secret"
     MPESA_CALLBACK_URL="https://your-ngrok-url.ngrok.io/mpesa_callback"
     ```

6. **Run Database Migrations:**
   
   ```bash
   flask db init         # Only run this once
   flask db migrate -m "Initial migration"
   flask db upgrade head
   ```
   
   This will create the database tables.

## Running the Application

1. **Start the Flask development server:**
   
   ```bash
   flask run --debug
   ```
   
   The application will be running at `http://127.0.0.1:5000` (or the port you've configured).

## API Endpoints

Here are some of the key API endpoints:

* **`POST /register`:** Register a new user.
  * Request body: `{ "email": "user@example.com", "password": "password", "phone_number": "254712345678", "name": "John Doe" }`
* **`POST /login`:** Log in an existing user.
  * Request body: `{ "email": "user@example.com", "password": "password" }`
* **`GET /user`:** Get the details of the currently logged-in user (requires JWT).
* **`DELETE /user`:** Delete the currently logged-in user's account (requires JWT).
* **`GET /events`:** Get a list of events (supports filtering by location, tag, and category).
* **`POST /events`:** Create a new event (requires JWT and organizer role).
  * Request body: See `app/models.py` for the structure of the `Event` model.
* **`DELETE /events/<event_id>`:** Delete an event (requires JWT and organizer role).
* **`POST /tickets`:** Purchase a ticket for an event (requires JWT).
  * Request body: `{ "event_id": 1, "ticket_type": "Early Bird", "phone_number": "254712345678" }`
* **`POST /mpesa_callback`:** MPESA callback URL (do not access directly).

## MPESA Integration Notes

* The MPESA integration uses the STK Push API to initiate payments.
* The `services.py` file contains the logic for generating the MPESA password and sending the STK push request.
* The `/mpesa_callback` route handles the MPESA callback and updates the payment status in the database.
* **Important:** In production, you must use HTTPS for your callback URL and implement MPESA's recommended methods for verifying callback authenticity.

## Debugging

* **Enable Debug Mode:** Run the Flask application with `--debug` to enable the debugger and automatic reloading.
* **Check Logs:** Carefully examine the application logs for any errors or warnings.
* **Use a Debugger:** Use a debugger (e.g., `pdb`) to step through the code and inspect variables.
* **Inspect MPESA Callbacks:** Use the Ngrok web interface to inspect the MPESA callbacks and verify that they're being sent correctly.

## Contributing

Please follow these steps to contribute to the project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Write tests for your changes.
5. Run the tests to ensure that everything is working correctly.
6. Commit your changes with a clear and descriptive commit message.
7. Push your changes to your fork.
8. Submit a pull request.



### Acknowledgements

Made with Love, Glory  be to God.

By Tamasha Dev.



- Emmanuel Mafabi

- Sean Daniel

- Ali Abdikadir
  
  

## License

[MIT License](LICENSE)
