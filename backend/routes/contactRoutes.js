const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', submitContactForm);

// Admin routes
router.get('/admin', protect, authorize('admin'), getAllContacts);
router.get('/admin/:id', protect, authorize('admin'), getContactById);
router.put('/admin/:id/status', protect, authorize('admin'), updateContactStatus);
router.delete('/admin/:id', protect, authorize('admin'), deleteContact);

module.exports = router;