const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getAnalytics,
  getSystemHealth
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/analytics', getAnalytics);
router.get('/health', getSystemHealth);

module.exports = router;
