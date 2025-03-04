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

export const fetchUserDetails = async (token) => {
	try {
		const response = await axios.get(`${API_URL}/user`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(response.data)
		return response.data;
	} catch (error) {
		console.error("Fetching user details failed:", error.response?.data || error.message);
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

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Forgot password request failed:", error.response?.data || error.message);
        throw error;
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
        return response.data;
    } catch (error) {
        console.error("Reset password failed:", error.response?.data || error.message);
        throw error;
    }
};

