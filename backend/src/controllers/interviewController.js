const { InterviewQuestion, User } = require('../models');
const InterviewService = require('../services/interviewService');

// Generate interview questions
const generateQuestions = async (req, res) => {
  try {
    const { targetRole, company, difficulty = 'medium' } = req.body;
    const userId = req.user._id;

    // Generate questions
    const interviewService = new InterviewService();
    const questions = await interviewService.generateInterviewPrep(
      targetRole,
      company,
      difficulty
    );

    // Save questions
    const savedQuestions = new InterviewQuestion({
      userId,
      targetRole,
      company,
      category: 'comprehensive',
      difficulty,
      questions: questions.questions
    });

    await savedQuestions.save();

    res.status(201).json({
      success: true,
      data: {
        questionId: savedQuestions._id,
        // Flatten questions to the top level of data so the frontend can read
        // response.questions directly after the service unwraps response.data.data
        questions: questions.questions,
        tips: questions.tips,
        role: questions.role,
        company: questions.company,
        difficulty: questions.difficulty
      },
      message: 'Interview questions generated successfully'
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

// Get user's interview questions
const getUserQuestions = async (req, res) => {
  try {
    const questions = await InterviewQuestion.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { questions }
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

// Get questions by ID
const getQuestions = async (req, res) => {
  try {
    const questions = await InterviewQuestion.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!questions) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'QUESTIONS_NOT_FOUND',
          message: 'Questions not found'
        }
      });
    }

    res.json({
      success: true,
      data: { questions }
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
  generateQuestions,
  getUserQuestions,
  getQuestions
};
