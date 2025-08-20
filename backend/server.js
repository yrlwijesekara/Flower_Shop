const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Custom middleware
app.use(logger);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Flower Shop API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION || 'v1'
  });
});

// API Routes
app.use('/api/products', require('./routes/productRoutes'));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Flower Shop API',
    documentation: '/api/docs',
    health: '/health',
    version: process.env.API_VERSION || 'v1'
  });
});

// API Documentation route (basic info)
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Flower Shop API Documentation',
    version: process.env.API_VERSION || 'v1',
    endpoints: {
      products: {
        'GET /api/products': 'Get all products with filtering, sorting, and pagination',
        'GET /api/products/:id': 'Get single product by ID',
        'POST /api/products': 'Create new product',
        'PUT /api/products/:id': 'Update product',
        'DELETE /api/products/:id': 'Delete product',
        'GET /api/products/featured': 'Get featured products',
        'GET /api/products/bestsellers': 'Get bestseller products',
        'GET /api/products/recent': 'Get recent products',
        'GET /api/products/category/:category': 'Get products by category',
        'GET /api/products/search/:query': 'Search products',
        'PATCH /api/products/:id/stock': 'Update product stock status',
        'PATCH /api/products/bulk-update': 'Bulk update products'
      }
    },
    queryParameters: {
      products: {
        category: 'Filter by category (e.g., Pothos, Aloe Vera, Cactus)',
        filterCategory: 'Filter by filter category (houseplants, valentine, wedding)',
        tab: 'Filter by tab (recent, popular, special)',
        featured: 'Filter featured products (true/false)',
        bestseller: 'Filter bestseller products (true/false)',
        inStock: 'Filter by stock status (true/false)',
        search: 'Search query',
        minPrice: 'Minimum price filter',
        maxPrice: 'Maximum price filter',
        sortBy: 'Sort field (name, price, createdAt, etc.)',
        sortOrder: 'Sort order (asc/desc)',
        page: 'Page number for pagination',
        limit: 'Items per page'
      }
    },
    examples: {
      'Get all products': 'GET /api/products',
      'Get featured products': 'GET /api/products?featured=true',
      'Get products by category': 'GET /api/products?category=Pothos',
      'Search products': 'GET /api/products?search=snake plant',
      'Get paginated results': 'GET /api/products?page=1&limit=10',
      'Get products sorted by price': 'GET /api/products?sortBy=price&sortOrder=asc'
    }
  });
});

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      health: '/health',
      documentation: '/api/docs',
      products: '/api/products'
    }
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🌸 =============================================== 🌸
🌿     Flower Shop API Server Started!          🌿
🌸 =============================================== 🌸
🚀 Server running in ${process.env.NODE_ENV} mode
🌐 Server URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api/docs
💚 Health Check: http://localhost:${PORT}/health
📦 Products API: http://localhost:${PORT}/api/products
🌸 =============================================== 🌸
  `.green.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.log(`❌ Uncaught Exception: ${err.message}`.red.bold);
  console.log(`🔍 Origin: ${origin}`.red);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...'.yellow);
  server.close(() => {
    console.log('✅ Process terminated'.green);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...'.yellow);
  server.close(() => {
    console.log('✅ Process terminated'.green);
    process.exit(0);
  });
});

module.exports = app;