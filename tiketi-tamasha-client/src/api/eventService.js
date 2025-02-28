import axios from "axios";
import CONFIG from "../config";

const API_URL = `${CONFIG.API_BASE_URL}/events`;

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found! User may not be logged in.");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

// Fetch all events
export const fetchEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);
    throw error;
  }
};

// Get details of a specific event
export const getEventDetails = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new event (Requires Organizer Role)
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch events created by a specific organizer
export const fetchOrganizerEvents = async (organizerId) => {
  try {
    const response = await axios.get(`${API_URL}/organizer/${organizerId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching organizer events:", error.response?.data || error.message);
    throw error;
  }
};

// Delete an event (Requires Organizer Role)
export const deleteEvent = async (eventId) => {
  try {
    await axios.delete(`${API_URL}/${eventId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting event:", error.response?.data || error.message);
    throw error;
  }
};
