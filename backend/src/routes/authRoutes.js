const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  googleLogin
} = require('../controllers/authController');

// Middleware to check validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.array()[0].msg,
        errors: errors.array()
      }
    });
  }
  next();
};


const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', validateRegister, handleValidation, register);
router.post('/login', validateLogin, handleValidation, login);
router.post('/google', googleLogin);



// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
