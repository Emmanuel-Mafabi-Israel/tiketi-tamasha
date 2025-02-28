import axios from "axios";
import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}`;

export const loginUser = async (credentials) => {
	try {
		const response = await axios.post(`${API_URL}/login`, credentials);
		return response.data;
	} catch (error) {
		console.error("Login failed:", error.response?.data || error.message);
		throw error;
	}
};

export const registerUser = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/register`, userData);
		return response.data;
	} catch (error) {
		console.error("Registration failed:", error.response?.data || error.message);
		throw error;
	}
};

export const logoutUser = () => {
	localStorage.removeItem("user");
};
