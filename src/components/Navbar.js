import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Book, Mail, ExternalLink } from 'lucide-react';

const Navbar = ({ handleDownloadSampleBook }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Visuai" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Visuai</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <button 
              onClick={handleDownloadSampleBook}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Book className="inline-block w-4 h-4 mr-1" />
              Download ePub
            </button>
            <a 
              href="mailto:gregmaceachern98@gmail.com?subject=Issues%20Generating%20Book"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Mail className="inline-block w-4 h-4 mr-1" />
              Support
            </a>
            <a 
              href="https://pro.visuai.io" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Visuai Pro
              <ExternalLink className="ml-1 w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <button
              onClick={() => {
                handleDownloadSampleBook();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Download ePub
            </button>
            <a
              href="mailto:gregmaceachern98@gmail.com?subject=Issues%20Generating%20Book"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </a>
            <a
              href="https://pro.visuai.io"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Visuai Pro
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;