import React, { useState } from 'react';
import AddProductForm from '../../components/Addproductform.jsx';

const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAddProductClick = () => setShowAddProduct(true);
  const handleCloseForm = () => setShowAddProduct(false);

  return (
    <div className="admin-products-container">
        <div className="admin-products-header">
          <h2 className="admin-products-title">Products</h2>
          <div className="admin-products-controls">
            <input type="text" className="admin-search-input" placeholder="Search products..." />
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
                <th>Plant Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="admin-product-id">P1001</td>
                <td className="admin-name-with-image">
                  <div className="admin-product-image"><img src="/admin/no1.jpg" alt="" /></div>
                  <span>Homalomena </span>
                </td>
                <td><span className="admin-stock-badge available">Available</span></td>
                <td className="admin-product-price">$15.99</td>
                <td className="admin-product-edit">
                  <button className="admin-edit-btn">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  </button>
                </td>
              </tr>
              <tr>
                    <td className="admin-product-id">P1002</td>
                    <td className="admin-name-with-image">
                      <div className="admin-product-image"><img src="/admin/no2.jpg" alt="" /></div>
                      <span>Goldon Pothos</span>
                    </td>
                    <td><span className="admin-stock-badge not-available">Not Available</span></td>
                    <td className="admin-product-price">$12.50</td>
                    <td className="admin-product-edit">
                      <button className="admin-edit-btn">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="admin-product-id">P1003</td>
                    <td className="admin-name-with-image">
                      <div className="admin-product-image"><img src="/admin/no3.jpg" alt="" /></div>
                      <span>Snake Plant</span>
                    </td>
                    <td><span className="admin-stock-badge available">Available</span></td>
                    <td className="admin-product-price">$18.75</td>
                    <td className="admin-product-edit">
                      <button className="admin-edit-btn">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="admin-product-id">P1004</td>
                    <td className="admin-name-with-image">
                      <div className="admin-product-image"><img src="/admin/no4.png" alt="" /></div>
                      <span>Candelabra Aloe</span>
                    </td>
                    <td><span className="admin-stock-badge not-available">Not Available</span></td>
                    <td className="admin-product-price">$22.00</td>
                    <td className="admin-product-edit">
                      <button className="admin-edit-btn">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="admin-product-id">P1005</td>
                    <td className="admin-name-with-image">
                      <div className="admin-product-image"><img src="/admin/no5.jpg" alt="" /></div>
                      <span>Cuctos</span>
                    </td>
                    <td><span className="admin-stock-badge available">Available</span></td>
                    <td className="admin-product-price">$18.75</td>
                    <td className="admin-product-edit">
                      <button className="admin-edit-btn">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                      </button>
                    </td>
                  </tr>
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <button className="admin-pagination-btn">Prev</button>
          <div className="admin-pagination-numbers">
            <span className="admin-page-number active">1</span>
            <span className="admin-page-number">2</span>
            <span className="admin-page-number">3</span>
            <span className="admin-page-dots">...</span>
            <span className="admin-page-number">10</span>
          </div>
          <button className="admin-pagination-btn">Next</button>
        </div>
      {showAddProduct && <AddProductForm onClose={handleCloseForm} />}
    </div>
  );
};

export default Products;