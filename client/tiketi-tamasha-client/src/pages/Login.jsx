import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Auth.css";

// ✅ Import background icons & logo
import icon1 from "../assets/icon1.svg/tiketi-tamasha-doodle-calendar.svg";
import icon2 from "../assets/icon2.svg/tiketi-tamasha-doodle-microphone.svg";
import icon3 from "../assets/icon3.svg/tiketi-tamasha-doodle-note-double.svg";
import icon4 from "../assets/icon4.svg/tiketi-tamasha-doodle-note-single.svg";
import icon5 from "../assets/icon5.svg/tiketi-tamasha-doodle-speaker.svg";
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

const Login = () => {
	const { login } = useContext(AuthContext);
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			setError("All fields are required!");
			return;
		}

		try {
			await login(formData);
		} catch (err) {
			setError("Invalid email or password. Please try again.");
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
				{/* Logo + "Login" title */}
				<div className="auth-title">
					<img src={logo} alt="Tiketi Tamasha Logo" />
					<span>Login</span>
				</div>

				{/* Show error message if exists */}
				{error && <p className="error-message">{error}</p>}

				<form onSubmit={handleSubmit}>
					{/* Email Input */}
					<input
						type="email"
						name="email"
						className="auth-input"
						placeholder="Registered Email"
						onChange={handleChange}
						required
					/>

					{/* Password Input with Toggle */}
					<div className="password-container">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							className="auth-input"
							placeholder="Account Password"
							onChange={handleChange}
							required
						/>
						<span
							onClick={() => setShowPassword(!showPassword)}
							className="password-toggle"
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>

					{/* Login Button */}
					<button type="submit" className="auth-button">
						Login
					</button>
				</form>

				{/* Footer links */}
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
