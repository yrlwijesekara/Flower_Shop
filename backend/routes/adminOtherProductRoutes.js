const express = require('express');
const router = express.Router();
const {
  getAdminOtherProducts,
  getOtherProductById,
  createOtherProduct,
  updateOtherProduct,
  deleteOtherProduct,
  toggleOtherProductStatus
} = require('../controllers/otherProductController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);

// @desc    Get all other products for admin
// @route   GET /api/admin/other-products
// @access  Private (Admin only)
router.get('/', authorize('admin'), getAdminOtherProducts);

// @desc    Get single other product by ID
// @route   GET /api/admin/other-products/:id
// @access  Private (Admin only)
router.get('/:id', authorize('admin'), getOtherProductById);

// @desc    Create new other product
// @route   POST /api/admin/other-products
// @access  Private (Admin only)
router.post('/', authorize('admin'), createOtherProduct);

// @desc    Update other product
// @route   PUT /api/admin/other-products/:id
// @access  Private (Admin only)
router.put('/:id', authorize('admin'), updateOtherProduct);

// @desc    Delete other product
// @route   DELETE /api/admin/other-products/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), deleteOtherProduct);

// @desc    Toggle other product active status
// @route   PUT /api/admin/other-products/:id/toggle-status
// @access  Private (Admin only)
router.put('/:id/toggle-status', authorize('admin'), toggleOtherProductStatus);

module.exports = router;