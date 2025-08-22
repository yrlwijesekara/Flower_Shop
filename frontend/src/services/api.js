// API base URL configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Generic API request function with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ API Response: ${config.method || 'GET'} ${url}`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
    throw error;
  }
};

// Product API functions
export const productAPI = {
  // Get all products with optional query parameters
  getProducts: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    const endpoint = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  // Get single product by ID
  getProduct: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Create new product
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update existing product
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Get featured products
  getFeaturedProducts: async () => {
    return apiRequest('/products/featured');
  },

  // Get bestseller products
  getBestsellerProducts: async () => {
    return apiRequest('/products/bestsellers');
  },

  // Get recent products
  getRecentProducts: async () => {
    return apiRequest('/products/recent');
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    return apiRequest(`/products/category/${encodeURIComponent(category)}`);
  },

  // Search products
  searchProducts: async (query) => {
    return apiRequest(`/products/search/${encodeURIComponent(query)}`);
  },

  // Update product stock status
  updateProductStock: async (id, inStock) => {
    return apiRequest(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ inStock }),
    });
  },

  // Bulk update products
  bulkUpdateProducts: async (productIds, updateData) => {
    return apiRequest('/products/bulk-update', {
      method: 'PATCH',
      body: JSON.stringify({ productIds, updateData }),
    });
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// API status check
export const checkAPIConnection = async () => {
  try {
    await healthCheck();
    console.log('✅ API connection successful');
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};

// Wishlist API functions (requires authentication)
export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: async (token) => {
    return apiRequest('/wishlist', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Add product to wishlist
  addToWishlist: async (productId, token) => {
    return apiRequest('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId, token) => {
    return apiRequest('/wishlist/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Toggle product in wishlist (add if not exists, remove if exists)
  toggleWishlist: async (productId, token) => {
    return apiRequest('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Clear entire wishlist
  clearWishlist: async (token) => {
    return apiRequest('/wishlist/clear', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Check if product is in wishlist
  checkWishlistStatus: async (productId, token) => {
    return apiRequest(`/wishlist/check/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Review API functions
export const reviewAPI = {
  // Get reviews for a product
  getProductReviews: async (productId, queryParams = {}) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });

    const endpoint = `/reviews/${productId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest(endpoint);
  },

  // Create a new review
  createReview: async (reviewData, token) => {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Update review helpful count
  updateReviewHelpful: async (reviewId) => {
    return apiRequest(`/reviews/${reviewId}/helpful`, {
      method: 'PUT',
    });
  },

  // Delete a review
  deleteReview: async (reviewId, token) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export default {
  productAPI,
  wishlistAPI,
  reviewAPI,
  healthCheck,
  checkAPIConnection,
};