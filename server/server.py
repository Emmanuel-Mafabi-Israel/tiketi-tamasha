# GLORY BE TO GOD,
# TIKETI TAMASHA STARTING POINT,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os
import sys
from dotenv import load_dotenv
from flask import Flask
from app import create_app
from .config import init_app
from .extensions import db
from .routes.auth_routes import auth_bp

# Load environment variables
load_dotenv()

# Adjust the sys.path to include the server directory
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

app = create_app()

# Initialize app with configuration
init_app(app)

# Initialize database
db.init_app(app)

# Import authentication routes (for Forgot Password)
from app.routes.auth_routes import auth_bp
app.register_blueprint(auth_bp, url_prefix="/api/auth")

if __name__ == "__main__":
    app.run(debug=True)  # Change to debug=False in production
