const { User } = require('../models');
const { generateToken, verifyToken } = require('../utils/tokenUtils');

// Register a new user
const register = async (req, res) => {
  try {
    let { name, email, password, firstName, lastName, role = 'student', phone, college, targetRole } = req.body;

    if (name && !firstName) {
      const parts = name.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || ' ';
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already registered'
        }
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      college,
      targetRole,
      education: {
        college
      }
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: user.getPublicProfile()
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('[register] FULL ERROR:', error);
    console.error(error.stack);
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

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is deactivated'
        }
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    res.json({
      success: true,
      data: {
        token,
        user: user.getPublicProfile()
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('[login] FULL ERROR:', error.message);
    console.error(error.stack);
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

// Logout user (client-side token removal)
const logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logout successful'
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

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
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
      data: {
        user: user.getPublicProfile()
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

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, targetRole, targetCompanies, experience, education, skills } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (targetRole) updates.targetRole = targetRole;
    if (targetCompanies) updates.targetCompanies = targetCompanies;
    if (experience !== undefined) updates.experience = experience;
    if (education) updates.education = education;
    if (skills) updates.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

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
      data: {
        user: user.getPublicProfile()
      },
      message: 'Profile updated successfully'
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

// Google Login / Signup
const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Email is required'
        }
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      const parts = (name || '').trim().split(/\s+/);
      const firstName = parts[0] || 'Google';
      const lastName = parts.slice(1).join(' ') || 'User';
      
      const randomPassword = require('crypto').randomBytes(16).toString('hex') + 'A1!';
      
      user = new User({
        email,
        password: randomPassword,
        firstName,
        lastName,
        role: 'student',
        phone: 'Not Provided',
        college: 'Google Auth',
        targetRole: 'Full Stack Developer',
        education: {
          college: 'Google Auth'
        }
      });
      await user.save();
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      role: user.role
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: user.getPublicProfile()
      },
      message: 'Google login successful'
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
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  googleLogin
};
