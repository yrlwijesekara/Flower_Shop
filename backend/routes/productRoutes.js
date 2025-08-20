const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestsellerProducts,
  getRecentProducts,
  getProductsByCategory,
  searchProducts,
  updateProductStock,
  bulkUpdateProducts
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.route('/')
  .get(getProducts)        // GET /api/products - Get all products with filtering
  .post(createProduct);    // POST /api/products - Create new product

router.route('/featured')
  .get(getFeaturedProducts); // GET /api/products/featured - Get featured products

router.route('/bestsellers')
  .get(getBestsellerProducts); // GET /api/products/bestsellers - Get bestseller products

router.route('/recent')
  .get(getRecentProducts); // GET /api/products/recent - Get recent products

router.route('/search/:query')
  .get(searchProducts); // GET /api/products/search/:query - Search products

router.route('/category/:category')
  .get(getProductsByCategory); // GET /api/products/category/:category - Get products by category

// Admin routes (these would typically require authentication middleware)
router.route('/bulk-update')
  .patch(bulkUpdateProducts); // PATCH /api/products/bulk-update - Bulk update products

router.route('/:id')
  .get(getProduct)         // GET /api/products/:id - Get single product
  .put(updateProduct)      // PUT /api/products/:id - Update product
  .delete(deleteProduct);  // DELETE /api/products/:id - Delete product

router.route('/:id/stock')
  .patch(updateProductStock); // PATCH /api/products/:id/stock - Update product stock status

module.exports = router;