import React from "react";
import "../styles/Register.css";


const Register = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Register</h2>
      <form>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
