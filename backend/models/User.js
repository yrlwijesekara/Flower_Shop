const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'United States'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness for non-null values
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  verificationExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate session ID for user when they login (after user is saved)
userSchema.methods.generateSessionId = function() {
  this.sessionId = `user_${this._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return this.sessionId;
};

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role,
      sessionId: this.sessionId
    },
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email verification token
userSchema.methods.getVerificationToken = function() {
  // Generate token
  const verificationToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to verificationToken field
  this.verificationToken = require('crypto')
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire time (24 hours)
  this.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ sessionId: 1 });
userSchema.index({ resetPasswordToken: 1 });
userSchema.index({ verificationToken: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;