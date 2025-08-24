const mongoose = require('mongoose');

const otherProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  rating: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  image: {
    type: String,
    required: [true, 'Product image is required'],
    trim: true
  },
  
  description: {
    type: String,
    default: 'Premium quality plant perfect for your home or office. Easy to care for and adds natural beauty to any space.',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
otherProductSchema.index({ isActive: 1, sortOrder: 1 });
otherProductSchema.index({ name: 1 });

// Static method to get active products sorted by sortOrder
otherProductSchema.statics.getActiveProducts = function() {
  return this.find({ isActive: true })
    .select('-__v') // Exclude version field
    .sort({ sortOrder: 1, createdAt: -1 })
    .allowDiskUse(true)
    .lean();
};

module.exports = mongoose.model('OtherProduct', otherProductSchema);