const express = require('express');
const router = express.Router();
const {
  getAllOtherProducts
} = require('../controllers/otherProductController');

// @desc    Get all active other products
// @route   GET /api/other-products
// @access  Public
router.get('/', getAllOtherProducts);

module.exports = router;