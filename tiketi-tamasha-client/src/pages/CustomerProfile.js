import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserTickets, updateUserProfile } from "../api/userService";
import "../styles/CustomerProfile.css";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    fullName: user?.fullName,
    email: user?.email,
  });

  // Fetch user tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (user && user.id) {
        try {
          const userTickets = await getUserTickets(user.id);
          setTickets(userTickets);
        } catch (error) {
          console.error("Error fetching user tickets:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTickets();
  }, [user]);

  const handleUpdate = async () => {
    await updateUserProfile(user.id, updatedData);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <h1>{user?.fullName}</h1>
        <p>{user?.email}</p>

        <button onClick={logout} className="logout-btn">Logout</button>

        <div className="profile-info">
          <label>Full Name:</label>
          {editMode ? (
            <input
              type="text"
              value={updatedData.fullName}
              onChange={(e) => setUpdatedData({ ...updatedData, fullName: e.target.value })}
            />
          ) : (
            <p>{user?.fullName}</p>
          )}

          <label>Email:</label>
          {editMode ? (
            <input
              type="email"
              value={updatedData.email}
              onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
            />
          ) : (
            <p>{user?.email}</p>
          )}

          {editMode ? (
            <button onClick={handleUpdate}>Save Changes</button>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      {/* Tickets Section */}
      <div className="profile-content">
        <h2>My Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets purchased yet.</p>
        ) : (
          <div className="ticket-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <p><strong>Event:</strong> {ticket.eventTitle}</p>
                <p><strong>Quantity:</strong> {ticket.quantity}</p>
                <p><strong>Date:</strong> {ticket.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
