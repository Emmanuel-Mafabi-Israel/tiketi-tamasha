// EventForm.js
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";

const EventForm = () => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    image_url: "",
    early_price: "",
    vip_price: "",
    regular_price: ""
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url) => {
    setEventData({ ...eventData, image_url: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:5000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    if (data.success) {
      alert("Event created!");
    } else {
      alert("Error creating event.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Event Name" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <input type="number" name="early_price" placeholder="Early Booking Price" onChange={handleChange} required />
      <input type="number" name="vip_price" placeholder="VIP Price" onChange={handleChange} required />
      <input type="number" name="regular_price" placeholder="Regular Price" onChange={handleChange} required />

      <ImageUpload onUpload={handleImageUpload} />

      {eventData.image_url && <img src={eventData.image_url} alt="Event" width="150" />}

      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm;
