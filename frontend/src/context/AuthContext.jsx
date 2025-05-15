import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const ServerUrl = import.meta.env.VITE_SERVER_URL;
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);

  // Function to login and store user session
  const login = async (username, password, navigate) => {
    try {
      const response = await axios.post(`${ServerUrl}/api/auth/login`, { username, password });
      console.log(response.data);
      const { idToken, accessToken, refreshToken, expiresIn } = response.data;
      
      // Store tokens in localStorage (or better: use HttpOnly cookies for security)
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("expiresAt", Date.now() + expiresIn * 1000); // Expiry time
      setAccessToken(accessToken);

      navigate("/");
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

    // Function to fetch user details using Access Token
    const getUserInfo = async (token) => {
      try {
        const response = await axios.get(`${ServerUrl}/api/auth/userinfo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        setUser(response.data); // Store user data in state
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser(null);
      }
    };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("idToken");
    const expiresAt = localStorage.getItem("expiresAt");
    return token && expiresAt && Date.now() < parseInt(expiresAt);
  };

  const getEmailFromUser = () => {
    const emailAttr = user?.UserAttributes?.find(attr => attr.Name === 'email');
    return emailAttr?.Value || '';
  };

  const getCategoriesFromUser = () => {
    const categoriesAttr = user?.UserAttributes?.find(attr => attr.Name === 'custom:categories');
    return categoriesAttr?.Value || '';
  }
  
  const getUserRole = () => {
    const roleAttr = user?.UserAttributes?.find(attr => attr.Name === 'custom:role');
    return roleAttr?.Value || '';
  };

  const checkAdmin = () => {
    const email = getEmailFromUser();
    return email === "hajrawajda52@gmail.com";
  }

  // Function to log out
  const logout = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    setUser(null);
    navigate("/auth");
  };

  // Auto-check if user is logged in on mount
  useEffect(() => {
    if (accessToken) {
      getUserInfo(accessToken);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, login, getEmailFromUser, checkAdmin, getCategoriesFromUser, getUserRole, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
