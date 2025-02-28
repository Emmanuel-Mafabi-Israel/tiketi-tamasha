import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// ✅ Import background icons & logo
import icon1 from "../assets/icon1.svg/tiketi-tamasha-doodle-calendar.svg";
import icon2 from "../assets/icon2.svg/tiketi-tamasha-doodle-microphone.svg";
import icon3 from "../assets/icon3.svg/tiketi-tamasha-doodle-note-double.svg";
import icon4 from "../assets/icon4.svg/tiketi-tamasha-doodle-note-single.svg";
import icon5 from "../assets/icon5.svg/tiketi-tamasha-doodle-speaker.svg";
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

// ✅ Register Component
const Register = () => {
  const navigate = useNavigate();

  // ✅ Track selected account type
  const [accountType, setAccountType] = useState("personal");

  // ✅ Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Message states
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Toggle Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(""); // Clear error when typing
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("❌ Passwords do not match!");
      return;
    }

    setErrorMessage(""); // Clear errors before request

    // Prepare correct request payload
    const requestBody = {
      name: formData.fullName, // Rename fullName -> name
      email: formData.email,
      phone_number: formData.phone, // Rename phone -> phone_number
      password: formData.password,
      role: accountType === "personal" ? "customer" : "organizer", // Add role
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody), // Send the updated object
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Registered successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 sec
      } else {
        setErrorMessage(data.message || "Registration failed. Try again."); // Fix error message retrieval
      }
    } catch (err) {
      setErrorMessage("Server error. Please try again later.");
    }
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

        {/* ✅ Show Error Message (If any) */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* ✅ Show Success Message (If any) */}
        {successMessage && <p className="success-message">{successMessage}</p>}

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
            <input
              type="text"
              name="businessName"
              className="auth-input"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          )}

          {/* ✅ Password Field */}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="auth-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🔒"}
            </span>
          </div>

          {/* ✅ Confirm Password */}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className="auth-input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🔒"}
            </span>
          </div>

          {/* ✅ Register Button */}
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>

        {/* Footer link */}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
