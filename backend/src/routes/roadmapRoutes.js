const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmap,
  updateRoadmapProgress
} = require('../controllers/roadmapController');

// All routes require authentication
router.use(authMiddleware);

router.post('/', generateRoadmap);
router.get('/', getUserRoadmaps);
router.get('/:id', getRoadmap);
router.put('/:id/progress', updateRoadmapProgress);

module.exports = router;
