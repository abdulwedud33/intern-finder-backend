const express = require('express');
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Create Listing
router.post('/', listingController.createListing);

// Edit Listing
router.put('/:id', listingController.editListing);

// Delete Listing
router.delete('/:id', listingController.deleteListing);

module.exports = router;
