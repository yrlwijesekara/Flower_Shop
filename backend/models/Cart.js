const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  // Store product details at time of adding to cart
  productSnapshot: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true
    // Note: unique: true automatically creates an index, no need for index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // For guest users
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  totalItems: {
    type: Number,
    default: 0,
    min: [0, 'Total items cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  } else {
    this.totalItems = 0;
    this.totalAmount = 0;
  }
  next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = function(productData, quantity = 1) {
  const existingItemIndex = this.items.findIndex(
    item => item.productId.toString() === productData._id.toString()
  );

  if (existingItemIndex !== -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      productId: productData._id,
      quantity: quantity,
      price: productData.price,
      productSnapshot: {
        name: productData.name,
        image: productData.image,
        category: productData.category
      }
    });
  }

  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const itemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (itemIndex !== -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.productId.toString() !== productId.toString()
  );
  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Static method to find or create cart by session ID
cartSchema.statics.findOrCreateBySession = async function(sessionId, userId = null) {
  let cart = await this.findOne({ sessionId }).populate('items.productId');
  
  if (!cart) {
    cart = new this({
      sessionId,
      userId,
      items: []
    });
    await cart.save();
  }
  
  return cart;
};

// Static method to cleanup expired carts
cartSchema.statics.cleanupExpiredCarts = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { status: 'expired' },
      { updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    ]
  });
  return result;
};

// Create indexes for better performance
// Note: sessionId already has unique index from schema definition
// Note: expiresAt already has TTL index from schema definition
cartSchema.index({ userId: 1 });
cartSchema.index({ status: 1 });
cartSchema.index({ updatedAt: 1 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;