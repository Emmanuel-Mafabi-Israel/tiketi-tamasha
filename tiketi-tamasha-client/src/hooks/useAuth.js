import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { login, logout } from "../api/authApi";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    const response = await login(credentials);
    if (response.token) {
      setUser(response.user);
      localStorage.setItem("token", response.token);
    } else {
      setError(response.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem("token");
  };

  return { user, handleLogin, handleLogout, error };
};

export default useAuth;
