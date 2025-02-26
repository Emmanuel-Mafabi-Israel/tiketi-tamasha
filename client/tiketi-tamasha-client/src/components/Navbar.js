import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return ( 
    <nav className="navbar">
      {/*  Make "Tiketi Tamasha" Clickable */}
      <div className="logo" onClick={() => navigate("/")}>
        Tiketi Tamasha
      </div>

      <ul className="nav-links">
        <li><Link to="/events">Explore Events</Link></li>
        {user ? (
          <>
            <li>
              <Link to={user.role === "organizer" ? "/organizer-dashboard" : "/dashboard"}>
                Dashboard
              </Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            {/*  Updated Login button to match Register button styling */}
            <li>
              <Link to="/login" className="auth-btn">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
