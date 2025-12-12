import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data);
      setLoading(false);
    } catch (err) {
      setError('Book not found');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (book && book.stockQuantity > 0) {
      addToCart(book, quantity);
      alert('Book added to cart!');
    }
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (error || !book) {
    return (
      <div className="error-container">
        <div className="error">{error || 'Book not found'}</div>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="book-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="book-detail-content">
        <div className="book-detail-image">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <div className="book-placeholder-large">📚</div>
          )}
        </div>
        
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>
          
          <div className="book-detail-meta">
            <span className="book-detail-genre">{book.genre}</span>
            {book.publisher && <span>Published by {book.publisher}</span>}
            {book.language && <span>Language: {book.language}</span>}
          </div>
          
          <div className="book-detail-price">
            ${book.price?.toFixed(2)}
          </div>
          
          {book.description && (
            <div className="book-detail-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          <div className="book-detail-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={book.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            
            {book.stockQuantity > 0 ? (
              <button onClick={handleAddToCart} className="btn-add-cart">
                Add to Cart
              </button>
            ) : (
              <button disabled className="btn-disabled">
                Out of Stock
              </button>
            )}
          </div>
          
          <div className="stock-info">
            {book.stockQuantity > 0 ? (
              <span className="in-stock">✓ {book.stockQuantity} in stock</span>
            ) : (
              <span className="out-of-stock">✗ Out of stock</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

