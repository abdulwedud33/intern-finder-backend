const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Submit Feedback
router.post('/', authMiddleware, feedbackController.submitFeedback);

module.exports = router;
