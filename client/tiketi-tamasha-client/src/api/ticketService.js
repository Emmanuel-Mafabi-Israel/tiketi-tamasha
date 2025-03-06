import axios from "axios"
import CONFIG from "../config";

const API_URL = "http://localhost:5000/tickets";
const API_USER_URL = `${CONFIG.API_BASE_URL}/user/tickets`;

const ticketService = {
    purchaseTicket: async (data) => {
        const token = localStorage.getItem('access_token');
        console.log(token);
        try {
            const response = await axios.post(`${API_URL}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data); // we'll need a fix...
            return response.data
        } catch(error) {
            console.error("Error purchasing ticket:", error.response?.data || error.message);
            throw error;
        }
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