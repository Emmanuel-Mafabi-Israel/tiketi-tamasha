// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { forgotPassword } from "../api/authService";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await forgotPassword(email);
            setMessage(response.message);
        } catch (error) {
            setMessage("Error sending reset email.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="card">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;