# GLORY BE TO GOD,
# TIKETI TAMASHA APP,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

# app/__init__.py
import os
import sys
from flask import Flask, render_template
from flask_cors import CORS
from extensions import db, jwt, migrate
from dotenv import load_dotenv
from .config import config

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

load_dotenv()

def create_app(config_name="default"):
    app = Flask(__name__)

    if config_name not in config:
        raise ValueError(f"Invalid config name: {config_name}. Must be one of {list(config.keys())}")

    app.config.from_object(config[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app)

    with app.app_context():
        from .routes import auth_bp, event_bp, ticket_bp, upload_bp

        app.register_blueprint(auth_bp, url_prefix="/auth")
        app.register_blueprint(event_bp)  # Remove the url_prefix here
        app.register_blueprint(ticket_bp, url_prefix="/tickets")
        app.register_blueprint(upload_bp, url_prefix="/upload")

    return app

def page_not_found(e):
    return render_template('404.html'), 404

def server_error(e):
    return render_template('500.html'), 500
