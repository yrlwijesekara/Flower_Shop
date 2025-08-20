const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// Protected routes (require authentication)
router.use(protect);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', getMe);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', updateProfile);

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', updatePassword);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', logout);

module.exports = router;