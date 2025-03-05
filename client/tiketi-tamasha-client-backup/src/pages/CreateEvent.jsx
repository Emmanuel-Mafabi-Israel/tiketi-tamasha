import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/eventService";
import { uploadImage } from "../api/cloudinaryService";
import Swal from "sweetalert2";  // Import SweetAlert2
import "../styles/CreateEvent.css";

const CreateEvent = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ title: "", description: "", date: "", location: "", price: "" });
	const [image, setImage] = useState(null);

	const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];

		if (!file) {
			Swal.fire({
				icon: "error",
				title: "Image Upload Failed",
				text: "Please select an image to upload!",
			});
			return;
		}

		try {
			const uploadedImage = await uploadImage(file);
			setImage(uploadedImage.url);
			Swal.fire({
				icon: "success",
				title: "Image Uploaded!",
				text: "Your event image has been successfully uploaded.",
				timer: 2000,
				showConfirmButton: false,
			});
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Upload Error",
				text: "There was a problem uploading your image. Please try again.",
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.title || !formData.description || !formData.date || !formData.location || !formData.price) {
			Swal.fire({
				icon: "error",
				title: "Missing Fields",
				text: "All fields are required!",
			});
			return;
		}

		try {
			await createEvent({ ...formData, image });
			Swal.fire({
				icon: "success",
				title: "Event Created!",
				text: "Your event has been successfully created.",
				timer: 2000,
				showConfirmButton: false,
			});
			navigate("/organizer-dashboard");
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Event Creation Failed",
				text: "There was an issue creating your event. Please try again.",
			});
		}
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
