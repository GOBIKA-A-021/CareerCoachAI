const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  generateReport,
  getUserReports,
  downloadReport
} = require('../controllers/reportController');

// All routes require authentication
router.use(authMiddleware);

router.post('/', generateReport);
router.get('/', getUserReports);
router.get('/:id/download', downloadReport);

module.exports = router;
