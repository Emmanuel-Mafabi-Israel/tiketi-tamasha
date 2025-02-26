import axios from "axios";
import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}/users`;

export const getUserProfile = async (userId) => {
	try {
		const response = await axios.get(`${API_URL}/${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching user profile:", error.response?.data || error.message);
		throw error;
	}
};

export const updateUserProfile = async (userId, updatedData) => {
	try {
		const response = await axios.put(`${API_URL}/${userId}`, updatedData);
		return response.data;
	} catch (error) {
		console.error("Error updating profile:", error.response?.data || error.message);
		throw error;
	}
};

export const getUserTickets = async (userId) => {
	try {
		const response = await axios.get(`${API_URL}/${userId}/tickets`);
		return response.data;
	} catch (error) {
		console.error("Error fetching user tickets:", error.response?.data || error.message);
		throw error;
	}
};
