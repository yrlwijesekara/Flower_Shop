const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getSalesAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics data (counts, sales, charts)
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), getDashboardAnalytics);

// @route   GET /api/analytics/sales
// @desc    Get sales analytics for specific period
// @access  Private (Admin only)
router.get('/sales', protect, authorize('admin'), getSalesAnalytics);

module.exports = router;