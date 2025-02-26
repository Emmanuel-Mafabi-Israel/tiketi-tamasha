import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

// ✅ Import background icons & logo
import icon1 from "../assets/icon1.svg/tiketi-tamasha-doodle-calendar.svg";
import icon2 from "../assets/icon2.svg/tiketi-tamasha-doodle-microphone.svg";
import icon3 from "../assets/icon3.svg/tiketi-tamasha-doodle-note-double.svg";
import icon4 from "../assets/icon4.svg/tiketi-tamasha-doodle-note-single.svg";
import icon5 from "../assets/icon5.svg/tiketi-tamasha-doodle-speaker.svg";
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

const Register = () => {
  // ✅ Track selected account type
  const [accountType, setAccountType] = useState("personal");

  // ✅ Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessRegistration: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Replace with actual registration logic
  };

  return (
    <div className="auth-container">
      {/* Background icons */}
      <div className="auth-icons">
        <img src={icon1} alt="Calendar Icon" className="auth-icon icon-1" />
        <img src={icon2} alt="Microphone Icon" className="auth-icon icon-2" />
        <img src={icon3} alt="Double Note Icon" className="auth-icon icon-3" />
        <img src={icon4} alt="Single Note Icon" className="auth-icon icon-4" />
        <img src={icon5} alt="Speaker Icon" className="auth-icon icon-5" />
      </div>

      <div className="auth-card">
        {/* Logo + "Register" title */}
        <div className="auth-title">
          <img src={logo} alt="Tiketi Tamasha Logo" />
          <span>Register</span>
        </div>

        {/* ✅ Account Type Toggle (Personal / Business) */}
        <div className="tab-container">
          <button
            className={accountType === "personal" ? "tab active" : "tab"}
            onClick={() => setAccountType("personal")}
          >
            Personal
          </button>
          <button
            className={accountType === "business" ? "tab active" : "tab"}
            onClick={() => setAccountType("business")}
          >
            Business
          </button>
        </div>

        {/* Form Start */}
        <form onSubmit={handleSubmit}>
          {/* ✅ Full Name (Personal) */}
          {accountType === "personal" && (
            <input
              type="text"
              name="fullName"
              className="auth-input"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          )}

          {/* ✅ Email */}
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* ✅ Phone Number */}
          <input
            type="tel"
            name="phone"
            className="auth-input"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* ✅ Business Fields (Only show if Business account) */}
          {accountType === "business" && (
            <>
              <input
                type="text"
                name="businessName"
                className="auth-input"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contactName"
                className="auth-input"
                placeholder="Contact Person"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="contactPhone"
                className="auth-input"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="contactEmail"
                className="auth-input"
                placeholder="Contact Email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="businessRegistration"
                className="auth-input"
                placeholder="Business Registration Number"
                value={formData.businessRegistration}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* ✅ Password Field (Personal / Business) */}
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* ✅ Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            className="auth-input"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* ✅ Register Button */}
          <button type="submit" className="auth-button">Register</button>
        </form>

        {/* Footer link */}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Signin</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
