const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadResume,
  getUserResumes,
  getResume,
  deleteResume,
  setCurrentResume
} = require('../controllers/resumeController');

// All routes require authentication
router.use(authMiddleware);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getUserResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);
router.put('/:id/set-current', setCurrentResume);

module.exports = router;
