import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Password Toggle Icons
import "../styles/Auth.css";

const Register = () => {
  const { register } = useContext(AuthContext);

  // Track account type
  const [accountType, setAccountType] = useState("personal");

  // Track password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",  // New field added
    businessName: "",
    businessRegistration: "",
  });

  // Error message for password mismatch
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "confirmPassword") {
      if (e.target.value !== formData.password) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    register(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        {/* 🔹 Account Type Tabs */}
        <div className="tab-container">
          <button
            className={`tab ${accountType === "personal" ? "selected" : ""}`}
            onClick={() => setAccountType("personal")}
          >
            Personal
          </button>
          <button
            className={`tab ${accountType === "business" ? "selected" : ""}`}
            onClick={() => setAccountType("business")}
          >
            Business
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 🔹 Common Fields */}
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          
          {/* Password Field with Toggle */}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field with Toggle */}
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* 🔴 Error Message (If passwords do not match) */}
          {error && <p className="error-message">{error}</p>}

          {/* 🔹 Business Fields (Only Show if Business Tab is Selected) */}
          {accountType === "business" && (
            <>
              <input type="text" name="businessName" placeholder="Business Name" onChange={handleChange} />
              <input type="text" name="businessRegistration" placeholder="Business Registration Number" onChange={handleChange} />
            </>
          )}

          {/* 🔹 Submit Button (Disabled if Passwords Don't Match) */}
          <button type="submit" className="auth-button" disabled={error !== ""}>Register</button>
        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
