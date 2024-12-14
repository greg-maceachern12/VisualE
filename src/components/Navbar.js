import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Download, Mail, Home, Info } from 'lucide-react';

const Navbar = ({
  user,
  handleDownloadSampleBook,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // const linkText = user ? "Account" : "Sign In";
  // const linkTo = user ? "/account" : "/auth";

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="logo.png" alt="Visuai Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Visuai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2 text-sm font-medium"
            >
              About
            </Link>
            <button
              onClick={handleDownloadSampleBook}
              className="text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2 text-sm font-medium inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download ePub</span>
            </button>
            <a
              href="mailto:gregmaceachern98@gmail.com?subject=Issues%20Generating%20Book&body=-%20This%20was%20broken%3A%0A-%20This%20is%20how%20it%20should%20have%20worked%3A%0A-%20Images%20or%20console%20errors%20(optional)%3A"
              className="text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2 text-sm font-medium inline-flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Issues?</span>
            </a>
            {/* <Link
              to={linkTo}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-lg shadow-cyan-900/20"
            >
              {linkText}
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
              onClick={toggleMenu}
            >
              <span className="flex items-center space-x-3">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </span>
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
              onClick={toggleMenu}
            >
              <span className="flex items-center space-x-3">
                <Info className="w-5 h-5" />
                <span>About</span>
              </span>
            </Link>
            <button
              onClick={() => {
                handleDownloadSampleBook();
                toggleMenu();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
            >
              <span className="flex items-center space-x-3">
                <Download className="w-5 h-5" />
                <span>Download ePub</span>
              </span>
            </button>
            <a
              href="mailto:gregmaceachern98@gmail.com?subject=Issues%20Generating%20Book"
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
              onClick={toggleMenu}
            >
              <span className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>Issues?</span>
              </span>
            </a>
            {/* <Link
              to={linkTo}
              className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={toggleMenu}
            >
              {linkText}
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;