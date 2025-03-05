/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    NEW EVENT DIALOG,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useEffect } from "react";
import "../styles/NewEvent.css";
import uploadIcon from '../assets/tiketi-tamasha-upload.svg';
import Button from './Button';
import { createEvent, updateEvent } from "../api/eventService";
import CONFIG from "../config"; // Import Cloudinary config
import Swal from 'sweetalert2';


export default function NewEvent({ onClose, event }) { // event prop!
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "",
        tags: "",
        start_date: "",
        end_date: "",
        image_url: "",  // This will store the Cloudinary URL
        earlyBirdPrice: "",
        vipPrice: "",
        regularPrice: "",
        total_tickets: "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // useEffect to Initialize Form State with Event Data (if editing)
    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || "",
                description: event.description || "",
                location: event.location || "",
                category: event.category || "",
                tags: event.tags || "",
                start_date: event.start_date || "",
                end_date: event.end_date || "",
                image_url: event.image_url || "",
                earlyBirdPrice: event.ticket_tiers?.["Early Bird"]?.price || "",
                vipPrice: event.ticket_tiers?.["VIP"]?.price || "",
                regularPrice: event.ticket_tiers?.["Regular"]?.price || "",
                total_tickets: event.total_tickets || "",
            });
            setSelectedImage(event.image_url || null); // Set the selected image if available
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setSelectedImage(reader.result);
                setLoading(true); // Start loading

                try {
                    const cloudinaryImageUrl = await uploadImageToCloudinary(file);
                    setFormData(prev => ({
                        ...prev,
                        image_url: cloudinaryImageUrl,
                    }));
                } catch (error) {
                    console.error("Cloudinary upload error:", error);
                    alert("Failed to upload image. Please try again.");
                } finally {
                    setLoading(false); // Stop loading
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Async function to upload the image to Cloudinary
    const uploadImageToCloudinary = async (imageFile) => {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY.CLOUD_NAME}/image/upload`;
        const formDataForCloudinary = new FormData();
        formDataForCloudinary.append('file', imageFile);
        formDataForCloudinary.append('upload_preset', CONFIG.CLOUDINARY.UPLOAD_PRESET);

        try {
            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formDataForCloudinary,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Cloudinary error response:", errorText);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error; // Re-throw to be caught by handleSubmit
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const ticketTiers = {
            "Early Bird": { price: formData.earlyBirdPrice },
            "VIP": { price: formData.vipPrice },
            "Regular": { price: formData.regularPrice },
        };
    
        try {
            setLoading(true);
            const finalFormData = { ...formData, ticket_tiers: ticketTiers };
    
            let response;
            if (event) {
                response = await updateEvent(event.id, finalFormData);
                Swal.fire({
                    title: "Success!",
                    text: "Event updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                response = await createEvent(finalFormData);
                Swal.fire({
                    title: "Success!",
                    text: "Event created successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
    
            console.log("Event created/updated successfully:", response);
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
            onClose();
        } catch (error) {
            console.error("Error creating/updating event:", error.message);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while creating/updating the event. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            {loading}
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
                                buttonText={event ? "Update Event" : "Create Event"} // Update button text
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
        </>
    );
};