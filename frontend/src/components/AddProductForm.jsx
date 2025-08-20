import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import './AddProductForm.css';

const AddProductForm = ({ onClose, onProductAdded, editingProduct }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(!!editingProduct);
  const [productData, setProductData] = useState({
    // Required fields
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image: '',
    
    // Optional fields with empty defaults
    filterCategory: '',
    shortDescription: '',
    features: [],
    tags: [],
    
    // Specifications
    specifications: {
      size: '',
      weight: '',
      potSize: '',
      height: '',
      spread: '',
      bloomTime: '',
      hardiness: '',
      origin: ''
    },
    
    // Care Instructions
    careInstructions: {
      difficulty: '',
      placement: '',
      watering: '',
      feeding: '',
      pruning: '',
      repotting: '',
      commonIssues: ''
    },
    
    // Plant Details
    plantDetails: {
      sunlight: '',
      water: '',
      soil: '',
      temperature: '',
      humidity: '',
      fertilizer: '',
      repotting: '',
      toxicity: ''
    },
    
    // Shipping & Policies
    shipping: {
      freeShipping: false,
      shippingTime: '',
      returnPolicy: '',
      packaging: ''
    },
    
    // Gallery and metadata
    gallery: [],
    rating: 0,
    reviewCount: 0,
    inStock: true,
    featured: false,
    bestseller: false,
    
    // Admin/System Fields
    isRecent: true,
    isPopular: false,
    isSpecial: false,
    isUserAdded: true
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setIsEditing(true);
      setProductData(editingProduct);
      if (editingProduct.image) {
        setImagePreview(editingProduct.image);
      }
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProductData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name === 'features' || name === 'tags') {
      // Handle comma-separated arrays
      const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
      setProductData((prev) => ({ ...prev, [name]: arrayValue }));
    } else {
      setProductData((prev) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? parseFloat(value) || '' : value 
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProductData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setProductData(prev => ({ ...prev, image: '' }));
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!productData.name.trim()) return 'Product name is required';
        if (!productData.category) return 'Please select a category';
        if (!productData.price || productData.price <= 0) return 'Please enter a valid price';
        if (!productData.quantity) return 'Please select quantity';
        if (!productData.description.trim()) return 'Product description is required';
        break;
      case 2:
        // Optional step - no required fields
        break;
      case 3:
        // Optional step - no required fields
        break;
      case 4:
        // Optional step - no required fields
        break;
      default:
        break;
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setError(error);
      return;
    }
    setError('');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    // Validate all required fields
    const finalValidation = validateStep(1);
    if (finalValidation) {
      setError(finalValidation);
      setCurrentStep(1);
      return;
    }

    setLoading(true);

    try {
      const productToSubmit = {
        ...productData,
        price: parseFloat(productData.price) || 0,
        // Set defaults for empty optional fields
        filterCategory: productData.filterCategory || 'houseplants',
        shipping: {
          ...productData.shipping,
          shippingTime: productData.shipping.shippingTime || '3-5 business days',
          returnPolicy: productData.shipping.returnPolicy || '30-day return policy',
          packaging: productData.shipping.packaging || 'Eco-friendly packaging'
        },
        careInstructions: {
          ...productData.careInstructions,
          difficulty: productData.careInstructions.difficulty || 'Easy'
        }
      };

      console.log(`${isEditing ? 'Updating' : 'Creating'} product:`, productToSubmit);
      
      const response = isEditing 
        ? await productAPI.updateProduct(editingProduct._id, productToSubmit)
        : await productAPI.createProduct(productToSubmit);
      
      if (response.success) {
        console.log(`Product ${isEditing ? 'updated' : 'created'} successfully:`, response.data);
        
        // Call callback to refresh product list if provided
        if (onProductAdded) {
          onProductAdded(response.data);
        }
        
        // Show success message
        alert(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
        
        // Close modal
        onClose();
      } else {
        throw new Error(response.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }
      
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
      setError(error.message || `Failed to ${isEditing ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3>Basic Product Information</h3>
            
            <div className="form-group">
              <label>Product Image</label>
              <div className="image-upload-container">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Product preview" className="preview-image" />
                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <label htmlFor="image-upload" className="upload-label">
                      <div className="upload-icon">+</div>
                      <span>Click to add image</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              <div className="image-url-option">
                <label>Or enter image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={productData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={productData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Pothos">Pothos</option>
                <option value="Aloe Vera">Aloe Vera</option>
                <option value="Cactus">Cactus</option>
                <option value="Tropical">Tropical</option>
                <option value="Indoor Tree">Indoor Tree</option>
                <option value="Flowering">Flowering</option>
                <option value="Air Purifying">Air Purifying</option>
                <option value="Low Light">Low Light</option>
                <option value="Wedding Flowers">Wedding Flowers</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Filter Category</label>
              <select name="filterCategory" value={productData.filterCategory} onChange={handleChange}>
                <option value="">Select filter category</option>
                <option value="houseplants">House Plants</option>
                <option value="valentine">Valentine</option>
                <option value="wedding">Wedding</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity *</label>
              <select name="quantity" value={productData.quantity} onChange={handleChange} required>
                <option value="">Select quantity</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="125">125</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Enter detailed product description..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                name="shortDescription"
                value={productData.shortDescription}
                onChange={handleChange}
                placeholder="Brief product summary for listings..."
                rows="2"
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3>Product Details & Features</h3>
            
            <div className="form-group">
              <label>Features (comma-separated)</label>
              <input
                type="text"
                name="features"
                value={productData.features.join(', ')}
                onChange={handleChange}
                placeholder="Air purifying, Low maintenance, Pet safe"
              />
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={productData.tags.join(', ')}
                onChange={handleChange}
                placeholder="indoor, beginner, tropical"
              />
            </div>

            <div className="form-group">
              <label>Gallery Images (comma-separated URLs)</label>
              <textarea
                name="gallery"
                value={productData.gallery.join(', ')}
                onChange={(e) => {
                  const galleryUrls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                  setProductData(prev => ({ ...prev, gallery: galleryUrls }));
                }}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                rows="3"
              />
            </div>

            <div className="specifications-grid">
              <div className="form-group">
                <label>Plant Size</label>
                <input
                  type="text"
                  name="specifications.size"
                  value={productData.specifications.size}
                  onChange={handleChange}
                  placeholder="e.g., Small (6-12 inches)"
                />
              </div>
              
              <div className="form-group">
                <label>Weight</label>
                <input
                  type="text"
                  name="specifications.weight"
                  value={productData.specifications.weight}
                  onChange={handleChange}
                  placeholder="e.g., 2-3 lbs"
                />
              </div>
              
              <div className="form-group">
                <label>Pot Size</label>
                <input
                  type="text"
                  name="specifications.potSize"
                  value={productData.specifications.potSize}
                  onChange={handleChange}
                  placeholder="e.g., 4 inch pot"
                />
              </div>
              
              <div className="form-group">
                <label>Height</label>
                <input
                  type="text"
                  name="specifications.height"
                  value={productData.specifications.height}
                  onChange={handleChange}
                  placeholder="e.g., 12-18 inches"
                />
              </div>
              
              <div className="form-group">
                <label>Spread</label>
                <input
                  type="text"
                  name="specifications.spread"
                  value={productData.specifications.spread}
                  onChange={handleChange}
                  placeholder="e.g., 8-12 inches"
                />
              </div>
              
              <div className="form-group">
                <label>Bloom Time</label>
                <input
                  type="text"
                  name="specifications.bloomTime"
                  value={productData.specifications.bloomTime}
                  onChange={handleChange}
                  placeholder="e.g., Spring to Summer"
                />
              </div>
              
              <div className="form-group">
                <label>Hardiness</label>
                <input
                  type="text"
                  name="specifications.hardiness"
                  value={productData.specifications.hardiness}
                  onChange={handleChange}
                  placeholder="e.g., USDA zones 9-11"
                />
              </div>
              
              <div className="form-group">
                <label>Origin</label>
                <input
                  type="text"
                  name="specifications.origin"
                  value={productData.specifications.origin}
                  onChange={handleChange}
                  placeholder="e.g., Tropical South America"
                />
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3>Care Instructions</h3>
            
            <div className="care-grid">
              <div className="form-group">
                <label>Care Difficulty</label>
                <select 
                  name="careInstructions.difficulty" 
                  value={productData.careInstructions.difficulty} 
                  onChange={handleChange}
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Ideal Placement</label>
                <input
                  type="text"
                  name="careInstructions.placement"
                  value={productData.careInstructions.placement}
                  onChange={handleChange}
                  placeholder="e.g., Bright, indirect light near window"
                />
              </div>
              
              <div className="form-group">
                <label>Sunlight Requirements</label>
                <select name="plantDetails.sunlight" value={productData.plantDetails.sunlight} onChange={handleChange}>
                  <option value="">Select sunlight needs</option>
                  <option value="Full Sun">Full Sun</option>
                  <option value="Partial Sun">Partial Sun</option>
                  <option value="Bright Indirect Light">Bright Indirect Light</option>
                  <option value="Medium Light">Medium Light</option>
                  <option value="Low Light">Low Light</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Watering Needs</label>
                <select name="plantDetails.water" value={productData.plantDetails.water} onChange={handleChange}>
                  <option value="">Select watering frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Every 2-3 days">Every 2-3 days</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Every 2 weeks">Every 2 weeks</option>
                  <option value="Monthly">Monthly</option>
                  <option value="When soil is dry">When soil is dry</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Soil Type</label>
                <select name="plantDetails.soil" value={productData.plantDetails.soil} onChange={handleChange}>
                  <option value="">Select soil type</option>
                  <option value="Well-draining potting mix">Well-draining potting mix</option>
                  <option value="Cactus/Succulent mix">Cactus/Succulent mix</option>
                  <option value="Regular potting soil">Regular potting soil</option>
                  <option value="Orchid bark mix">Orchid bark mix</option>
                  <option value="Sandy soil">Sandy soil</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Pet Safety</label>
                <select name="plantDetails.toxicity" value={productData.plantDetails.toxicity} onChange={handleChange}>
                  <option value="">Select pet safety level</option>
                  <option value="Pet Safe">Pet Safe</option>
                  <option value="Toxic to cats and dogs">Toxic to cats and dogs</option>
                  <option value="Toxic to cats">Toxic to cats</option>
                  <option value="Toxic to dogs">Toxic to dogs</option>
                  <option value="Mildly toxic">Mildly toxic</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Temperature Range</label>
                <input
                  type="text"
                  name="plantDetails.temperature"
                  value={productData.plantDetails.temperature}
                  onChange={handleChange}
                  placeholder="e.g., 65-75°F (18-24°C)"
                />
              </div>
              
              <div className="form-group">
                <label>Humidity Level</label>
                <select name="plantDetails.humidity" value={productData.plantDetails.humidity} onChange={handleChange}>
                  <option value="">Select humidity level</option>
                  <option value="Low (30-40%)">Low (30-40%)</option>
                  <option value="Medium (40-60%)">Medium (40-60%)</option>
                  <option value="High (60-80%)">High (60-80%)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Repotting Frequency</label>
                <select name="plantDetails.repotting" value={productData.plantDetails.repotting} onChange={handleChange}>
                  <option value="">Select repotting frequency</option>
                  <option value="Every year">Every year</option>
                  <option value="Every 2-3 years">Every 2-3 years</option>
                  <option value="When rootbound">When rootbound</option>
                  <option value="Rarely needed">Rarely needed</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Fertilizer Information</label>
              <input
                type="text"
                name="plantDetails.fertilizer"
                value={productData.plantDetails.fertilizer}
                onChange={handleChange}
                placeholder="e.g., Monthly during growing season with balanced fertilizer"
              />
            </div>
            
            <div className="form-group">
              <label>Watering Instructions</label>
              <textarea
                name="careInstructions.watering"
                value={productData.careInstructions.watering}
                onChange={handleChange}
                placeholder="Detailed watering instructions..."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Feeding Instructions</label>
              <textarea
                name="careInstructions.feeding"
                value={productData.careInstructions.feeding}
                onChange={handleChange}
                placeholder="Fertilizer and feeding schedule..."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Pruning Instructions</label>
              <textarea
                name="careInstructions.pruning"
                value={productData.careInstructions.pruning}
                onChange={handleChange}
                placeholder="Pruning and maintenance instructions..."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Repotting Instructions</label>
              <textarea
                name="careInstructions.repotting"
                value={productData.careInstructions.repotting}
                onChange={handleChange}
                placeholder="Repotting guidelines and timing..."
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Common Issues</label>
              <textarea
                name="careInstructions.commonIssues"
                value={productData.careInstructions.commonIssues}
                onChange={handleChange}
                placeholder="Common problems and solutions..."
                rows="4"
              />
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h3>Shipping & Settings</h3>
            
            <div className="shipping-grid">
              <div className="form-group">
                <label>Shipping Time</label>
                <input
                  type="text"
                  name="shipping.shippingTime"
                  value={productData.shipping.shippingTime}
                  onChange={handleChange}
                  placeholder="e.g., 3-5 business days"
                />
              </div>
              
              <div className="form-group">
                <label>Return Policy</label>
                <input
                  type="text"
                  name="shipping.returnPolicy"
                  value={productData.shipping.returnPolicy}
                  onChange={handleChange}
                  placeholder="e.g., 30-day return policy"
                />
              </div>
              
              <div className="form-group">
                <label>Packaging</label>
                <input
                  type="text"
                  name="shipping.packaging"
                  value={productData.shipping.packaging}
                  onChange={handleChange}
                  placeholder="e.g., Eco-friendly packaging"
                />
              </div>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="shipping.freeShipping"
                  checked={productData.shipping.freeShipping}
                  onChange={handleChange}
                />
                <span>Free Shipping</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  checked={productData.featured}
                  onChange={handleChange}
                />
                <span>Featured Product</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={productData.bestseller}
                  onChange={handleChange}
                />
                <span>Bestseller</span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={productData.inStock}
                  onChange={handleChange}
                />
                <span>In Stock</span>
              </label>
            </div>
            
            <div className="admin-settings">
              <h4>Admin Settings</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isRecent"
                    checked={productData.isRecent}
                    onChange={handleChange}
                  />
                  <span>Mark as Recent</span>
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={productData.isPopular}
                    onChange={handleChange}
                  />
                  <span>Mark as Popular</span>
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isSpecial"
                    checked={productData.isSpecial}
                    onChange={handleChange}
                  />
                  <span>Mark as Special</span>
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isUserAdded"
                    checked={productData.isUserAdded}
                    onChange={handleChange}
                  />
                  <span>User Added Product</span>
                </label>
              </div>
            </div>
            
            <div className="rating-review-section">
              <div className="form-group">
                <label>Initial Rating (0-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={productData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
              
              <div className="form-group">
                <label>Review Count</label>
                <input
                  type="number"
                  name="reviewCount"
                  value={productData.reviewCount}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-product-modal">
      <div className="add-product-content">
        <div className="modal-header">
          
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          
          <button type="button" className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Progress Indicator */}
        <div className="progress-indicator">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div 
              key={index} 
              className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
            >
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={(e) => {
          // Prevent default form submission
          e.preventDefault();
        }}>
          <div className="form-content">
            {renderStepContent()}
          </div>

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-btn prev-btn">
                Previous
              </button>
            )}
            
            <div className="nav-right">
              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep} className="nav-btn next-btn">
                  Next
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading} className="submit-btn">
                  {loading ? (isEditing ? 'Updating Product...' : 'Adding Product...') : (isEditing ? 'Update Product' : 'Add Product')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;