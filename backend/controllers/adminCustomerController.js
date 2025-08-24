const User = require('../models/User');

// @desc    Get all customers for admin
// @route   GET /api/admin/customers
// @access  Private (Admin only)
const getAllCustomers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      verified,
      role = 'user'
    } = req.query;

    // Build query
    const query = { role: role }; // Only get users, not admins
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const customers = await User.find(query)
      .select('-password') // Exclude password field
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await User.countDocuments(query);

    // Calculate summary statistics
    const stats = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          verifiedCustomers: { 
            $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
          },
          unverifiedCustomers: { 
            $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] }
          }
        }
      }
    ]);

    const summary = stats[0] || { 
      totalCustomers: 0, 
      verifiedCustomers: 0, 
      unverifiedCustomers: 0 
    };

    res.status(200).json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCustomers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        },
        summary
      }
    });

  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single customer details for admin
// @route   GET /api/admin/customers/:id
// @access  Private (Admin only)
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id)
      .select('-password')
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (customer.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        customer
      }
    });

  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update customer status (verify/unverify)
// @route   PUT /api/admin/customers/:id/status
// @access  Private (Admin only)
const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isVerified must be a boolean value'
      });
    }

    const customer = await User.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (customer.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify admin accounts'
      });
    }

    customer.isVerified = isVerified;
    await customer.save();

    const updatedCustomer = await User.findById(id)
      .select('-password')
      .lean();

    res.status(200).json({
      success: true,
      message: `Customer ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: {
        customer: updatedCustomer
      }
    });

  } catch (error) {
    console.error('Update customer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get customer statistics
// @route   GET /api/admin/customers/stats
// @access  Private (Admin only)
const getCustomerStats = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalNewCustomers: { $sum: 1 },
          verifiedCustomers: {
            $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
          },
          unverifiedCustomers: {
            $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] }
          }
        }
      }
    ]);

    // Get overall stats
    const overallStats = await User.aggregate([
      {
        $match: { role: 'user' }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalVerified: {
            $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
          },
          totalUnverified: {
            $sum: { $cond: [{ $eq: ['$isVerified', false] }, 1, 0] }
          }
        }
      }
    ]);

    const periodStats = stats[0] || {
      totalNewCustomers: 0,
      verifiedCustomers: 0,
      unverifiedCustomers: 0
    };

    const overall = overallStats[0] || {
      totalCustomers: 0,
      totalVerified: 0,
      totalUnverified: 0
    };

    res.status(200).json({
      success: true,
      data: {
        period: days,
        periodStats,
        overallStats: overall
      }
    });

  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete customer (Admin only)
// @route   DELETE /api/admin/customers/:id
// @access  Private (Admin only)
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the customer first to check if it exists and is a user (not admin)
    const customer = await User.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Prevent deletion of admin users
    if (customer.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Delete the customer
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerStats,
  deleteCustomer
};