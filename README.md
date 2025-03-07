# Tiketi Tamasha - Event Ticketing Platform

By Tamasha Devs

## Overview

Tiketi Tamasha is a full-stack web application designed to facilitate event ticketing. It allows event organizers to create and manage events, and customers to discover, purchase tickets, and manage their event attendance.

This README provides a detailed explanation of the project's architecture, components, deployment process, and setup instructions.

## Features

* **Event Discovery:** Browse events by category or search for specific events.
* **Event Details:** View comprehensive event information, including description, location, date, and ticket tiers.
* **Ticket Purchase:** Securely purchase tickets using MPESA STK Push.
* **User Authentication:** Register and login as either a customer or event organizer.
* **Organizer Dashboard:** Create, edit, and manage events (organizer role).
* **Customer Dashboard:** View purchased tickets, upcoming events, and payment history (customer role).
* **Profile Management:** Update user profile information.
* **Account Management:** Delete your account.

## Technology Stack

* **Frontend:**
  * React
  * React Router
  * Axios (for API communication)
  * Context API (for state management - Authentication and Loading)
  * CSS for Styling
  * Deployed on **Vercel**
* **Backend:**
  * Python
  * Flask
  * Flask-SQLAlchemy (ORM)
  * Flask-JWT-Extended (JWT Authentication)
  * Flask-Migrate (Database Migrations)
  * Marshmallow (Serialization)
  * Werkzeug (Password Hashing)
  * MPESA API Integration (for mobile money payments)
  * Deployed on **Render**
* **Database:**
  * SQLite (Development) - can be swapped out for other databases
* **MPESA Integration:**
  * Safaricom MPESA API for STK Push payments.
* **Other Libraries:**
  * dotenv - loading the environment variables...
  * python-dateutil - helps parse datatime.
  * Swal (SweetAlert2) for notification

## Project Structure

The project follows a modular structure, separating the frontend and backend into distinct directories.

### Frontend (Client) - `/client`

This directory contains the React application code.

* **`src/`:**
  * **`App.jsx`:** The root component, sets up routing and provides context providers.
  * **`index.js`:** Entry point for the React application, renders the `App` component.
  * **`routes.jsx`:** Defines the application's routes and utilizes `ProtectedRoute` for authentication.
  * **`components/`:** Reusable UI components:
    * `Navbar.jsx`: Navigation bar with dynamic links based on user authentication and role.
    * `Button.jsx`: Reusable button component.
    * `EventCard.jsx`: Displays event information.
    * `TicketCard.jsx`: Displays ticket information.
    * `NewEvent.jsx`: Form for creating or editing events (organizer role).
    * `ProtectedRoute.jsx`: Protects routes based on user authentication status.
    * `PaymentCard.jsx`: Payment information.
    * `DiscoverCard.jsx`: Discover cards.
  * **`pages/`:** Page-level components:
    * `Home.jsx`: Landing page.
    * `Login.jsx`: Login form.
    * `Register.jsx`: Registration form.
    * `CustomerDashboard.jsx`: Dashboard for customers.
    * `OrganizerDashboard.jsx`: Dashboard for event organizers.
    * `Discover.jsx`: Page for browsing events by category.
    * `Explore.jsx`: Page for searching and exploring events.
    * `NotFound.jsx`: 404 page.
  * **`context/`:** React Contexts for managing global state:
    * `AuthContext.js`: Manages user authentication state (user data, tokens) and provides login, register, and logout functions.
    * `LoadingContext.js`: Manages global loading state to display loading indicators.
  * **`api/`:** Services for interacting with the backend API:
    * `authService.js`: Authentication-related API calls.
    * `eventService.js`: Event management API calls.
    * `ticketService.js`: Ticket purchase API calls.
    * `paymentService.js`: Payment-related API calls.
    * `userService.js`: user related services.
    * `myEventService.js`: my events service...
  * **`styles/`:** CSS files for styling the components and pages.
  * **`assets/`:** Images and other static assets.
  * **`config.js`:** The config file, for environment variables

### Backend (Server) - `/server`

This directory contains the Flask API application code.

* **`server.py`:** The main entry point, creates and runs the Flask app.
* **`Procfile`:** Specifies the command to run the application on Render (`gunicorn server.server:app`).
* **`.env`:** Stores sensitive configuration variables (API keys, database URI, secret keys).  **Important:** This file should *never* be committed to version control.
* **`extensions.py`:** Initializes Flask extensions (SQLAlchemy, JWTManager, Migrate).
* **`app/`:**
  * **`__init__.py`:** Creates the Flask app, initializes extensions, registers blueprints (routes), and sets up error handlers.
  * **`config.py`:** Defines application configuration settings using environment variables.
  * **`models.py`:** Defines the database models (User, Event, Ticket, Payment) using SQLAlchemy.
  * **`routes.py`:** Defines the API endpoints (authentication, events, tickets, payments) using Flask blueprints.
  * **`schemas.py`:** Defines the serialization schemas for the database models using Marshmallow.
  * **`services.py`:** Handles business logic, especially the MPESA integration (generating access tokens, initiating STK push, querying transaction status).

