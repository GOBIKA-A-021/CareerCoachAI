const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  updatePassword,
  getSettings,
  updateSettings
} = require('../controllers/userController');

// All routes require authentication
router.use(authMiddleware);

router.put('/password', updatePassword);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
