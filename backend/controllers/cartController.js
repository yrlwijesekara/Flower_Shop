const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to generate session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// @desc    Get cart by session ID
// @route   GET /api/cart/:sessionId
// @access  Public
const getCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user ? req.user._id : null; // Optional user ID if authenticated

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const cart = await Cart.findOrCreateBySession(sessionId, userId)
      .populate('items.productId', 'name price image category inStock');

    // Filter out items where product no longer exists
    const validItems = cart.items.filter(item => item.productId);
    
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/:sessionId/items
// @access  Public
const addToCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, quantity = 1 } = req.body;

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

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Find or create cart
    const cart = await Cart.findOrCreateBySession(sessionId);

    // Add item to cart
    await cart.addItem(product, quantity);

    // Populate cart items and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'name price image category inStock');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart
    });

  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:sessionId/items/:productId
// @access  Public
const updateCartItem = async (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const { quantity } = req.body;

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

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Update item quantity
    await cart.updateItemQuantity(productId, quantity);

    // Populate cart items and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'name price image category inStock');

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCart
    });

  } catch (error) {
    console.error('Error in updateCartItem:', error);
    
    if (error.message === 'Item not found in cart') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:sessionId/items/:productId
// @access  Public
const removeFromCart = async (req, res) => {
  try {
    const { sessionId, productId } = req.params;

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

    // Find cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item from cart
    await cart.removeItem(productId);

    // Populate cart items and return updated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.productId', 'name price image category inStock');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: updatedCart
    });

  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/:sessionId
// @access  Public
const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart
    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });

  } catch (error) {
    console.error('Error in clearCart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Generate new session ID
// @route   POST /api/cart/session
// @access  Public
const createSession = async (req, res) => {
  try {
    const sessionId = generateSessionId();

    res.status(200).json({
      success: true,
      message: 'Session created successfully',
      data: {
        sessionId
      }
    });

  } catch (error) {
    console.error('Error in createSession:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get cart summary (item count and total)
// @route   GET /api/cart/:sessionId/summary
// @access  Public
const getCartSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          totalItems: 0,
          totalAmount: 0,
          itemCount: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length
      }
    });

  } catch (error) {
    console.error('Error in getCartSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Merge guest cart with user cart (for when user logs in)
// @route   POST /api/cart/:sessionId/merge
// @access  Public
const mergeCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userSessionId, userId } = req.body;

    if (!sessionId || !userSessionId) {
      return res.status(400).json({
        success: false,
        message: 'Both session IDs are required'
      });
    }

    // Find guest cart and user cart
    const guestCart = await Cart.findOne({ sessionId });
    const userCart = await Cart.findOrCreateBySession(userSessionId, userId);

    if (!guestCart || guestCart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No items to merge',
        data: userCart
      });
    }

    // Merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        item => item.productId.toString() === guestItem.productId.toString()
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();

    // Clear guest cart
    await guestCart.clearCart();

    // Populate and return merged cart
    const mergedCart = await Cart.findById(userCart._id)
      .populate('items.productId', 'name price image category inStock');

    res.status(200).json({
      success: true,
      message: 'Carts merged successfully',
      data: mergedCart
    });

  } catch (error) {
    console.error('Error in mergeCart:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createSession,
  getCartSummary,
  mergeCart
};