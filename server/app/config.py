# GLORY BE TO GOD,
# TIKETI TAMASHA CONFIGURATION FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os
from dotenv import load_dotenv
from flask_mail import Mail

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY                     = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI        = os.getenv('SQLALCHEMY_DATABASE_URI')  # For SQLite: 'sqlite:///tiketi_tamasha.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress warnings
    JWT_SECRET_KEY                 = os.getenv('JWT_SECRET_KEY')

    # Email Configuration
    MAIL_SERVER                     = "smtp.gmail.com"
    MAIL_PORT                        = 587
    MAIL_USE_TLS                     = True
    MAIL_USERNAME                    = os.getenv("MAIL_USERNAME")  # Your email
    MAIL_PASSWORD                    = os.getenv("MAIL_PASSWORD")  # Your email password
    MAIL_DEFAULT_SENDER              = os.getenv("MAIL_USERNAME")  # Default sender email

# Initialize mail extension
mail = Mail()

def init_app(app):
    app.config.from_object(Config)
    mail.init_app(app)
