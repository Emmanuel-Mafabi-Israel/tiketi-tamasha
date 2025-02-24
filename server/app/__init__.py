# GLORY BE TO GOD,
# TIKETI TAMASHA APP,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

# app/__init__.py
import os
import sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from flask import Flask, render_template
from flask_cors import CORS
from extensions import db, jwt, migrate
from dotenv import load_dotenv
from config import config

load_dotenv()

def create_app(config_name="default"):
    app = Flask(__name__)
    
    if config_name not in config:
        raise ValueError(f"Invalid config name: {config_name}. Must be one of {list(config.keys())}")

    app.config.from_object(config[config_name])  # ✅ Use config dictionary
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app)

    with app.app_context():
        from . import routes
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