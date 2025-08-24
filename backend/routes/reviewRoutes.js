const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReviewHelpful,
  deleteReview,
  getAllReviews,
  updateReviewApproval,
  deleteReviewAdmin
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/reviews/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/:productId', getProductReviews);

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, createReview);

// @route   PUT /api/reviews/:reviewId/helpful
// @desc    Mark review as helpful
// @access  Public
router.put('/:reviewId/helpful', updateReviewHelpful);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:reviewId', protect, deleteReview);

// Admin routes
// @route   GET /api/reviews/admin/all
// @desc    Get all reviews for admin management
// @access  Private (Admin only)
router.get('/admin/all', protect, authorize('admin'), getAllReviews);

// @route   PUT /api/reviews/admin/:reviewId/approval
// @desc    Update review approval status
// @access  Private (Admin only)
router.put('/admin/:reviewId/approval', protect, authorize('admin'), updateReviewApproval);

// @route   DELETE /api/reviews/admin/:reviewId
// @desc    Delete review (admin)
// @access  Private (Admin only)
router.delete('/admin/:reviewId', protect, authorize('admin'), deleteReviewAdmin);

module.exports = router;