# GLORY BE TO GOD,
# TIKETI TAMASHA CONFIGURATION FILE,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

cloudinary.config(
    cloud_name="dtjg7iymg",
    api_key="745126562613492",
    api_secret="kP55ZlQgWa9wGVT5pR3mr5Pm_rU"
)


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
