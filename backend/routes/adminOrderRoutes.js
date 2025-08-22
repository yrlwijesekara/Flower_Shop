const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  deleteOrder
} = require('../controllers/adminOrderController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);

// @desc    Get all orders with filtering and pagination
// @route   GET /api/admin/orders
// @access  Private (Admin with manage_orders permission)
router.get('/', authorize('admin'), getAllOrders);

// @desc    Get order statistics
// @route   GET /api/admin/orders/stats
// @access  Private (Admin with view_analytics permission)
router.get('/stats', authorize('admin'), getOrderStats);

// @desc    Get single order by ID
// @route   GET /api/admin/orders/:id
// @access  Private (Admin with manage_orders permission)
router.get('/:id', authorize('admin'), getOrderById);

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin with manage_orders permission)
router.put('/:id/status', authorize('admin'), updateOrderStatus);

// @desc    Update payment status
// @route   PUT /api/admin/orders/:id/payment
// @access  Private (Admin with manage_orders permission)
router.put('/:id/payment', authorize('admin'), updatePaymentStatus);

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin with manage_orders permission)
router.delete('/:id', authorize('admin'), deleteOrder);

// Test route to verify delete functionality
router.get('/test-delete/:id', authorize('admin'), (req, res) => {
  res.json({ 
    success: true, 
    message: 'Delete route is accessible',
    id: req.params.id,
    method: 'GET (test)'
  });
});

module.exports = router;