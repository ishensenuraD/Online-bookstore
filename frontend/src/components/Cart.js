import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        book_id: item.book_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));

      const order = {
        userId: user.userId,
        items: orderItems,
        totalAmount: getTotalPrice(),
        status: 'PENDING',
      };

      await ordersAPI.create(order);
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some books to get started!</p>
          <Link to="/" className="btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.book_id} className="cart-item">
              <div className="cart-item-image">
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt={item.title} />
                ) : (
                  <div className="cart-placeholder">📚</div>
                )}
              </div>
              
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>by {item.author}</p>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.book_id, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.book_id, item.quantity + 1)}>
                  +
                </button>
              </div>
              
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.book_id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="btn-checkout">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

