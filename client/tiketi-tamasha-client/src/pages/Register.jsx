/*
    GLORY BE TO GOD,
    TIKETI TAMASHA,
    REGISTRATION PAGE,

    BY ISRAEL MAFABI EMMANUEL
*/

import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

import Button from "../components/Button";
import LoadingPage from "../components/LoadingPage";
import "../styles/Auth.css";

import doodle_background from '../assets/tamasha_doodle_background.svg';
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

import Swal from 'sweetalert2';

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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (validationError) {
            Swal.fire({
                title: validationError.type === 'error' ? 'Error' : 'Warning',
                text: validationError.message,
            });
            setValidationError(null); // Clear the error after displaying the message
        }
    }, [validationError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextPage = (e) => {
        e.preventDefault();
        if (!validatePageOne()) {
            return;
        }
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = (e) => {
        e.preventDefault();
        setCurrentPage(currentPage - 1);
    };

    const handleSubmit = async (e, role) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: "Passwords do not match!",
            });
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
            Swal.fire({
                title: 'Registration Success',
                text: "Registration successful! Welcome to TiketiTamasha!",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: "Error: " + err,
            });
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex1 = /^2547\d{8}$/; // 2547... format
        const phoneRegex2 = /^07\d{8}$/; // 07... format
        return phoneRegex1.test(phone) || phoneRegex2.test(phone);
    };

    const validatePageOne = () => {
        if (!formData.fullName) {
            setValidationError({ type: 'warning', message: 'Full Name is required!' });
            return false;
        }
        if (!formData.email) {
            setValidationError({ type: 'warning', message: 'Email is required!' });
            return false;
        }
        if (!validateEmail(formData.email)) {
            setValidationError({ type: 'error', message: 'Invalid email format!' });
            return false;
        }
        if (!formData.phone) {
            setValidationError({ type: 'warning', message: 'Phone number is required!' });
            return false;
        }
        if (!validatePhoneNumber(formData.phone)) {
            setValidationError({ type: 'warning', message: 'Invalid phone number format. Must be 2547... or 07...!' });
            return false;
        }
        return true;
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