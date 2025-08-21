import React, { useState, useEffect } from 'react';
import AddProductForm from '../../components/AddProductForm.jsx';
import { productAPI } from '../../services/api';

const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProductClick = () => {
    setEditingProduct(null);
    setShowAddProduct(true);
  };
  
  const handleCloseForm = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        fetchProducts(); // Refresh the list
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refresh the list after adding/editing
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-products-container">
        <div className="admin-products-header">
          <h2 className="admin-products-title">Products</h2>
          <div className="admin-products-controls">
            <input 
              type="text" 
              className="admin-search-input" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="admin-add-product-btn" onClick={handleAddProductClick}>
              Add Product
            </button>
          </div>
        </div>
        <div className="admin-table-container">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Product Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                    {error}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id?.slice(-8).toUpperCase() || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={product.image || '/images/placeholder.jpg'} 
                          alt={product.name || 'Product'}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <span>{product.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>${product.price?.toFixed(2) || '0.00'}</td>
                    <td>{product.category || 'N/A'}</td>
                    <td>{product.quantity || 'N/A'}</td>
                    <td>
                      <span 
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          backgroundColor: product.inStock ? '#e8f5e8' : '#ffebee',
                          color: product.inStock ? '#2e7d32' : '#c62828'
                        }}
                      >
                        {product.inStock ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '4px',
                            color: '#666'
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}>
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Delete Product"
                          style={{
                            background: '#ff4757',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '4px',
                            color: 'white'
                          }}
                        >
                          <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'white' }}>
                            <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      {showAddProduct && (
        <AddProductForm 
          onClose={handleCloseForm} 
          onProductAdded={handleProductAdded}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
};

export default Products;