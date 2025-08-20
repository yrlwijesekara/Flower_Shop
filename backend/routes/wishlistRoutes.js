const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  checkWishlistStatus,
  generateSession
} = require('../controllers/wishlistController');

const router = express.Router();

// Public routes
router.route('/session')
  .post(generateSession); // POST /api/wishlist/session - Generate new session ID

router.route('/:sessionId')
  .get(getWishlist); // GET /api/wishlist/:sessionId - Get user's wishlist

router.route('/add')
  .post(addToWishlist); // POST /api/wishlist/add - Add product to wishlist

router.route('/remove')
  .delete(removeFromWishlist); // DELETE /api/wishlist/remove - Remove product from wishlist

router.route('/toggle')
  .post(toggleWishlist); // POST /api/wishlist/toggle - Toggle product in wishlist

router.route('/clear')
  .delete(clearWishlist); // DELETE /api/wishlist/clear - Clear entire wishlist

router.route('/check/:sessionId/:productId')
  .get(checkWishlistStatus); // GET /api/wishlist/check/:sessionId/:productId - Check if product is in wishlist

module.exports = router;