const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get checkout information (cart + user details)
// @route   GET /api/checkout/:sessionId
// @access  Private (logged in users only)
const getCheckoutInfo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Get cart with populated product details
    const cart = await Cart.findOne({ sessionId })
      .populate('items.productId', 'name price image category inStock quantity');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add items before checkout.'
      });
    }

    // Check if all items are still in stock
    const unavailableItems = [];
    for (const item of cart.items) {
      if (!item.productId || !item.productId.inStock) {
        unavailableItems.push(item.productSnapshot.name || 'Unknown product');
      }
    }

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some items are no longer available',
        unavailableItems
      });
    }

    // Get user details for pre-filling form
    const user = await User.findById(userId).select('-password');

    // Calculate totals
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
    const tax = Math.round((subtotal + shippingCost) * 0.08 * 100) / 100; // 8% tax
    const total = subtotal + shippingCost + tax;

    res.status(200).json({
      success: true,
      data: {
        cart,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address
        },
        pricing: {
          subtotal,
          shippingCost,
          tax,
          total
        }
      }
    });

  } catch (error) {
    console.error('Error in getCheckoutInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Process checkout and create order
// @route   POST /api/checkout/:sessionId
// @access  Private (logged in users only)
const processCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      sameAsBilling = false
    } = req.body;

    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Get cart with populated product details
    const cart = await Cart.findOne({ sessionId })
      .populate('items.productId', 'name price image category inStock quantity description');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot process checkout.'
      });
    }

    // Final stock check
    const unavailableItems = [];
    for (const item of cart.items) {
      if (!item.productId || !item.productId.inStock) {
        unavailableItems.push(item.productSnapshot.name || 'Unknown product');
      }
    }

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some items are no longer available',
        unavailableItems
      });
    }

    // Prepare order items with product snapshots
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price,
      productSnapshot: {
        name: item.productId.name,
        image: item.productId.image,
        category: item.productId.category,
        description: item.productId.description
      }
    }));

    // Calculate totals
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal >= 100 ? 0 : 9.99;
    const tax = Math.round((subtotal + shippingCost) * 0.08 * 100) / 100;
    const totalAmount = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      userId,
      sessionId,
      items: orderItems,
      shippingAddress,
      billingAddress: sameAsBilling ? shippingAddress : billingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order created'
      }]
    });

    await order.save();

    // Clear the cart after successful order creation
    await cart.clearCart();

    // Update cart status to converted
    cart.status = 'converted';
    await cart.save();

    // In a real application, you would integrate with a payment processor here
    // For now, we'll just mark the payment as pending

    res.status(201).json({
      success: true,
      message: 'Order created successfully! You will receive a confirmation email shortly.',
      data: {
        order: {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.orderStatus,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      }
    });

  } catch (error) {
    console.error('Error in processCheckout:', error);
    
    // Handle validation errors
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

// @desc    Get user's order history
// @route   GET /api/checkout/orders
// @access  Private (logged in users only)
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.productId', 'name image category');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error in getOrderHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get specific order details
// @route   GET /api/checkout/orders/:orderNumber
// @access  Private (logged in users only)
const getOrderDetails = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ 
      orderNumber, 
      userId 
    }).populate('items.productId', 'name image category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Cancel order (only if status is pending or confirmed)
// @route   PATCH /api/checkout/orders/:orderNumber/cancel
// @access  Private (logged in users only)
const cancelOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user._id;
    const { reason } = req.body;

    const order = await Order.findOne({ 
      orderNumber, 
      userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    await order.updateStatus('cancelled', reason || 'Cancelled by customer');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Error in cancelOrder:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Process simple checkout (for frontend localStorage cart)
// @route   POST /api/checkout/simple
// @access  Private (logged in users only)
const processSimpleCheckout = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      firstName,
      lastName,
      streetAddress,
      apartment,
      townCity,
      state,
      postcode,
      country,
      phoneNumber,
      emailAddress,
      cartItems,
      paymentMethod = 'cod'
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !streetAddress || !townCity || !state || !postcode || !country || !phoneNumber || !emailAddress) {
      console.log('Missing required fields:', {
        firstName: !!firstName,
        lastName: !!lastName,
        streetAddress: !!streetAddress,
        townCity: !!townCity,
        state: !!state,
        postcode: !!postcode,
        country: !!country,
        phoneNumber: !!phoneNumber,
        emailAddress: !!emailAddress
      });
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot process checkout.'
      });
    }

    // Convert cart items to order format
    const orderItems = cartItems.map(item => ({
      productId: String(item.id || item.productId), // Convert to string for ObjectId
      quantity: item.quantity,
      price: item.price,
      productSnapshot: {
        name: item.name,
        image: item.image,
        category: item.category || 'Product'
      }
    }));

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = 250; // Fixed shipping cost from frontend
    const tax = Math.round(subtotal * 0.1 * 100) / 100; // 10% tax
    const totalAmount = subtotal + shippingCost + tax;

    // Create shipping address object
    const shippingAddress = {
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      street: apartment ? `${streetAddress.trim()}, ${apartment.trim()}` : streetAddress.trim(),
      city: townCity.trim(),
      state: state.trim(),
      zipCode: postcode.trim(),
      country: country.trim(),
      phone: phoneNumber.trim()
    };

    console.log('Created shipping address:', shippingAddress);

    // Create order
    const orderData = {
      userId,
      sessionId: `frontend_${userId}_${Date.now()}`,
      items: orderItems,
      shippingAddress,
      billingAddress: shippingAddress,
      paymentMethod: paymentMethod === 'online' ? 'credit_card' : 'cod',
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order created from frontend checkout'
      }]
    };

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

    const order = new Order(orderData);
    
    // Validate the order before saving to get specific error
    const validationError = order.validateSync();
    if (validationError) {
      console.error('Order validation failed:', validationError);
      throw validationError;
    }
    
    await order.save();
    
    console.log('Order saved successfully:', order.orderNumber);

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: {
        order: {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.orderStatus,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          shippingAddress: order.shippingAddress
        }
      }
    });

  } catch (error) {
    console.error('Error in processSimpleCheckout:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => {
        console.error(`Validation error for ${err.path}: ${err.message}`);
        return `${err.path}: ${err.message}`;
      });
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

module.exports = {
  getCheckoutInfo,
  processCheckout,
  processSimpleCheckout,
  getOrderHistory,
  getOrderDetails,
  cancelOrder
};