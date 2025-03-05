// eventService.js
import axios from "axios";
import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}/events`;

export const fetchEvents = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		console.error("Error fetching events:", error.response?.data || error.message);
		throw error;
	}
};

export const getEventDetails = async (eventId) => {
	try {
		const response = await axios.get(`${API_URL}/${eventId}`);
		// console.log(response.data); -> debugging
		return response.data;
	} catch (error) {
		console.error("Error fetching event details:", error.response?.data || error.message);
		throw error;
	}
};

export const createEvent = async (eventData) => {
	try {
		const token = localStorage.getItem('access_token'); // Retrieve the token from local storage

		const response = await axios.post(API_URL, eventData, {
			headers: {
				Authorization: `Bearer ${token}` // Add the Authorization header
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error creating event:", error.response?.data || error.message);
		throw error;
	}
};

export const fetchOrganizerEvents = async () => {
	try {
		const token = localStorage.getItem('access_token'); // Retrieve the token from local storage
		const response = await axios.get(`${CONFIG.API_BASE_URL}/organizer/events`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching organizer events:", error.response?.data || error.message);
		throw error;
	}
};

export const deleteEvent = async (eventId) => {
	try {
        const token = localStorage.getItem('access_token');
		await axios.delete(`${API_URL}/${eventId}`, {
            headers: {
				Authorization: `Bearer ${token}` // Add the Authorization header
			}
        });
	} catch (error) {
		console.error("Error deleting event:", error.response?.data || error.message);
		throw error;
	}
};

// New service to get the event category count
export const getEventCategoryCount = async (categoryName) => {
	try {
		const response = await axios.get(`${API_URL}/category_count/${categoryName}`);
		return response.data.count;
	} catch (error) {
		console.error("Error fetching event category count:", error.response?.data || error.message);
		throw error;
	}
};

// New service to get popular events => but this time it's not popular events - since we have no metrics on the current events -> basically randomized.
export const getPopularEvents = async () => {
	try {
		const response = await axios.get(`${API_URL}/popular`);
		console.log(response.data.popular_events)
		return response.data.popular_events;
	} catch (error) {
		console.error("Error fetching popular events:", error.response?.data || error.message);
		throw error;
	}
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await axios.put(`${API_URL}/${eventId}`, eventData, {
            headers: {
                Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating event:", error.response?.data || error.message);
        throw error;
    }
};

// search function...
export const searchEvents = async (searchTerm, page = 1, perPage = 10) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: {
                q: searchTerm,
                page: page,
                per_page: perPage,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching events:", error.response?.data || error.message);
        throw error;
    }
};