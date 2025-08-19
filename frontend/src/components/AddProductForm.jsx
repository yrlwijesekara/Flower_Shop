import React, { useState } from 'react';
import './Addproductform.css';
const AddProductForm = ({ onClose }) => {
  const [productData, setProductData] = useState({
    name: '',
    type: 'Pothos',
    price: '',
    quantity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product added:', productData);
    onClose();
  };

  return (
    <div className="add-product-modal">
      <div className="add-product-content">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Add Picture</label>
            <div className="image-upload">
              <span>+</span>
            </div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Solmenia"
            />
          </div>
          <div className="form-group">
            <label>Binomial Type</label>
            <select name="type" value={productData.type} onChange={handleChange}>
              <option value="Pothos">Pothos</option>
              <option value="Aloe Vera">Aloe Vera</option>
              <option value="Cactus">Cactus</option>
              <option value="Bonsai">Bonsai</option>
              <option value="Fertilizer">Fertilizer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <select name="quantity" value={productData.quantity} onChange={handleChange}>
              <option value="125">125</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={productData.price}
              onChange={handleChange}
              placeholder="129"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              placeholder="about picture..."
            />
          </div>
          <button type="submit">Add Product</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;