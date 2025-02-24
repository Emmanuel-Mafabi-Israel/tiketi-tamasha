import React from "react";
import "../styles/Login.css";


const Login = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
