import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAll();
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books');
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>Our Books</h1>
        <input
          type="text"
          placeholder="Search books by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <div className="no-results">No books found</div>
        ) : (
          filteredBooks.map((book) => (
            <Link key={book.book_id} to={`/books/${book.book_id}`} className="book-card">
              <div className="book-image">
                {book.coverImageUrl ? (
                  <img src={book.coverImageUrl} alt={book.title} />
                ) : (
                  <div className="book-placeholder">📚</div>
                )}
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-genre">{book.genre}</p>
                <div className="book-footer">
                  <span className="book-price">${book.price?.toFixed(2)}</span>
                  {book.stockQuantity > 0 ? (
                    <span className="in-stock">In Stock</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;

