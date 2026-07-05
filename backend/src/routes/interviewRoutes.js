const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  generateQuestions,
  getUserQuestions,
  getQuestions
} = require('../controllers/interviewController');

// All routes require authentication
router.use(authMiddleware);

router.post('/', generateQuestions);
router.get('/', getUserQuestions);
router.get('/:id', getQuestions);

module.exports = router;
