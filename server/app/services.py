# GLORY BE TO GOD,
# TIKETI TAMASHA - SERVICES,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS

# Here we'll be handling tasks such as:
#   - Payment processing (MPESA integration)
#   - Sending email notifications
#   - Image resizing and uploading to Cloudinary
#   - Data validation
#   - Any other business logic that doesn't belong in the routes.

# def process_mpesa_payment(ticket, amount, phone_number):
#     # Placeholder for MPESA integration logic
#     print(f"Processing MPESA payment for ticket {ticket.id}, amount {amount}, phone {phone_number}")
#     # Implement MPESA API calls here
#     # Update payment status in the database
#     return True  # Or False if payment fails

# def send_email_notification(email, subject, body):
#     # Placeholder for email sending logic
#     print(f"Sending email to {email} with subject '{subject}'")
#     # Implement SendGrid API calls here
#     return True

import os
from dotenv import load_dotenv
import base64  #For password encoding

load_dotenv() # Load environment variables from .env
import requests
import logging
from datetime import datetime
from .models import Payment

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def initiate_mpesa_stk_push(phone_number, amount, callback_url, account_reference, transaction_desc):
    """
    Initiates an MPESA STK Push request.
    Args:
        phone_number: The customer's phone number (e.g., "2547XXXXXXXX").
        amount: The amount to be paid.
        callback_url: The URL on your server that MPESA will call back to with the payment status.
        account_reference:  Your unique reference for the transaction (e.g., ticket ID).
        transaction_desc: A description of the transaction.

    Returns:
        A tuple: (success, message, checkout_request_id)
        success: True if the STK push was initiated successfully, False otherwise.
        message: A message indicating the status of the request.
        checkout_request_id: The MPESA CheckoutRequestID (used for querying the transaction status).
    """

    BUSINESS_SHORT_CODE = os.getenv("MPESA_BUSINESS_SHORT_CODE")
    PASSKEY             = os.getenv("MPESA_PASSKEY")
    TIMESTAMP           = datetime.now().strftime("%Y%m%d%H%M%S")
    PASSWORD            = encode_password(BUSINESS_SHORT_CODE, PASSKEY, TIMESTAMP)
    CALLBACK_URL        = callback_url
    ACCOUNT_REFERENCE   = account_reference
    TRANSACTION_DESC    = transaction_desc
    PARTY_A             = phone_number  # The Sender - customer
    PARTY_B             = BUSINESS_SHORT_CODE # The Recipient

    STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"  # we'll use production URL in production
    # Access Token URL
    ACCESS_TOKEN_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    # Consumer Key
    CONSUMER_KEY        = os.getenv("MPESA_CONSUMER_KEY")
    # Consumer Secret
    CONSUMER_SECRET     = os.getenv("MPESA_CONSUMER_SECRET")

    try:
        # Get the access token from the API
        access_token_response = requests.get(ACCESS_TOKEN_URL, auth=(CONSUMER_KEY, CONSUMER_SECRET))
        access_token_response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

        access_token_data = access_token_response.json()
        access_token = access_token_data.get("access_token")

        # STK Push Payload

        stk_push_payload = {
            "BusinessShortCode": BUSINESS_SHORT_CODE,
            "Password": PASSWORD,
            "Timestamp": TIMESTAMP,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": PARTY_A,
            "PartyB": PARTY_B,
            "PhoneNumber": PARTY_A,
            "CallBackURL": CALLBACK_URL,
            "AccountReference": ACCOUNT_REFERENCE,
            "TransactionDesc": TRANSACTION_DESC
        }

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        # Initiate STK Push
        response = requests.post(STK_PUSH_URL, json=stk_push_payload, headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

        response_json = response.json()

        checkout_request_id = response_json.get("CheckoutRequestID")
        if checkout_request_id:
            return True, "STK push initiated successfully", checkout_request_id
        else:
            error_message = response_json.get("errorMessage")
            return False, f"STK push failed: {error_message}", None

    except requests.exceptions.RequestException as e:
        logging.error(f"MPESA STK Push request failed: {e}")
        return False, f"MPESA STK Push request failed: {str(e)}", None
    except Exception as e:
        logging.error(f"Error initiating MPESA STK Push: {e}")
        return False, f"Error initiating MPESA STK Push: {str(e)}", None
    
def encode_password(shortcode, passkey, timestamp):
    """
    Encodes the password using the provided shortcode, passkey and timestamp.

    Returns:
         The encoded password string
    """
    password_string = shortcode + passkey + timestamp
    encoded_string = base64.b64encode(password_string.encode())
    return encoded_string.decode('utf-8')

def debug_access_token():
    # STK_PUSH_URL     = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    # Access Token URL
    ACCESS_TOKEN_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
    CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")

    access_token_response = (requests.get(ACCESS_TOKEN_URL, auth=(CONSUMER_KEY, CONSUMER_SECRET))).json()
    return access_token_response