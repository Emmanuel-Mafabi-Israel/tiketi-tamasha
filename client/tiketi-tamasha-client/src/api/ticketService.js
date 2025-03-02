const API_URL = "http://localhost:5000/tickets";

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

export default ticketService;