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
		return response.data;
	} catch (error) {
		console.error("Error fetching event details:", error.response?.data || error.message);
		throw error;
	}
};

export const createEvent = async (eventData) => {
	try {
		const response = await axios.post(API_URL, eventData);
		return response.data;
	} catch (error) {
		console.error("Error creating event:", error.response?.data || error.message);
		throw error;
	}
};

export const fetchOrganizerEvents = async (organizerId) => {
	try {
		const response = await axios.get(`${API_URL}/organizer/${organizerId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching organizer events:", error.response?.data || error.message);
		throw error;
	}
};

export const deleteEvent = async (eventId) => {
	try {
		await axios.delete(`${API_URL}/${eventId}`);
	} catch (error) {
		console.error("Error deleting event:", error.response?.data || error.message);
		throw error;
	}
};
