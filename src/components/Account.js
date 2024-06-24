import React, { useState, useEffect } from 'react';
import { fetchUserBooks } from '../coreFunctions/service';
import { supabase } from '../utils/supabaseClient'; // Make sure this import is correct
import '../styles/Account.scss';

const Account = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      const userBooks = await fetchUserBooks();
      setBooks(userBooks);
      setLoading(false);
    };

    loadBooks();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to home page or login page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  if (loading) {
    return <div>Loading your books...</div>;
  }

  return (
    <div className="account-page">
      <h1>Your Generated Books</h1>
      {books.length === 0 ? (
        <p>You haven't generated any books yet.</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <span className="book-title">{book.book_title}</span>
              <span className="book-date">{new Date(book.created_at).toLocaleDateString()}</span>
              <a href={book.download_url} download={`${book.book_title}.epub`} className="download-button">
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
    </div>
  );
};

export default Account;