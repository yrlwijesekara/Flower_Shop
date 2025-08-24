const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.'
        });
      }

      // Check if user is verified (optional - you can remove this if not needed)
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email before proceeding.'
        });
      }

      // Add user to request object
      req.user = user;
      next();

    } catch (error) {
      console.error('Auth middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Please login again.'
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication required.'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.isVerified) {
        // Add user to request object if valid
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

// Admin role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized for this action.`
      });
    }

    next();
  };
};

// Check if user owns the resource or is admin
const ownerOrAdmin = (resourceUserField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.body[resourceUserField] || req.params[resourceUserField] || req.query[resourceUserField];
    
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

// Verify user session (additional security layer)
const verifySession = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    // Check if the user's session is still valid
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser || currentUser.sessionId !== req.user.sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.'
      });
    }

    next();
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Session verification failed'
    });
  }
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
  ownerOrAdmin,
  verifySession
};