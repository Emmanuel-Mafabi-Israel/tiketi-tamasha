/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    NEW EVENT DIALOG,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState } from "react";
import "../styles/NewEvent.css";
import uploadIcon from '../assets/tiketi-tamasha-upload.svg';
import Button from '../components/Button';
import { createEvent } from "../api/eventService";

export default function NewEvent({ onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "",
        tags: "",
        start_date: "",
        end_date: "",
        image_url: "",
        earlyBirdPrice: "",
        vipPrice: "",
        regularPrice: "",
        total_tickets: "",
    });
    
    const [selectedImage, setSelectedImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image_url: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct the ticket_tiers object from the individual price fields
        const ticketTiers = {
            "Early Bird": { price: formData.earlyBirdPrice },
            "VIP": { price: formData.vipPrice },
            "Regular": { price: formData.regularPrice },
        };
        // Send the image to cloudinary...
        // receive cloudinary image url...
        const finalFormData = { ...formData, ticket_tiers: ticketTiers };
        try {
            // Send the finalFormData to the API
            const response = await createEvent(finalFormData);
            console.log('Event created successfully:', response);
            // confirmation dialog...
            // Reset form
            setFormData({
                title: "",
                description: "",
                location: "",
                category: "",
                tags: "",
                start_date: "",
                end_date: "",
                image_url: "",
                earlyBirdPrice: "",
                vipPrice: "",
                regularPrice: "",
                total_tickets: "",
            });
            setSelectedImage(null);
            onClose(); // Close the dialog after successful creation
        } catch (error) {
            console.error("Error creating event:", error.message);
            alert("An error occurred while creating the event. Please try again.");
        }
    };

    return (
        <div className="tiketi-tamasha-dialog-container">
            <form className="tiketi-tamasha-dialog new-event" onSubmit={handleSubmit}>
                <div className="image-section">
                    <label htmlFor="image-upload" className={selectedImage ? 'custom-uploaded' : 'custom-upload'}>
                        <img src={uploadIcon} alt="" />
                        <div className="text">
                            {selectedImage ? 'Change Event Image' : 'Upload Event Image'}
                        </div>
                    </label>
                    <input
                        className="image-input"
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    {selectedImage && <img src={selectedImage} alt="Uploaded Event" className="uploaded" />}
                </div>
                <div className="dialog-body">
                    <div className="linked-data event-title-details">
                        <div className="title">Event title, description and location</div>
                        <div className="inputs">
                            <input
                                type="text"
                                name="title"
                                className="tiketi-tamasha-input"
                                placeholder="Event Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                className="tiketi-tamasha-input"
                                placeholder="Event Description, what's your event all about?"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="location"
                                className="tiketi-tamasha-input"
                                placeholder="Event Location; KICC, Nairobi"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="linked-data event-short-details">
                        <div className="title">Event Category and Tags</div>
                        <div className="inputs">
                            <input
                                type="text"
                                name="category"
                                className="tiketi-tamasha-input"
                                placeholder="Event Category; Music, Research, Fitness..."
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="tags"
                                className="tiketi-tamasha-input"
                                placeholder="Event associated tags; music, festival, live"
                                value={formData.tags}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="linked-data event-short-details">
                        <div className="title">Time and Planning</div>
                        <div className="inputs">
                            <input
                                type="datetime-local"
                                name="start_date"
                                className="tiketi-tamasha-input"
                                placeholder="Start date and time..."
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="datetime-local"
                                name="end_date"
                                className="tiketi-tamasha-input"
                                placeholder="End date and time..."
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="linked-data">
                        <div className="title">Tickets available, Ticket Tiers and pricing</div>
                        <div className="inputs">
                            <input
                                type="number"
                                name="total_tickets"
                                className="tiketi-tamasha-input"
                                placeholder="Available Tickets for sale"
                                value={formData.total_tickets}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="earlyBirdPrice"
                                className="tiketi-tamasha-input"
                                placeholder="Early Bird Price"
                                value={formData.earlyBirdPrice}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="vipPrice"
                                className="tiketi-tamasha-input"
                                placeholder="VIP Price"
                                value={formData.vipPrice}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="regularPrice"
                                className="tiketi-tamasha-input"
                                placeholder="Regular Price"
                                value={formData.regularPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="buttons">
                        <Button
                            className="tiketi-tamasha-btn auth"
                            buttonText="Create Event"
                            type="submit"
                        />
                        <Button
                            className="tiketi-tamasha-btn auth"
                            buttonText="Close"
                            onClick={onClose}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
