import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Improve error messages
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 409) {
        error.message = 'Email already exists. Please use a different email or try logging in.';
      } else if (status === 400) {
        error.message = data?.message || 'Invalid request. Please check your input.';
      } else if (status === 500) {
        error.message = 'Server error. Please try again later.';
      } else if (data?.message) {
        error.message = data.message;
      }
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Unable to connect to server. Please check if the backend is running.';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
};

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (order) => api.post('/orders', order),
  update: (id, order) => api.put(`/orders/${id}`, order),
  delete: (id) => api.delete(`/orders/${id}`),
  getByUserId: (userId) => api.get(`/orders/history/${userId}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
  changePassword: (id, passwordData) => api.put(`/users/${id}/change-password`, passwordData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;

