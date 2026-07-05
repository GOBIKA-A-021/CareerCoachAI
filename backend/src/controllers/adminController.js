const { User, Resume, Analysis, Report } = require('../models');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = search 
      ? { $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]}
      : {};

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
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

// Get user details (admin only)
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const resumes = await Resume.find({ userId: user._id });
    const analyses = await Analysis.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user,
        resumes,
        recentAnalyses: analyses
      }
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

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: { user },
      message: 'User updated successfully'
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

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    await Resume.deleteMany({ userId: id });
    await Analysis.deleteMany({ userId: id });
    await Report.deleteMany({ userId: id });

    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
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

// Toggle user status (admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      data: { isActive: user.isActive },
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`
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

// Get analytics (admin only)
const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments(dateFilter);

    const totalResumes = await Resume.countDocuments();
    const uploadedResumes = await Resume.countDocuments(dateFilter);

    const totalAnalyses = await Analysis.countDocuments();
    const completedAnalyses = await Analysis.countDocuments({
      ...dateFilter,
      'results.atsScore.overall': { $exists: true }
    });

    const avgATSScore = await Analysis.aggregate([
      { $match: { 'results.atsScore.overall': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$results.atsScore.overall' } } }
    ]);

    const avgPlacementScore = await Analysis.aggregate([
      { $match: { 'results.placementScore.overall': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$results.placementScore.overall' } } }
    ]);

    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          new: newUsers
        },
        resumes: {
          total: totalResumes,
          uploaded: uploadedResumes
        },
        analyses: {
          total: totalAnalyses,
          completed: completedAnalyses
        },
        scores: {
          avgATS: avgATSScore[0]?.avg || 0,
          avgPlacement: avgPlacementScore[0]?.avg || 0
        },
        roleDistribution
      }
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

// Get system health (admin only)
const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    res.json({
      success: true,
      data: {
        database: dbStatus,
        system: {
          memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
          },
          uptime: `${Math.floor(uptime / 3600)} hours`
        }
      }
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
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getAnalytics,
  getSystemHealth
};
