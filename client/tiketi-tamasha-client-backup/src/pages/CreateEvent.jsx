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
			<h1>Create New Event</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" name="title" placeholder="Event Title" onChange={handleChange} required />
				<textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
				<input type="date" name="date" onChange={handleChange} required />
				<input type="text" name="location" placeholder="Location" onChange={handleChange} required />
				<input type="number" name="price" placeholder="Ticket Price" onChange={handleChange} required />
				<input type="file" onChange={handleImageUpload} />
				<button type="submit">Create Event</button>
			</form>
		</div>
	);
};

export default CreateEvent;
