const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get dashboard analytics data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin only)
const getDashboardAnalytics = async (req, res) => {
  try {
    // Get current date and calculate date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Parallel data fetching for better performance
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      totalReviews,
      todayOrders,
      monthlyOrders,
      yearlyOrders,
      salesStats,
      recentOrders,
      orderStatusStats,
      monthlyRevenue
    ] = await Promise.all([
      // Total counts
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Review.countDocuments(),
      
      // Today's orders
      Order.countDocuments({ 
        createdAt: { $gte: startOfToday } 
      }),
      
      // This month's orders
      Order.countDocuments({ 
        createdAt: { $gte: startOfMonth } 
      }),
      
      // This year's orders
      Order.countDocuments({ 
        createdAt: { $gte: startOfYear } 
      }),
      
      // Sales statistics
      Order.aggregate([
        {
          $match: {
            paymentStatus: { $in: ['paid', 'partial_refund'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            totalOrders: { $sum: 1 }
          }
        }
      ]),
      
      // Recent orders (last 10)
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email')
        .select('orderNumber totalAmount orderStatus createdAt userId'),
      
      // Order status distribution
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Monthly revenue for the last 12 months
      Order.aggregate([
        {
          $match: {
            createdAt: { 
              $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) 
            },
            paymentStatus: { $in: ['paid', 'partial_refund'] }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ])
    ]);

    // Process sales statistics
    const salesData = salesStats.length > 0 ? salesStats[0] : {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalOrders: 0
    };

    // Process order status distribution
    const statusDistribution = {};
    orderStatusStats.forEach(status => {
      statusDistribution[status._id] = status.count;
    });

    // Process monthly revenue data for chart
    const monthlyChartData = [];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Fill in the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const monthData = monthlyRevenue.find(
        m => m._id.year === year && m._id.month === month
      );
      
      monthlyChartData.push({
        month: monthNames[month - 1],
        year: year,
        revenue: monthData ? monthData.revenue : 0,
        orders: monthData ? monthData.orders : 0
      });
    }

    // Calculate growth rates
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          paymentStatus: { $in: ['paid', 'partial_refund'] }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyRevenueCurrent = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: { $in: ['paid', 'partial_refund'] }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        // Overview counts
        overview: {
          totalOrders,
          totalProducts,
          totalCustomers,
          totalReviews,
          todayOrders,
          monthlyOrders,
          yearlyOrders
        },
        
        // Financial data
        sales: {
          totalRevenue: Math.round(salesData.totalRevenue * 100) / 100,
          averageOrderValue: Math.round(salesData.averageOrderValue * 100) / 100,
          todayRevenue: todayRevenue.length > 0 ? Math.round(todayRevenue[0].revenue * 100) / 100 : 0,
          monthlyRevenue: monthlyRevenueCurrent.length > 0 ? Math.round(monthlyRevenueCurrent[0].revenue * 100) / 100 : 0
        },
        
        // Chart data
        chartData: {
          monthlyRevenue: monthlyChartData
        },
        
        // Order status distribution
        orderStatus: statusDistribution,
        
        // Recent activity
        recentOrders: recentOrders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.userId?.name || 'Guest',
          customerEmail: order.userId?.email || 'N/A',
          amount: order.totalAmount,
          status: order.orderStatus,
          date: order.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard analytics'
    });
  }
};

// @desc    Get sales analytics for specific period
// @route   GET /api/analytics/sales?period=7d|30d|90d|1y
// @access  Private (Admin only)
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const now = new Date();
    
    let startDate;
    let groupBy;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '90d':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: { $in: ['paid', 'partial_refund'] }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        salesData: salesData.map(item => ({
          ...item,
          revenue: Math.round(item.revenue * 100) / 100,
          averageOrderValue: Math.round(item.averageOrderValue * 100) / 100
        }))
      }
    });

  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales analytics'
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getSalesAnalytics
};