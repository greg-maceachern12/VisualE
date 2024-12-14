import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Book, Mail, ExternalLink } from 'lucide-react';

const Navbar = ({ handleDownloadSampleBook }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/60 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center group">
              <img src="/logo.png" alt="Visuai" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Visuai
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              About
            </Link>
            <button 
              onClick={handleDownloadSampleBook}
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
            >
              <Book className="w-4 h-4 mr-1" />
              Download ePub
            </button>
            <a 
              href="mailto:gregmaceachern98@gmail.com?subject=Issues%20Generating%20Book"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
            >
              <Mail className="w-4 h-4 mr-1" />
              Support
            </a>
            <a 
              href="https://pro.visuai.io" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-sm"
            >
              Visuai Pro
              <ExternalLink className="ml-1 w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/80 backdrop-blur-xl border-t border-gray-100/50">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                Home
              </span>
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                About
              </span>
            </Link>
            <button
              onClick={() => {
                handleDownloadSampleBook();
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
            >
              <span className="flex items-center">
                <Book className="w-4 h-4 mr-2" />
                Download ePub
              </span>
            </button>
            <a
              href="mailto:gregmaceachern98@gmail.com?subject=Issues%20Generating%20Book"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Support
              </span>
            </a>
            <a
              href="https://pro.visuai.io"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visuai Pro
              </span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;