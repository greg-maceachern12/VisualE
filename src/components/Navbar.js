import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, isDropdownOpen, toggleDropdown, handleSignOut, handleDownloadSampleBook }) => {
  return (
    <div className="navbar">
      <Link to="/" className="link-button">
        <div className="logo-container">
          <img src="logo.png" alt="Visuai Logo" className="logo" />
          <h1>Visuai</h1>
        </div>
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <button onClick={handleDownloadSampleBook} className="nav-link">Download an ePub</button>
        <a
          className="nav-link"
          href={`mailto:greg@visuai.io?subject=Visuai%20Issues&body=-%20This%20was%20broken%3A%0A-%20This%20is%20how%20it%20should%20have%20worked%3A%0A-%20Images%20or%20console%20errors%20(optional)%3A`}
        >
          Issues?
        </a>
        <div className="nav-link dropdown">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            {user ? user.user_metadata.name : "Sign In"}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <Link to="/account" className="dropdown-item">Account</Link>
                  <button className="dropdown-item" onClick={handleSignOut}>Sign Out</button>
                </>
              ) : (
                <Link to="/auth" className="dropdown-item">Sign In</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;