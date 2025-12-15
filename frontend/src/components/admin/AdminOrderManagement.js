import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import './AdminOrderManagement.css';
import './shared.css';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setSuccess('Order status updated successfully!');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#ff9800';
      case 'PROCESSING':
        return '#2196f3';
      case 'SHIPPED':
        return '#9c27b0';
      case 'DELIVERED':
        return '#4caf50';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-order-management">
      <div className="admin-section-header">
        <h2>Order Management</h2>
        <p>Total Orders: {orders.length}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.order_id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order.order_id.slice(-8)}</h3>
                <p className="order-date">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="order-user">User ID: {order.userId}</p>
              </div>
              <div className="order-status-section">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                  className="status-select"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="order-items">
              {order.items?.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-info">
                    <h4>{item.title}</h4>
                    <p>Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="order-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Total:</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManagement;

