const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Private routes (require user authentication)
router.route('/')
  .get(getWishlist); // GET /api/wishlist - Get user's wishlist

router.route('/add')
  .post(addToWishlist); // POST /api/wishlist/add - Add product to wishlist

router.route('/remove')
  .delete(removeFromWishlist); // DELETE /api/wishlist/remove - Remove product from wishlist

router.route('/toggle')
  .post(toggleWishlist); // POST /api/wishlist/toggle - Toggle product in wishlist

router.route('/clear')
  .delete(clearWishlist); // DELETE /api/wishlist/clear - Clear entire wishlist

router.route('/check/:productId')
  .get(checkWishlistStatus); // GET /api/wishlist/check/:productId - Check if product is in wishlist

module.exports = router;