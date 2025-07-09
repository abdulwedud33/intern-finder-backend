const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register Interns
router.post('/register/intern', authController.registerIntern);

// Register Clients
router.post('/register/client', authController.registerClient);

module.exports = router;
