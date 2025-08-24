const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let reviews = [];
    let totalReviews = 0;
    let reviewStats = [];

    // Check if productId is a valid ObjectId format
    if (mongoose.Types.ObjectId.isValid(productId) && productId.length === 24) {
      // Handle database products with ObjectId
      const query = { 
        productId: new mongoose.Types.ObjectId(productId), 
        isApproved: true 
      };

      reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email');

      totalReviews = await Review.countDocuments(query);

      // Calculate review statistics
      reviewStats = await Review.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: '$rating' },
            ratingCounts: {
              $push: '$rating'
            }
          }
        }
      ]);
    } else {
      // For fallback data with simple string IDs, return empty results
      // The frontend will display fallback reviews from the product data
      reviews = [];
      totalReviews = 0;
      reviewStats = [];
    }

    let stats = {
      totalReviews: 0,
      averageRating: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (reviewStats.length > 0) {
      const ratingCounts = reviewStats[0].ratingCounts.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      stats = {
        totalReviews: reviewStats[0].totalReviews,
        averageRating: Math.round(reviewStats[0].averageRating * 10) / 10,
        ratingCounts: { ...stats.ratingCounts, ...ratingCounts }
      };
    }

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => ({
          id: review._id,
          userName: review.userName,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          date: review.createdAt,
          formattedDate: review.formattedDate,
          verified: review.verified,
          helpful: review.helpful
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: page * limit < totalReviews,
          hasPrev: page > 1
        },
        stats
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: productId, rating, title, and comment'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Review title must be less than 100 characters'
      });
    }

    if (comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Review comment must be less than 1000 characters'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle productId format for checking existing reviews
    let existingReviewQuery = { userId };
    if (mongoose.Types.ObjectId.isValid(productId) && productId.length === 24) {
      existingReviewQuery.productId = new mongoose.Types.ObjectId(productId);
    } else {
      existingReviewQuery.productId = productId;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne(existingReviewQuery);

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create the review
    const review = new Review({
      productId,
      userId,
      userName: user.name || 'Anonymous User',
      userEmail: user.email,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      verified: false // Set to true if user has purchased the product
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        id: review._id,
        userName: review.userName,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        date: review.createdAt,
        formattedDate: review.formattedDate,
        verified: review.verified
      }
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// @desc    Update review helpful count
// @route   PUT /api/reviews/:reviewId/helpful
// @access  Public
const updateReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: {
        helpful: review.helpful
      }
    });
  } catch (error) {
    console.error('Update review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

// @desc    Delete a review (user's own review only)
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      _id: reviewId,
      userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete this review'
      });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    // Update product rating after deleting review
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const averageRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviewCount: reviewCount
    });
  } catch (error) {
    console.error('Update product rating error:', error);
  }
};

// @desc    Get all reviews for admin (with pagination and filtering)
// @route   GET /api/admin/reviews
// @access  Private (Admin only)
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // 'approved', 'pending', 'rejected'
    const skip = (page - 1) * limit;

    let query = {};
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('productId', 'name images');

    const totalReviews = await Review.countDocuments(query);

    // Get review statistics
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          approvedReviews: {
            $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
          },
          pendingReviews: {
            $sum: { $cond: [{ $eq: ['$isApproved', false] }, 1, 0] }
          },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const reviewStats = stats.length > 0 ? {
      total: stats[0].totalReviews,
      approved: stats[0].approvedReviews,
      pending: stats[0].pendingReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10
    } : {
      total: 0,
      approved: 0,
      pending: 0,
      averageRating: 0
    };

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => ({
          id: review._id,
          userName: review.userName,
          userEmail: review.userEmail,
          productName: review.productId?.name || 'Unknown Product',
          productImage: review.productId?.images?.[0] || null,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          isApproved: review.isApproved,
          helpful: review.helpful,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNext: page * limit < totalReviews,
          hasPrev: page > 1
        },
        stats: reviewStats
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Update review approval status
// @route   PUT /api/admin/reviews/:reviewId/approval
// @access  Private (Admin only)
const updateReviewApproval = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isApproved must be a boolean value'
      });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    ).populate('productId', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update product rating if review was approved
    if (isApproved) {
      await updateProductRating(review.productId._id);
    }

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: {
        id: review._id,
        isApproved: review.isApproved,
        productName: review.productId?.name
      }
    });
  } catch (error) {
    console.error('Update review approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review approval'
    });
  }
};

// @desc    Delete review (admin)
// @route   DELETE /api/admin/reviews/:reviewId
// @access  Private (Admin only)
const deleteReviewAdmin = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    // Update product rating after deleting review
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReviewHelpful,
  deleteReview,
  getAllReviews,
  updateReviewApproval,
  deleteReviewAdmin
};