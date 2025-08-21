const express = require('express');
const router = express.Router();
const {
  getOrderHistory,
  getOrderDetails,
  cancelOrder
} = require('../controllers/checkoutController');
const { protect } = require('../middleware/auth');

// All order routes require authentication
router.use(protect);

// @desc    Get user's order history
// @route   GET /api/orders
// @access  Private
router.get('/', getOrderHistory);

// @desc    Get specific order details
// @route   GET /api/orders/:orderNumber
// @access  Private
router.get('/:orderNumber', getOrderDetails);

// @desc    Cancel order
// @route   PATCH /api/orders/:orderNumber/cancel
// @access  Private
router.patch('/:orderNumber/cancel', cancelOrder);

module.exports = router;