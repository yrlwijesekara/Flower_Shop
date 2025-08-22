import React, { useState, useEffect } from 'react';
import { FiTrash2, FiEye, FiEdit, FiPlus, FiToggleLeft, FiToggleRight, FiPackage, FiDollarSign, FiStar } from 'react-icons/fi';
import './Adminpage.css';

const OtherProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: 5,
    image: '',
    description: '',
    category: '',
    isActive: true,
    sortOrder: 0,
    useFileUpload: false,
    imageFile: null
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch other products from API
  const fetchOtherProducts = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('authToken');
      if (!adminToken) {
        setError('Authentication required. Please login as admin.');
        return;
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });

      const response = await fetch(`http://localhost:8000/api/admin/other-products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch other products');
      }
    } catch (error) {
      console.error('Error fetching other products:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtherProducts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOtherProducts(1, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOtherProducts(page, searchTerm);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const adminToken = localStorage.getItem('authToken');
      const url = editingId 
        ? `http://localhost:8000/api/admin/other-products/${editingId}`
        : 'http://localhost:8000/api/admin/other-products';
      
      const method = editingId ? 'PUT' : 'POST';

      let submitData = { ...formData };

      // Handle file upload
      if (formData.useFileUpload && formData.imageFile) {
        // Convert file to base64
        const fileReader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(formData.imageFile);
        });
        
        const base64Data = await base64Promise;
        submitData.image = base64Data;
      }

      // Remove file-related fields from submit data
      delete submitData.useFileUpload;
      delete submitData.imageFile;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        fetchOtherProducts(currentPage, searchTerm);
        setShowForm(false);
        setEditingId(null);
        resetForm();
      } else {
        setError(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Network error. Please try again.');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      rating: 5,
      image: '',
      description: '',
      category: '',
      isActive: true,
      sortOrder: 0,
      useFileUpload: false,
      imageFile: null
    });
  };

  // Handle edit
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      rating: product.rating,
      image: product.image,
      description: product.description || '',
      category: product.category || '',
      isActive: product.isActive,
      sortOrder: product.sortOrder || 0,
      useFileUpload: false,
      imageFile: null
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  // Handle view
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/other-products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchOtherProducts(currentPage, searchTerm);
      } else {
        setError(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Network error. Please try again.');
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (productId) => {
    try {
      const adminToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/admin/other-products/${productId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchOtherProducts(currentPage, searchTerm);
      } else {
        setError(data.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="admin-other-products-section">
      <div className="admin-other-products-header">
        <h2 className="admin-section-title">Other Products Management</h2>
        <button 
          className="admin-btn-primary"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <FiPlus size={16} />
          Add New Product
        </button>
      </div>

      <div className="admin-other-products-controls">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="admin-loading">Loading other products...</div>
      ) : error ? (
        <div className="admin-error">Error: {error}</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-other-products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Sort Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-no-data">No other products found</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-product-image">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                      </td>
                      <td className="admin-product-name">{product.name}</td>
                      <td>{product.category || 'N/A'}</td>
                      <td>${product.price}</td>
                      <td>
                        <div className="admin-rating">
                          <FiStar size={14} />
                          {product.rating}/5
                        </div>
                      </td>
                      <td>
                        <span className={`admin-status ${product.isActive ? 'admin-active' : 'admin-inactive'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{product.sortOrder}</td>
                      <td>
                        <div className="admin-other-product-actions">
                          <button
                            className="admin-btn-view"
                            onClick={() => handleView(product)}
                            title="View product details"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            className="admin-btn-edit"
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            className={`admin-btn-toggle ${product.isActive ? 'admin-active' : 'admin-inactive'}`}
                            onClick={() => handleToggleStatus(product._id)}
                            title={product.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {product.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                          </button>
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDelete(product._id, product.name)}
                            title="Delete product"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              <div className="admin-pagination-numbers">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`admin-page-number ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="admin-pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <FiPackage className="admin-modal-icon" />
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                className="admin-modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength="100"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    maxLength="50"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Product Image *</label>
                <div className="admin-image-input-container">
                  <div className="admin-image-input-tabs">
                    <button 
                      type="button"
                      className={`admin-tab-btn ${!formData.useFileUpload ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, useFileUpload: false, imageFile: null }))}
                    >
                      Image URL
                    </button>
                    <button 
                      type="button"
                      className={`admin-tab-btn ${formData.useFileUpload ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, useFileUpload: true, image: '' }))}
                    >
                      Upload File
                    </button>
                  </div>
                  
                  {!formData.useFileUpload ? (
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  ) : (
                    <div className="admin-file-upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required={formData.useFileUpload && !formData.image}
                        className="admin-file-input"
                      />
                      {formData.imageFile && (
                        <div className="admin-file-preview">
                          <span>Selected: {formData.imageFile.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="500"
                  placeholder="Product description..."
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="submit" className="admin-btn-primary">
                  {editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button 
                  type="button" 
                  className="admin-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                <FiEye className="admin-modal-icon" />
                Product Details
              </h3>
              <button 
                className="admin-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-product-detail">
                <div className="admin-product-detail-image">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="admin-product-detail-info">
                  <h4>{selectedProduct.name}</h4>
                  <p><strong>Category:</strong> {selectedProduct.category || 'N/A'}</p>
                  <p><strong>Price:</strong> ${selectedProduct.price}</p>
                  <p><strong>Rating:</strong> {selectedProduct.rating}/5</p>
                  <p><strong>Status:</strong> {selectedProduct.isActive ? 'Active' : 'Inactive'}</p>
                  <p><strong>Sort Order:</strong> {selectedProduct.sortOrder}</p>
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  <p><strong>Created:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="admin-btn-primary"
                onClick={() => {
                  setShowModal(false);
                  handleEdit(selectedProduct);
                }}
              >
                Edit Product
              </button>
              <button 
                className="admin-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherProducts;