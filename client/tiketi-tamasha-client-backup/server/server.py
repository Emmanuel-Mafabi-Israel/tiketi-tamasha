# GLORY BE TO GOD,
# TIKETI TAMASHA STARTING POINT,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Adjust the sys.path to include the server directory
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
# from seed import seed_data

app = create_app()

if __name__ == "__main__":
    # Seed the database (call the function)
    # with app.app_context():
    #     seed_data()
    app.run(debug=True)  # Consider debug=False in production!