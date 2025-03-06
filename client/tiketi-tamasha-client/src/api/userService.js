// userService.js
import axios from "axios";
import CONFIG from "../config";

// const API_URL = `${CONFIG.API_BASE_URL}/users`; // Corrected API_URL

export const getUserProfile = async () => {
	try {
		const response = await axios.get(`${CONFIG.API_BASE_URL}/user`, {  // Corrected URL to /user
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Use the token
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching user profile:", error.response?.data || error.message);
		throw error;
	}
};

export const updateUserProfile = async (updatedData, token) => {
	try {
		const response = await axios.put(`${CONFIG.API_BASE_URL}/user`, updatedData, { // Updated URL
			headers: {
				Authorization: `Bearer ${token}`, // Include the token
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error updating profile:", error.response?.data || error.message);
		throw error;
	}
};

export const deleteUserAccount = async (token) => {  // Add this function
	try {
		const response = await axios.delete(`${CONFIG.API_BASE_URL}/user`, {  // DELETE request to /user
			headers: {
				Authorization: `Bearer ${token}`,  // Include the token
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error deleting account:", error.response?.data || error.message);
		throw error;
	}
};

// export const getUserTickets = async (userId) => {
// 	try {
// 		const response = await axios.get(`${API_URL}/${userId}/tickets`);
// 		console.log(`user tickets are: ${response.data}`)
// 		return response.data;
// 	} catch (error) {
// 		console.error("Error fetching user tickets:", error.response?.data || error.message);
// 		throw error;
// 	}
// };