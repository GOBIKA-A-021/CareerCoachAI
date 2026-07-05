const { Resume, User } = require('../models');
const ResumeParser = require('../services/resumeParser');
const CareerAgent = require('../ai-agent/agent');

// ── Upload resume ─────────────────────────────────────────────────────────────
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No file uploaded' }
      });
    }

    const userId = req.user._id;
    const { targetRole = '', targetCompany = '' } = req.body;

    // Persist target preferences on the User document
    if (targetRole || targetCompany) {
      const updates = {};
      if (targetRole)   updates.targetRole      = targetRole;
      if (targetCompany) updates.targetCompanies = [targetCompany];
      await User.findByIdAndUpdate(userId, { $set: updates });
    }

    // Parse resume text
    const parser = new ResumeParser();
    const parsedContent = await parser.parseResume(req.file.path);

    // Mark all previous resumes as not current
    await Resume.updateMany({ userId, isCurrent: true }, { isCurrent: false });

    // Save resume with targetRole + targetCompany fields
    const resume = new Resume({
      userId,
      fileName:      req.file.filename,
      fileUrl:       `/uploads/${req.file.filename}`,
      fileSize:      req.file.size,
      targetRole,
      targetCompany,
      parsedContent,
      analysisStatus: 'pending'
    });

    await resume.save();

    // Fire-and-forget AI analysis
    CareerAgent.processResume(resume._id, targetRole, targetCompany).catch(err => {
      console.error('AI Agent error:', err.message);
    });

    res.status(201).json({
      success: true,
      data: {
        resumeId:       resume._id,
        fileName:       resume.fileName,
        targetRole:     resume.targetRole,
        parsedContent:  resume.parsedContent,
        analysisStatus: resume.analysisStatus
      },
      message: 'Resume uploaded and parsing started'
    });
  } catch (error) {
    console.error('[uploadResume] FULL ERROR:', error.message);
    console.error('[uploadResume] Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
      }
    });
  }
};

// ── Get all resumes for the logged-in user ────────────────────────────────────
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { resumes } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// ── Get single resume ─────────────────────────────────────────────────────────
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESUME_NOT_FOUND', message: 'Resume not found' }
      });
    }
    res.json({ success: true, data: { resume } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// ── Delete resume ─────────────────────────────────────────────────────────────
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESUME_NOT_FOUND', message: 'Resume not found' }
      });
    }

    // Remove the file from disk
    const fs   = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), resume.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// ── Set a resume as current ───────────────────────────────────────────────────
const setCurrentResume = async (req, res) => {
  try {
    const userId = req.user._id;

    await Resume.updateMany({ userId }, { isCurrent: false });

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isCurrent: true },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESUME_NOT_FOUND', message: 'Resume not found' }
      });
    }

    res.json({ success: true, data: { resume }, message: 'Current resume updated' });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

module.exports = { uploadResume, getUserResumes, getResume, deleteResume, setCurrentResume };
