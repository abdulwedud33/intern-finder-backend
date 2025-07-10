const express = require('express');
const appController = require('../controllers/appController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply to Listing
router.post('/:id/apply', authMiddleware, appController.applyToListing);
// Mark Application as Completed
router.patch('/:id/complete', authMiddleware, appController.completeApplication);

module.exports = router;
