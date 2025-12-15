import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, categoriesAPI } from '../services/api';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const filteredBooks = books.filter(book => {
    // Search filter
    const matchesSearch = !searchTerm || 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = !selectedCategory || book.genre === selectedCategory;
    
    // Price filter
    const matchesPrice = (!priceRange.min || book.price >= parseFloat(priceRange.min)) &&
      (!priceRange.max || book.price <= parseFloat(priceRange.max));
    
    // Rating filter
    const matchesRating = !minRating || (book.rating && book.rating >= parseFloat(minRating));
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setMinRating('');
  };

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>Our Books</h1>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Price Range:</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="price-input"
                min="0"
                step="0.01"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="price-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Min Rating:</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="filter-select"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
          
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
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
                {book.rating && (
                  <p className="book-rating">⭐ {book.rating.toFixed(1)}</p>
                )}
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

