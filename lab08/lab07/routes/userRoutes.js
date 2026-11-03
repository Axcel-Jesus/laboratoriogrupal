const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.get('/perfil', authMiddleware.requireAuth, authController.getProfile);

module.exports = router;
