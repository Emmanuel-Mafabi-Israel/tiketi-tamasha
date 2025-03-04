# GLORY BE TO GOD,
# TIKETI TAMASHA APP,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

# app/__init__.py
from flask import Flask, render_template
from flask_cors import CORS
from extensions import db, jwt, migrate
from routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app) 
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app)

    with app.app_context():
        app.register_blueprint(auth_bp)  # ✅ Use directly
        app.register_blueprint(routes.auth_bp)   # User Authentication Routes
        app.register_blueprint(routes.event_bp)  # Event Management Routes
        app.register_blueprint(routes.ticket_bp) # Ticket Routes

        app.register_error_handler(404, page_not_found)
        app.register_error_handler(500, server_error)

        return app

def page_not_found(e):
    return render_template('404.html'), 404

def server_error(e):
    return render_template('500.html'), 500