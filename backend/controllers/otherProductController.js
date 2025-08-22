const OtherProduct = require('../models/OtherProduct');

// @desc    Get all other products
// @route   GET /api/other-products
// @access  Public
const getAllOtherProducts = async (req, res) => {
  try {
    const products = await OtherProduct.getActiveProducts();
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching other products:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all other products for admin (including inactive)
// @route   GET /api/admin/other-products
// @access  Private (Admin only)
const getAdminOtherProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination (exclude large image field for listing)
    const products = await OtherProduct.find(query)
      .select('-__v') // Exclude version field
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .allowDiskUse(true);
    
    const total = await OtherProduct.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin other products:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single other product by ID
// @route   GET /api/admin/other-products/:id
// @access  Private (Admin only)
const getOtherProductById = async (req, res) => {
  try {
    const product = await OtherProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Other product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching other product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new other product
// @route   POST /api/admin/other-products
// @access  Private (Admin only)
const createOtherProduct = async (req, res) => {
  try {
    const { name, price, rating, image, description, category, isActive, sortOrder } = req.body;
    
    const product = await OtherProduct.create({
      name,
      price,
      rating,
      image,
      description,
      category,
      isActive,
      sortOrder
    });
    
    res.status(201).json({
      success: true,
      message: 'Other product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating other product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update other product
// @route   PUT /api/admin/other-products/:id
// @access  Private (Admin only)
const updateOtherProduct = async (req, res) => {
  try {
    const { name, price, rating, image, description, category, isActive, sortOrder } = req.body;
    
    const product = await OtherProduct.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        rating,
        image,
        description,
        category,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Other product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Other product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating other product:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete other product
// @route   DELETE /api/admin/other-products/:id
// @access  Private (Admin only)
const deleteOtherProduct = async (req, res) => {
  try {
    const product = await OtherProduct.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Other product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Other product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting other product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle other product active status
// @route   PUT /api/admin/other-products/:id/toggle-status
// @access  Private (Admin only)
const toggleOtherProductStatus = async (req, res) => {
  try {
    const product = await OtherProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Other product not found'
      });
    }
    
    product.isActive = !product.isActive;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: `Other product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product
    });
  } catch (error) {
    console.error('Error toggling other product status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllOtherProducts,
  getAdminOtherProducts,
  getOtherProductById,
  createOtherProduct,
  updateOtherProduct,
  deleteOtherProduct,
  toggleOtherProductStatus
};