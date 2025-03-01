import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserTickets, updateUserProfile } from "../api/userService";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("profile"); // Default section
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    fullName: user?.fullName,
    email: user?.email,
  });
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (user && user.id) {
      getUserTickets(user.id)
        .then(setTickets)
        .catch((error) => console.error("Error fetching tickets:", error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (activeSection === "analytics" && user?.role === "organizer") {
      fetchAnalytics();
    }
  }, [activeSection, user]);

  const fetchAnalytics = async () => {
    try {
      const data = {
        totalEvents: 12,
        totalTickets: 250,
        totalRevenue: 5000,
      };
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleUpdate = async () => {
    await updateUserProfile(user.id, updatedData);
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      {/* Sidebar Navigation */}
      <div className="profile-sidebar">
        <h1>{user?.fullName}</h1>
        <p>{user?.email}</p>

        {/* Sidebar Navigation Buttons */}
        <div className="nav-buttons">
          <button
            onClick={() => setActiveSection("profile")}
            className={activeSection === "profile" ? "active" : ""}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveSection("tickets")}
            className={activeSection === "tickets" ? "active" : ""}
          >
            {user.role === "organizer" ? "My Events" : "My Tickets"}
          </button>
          {user.role === "organizer" && (
            <button
              onClick={() => setActiveSection("analytics")}
              className={activeSection === "analytics" ? "active" : ""}
            >
              Analytics
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="profile-content">
        {/* Profile Info Section */}
        {activeSection === "profile" && (
          <div>
            <h2>Profile Information</h2>
            <label>Full Name:</label>
            {editMode ? (
              <input
                type="text"
                value={updatedData.fullName}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, fullName: e.target.value })
                }
              />
            ) : (
              <p>{user?.fullName}</p>
            )}

            <label>Email:</label>
            {editMode ? (
              <input
                type="email"
                value={updatedData.email}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, email: e.target.value })
                }
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
        )}

        {/* Tickets/Events Section */}
        {activeSection === "tickets" && (
          <div>
            <h2>{user.role === "organizer" ? "My Events" : "My Tickets"}</h2>
            {loading ? (
              <p>Loading {user.role === "organizer" ? "events" : "tickets"}...</p>
            ) : tickets.length === 0 ? (
              <p>No {user.role === "organizer" ? "events created" : "tickets purchased"} yet.</p>
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
        )}

        {/* Analytics Section (Only for Organizers) */}
        {activeSection === "analytics" && user.role === "organizer" && (
          <div>
            <h2>Event Analytics</h2>
            <p><strong>Total Events:</strong> {analytics.totalEvents}</p>
            <p><strong>Total Tickets Sold:</strong> {analytics.totalTickets}</p>
            <p><strong>Total Revenue:</strong> ${analytics.totalRevenue}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
