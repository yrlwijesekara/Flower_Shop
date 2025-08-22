const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  // User identification using authenticated user ID
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Array of product IDs in wishlist
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    // Store some product info for quick access
    productInfo: {
      name: String,
      price: Number,
      image: String,
      category: String
    }
  }],
  
  // Metadata
  totalItems: {
    type: Number,
    default: 0
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'products.productId': 1 });
wishlistSchema.index({ userId: 1, 'products.productId': 1 });

// Update totalItems and lastModified before saving
wishlistSchema.pre('save', function(next) {
  this.totalItems = this.products.length;
  this.lastModified = new Date();
  next();
});

// Static method to find wishlist by user ID
wishlistSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId }).populate('products.productId');
};

// Static method to add product to wishlist
wishlistSchema.statics.addToWishlist = async function(userId, productId, productInfo = {}) {
  let retries = 3;
  
  while (retries > 0) {
    try {
      let wishlist = await this.findOne({ userId });
      
      if (!wishlist) {
        wishlist = new this({ userId, products: [] });
      }
      
      // Check if product already exists
      const existingProductIndex = wishlist.products.findIndex(
        item => item.productId.toString() === productId.toString()
      );
      
      if (existingProductIndex === -1) {
        wishlist.products.push({
          productId,
          productInfo,
          addedAt: new Date()
        });
        await wishlist.save();
      }
      
      return wishlist;
    } catch (error) {
      if (error.name === 'VersionError' && retries > 1) {
        retries--;
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      throw error;
    }
  }
};

// Static method to remove product from wishlist
wishlistSchema.statics.removeFromWishlist = async function(userId, productId) {
  let retries = 3;
  
  while (retries > 0) {
    try {
      const wishlist = await this.findOne({ userId });
      
      if (wishlist) {
        wishlist.products = wishlist.products.filter(
          item => item.productId.toString() !== productId.toString()
        );
        await wishlist.save();
      }
      
      return wishlist;
    } catch (error) {
      if (error.name === 'VersionError' && retries > 1) {
        retries--;
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      throw error;
    }
  }
};

// Static method to clear entire wishlist
wishlistSchema.statics.clearWishlist = async function(userId) {
  const wishlist = await this.findOne({ userId });
  
  if (wishlist) {
    wishlist.products = [];
    await wishlist.save();
  }
  
  return wishlist;
};

// Instance method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.products.some(item => item.productId.toString() === productId.toString());
};

// Instance method to get product IDs array
wishlistSchema.methods.getProductIds = function() {
  return this.products.map(item => item.productId.toString());
};

module.exports = mongoose.model('Wishlist', wishlistSchema);