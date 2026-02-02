import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [isAuthenticated]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>Zhaa Home Foods</div>
      <ul className="nav-links">
        <li onClick={() => scrollToSection('about')}>About</li>
        <li onClick={() => scrollToSection('menus')}>Menu</li>
        <li onClick={() => scrollToSection('visit')}>Visit Us</li>
        {isAuthenticated ? (
          <li className="user-menu">
            <span className="user-name">Hi, {user?.name || user?.email?.split('@')[0]}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        ) : (
          <>
            <li onClick={() => navigate("/login")} className="auth-link">Login</li>
            <li onClick={() => navigate("/signup")} className="signup-link">Sign Up</li>
          </>
        )}
      </ul>
    </nav>
  );
}
