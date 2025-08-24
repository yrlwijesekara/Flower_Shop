const express = require('express');
const router = express.Router();
const {
  getCheckoutInfo,
  processCheckout,
  processSimpleCheckout,
  getOrderHistory,
  getOrderDetails,
  cancelOrder
} = require('../controllers/checkoutController');
const { protect, verifySession } = require('../middleware/auth');

// All checkout routes require authentication
router.use(protect);

// @desc    Process simple checkout (for frontend localStorage cart)
// @route   POST /api/checkout/simple
// @access  Private
router.post('/simple', processSimpleCheckout);

// @desc    Get user's order history
// @route   GET /api/checkout/orders
// @access  Private
router.get('/orders', getOrderHistory);

// @desc    Get specific order details
// @route   GET /api/checkout/orders/:orderNumber
// @access  Private
router.get('/orders/:orderNumber', getOrderDetails);

// @desc    Cancel order
// @route   PATCH /api/checkout/orders/:orderNumber/cancel
// @access  Private
router.patch('/orders/:orderNumber/cancel', cancelOrder);

// @desc    Get checkout information (cart + user details)
// @route   GET /api/checkout/:sessionId
// @access  Private
router.get('/:sessionId', verifySession, getCheckoutInfo);

// @desc    Process checkout and create order
// @route   POST /api/checkout/:sessionId
// @access  Private
router.post('/:sessionId', verifySession, processCheckout);

module.exports = router;