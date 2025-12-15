import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminBookManagement from './admin/AdminBookManagement';
import AdminCategoryManagement from './admin/AdminCategoryManagement';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminOrderManagement from './admin/AdminOrderManagement';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('books');

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="admin-panel-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You must be an administrator to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your bookstore</p>
      </div>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <button
            className={activeTab === 'books' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('books')}
          >
            📚 Books
          </button>
          <button
            className={activeTab === 'categories' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('categories')}
          >
            🏷️ Categories
          </button>
          <button
            className={activeTab === 'users' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={activeTab === 'orders' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders
          </button>
        </div>
        
        <div className="admin-main">
          {activeTab === 'books' && <AdminBookManagement />}
          {activeTab === 'categories' && <AdminCategoryManagement />}
          {activeTab === 'users' && <AdminUserManagement />}
          {activeTab === 'orders' && <AdminOrderManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

