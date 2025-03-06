// paymentService.js
import axios from "axios";
import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}/user/payments`;

export const fetchPayments = async (token) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.payments;
    } catch (error) {
        console.error("Error fetching payments:", error.response?.data || error.message);
        throw error;
    }
};

export const queryPaymentStatus = async (checkoutRequestId, token) => {
    console.log(checkoutRequestId);
    try {
        const response = await axios.post(
            `${CONFIG.API_BASE_URL}/mpesa_transaction_status`,
            { checkout_request_id: checkoutRequestId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Return the entire response data
    } catch (error) {
        console.error("Error querying payment status:", error.response?.data || error.message);
        throw error;
    }
};