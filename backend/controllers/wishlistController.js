const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Generate session ID if not provided
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substring(2) + '_' + Date.now();
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist/:sessionId
// @access  Public
const getWishlist = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const wishlist = await Wishlist.findBySessionId(sessionId);

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          sessionId,
          products: [],
          totalItems: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });

  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Public
const addToWishlist = async (req, res) => {
  try {
    let { sessionId, productId } = req.body;

    // Generate session ID if not provided
    if (!sessionId) {
      sessionId = generateSessionId();
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Prepare product info for storage
    const productInfo = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    };

    // Add to wishlist
    const wishlist = await Wishlist.addToWishlist(sessionId, productId, productInfo);

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: {
        sessionId,
        wishlist,
        productAdded: {
          id: productId,
          ...productInfo
        }
      }
    });

  } catch (error) {
    console.error('Error in addToWishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove
// @access  Public
const removeFromWishlist = async (req, res) => {
  try {
    const { sessionId, productId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Remove from wishlist
    const wishlist = await Wishlist.removeFromWishlist(sessionId, productId);

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: {
        sessionId,
        wishlist
      }
    });

  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle product in wishlist (add if not exists, remove if exists)
// @route   POST /api/wishlist/toggle
// @access  Public
const toggleWishlist = async (req, res) => {
  try {
    let { sessionId, productId } = req.body;

    // Generate session ID if not provided
    if (!sessionId) {
      sessionId = generateSessionId();
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Check if product exists in wishlist
    let wishlist = await Wishlist.findOne({ sessionId });
    let isInWishlist = false;
    let action = '';

    if (wishlist) {
      isInWishlist = wishlist.hasProduct(productId);
    }

    if (isInWishlist) {
      // Remove from wishlist
      wishlist = await Wishlist.removeFromWishlist(sessionId, productId);
      action = 'removed';
    } else {
      // Add to wishlist
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const productInfo = {
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };

      wishlist = await Wishlist.addToWishlist(sessionId, productId, productInfo);
      action = 'added';
    }

    res.status(200).json({
      success: true,
      message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
      data: {
        sessionId,
        action,
        isInWishlist: action === 'added',
        wishlist
      }
    });

  } catch (error) {
    console.error('Error in toggleWishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist/clear
// @access  Public
const clearWishlist = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const wishlist = await Wishlist.clearWishlist(sessionId);

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: {
        sessionId,
        wishlist
      }
    });

  } catch (error) {
    console.error('Error in clearWishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:sessionId/:productId
// @access  Public
const checkWishlistStatus = async (req, res) => {
  try {
    const { sessionId, productId } = req.params;

    if (!sessionId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and Product ID are required'
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const wishlist = await Wishlist.findOne({ sessionId });
    const isInWishlist = wishlist ? wishlist.hasProduct(productId) : false;

    res.status(200).json({
      success: true,
      data: {
        isInWishlist,
        productId
      }
    });

  } catch (error) {
    console.error('Error in checkWishlistStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Generate new session ID
// @route   POST /api/wishlist/session
// @access  Public
const generateSession = async (req, res) => {
  try {
    const newSessionId = generateSessionId();

    res.status(200).json({
      success: true,
      message: 'New session ID generated',
      data: {
        sessionId: newSessionId
      }
    });

  } catch (error) {
    console.error('Error in generateSession:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  checkWishlistStatus,
  generateSession
};