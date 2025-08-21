const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and string/number
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Snapshot of product details at time of order
  productSnapshot: {
    name: String,
    image: String,
    category: String,
    description: String
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  street: {
    type: String,
    required: [true, 'Street address is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'United States'
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: false // Let pre-save hook generate it
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  sessionId: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: {
    type: shippingAddressSchema,
    required: false // Can be same as shipping
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'cod'],
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  paymentIntentId: String, // For Stripe payment intent
  refundReason: String,
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    this.orderNumber = `FS${year}${month}${day}${random}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus') && !this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date()
    });
  }
  next();
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totalAmount = this.subtotal + this.shippingCost + this.tax - this.discount;
  }
  next();
});

// Instance method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note
  });
  return this.save();
};

// Instance method to calculate shipping cost
orderSchema.methods.calculateShipping = function() {
  // Free shipping over $100
  if (this.subtotal >= 100) {
    this.shippingCost = 0;
  } else {
    this.shippingCost = 9.99; // Standard shipping
  }
  return this;
};

// Instance method to calculate tax
orderSchema.methods.calculateTax = function(taxRate = 0.08) {
  this.tax = Math.round((this.subtotal + this.shippingCost) * taxRate * 100) / 100;
  return this;
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ orderStatus: status }).sort({ createdAt: -1 });
};

// Create indexes for better performance
orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ sessionId: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;