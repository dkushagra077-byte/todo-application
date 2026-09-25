const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');

// Public routes
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

// Protected route
router.get('/me', authMiddleware, AuthController.getCurrentUser);

module.exports = router;
