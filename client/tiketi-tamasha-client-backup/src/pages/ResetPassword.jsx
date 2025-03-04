// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../api/authService";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPassword(token, newPassword);
            setMessage(response.message);
        } catch (error) {
            setMessage("Error resetting password.");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="card">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="password" 
                        placeholder="Enter new password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
