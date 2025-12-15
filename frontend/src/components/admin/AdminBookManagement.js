import React, { useState, useEffect } from 'react';
import { booksAPI } from '../../services/api';
import './AdminBookManagement.css';
import './shared.css';

const AdminBookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    genre: '',
    publisher: '',
    language: '',
    stockQuantity: '',
    coverImageUrl: '',
    publishedDate: '',
    rating: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };

      if (editingBook) {
        await booksAPI.update(editingBook.book_id, bookData);
        setSuccess('Book updated successfully!');
      } else {
        await booksAPI.create(bookData);
        setSuccess('Book created successfully!');
      }

      setShowForm(false);
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        price: '',
        description: '',
        genre: '',
        publisher: '',
        language: '',
        stockQuantity: '',
        coverImageUrl: '',
        publishedDate: '',
        rating: '',
      });
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      price: book.price || '',
      description: book.description || '',
      genre: book.genre || '',
      publisher: book.publisher || '',
      language: book.language || '',
      stockQuantity: book.stockQuantity || '',
      coverImageUrl: book.coverImageUrl || '',
      publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
      rating: book.rating || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await booksAPI.delete(id);
      setSuccess('Book deleted successfully!');
      fetchBooks();
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      price: '',
      description: '',
      genre: '',
      publisher: '',
      language: '',
      stockQuantity: '',
      coverImageUrl: '',
      publishedDate: '',
      rating: '',
    });
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="admin-book-management">
      <div className="admin-section-header">
        <h2>Book Management</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Book
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="book-form-modal">
          <div className="book-form-content">
            <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Published Date</label>
                  <input
                    type="date"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="url"
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingBook ? 'Update Book' : 'Create Book'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="books-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.book_id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>${book.price?.toFixed(2)}</td>
                <td>{book.stockQuantity}</td>
                <td>{book.rating ? book.rating.toFixed(1) : 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(book)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(book.book_id)} className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookManagement;

