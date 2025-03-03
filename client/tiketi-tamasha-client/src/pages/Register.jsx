/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    REGISTRATION PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

import Button from "../components/Button";
import LoadingPage from "../components/LoadingPage";
import "../styles/Auth.css";

import doodle_background from '../assets/tamasha_doodle_background.svg';
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

export default function Register() {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false); // New state for the alert
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextPage = (e) => {
        e.preventDefault();
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = (e) => {
        e.preventDefault();
        setCurrentPage(currentPage - 1);
    };

    const handleSubmit = async (e, role) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const data = {
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone,
            role: role,
            name: formData.fullName
        };

        try {
            setLoading(true);
            await register(data, navigate);
            setShowAlert(true); // Show the alert on successful registration
        } catch (err) {
            setError("Registration failed. Please try again.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <LoadingPage />
                <div className="tiketi-tamasha-auth-page">
                    <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
                </div>
            </>
        );
    }

    return (
        <div className="tiketi-tamasha-auth-page">
            <img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />
            <div className="tiketi-tamasha-auth-page-center">
                <div className="tiketi-tamasha-auth-heading">
                    <img className="image" src={logo} alt="Tiketi Tamasha Logo" />
                    <span className="text">Register</span>
                </div>
                {error && <p className="error-message">{error}</p>}
                  {showAlert && (
                    <div className="success-message">
                        Registration successful! You are being redirected...
                    </div>
                )}
                <form className="tiketi-tamasha-form">
                    {currentPage === 1 && (
                        <>
                            <input
                                type="text"
                                name="fullName"
                                className="tiketi-tamasha-input"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                className="tiketi-tamasha-input"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                className="tiketi-tamasha-input"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <div className="auth-footer register">
                                <Button
                                    className="tiketi-tamasha-btn auth"
                                    buttonText="Continue"
                                    onClick={handleNextPage}
                                />
                            </div>
                        </>
                    )}

                    {currentPage === 2 && (
                        <>
                            <input
                                type="password"
                                name="password"
                                className="tiketi-tamasha-input"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                className="tiketi-tamasha-input"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <div className="auth-footer register extra">
                                <Button
                                    className="tiketi-tamasha-btn auth"
                                    buttonText="Register as Customer"
                                    onClick={(e) => handleSubmit(e, "customer")}
                                />
                                <Button
                                    className="tiketi-tamasha-btn auth"
                                    buttonText="Register as Organizer"
                                    onClick={(e) => handleSubmit(e, "organizer")}
                                />
                                <Button
                                    className="tiketi-tamasha-btn auth"
                                    buttonText="Previous"
                                    onClick={handlePreviousPage}
                                />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};