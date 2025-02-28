import axios from "axios";
import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}`;

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, { 
      withCredentials: true 
    });

    console.log("🛠 Full Login API Response:", response);
    console.log("🔍 Login API Response Data:", response.data);
    console.log("🧩 Response Keys:", Object.keys(response.data));

    if (response.data && response.data.access_token) {
      console.log("🔑 Access Token:", response.data.access_token);
      console.log("👤 Role:", response.data.role);
      return response.data;  // ✅ FIX: Return response.data correctly
    } else {
      throw new Error("Invalid response format");  // ❌ Handle incorrect response format
    }
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
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
