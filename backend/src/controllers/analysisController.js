const { Analysis, Resume } = require('../models');
const ATSService = require('../services/atsService');
const SkillGapService = require('../services/skillGapService');
const PlacementService = require('../services/placementService');
const CareerAgent = require('../ai-agent/agent');

// Perform ATS analysis
const performATSAnalysis = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESUME_NOT_FOUND',
          message: 'Resume not found'
        }
      });
    }

    // Perform ATS analysis
    const atsService = new ATSService();
    const atsScore = await atsService.analyzeResume(
      resume.parsedContent,
      targetRole
    );

    // Save analysis
    const analysis = new Analysis({
      userId: req.user._id,
      resumeId,
      targetRole,
      analysisType: 'ats',
      results: {
        atsScore
      },
      recommendations: atsScore.recommendations || []
    });

    await analysis.save();

    // Update resume analysis status
    resume.analysisStatus = 'completed';
    await resume.save();

    res.json({
      success: true,
      data: {
        analysisId: analysis._id,
        atsScore
      },
      message: 'ATS analysis completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Perform skill gap analysis
const performSkillGapAnalysis = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESUME_NOT_FOUND',
          message: 'Resume not found'
        }
      });
    }

    // Perform skill gap analysis
    const skillGapService = new SkillGapService();
    const skillGap = await skillGapService.analyzeSkillGap(
      resume.parsedContent.skills,
      targetRole
    );

    // Save analysis
    const analysis = new Analysis({
      userId: req.user._id,
      resumeId,
      targetRole,
      analysisType: 'skill_gap',
      results: {
        skillGap
      },
      recommendations: skillGap.recommendations || []
    });

    await analysis.save();

    res.json({
      success: true,
      data: {
        analysisId: analysis._id,
        skillGap
      },
      message: 'Skill gap analysis completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Calculate placement score
const calculatePlacementScore = async (req, res) => {
  try {
    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_ANALYSIS_ID', message: 'analysisId is required' }
      });
    }

    // Populate resumeId so PlacementService can read projects / experience
    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.user._id
    }).populate('resumeId');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: { code: 'ANALYSIS_NOT_FOUND', message: 'Analysis not found' }
      });
    }

    const placementService = new PlacementService();
    const placementScore   = placementService.calculatePlacementScore(analysis);

    // markModified is required because Mongoose does not detect nested object mutations
    analysis.results.placementScore = placementScore;
    analysis.markModified('results');
    await analysis.save();

    res.json({
      success: true,
      data: { placementScore },
      message: 'Placement score calculated successfully'
    });
  } catch (error) {
    console.error('calculatePlacementScore error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

// Perform comprehensive analysis
const performComprehensiveAnalysis = async (req, res) => {
  try {
    const { resumeId, targetRole } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RESUME_NOT_FOUND',
          message: 'Resume not found'
        }
      });
    }

    // Update resume status
    resume.analysisStatus = 'processing';
    await resume.save();

    // Perform individual analyses
    const atsService = new ATSService();
    const skillGapService = new SkillGapService();
    const placementService = new PlacementService();

    const atsScore   = await atsService.analyzeResume(resume.parsedContent, targetRole);
    const skillGap   = await skillGapService.analyzeSkillGap(resume.parsedContent.skills, targetRole);

    // Save analysis with resumeId populated so PlacementService can read projects
    const analysis = new Analysis({
      userId: req.user._id,
      resumeId,
      targetRole,
      analysisType: 'comprehensive',
      results: { atsScore, skillGap },
      recommendations: atsScore.recommendations || []
    });
    await analysis.save();

    // Populate resumeId so PlacementService can access parsedContent.projects/experience
    await analysis.populate('resumeId');
    const placementScore = placementService.calculatePlacementScore(analysis);
    analysis.results.placementScore = placementScore;
    analysis.markModified('results');
    await analysis.save();

    // Update resume status
    resume.analysisStatus = 'completed';
    await resume.save();

    res.json({
      success: true,
      data: {
        analysisId: analysis._id,
        comprehensive: {
          atsScore,
          skillGap,
          placementScore
        },
        recommendations: analysis.recommendations
      },
      message: 'Comprehensive analysis completed successfully'
    });
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Get analysis by ID
const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('resumeId');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: 'Analysis not found'
        }
      });
    }

    res.json({
      success: true,
      data: { analysis }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Get user's analyses
const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .populate('resumeId', 'fileName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { analyses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

module.exports = {
  performATSAnalysis,
  performSkillGapAnalysis,
  calculatePlacementScore,
  performComprehensiveAnalysis,
  getAnalysis,
  getUserAnalyses
};
