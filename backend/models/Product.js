const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Pothos', 'Aloe Vera', 'Cactus', 'Tropical', 'Indoor Tree', 'Flowering', 'Air Purifying', 'Low Light', 'Wedding Flowers']
  },
  filterCategory: {
    type: String,
    enum: ['houseplants', 'valentine', 'wedding']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Images
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  gallery: [{
    type: String
  }],
  
  // Product Features and Details
  features: [{
    type: String,
    maxlength: [200, 'Feature cannot exceed 200 characters']
  }],
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Product Specifications
  specifications: {
    size: {
      type: String,
      maxlength: [100, 'Size specification cannot exceed 100 characters']
    },
    weight: {
      type: String,
      maxlength: [50, 'Weight specification cannot exceed 50 characters']
    },
    potSize: {
      type: String,
      maxlength: [50, 'Pot size cannot exceed 50 characters']
    },
    height: {
      type: String,
      maxlength: [50, 'Height cannot exceed 50 characters']
    },
    spread: {
      type: String,
      maxlength: [50, 'Spread cannot exceed 50 characters']
    },
    bloomTime: {
      type: String,
      maxlength: [100, 'Bloom time cannot exceed 100 characters']
    },
    hardiness: {
      type: String,
      maxlength: [100, 'Hardiness cannot exceed 100 characters']
    },
    origin: {
      type: String,
      maxlength: [100, 'Origin cannot exceed 100 characters']
    }
  },
  
  // Care Instructions
  careInstructions: {
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging']
    },
    placement: {
      type: String,
      maxlength: [200, 'Placement instructions cannot exceed 200 characters']
    },
    watering: {
      type: String,
      maxlength: [500, 'Watering instructions cannot exceed 500 characters']
    },
    feeding: {
      type: String,
      maxlength: [500, 'Feeding instructions cannot exceed 500 characters']
    },
    pruning: {
      type: String,
      maxlength: [500, 'Pruning instructions cannot exceed 500 characters']
    },
    repotting: {
      type: String,
      maxlength: [500, 'Repotting instructions cannot exceed 500 characters']
    },
    commonIssues: {
      type: String,
      maxlength: [1000, 'Common issues cannot exceed 1000 characters']
    }
  },
  
  // Plant Details
  plantDetails: {
    sunlight: {
      type: String,
      enum: ['Full Sun', 'Partial Sun', 'Bright Indirect Light', 'Medium Light', 'Low Light']
    },
    water: {
      type: String,
      enum: ['Daily', 'Every 2-3 days', 'Weekly', 'Every 2 weeks', 'Monthly', 'When soil is dry']
    },
    soil: {
      type: String,
      enum: ['Well-draining potting mix', 'Cactus/Succulent mix', 'Regular potting soil', 'Orchid bark mix', 'Sandy soil']
    },
    temperature: {
      type: String,
      maxlength: [50, 'Temperature range cannot exceed 50 characters']
    },
    humidity: {
      type: String,
      enum: ['', 'Low (30-40%)', 'Medium (40-60%)', 'High (60-80%)'],
      default: ''
    },
    fertilizer: {
      type: String,
      maxlength: [500, 'Fertilizer information cannot exceed 500 characters']
    },
    repotting: {
      type: String,
      enum: ['', 'Every year', 'Every 2-3 years', 'When rootbound', 'Rarely needed'],
      default: ''
    },
    toxicity: {
      type: String,
      enum: ['Pet Safe', 'Toxic to cats and dogs', 'Toxic to cats', 'Toxic to dogs', 'Mildly toxic']
    }
  },
  
  // Shipping Information
  shipping: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingTime: {
      type: String,
      maxlength: [100, 'Shipping time cannot exceed 100 characters']
    },
    returnPolicy: {
      type: String,
      maxlength: [200, 'Return policy cannot exceed 200 characters']
    },
    packaging: {
      type: String,
      maxlength: [200, 'Packaging info cannot exceed 200 characters']
    }
  },
  
  // Product Status and Metadata
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  
  // Admin/System Fields
  isRecent: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  isUserAdded: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ filterCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for images array (combines main image with gallery)
productSchema.virtual('images').get(function() {
  const images = [this.image];
  if (this.gallery && this.gallery.length > 0) {
    images.push(...this.gallery);
  }
  return images;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Pre-save middleware to handle defaults and validation
productSchema.pre('save', function(next) {
  // Set default values for new products
  if (this.isNew) {
    this.isRecent = true;
    this.reviewCount = 0;
    this.rating = 0;
    if (!this.inStock) this.inStock = true;
  }
  
  next();
});

// Static methods for common queries
productSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, inStock: true });
};

productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, inStock: true }).limit(10);
};

productSchema.statics.findBestsellers = function() {
  return this.find({ bestseller: true, inStock: true }).limit(10);
};

productSchema.statics.findRecent = function() {
  return this.find({ isRecent: true, inStock: true }).sort({ createdAt: -1 }).limit(10);
};

productSchema.statics.searchProducts = function(query) {
  return this.find({
    $text: { $search: query },
    inStock: true
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema);