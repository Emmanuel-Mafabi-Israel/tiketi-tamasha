const API_URL = "https://your-backend-url.com/api/bookings";

export const fetchBookings = async (userId, token) => {
  const response = await fetch(`${API_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const createBooking = async (bookingData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  return response.json();
};

export const cancelBooking = async (bookingId, token) => {
  const response = await fetch(`${API_URL}/${bookingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
