const { Roadmap, User } = require('../models');
const RoadmapService = require('../services/roadmapService');

// Generate career roadmap
const generateRoadmap = async (req, res) => {
  try {
    const { targetRole, timeline } = req.body;
    const userId = req.user._id;

    // Get user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Generate roadmap
    const roadmapService = new RoadmapService();
    const roadmap = await roadmapService.generateRoadmap(
      {
        skills: user.skills,
        experience: user.experience,
        education: user.education
      },
      targetRole,
      timeline
    );

    // Save roadmap
    const savedRoadmap = new Roadmap({
      userId,
      targetRole,
      currentSkills: user.skills,
      totalDuration: timeline,
      phases: roadmap.phases,
      prerequisites: roadmap.prerequisites,
      successMetrics: roadmap.successMetrics
    });

    await savedRoadmap.save();

    res.status(201).json({
      success: true,
      data: {
        roadmapId: savedRoadmap._id,
        roadmap: savedRoadmap
      },
      message: 'Roadmap generated successfully'
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

// Get user's roadmaps
const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { roadmaps }
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

// Get roadmap by ID
const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROADMAP_NOT_FOUND',
          message: 'Roadmap not found'
        }
      });
    }

    res.json({
      success: true,
      data: { roadmap }
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

// Update roadmap progress
const updateRoadmapProgress = async (req, res) => {
  try {
    const { completedPhases, progress } = req.body;

    const roadmap = await Roadmap.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        $set: { 
          completedPhases,
          progress 
        }
      },
      { new: true }
    );

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROADMAP_NOT_FOUND',
          message: 'Roadmap not found'
        }
      });
    }

    res.json({
      success: true,
      data: { roadmap },
      message: 'Roadmap progress updated successfully'
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
  generateRoadmap,
  getUserRoadmaps,
  getRoadmap,
  updateRoadmapProgress
};