## Setup and Installation

### Backend (Render)

1. **Clone the Repository:**
   
   ```bash
   git clone <our repo url>
   cd server
   ```

2. **Create a `.env` file:**
   
   Create a `.env` file in the `server/` directory and populate it with your configuration variables. Obtain these variables from MPESA developer portal and other secure sources.  **Do not commit this file to version control!**
   
   ```
   SECRET_KEY='your_secret_key'
   SQLALCHEMY_DATABASE_URI='sqlite:///tiketi_tamasha.db' # for local testing
   JWT_SECRET_KEY='your_jwt_secret_key'
   MPESA_BUSINESS_SHORTCODE="your_mpesa_business_shortcode"
   MPESA_CONSUMER_SECRET_KEY="your_mpesa_consumer_secret"
   MPESA_CONSUMER_KEY="your_mpesa_consumer_key"
   MPESA_PASSKEY="your_mpesa_passkey"
   MPESA_CALLBACK_URL="your_production_callback_url"  # IMPORTANT: Update this for production!
   DEVELOPMENT_GENERATE_URL="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
   LIVE_GENERATE_URL="https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
   DEVELOPMENT_PROCESS_REQUEST_URL="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
   LIVE_PROCESS_REQUEST_URL="https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
   ```

3. **Deploy to Render:**
   
   * Create a Render account.
   * Connect your repository to Render.
   * Render will automatically detect the Python environment and use the `Procfile` to start the application.
   * **Configure Environment Variables:** Add the environment variables from your `.env` file to the Render environment.  This is crucial for security and proper functioning.
   * **Disable Debug Mode:**  In production, ensure that `debug=False` is set in the backend code.

4. **Database Migrations:**
   After deploying for the first time, you might need to run database migrations to create the database tables. You can do this by connecting to the Render console and running the following commands, but it is not always needed.
   
       ```bash
       flask db init
       flask db migrate -m "Initial migration"
       flask db upgrade
       ```

### Frontend (Vercel)

1. **Clone the Repository:**
   
   ```bash
   git clone <our repo url>
   cd client
   ```

2. **Install Dependencies:**
   
   ```bash
   npm install
   ```

3. **Create a `.env.local` file:**
   
   Create a `.env.local` file in the `client/` directory and populate it with your configuration variables.
   
   ```
   REACT_APP_API_BASE_URL=your_backend_render_url
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
   REACT_APP_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Update `config.js`** Update the `config.js` file to reflect the REACT_APP_API_BASE_URL.
   
   ```js
   const CONFIG = {
       API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
       CLOUDINARY: {
           CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
           API_KEY: process.env.REACT_APP_CLOUDINARY_API_KEY,
           API_SECRET: process.env.REACT_APP_CLOUDINARY_API_SECRET,
           UPLOAD_PRESET: "ml_default",
       },
   };
   
   export default CONFIG;
   ```

5. **Deploy to Vercel:**
   
   * Create a Vercel account.
   * Connect your repository to Vercel.
   * Vercel will automatically detect the React environment and build the application.
   * **Configure Environment Variables:** Add the environment variables from your `.env.local` file to the Vercel environment. Prefix with `REACT_APP_`.
   * After successful deployment, Vercel will provide a unique URL for your application.

6. **Connecting to the backend**
   Set the backend url to Vercel's enviroment configuration.

## Configuration

* **Frontend:** Configuration variables are managed through environment variables (prefixed with `REACT_APP_`).
* **Backend:** Configuration variables are managed through environment variables.

## Deployment

* **Backend:** Deployed on Render using Gunicorn.
* **Frontend:** Deployed on Vercel as static files.

## API Endpoints

The backend API exposes the following endpoints:

* `/register`: User registration.
* `/login`: User login.
* `/user`: Get user details.
* `/user/tickets`: Get user tickets.
* `/user/payments`: Get user payments.
* `/events`: Get all events.
* `/events/{event_id}`: Get a specific event.
* `/events`: Create an event (organizer role).
* `/events/{event_id}`: Update an event (organizer role).
* `/events/{event_id}`: Delete an event (organizer role).
* `/tickets`: Purchase a ticket (MPESA STK Push).
* `/mpesa_callback`: MPESA callback URL.

## Important Considerations

* **Security:**
  * Protect your API keys and secret keys.  Never commit them to version control.
  * Use HTTPS for all communication.
  * Implement proper input validation and sanitization to prevent security vulnerabilities.
  * Consider rate limiting to prevent abuse.
* **MPESA Integration:**
  * Test your MPESA integration thoroughly in the sandbox environment before deploying to production.
  * Handle MPESA callback responses gracefully and update the database accordingly.
  * Monitor MPESA transaction statuses and implement error handling.
* **Frontend Performance:**
  * Optimize images and other assets for faster loading times.
  * Use code splitting to reduce the initial bundle size.

## Contributing

Please follow these guidelines when contributing to the project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Test your changes thoroughly.
5. Submit a pull request.

## License

MIT License

## Credits

Made with Love, Glory be to God.

By Tamasha Dev,

- Emmanuel Mafabi Israel

- Sean Daniel

- Ali Abdikadir
