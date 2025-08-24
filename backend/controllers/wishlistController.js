const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private (requires authentication)
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findByUserId(userId);

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          userId,
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
// @access  Private (requires authentication)
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

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
    const wishlist = await Wishlist.addToWishlist(userId, productId, productInfo);

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: {
        userId,
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
// @access  Private (requires authentication)
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

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
    const wishlist = await Wishlist.removeFromWishlist(userId, productId);

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: {
        userId,
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
// @access  Private (requires authentication)
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

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
    let wishlist = await Wishlist.findOne({ userId });
    let isInWishlist = false;
    let action = '';

    if (wishlist) {
      isInWishlist = wishlist.hasProduct(productId);
    }

    if (isInWishlist) {
      // Remove from wishlist
      wishlist = await Wishlist.removeFromWishlist(userId, productId);
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

      wishlist = await Wishlist.addToWishlist(userId, productId, productInfo);
      action = 'added';
    }

    res.status(200).json({
      success: true,
      message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
      data: {
        userId,
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
// @access  Private (requires authentication)
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.clearWishlist(userId);

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: {
        userId,
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
// @route   GET /api/wishlist/check/:productId
// @access  Private (requires authentication)
const checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

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

    const wishlist = await Wishlist.findOne({ userId });
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

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  checkWishlistStatus
};