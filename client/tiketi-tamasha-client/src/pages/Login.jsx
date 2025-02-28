import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";


import Button from "../components/Button";
import "../styles/Auth.css";

import doodle_background from '../assets/tamasha_doodle_background.svg';
import logo from "../assets/logo.svg/tiketi-tamasha-icon-high-res-white.svg";

export default function Login() {
	const { login } = useContext(AuthContext);
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

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
		<div className="tiketi-tamasha-auth-page">
			<img className='tiketi-tamasha-doodle-background' src={doodle_background} alt="tamasha-doodle" />

			<div className="tiketi-tamasha-auth-page-center">
				<div className="tiketi-tamasha-auth-heading">
					<img className="image" src={logo} alt="Tiketi Tamasha Logo" />
					<span className="text">Login</span>
				</div>
				{error && <p className="error-message">{error}</p>}
				<form className="tiketi-tamasha-form" onSubmit={handleSubmit}>
					<input
						type="email"
						name="email"
						className="tiketi-tamasha-input"
						placeholder="Registered Email"
						onChange={handleChange}
						required
					/>
					<div className="password-container">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							className="tiketi-tamasha-input"
							placeholder="Account Password"
							onChange={handleChange}
							required
						/>
						<div className="tools">
							<span
								onClick={() => setShowPassword(!showPassword)}
								className="password-toggle"
							>
								{showPassword ? "Hide Password" : "Show Password"}
							</span>
							<Link to="/forgot-password">Forgot Password?</Link>
						</div>
					</div>
					<div className="auth-footer">
						<Button
							className="tiketi-tamasha-btn auth"
							buttonText="Login"
							type="submit"
						/>
						<div className="link-text" onClick={() => navigate("/register")}>
							Don’t have an account? Signup
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};