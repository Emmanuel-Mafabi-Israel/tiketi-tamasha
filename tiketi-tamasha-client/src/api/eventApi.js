const API_URL = "https://your-backend-url.com/api/events";

export const fetchEvents = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const getEventDetails = async (eventId) => {
  const response = await fetch(`${API_URL}/${eventId}`);
  return response.json();
};

export const createEvent = async (eventData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  return response.json();
};
