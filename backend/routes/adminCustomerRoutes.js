const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerStats,
  deleteCustomer
} = require('../controllers/adminCustomerController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);

// @desc    Get all customers with filtering and pagination
// @route   GET /api/admin/customers
// @access  Private (Admin only)
router.get('/', authorize('admin'), getAllCustomers);

// @desc    Get customer statistics
// @route   GET /api/admin/customers/stats
// @access  Private (Admin only)
router.get('/stats', authorize('admin'), getCustomerStats);

// @desc    Get single customer by ID
// @route   GET /api/admin/customers/:id
// @access  Private (Admin only)
router.get('/:id', authorize('admin'), getCustomerById);

// @desc    Update customer status (verify/unverify)
// @route   PUT /api/admin/customers/:id/status
// @access  Private (Admin only)
router.put('/:id/status', authorize('admin'), updateCustomerStatus);

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), deleteCustomer);

module.exports = router;