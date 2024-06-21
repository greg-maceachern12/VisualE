import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Navbar.scss";

const Navbar = ({ handleDownloadSampleBook }) => {
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
        <a className="nav-link" href={`mailto:greg@visuai.io?subject=Issues%20Generating%20Book&body=-%20This%20was%20broken%3A%0A-%20This%20is%20how%20it%20should%20have%20worked%3A%0A-%20Images%20or%20console%20errors%20(optional)%3A`}>
          Issues?
        </a>
        <a className="nav-link" href="https://pro.visuai.io" target="_blank" rel="noreferrer" id='goPro'>
          Visuai Pro
        </a>
      </div>
    </div>
  );
};

export default Navbar;