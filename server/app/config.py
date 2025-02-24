# GLORY BE TO GOD,
# TIKETI TAMASHA CONFIGURATION FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY                     = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI        = os.getenv('SQLALCHEMY_DATABASE_URI')  # for us it will be 'sqlite:///tiketi_tamasha.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress warnings
    JWT_SECRET_KEY                 = os.getenv('JWT_SECRET_KEY')
    


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"  # Use an in-memory SQLite DB for testing
    WTF_CSRF_ENABLED = False  # Disable CSRF for testing forms

config = {
    "default": Config,
    "testing": TestingConfig
}    
