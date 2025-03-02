import axios from "axios"
import CONFIG from "../config";

const API_URL = "http://localhost:5000/tickets";
const API_USER_URL = `${CONFIG.API_BASE_URL}/user/tickets`;

const ticketService = {
	purchaseTicket: async (eventId, quantity, userId) => {
		const response = await fetch(`${API_URL}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ eventId, quantity, userId }),
		});

		return response.json();
	},
};

export const fetchTickets = async (token) => {
    try {
        const response = await axios.get(API_USER_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.tickets;
    } catch (error) {
        console.error("Error fetching tickets:", error.response?.data || error.message);
        throw error;
    }
};

export default ticketService;