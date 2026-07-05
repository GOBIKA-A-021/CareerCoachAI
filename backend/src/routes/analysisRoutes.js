const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  performATSAnalysis,
  performSkillGapAnalysis,
  calculatePlacementScore,
  performComprehensiveAnalysis,
  getAnalysis,
  getUserAnalyses
} = require('../controllers/analysisController');

// All routes require authentication
router.use(authMiddleware);

router.post('/ats', performATSAnalysis);
router.post('/skill-gap', performSkillGapAnalysis);
router.post('/placement-score', calculatePlacementScore);
router.post('/comprehensive', performComprehensiveAnalysis);
router.get('/:id', getAnalysis);
router.get('/', getUserAnalyses);

module.exports = router;
