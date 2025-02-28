import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/eventService";
import { uploadImage } from "../api/cloudinaryService";
import "../styles/CreateEvent.css";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", date: "", location: "", price: "" });
  const [image, setImage] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const uploadedImage = await uploadImage(file);
    setImage(uploadedImage.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent({ ...formData, image });
    navigate("/organizer-dashboard");
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
              <input type="date" name="date" onChange={handleChange} required />
              <input type="time" name="time" onChange={handleChange} required />
            </div>

            <input type="text" name="location" placeholder="Event Location" onChange={handleChange} required />
            <textarea name="description" placeholder="Add Description" onChange={handleChange} required></textarea>

            {/* Event Options */}
            <div className="event-options">
              <label>Tickets: <input type="number" name="price" placeholder="Free or Price" onChange={handleChange} required /></label>
              <label>Require Approval: <input type="checkbox" /></label>
              <label>Capacity: <input type="number" placeholder="Unlimited" /></label>
            </div>

            <button type="submit">Create Event</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
