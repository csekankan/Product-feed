// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import '../css/nav.css'; // Import the CSS file

export const NavBar: React.FC = () => {
  const { isLoggedIn, logout ,isTokenExpired} = useAuth();
  
  return (
    <nav className="nav-container">
      <div className="logo-container">
        <h1 className="logo">Product Management</h1>
      </div>
      <div className="link-container">
        <div className="center-links">
        {isLoggedIn &&(
          <><Link className="link" to="/upload">UPLOAD</Link>
          <Link className="link" to="/edit">EDIT </Link>
          <Link className="link" to="/view"> VIEW</Link></>
        )}
        </div>
        <div className="logout-links">
          {!isTokenExpired() ? (
            <>
              <Link className="big-button" to="/login">LOGIN</Link>
              <Link className="big-button" to="/register">REGISTER</Link>
            </>
          ) : (
            <button className="logout-button" onClick={logout}>LOGOUT</button>
          )}
        </div>
      </div>
    </nav>
  );
};
