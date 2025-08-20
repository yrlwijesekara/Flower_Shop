const Product = require('../models/Product');
const mongoose = require('mongoose');

// Sample fallback data for development
const sampleProducts = [
  {
    _id: "1",
    name: "SNAKE PLANT",
    category: "Cactus",
    filterCategory: "houseplants",
    price: 149,
    quantity: "50",
    image: "/images/snake-plant.jpg",
    description: "A beautiful snake plant perfect for indoor decoration",
    inStock: true,
    featured: true,
    bestseller: false,
    isRecent: true,
    isPopular: true,
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "2",
    name: "CANDELABRA ALOE",
    category: "Aloe Vera",
    filterCategory: "houseplants",
    price: 129,
    quantity: "25",
    image: "/images/candelabra-aloe.jpg",
    description: "A stunning candelabra aloe plant",
    inStock: true,
    featured: false,
    bestseller: true,
    isRecent: false,
    isPopular: true,
    isSpecial: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "3",
    name: "GOLDEN POTHOS",
    category: "Ivy",
    filterCategory: "houseplants",
    price: 89,
    quantity: "75",
    image: "/images/golden-pothos.jpg",
    description: "Beautiful golden pothos perfect for beginners",
    inStock: true,
    featured: true,
    bestseller: true,
    isRecent: true,
    isPopular: false,
    isSpecial: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, using sample data');
      return res.status(200).json({
        success: true,
        count: sampleProducts.length,
        data: sampleProducts
      });
    }
    // Build query object
    let query = {};
    
    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }
    
    // Filter by filter category (houseplants, valentine, wedding)
    if (req.query.filterCategory && req.query.filterCategory !== 'all') {
      query.filterCategory = req.query.filterCategory;
    }
    
    // Filter by stock status
    if (req.query.inStock !== undefined) {
      query.inStock = req.query.inStock === 'true';
    } else {
      // Default to showing only in-stock items
      query.inStock = true;
    }
    
    // Filter by featured status
    if (req.query.featured === 'true') {
      query.featured = true;
    }
    
    // Filter by bestseller status
    if (req.query.bestseller === 'true') {
      query.bestseller = true;
    }
    
    // Filter by special/recent/popular tabs
    if (req.query.tab) {
      switch (req.query.tab) {
        case 'recent':
          query.isRecent = true;
          break;
        case 'popular':
          query.isPopular = true;
          break;
        case 'special':
          query.isSpecial = true;
          break;
      }
    }
    
    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    
    // Search functionality
    let products;
    if (req.query.search) {
      products = await Product.searchProducts(req.query.search)
        .find(query);
    } else {
      products = Product.find(query);
    }
    
    // Sorting
    let sortBy = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sortBy[sortField] = sortOrder;
    } else {
      // Default sort by creation date (newest first)
      sortBy.createdAt = -1;
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Execute query
    const result = await products
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: result.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: result
    });
    
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    // Create product with request body
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
    
  } catch (error) {
    console.error('Error in createProduct:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product already exists'
      });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoServerSelectionError' || 
        error.name === 'MongoNetworkError' ||
        error.message.includes('connection') ||
        error.message.includes('timeout')) {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again in a moment.',
        error: 'Connection Error'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
    
  } catch (error) {
    console.error('Error in updateProduct:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {}
    });
    
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findFeatured();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get bestseller products
// @route   GET /api/products/bestsellers
// @access  Public
const getBestsellerProducts = async (req, res) => {
  try {
    const products = await Product.findBestsellers();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error in getBestsellerProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get recent products
// @route   GET /api/products/recent
// @access  Public
const getRecentProducts = async (req, res) => {
  try {
    const products = await Product.findRecent();
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error in getRecentProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findByCategory(category);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const products = await Product.searchProducts(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
    
  } catch (error) {
    console.error('Error in searchProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update product stock status
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin)
const updateProductStock = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const { inStock } = req.body;
    
    if (typeof inStock !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'inStock must be a boolean value'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Product stock status updated to ${inStock ? 'in stock' : 'out of stock'}`,
      data: product
    });
    
  } catch (error) {
    console.error('Error in updateProductStock:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Bulk update products
// @route   PATCH /api/products/bulk-update
// @access  Private (Admin)
const bulkUpdateProducts = async (req, res) => {
  try {
    const { productIds, updateData } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Update data is required'
      });
    }
    
    // Validate all ObjectIds
    const invalidIds = productIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format(s)',
        invalidIds
      });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData,
      { runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
    
  } catch (error) {
    console.error('Error in bulkUpdateProducts:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestsellerProducts,
  getRecentProducts,
  getProductsByCategory,
  searchProducts,
  updateProductStock,
  bulkUpdateProducts
};