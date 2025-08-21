const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  updateReviewHelpful,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

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

module.exports = router;