const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createSession,
  getCartSummary,
  mergeCart
} = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

// @desc    Create new session
// @route   POST /api/cart/session
// @access  Public
router.post('/session', createSession);

// @desc    Get cart by session ID
// @route   GET /api/cart/:sessionId
// @access  Public (with optional auth)
router.get('/:sessionId', optionalAuth, getCart);

// @desc    Get cart summary (item count and total)
// @route   GET /api/cart/:sessionId/summary
// @access  Public (with optional auth)
router.get('/:sessionId/summary', optionalAuth, getCartSummary);

// @desc    Add item to cart
// @route   POST /api/cart/:sessionId/items
// @access  Public (with optional auth)
router.post('/:sessionId/items', optionalAuth, addToCart);

// @desc    Update cart item quantity
// @route   PUT /api/cart/:sessionId/items/:productId
// @access  Public (with optional auth)
router.put('/:sessionId/items/:productId', optionalAuth, updateCartItem);

// @desc    Remove item from cart
// @route   DELETE /api/cart/:sessionId/items/:productId
// @access  Public (with optional auth)
router.delete('/:sessionId/items/:productId', optionalAuth, removeFromCart);

// @desc    Clear entire cart
// @route   DELETE /api/cart/:sessionId
// @access  Public (with optional auth)
router.delete('/:sessionId', optionalAuth, clearCart);

// @desc    Merge guest cart with user cart
// @route   POST /api/cart/:sessionId/merge
// @access  Public (with optional auth)
router.post('/:sessionId/merge', optionalAuth, mergeCart);

module.exports = router;