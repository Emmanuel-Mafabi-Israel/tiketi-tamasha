import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/eventService";
import { uploadImage } from "../api/cloudinaryService";
import { AuthContext } from "../context/AuthContext"; // Import Auth Context
import "../styles/CreateEvent.css";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get logged-in user

  // Redirect if user is not an organizer
  useEffect(() => {
    if (!user || user.role !== "organizer") {
      alert("Access Denied! Only organizers can create events.");
      navigate("/"); // Redirect to home or another page
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    start_date: "",
    end_date: "",
    location: "",
    ticket_tiers: [{ type: "General", price: 0 }],
    total_tickets: 100,
  });
  const [image, setImage] = useState(null);
  const [time, setTime] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const uploadedImage = await uploadImage(file);
    setImage(uploadedImage.url);
  };

  const handleTicketChange = (index, e) => {
    const updatedTiers = [...formData.ticket_tiers];
    updatedTiers[index][e.target.name] = e.target.value;
    setFormData({ ...formData, ticket_tiers: updatedTiers });
  };

  const addTicketTier = () => {
    setFormData({ ...formData, ticket_tiers: [...formData.ticket_tiers, { type: "", price: 0 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.start_date || !time) {
      alert("Start date and time are required");
      return;
    }
  
    const startDateTime = `${formData.start_date}T${time}:00Z`; // ISO format
    const endDateTime = `${formData.end_date}T23:59:59Z`; // Ensure full-day event
  
    try {
      await createEvent({
        organizer_id: user.id, // Include organizer ID
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        tags: JSON.stringify(formData.tags.split(",").map(tag => tag.trim())), // Convert to JSON array
        start_date: startDateTime,
        end_date: endDateTime,
        image_url: image,
        ticket_tiers: JSON.stringify(formData.ticket_tiers), // Convert to JSON string
        total_tickets: formData.total_tickets,
        tickets_sold: 0, // Initialize tickets sold
      });
  
      alert("Event created successfully!");
      navigate("/manage-events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert(`Failed to create event: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="create-event-container">
      <div className="event-card">
        {/* Left Section - Image Upload */}
        <div className="event-image-section">
          {image ? <img src={image} alt="Event" className="event-image" /> : <div className="image-placeholder">Upload Image</div>}
          <input type="file" onChange={handleImageUpload} className="file-input" />
        </div>

        {/* Right Section - Form Inputs */}
        <div className="event-form-section">
          <h2>Create Event</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Event Name" onChange={handleChange} required />
            
            <div className="date-time-section">
              <input type="date" name="start_date" onChange={handleChange} required />
              <input type="time" onChange={(e) => setTime(e.target.value)} required />
            </div>

            <input type="date" name="end_date" onChange={handleChange} required />
            <input type="text" name="location" placeholder="Event Location" onChange={handleChange} required />
            <input type="text" name="category" placeholder="Event Category" onChange={handleChange} required />
            <input type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} required />
            <textarea name="description" placeholder="Add Description" onChange={handleChange} required></textarea>

            {/* Ticket Pricing Section */}
            <div className="ticket-tier-section">
              <h3>Ticket Tiers</h3>
              {formData.ticket_tiers.map((tier, index) => (
                <div key={index} className="ticket-tier">
                  <input type="text" name="type" placeholder="Ticket Type" value={tier.type} onChange={(e) => handleTicketChange(index, e)} required />
                  <input type="number" name="price" placeholder="Price" value={tier.price} onChange={(e) => handleTicketChange(index, e)} required />
                </div>
              ))}
              <button type="button" onClick={addTicketTier}>Add Ticket Tier</button>
            </div>

            <input type="number" name="total_tickets" placeholder="Total Tickets Available" value={formData.total_tickets} onChange={handleChange} required />

            <button type="submit">Create Event</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
