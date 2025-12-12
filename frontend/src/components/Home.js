import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to BookStore</h1>
        <p className="hero-subtitle">Discover your next favorite book</p>
        <Link to="/books" className="btn-hero">
          Browse Books
        </Link>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">📚</div>
          <h3>Wide Selection</h3>
          <p>Thousands of books across all genres</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable shipping</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">💳</div>
          <h3>Secure Payment</h3>
          <p>Safe and easy checkout process</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

