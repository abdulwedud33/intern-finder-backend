const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register Intern
router.post('/register/intern', authController.registerIntern);

// Register Client
router.post('/register/client', authController.registerClient);

module.exports = router;
