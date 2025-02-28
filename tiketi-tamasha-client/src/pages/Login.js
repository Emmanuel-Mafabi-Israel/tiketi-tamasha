import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

import icon1 from "../assets/icon1.svg/tiketi-tamasha-doodle-calendar.svg";
import icon2 from "../assets/icon2.svg/tiketi-tamasha-doodle-microphone.svg";
import icon3 from "../assets/icon3.svg/tiketi-tamasha-doodle-note-double.svg";
import icon4 from "../assets/icon4.svg/tiketi-tamasha-doodle-note-single.svg";
import icon5 from "../assets/icon5.svg/tiketi-tamasha-doodle-speaker.svg";
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Success message state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
    setSuccess(""); // Clear success message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("❌ All fields are required!");
      return;
    }

    try {
      const role = await login(formData); // ✅ login() returns user role

      setSuccess("✅ Login Successful! Redirecting...");
      setError(""); // Clear error on success
      console.log("✅ Login Successful. User Role:", role);

      setTimeout(() => {
        if (role === "organizer") {
          navigate("/organizer-dashboard");
        } else if (role === "customer") {
          navigate("/dashboard");
        } else {
          throw new Error("Invalid user role");
        }
      }, 1500); // Small delay for message visibility
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("❌ Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-icons">
        <img src={icon1} alt="Calendar Icon" className="auth-icon icon-1" />
        <img src={icon2} alt="Microphone Icon" className="auth-icon icon-2" />
        <img src={icon3} alt="Double Note Icon" className="auth-icon icon-3" />
        <img src={icon4} alt="Single Note Icon" className="auth-icon icon-4" />
        <img src={icon5} alt="Speaker Icon" className="auth-icon icon-5" />
      </div>

      <div className="auth-card">
        <div className="auth-title">
          <img src={logo} alt="Tiketi Tamasha Logo" />
          <span>Login</span>
        </div>

        {/* ✅ Success Message */}
        {success && <p className="success-message">{success}</p>}

        {/* ❌ Error Message */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Registered Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="auth-input"
              placeholder="Account Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
          <br />
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
