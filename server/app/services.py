# GLORY BE TO GOD,
# TIKETI TAMASHA - SERVICES,
# BY ISRAEL MAFABI EMMANUEL
# TAMASHA DEVELOPERS


# services.py
import os
import base64
import requests
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

BUSINESS_SHORTCODE: str = os.getenv("MPESA_BUSINESS_SHORTCODE")
PASSKEY: str = os.getenv("MPESA_PASSKEY")
CONSUMER_KEY: str = os.getenv("MPESA_CONSUMER_KEY")
CONSUMER_SECRET_KEY: str = os.getenv("MPESA_CONSUMER_SECRET_KEY")

def url(environment: int = 0, request: int = 0, query: int = 0) -> str:
    """
        A function for selecting the required url
        based on environment selection.

        request type:
        0 -> generate URL
        1 -> process request URL
        2 -> query request URL

        environment type:
        0 -> local environment - development environment
        1 -> live/deployment

        :returns
        -> returns a string -> concerning the url (environment based...)
    """
    development_generate_url = os.getenv("DEVELOPMENT_GENERATE_URL")
    live_generate_url = os.getenv("LIVE_GENERATE_URL")
    development_process_request_url = os.getenv("DEVELOPMENT_PROCESS_REQUEST_URL")
    live_process_request_url = os.getenv("LIVE_PROCESS_REQUEST_URL")
    development_query_request_url = os.getenv("DEVELOPMENT_QUERY_REQUEST_URL")
    live_query_request_url = os.getenv("LIVE_QUERY_REQUEST_URL")

    if query != 0:
        # query session
        if environment != 0:
            return live_query_request_url
        return development_query_request_url
    elif request != 0:
        # request session
        if environment != 0:
            return live_process_request_url
        return development_process_request_url
    else:
        # default... generate access token
        if environment != 0:
            return live_generate_url
        return development_generate_url

def encode_password(shortcode: str, passkey: str, timestamp: str) -> str:
    password_string: str = shortcode + passkey + timestamp
    encoded_string: bytes = base64.b64encode(password_string.encode())
    return encoded_string.decode('utf-8')

def generate_access_token():
    try:
        # encoding the credentials
        # following the structure: [key:key]
        encoded_credentials: base64 = base64.b64encode(f"{CONSUMER_KEY}:{CONSUMER_SECRET_KEY}".encode()).decode()
        # setting up the header... ~ Authorization
        headers: dict = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json"
        }
        # send the request and parse the response...
        response = requests.get(url(environment=0, request=0), headers=headers).json()

        print(f"debug[auth key]: {encoded_credentials}")
        print(f"debug[response status]: {response}")

        # check for errors and afterwards return the access token...
        # since if positive a dict will be returned...
        if "access_token" in response:
            return response["access_token"]
        else:
            raise Exception(f"error: failed to get access token: {response['error_description']}")
    except Exception as e:
        raise Exception(f"error: failed to get access token: {e}")

def initiate_mpesa_stk_push(phone_number: str, amount: int, callback_url: str, account_reference: str,
                            transaction_description: str):
    access_token = generate_access_token()
    timestamp: str = datetime.now().strftime('%Y%m%d%H%M%S')

    headers: dict = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    print(f"debug[callback url]: {callback_url}") # for debugging purposes...
    # body, stk push payload...
    stk_push_payload: dict = {
        "BusinessShortCode": BUSINESS_SHORTCODE,
        "Password": encode_password(BUSINESS_SHORTCODE, PASSKEY, timestamp),
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,  # the sender
        "PartyB": BUSINESS_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": account_reference,  # Any value... -> MAFABI
        "TransactionDesc": transaction_description  # Any value... -> MAFABI
    }

    try:
        response = requests.post(url(environment=0, request=1), json=stk_push_payload, headers=headers)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        response_json: any = response.json()

        checkout_request_id: any = response_json.get('CheckoutRequestID')
        if checkout_request_id:
            return True, "STK push initiated successfully", checkout_request_id
        else:
            error_message: any = response_json.get('errorMesssage')
            return False, f"STK push failed: {str(error_message)}", None
        # return response_json
    except requests.exceptions.RequestException as error_message:
        return False, f"STK push failed: {error_message}", None
    except Exception as error_message:
        return False, f"Error initiating MPESA STK Push: {error_message}", None

def debug_access_token():
   # [Implementation remains unchanged]
    # STK_PUSH_URL     = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" -> request processing route...
    # Access Token URL
    print(f"debug[generate - url]: {url(environment=0, request=0)}")
    # access_token_response = generate_access_token()
    return generate_access_token()

def query_mpesa_transaction_status(checkout_request_id: str):
    """
    Queries the status of an MPESA transaction.

    Args:
        checkout_request_id: The CheckoutRequestID from the STK push request.

    Returns:
        A tuple: (success, message, transaction_status).  transaction_status will
        be None if the query fails.
    """
    access_token = generate_access_token()
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    query_payload = {
        "BusinessShortCode": BUSINESS_SHORTCODE,
        "Password": encode_password(BUSINESS_SHORTCODE, PASSKEY, timestamp),
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id
    }

    try:
        mpesa_environment: int = 0  # or 1 if you want to check the production environment
        response = requests.post(url(environment=mpesa_environment, request=0, query=2), json=query_payload, headers=headers) # type: ignore
        response.raise_for_status()
        response_json = response.json()

        # Successful query.  Parse the response.
        result_code = response_json.get("ResultCode")
        result_desc = response_json.get("ResultDesc")

        if result_code == "0":
            transaction_status = response_json.get("TransactionStatus")
            return True, f"Transaction status query successful: {result_desc}", transaction_status
        else:
            return False, f"Transaction status query failed: {result_desc}", None

    except requests.exceptions.RequestException as e:
        return False, f"Request error during status query: {e}", None
    except Exception as e:
        return False, f"Error during status query: {e}", None