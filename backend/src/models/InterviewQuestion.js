const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  topics: [String],
  frequency: Number,
  timeComplexity: String,
  spaceComplexity: String
});

const interviewQuestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  targetRole: String,
  company: String,
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'coding', 'comprehensive'],
    default: 'comprehensive'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: {
    technical:  [questionSchema],
    behavioral: [questionSchema],
    coding:     [questionSchema],
    companySpecific: [questionSchema]
  },
  tips: [String]
}, { timestamps: true });

interviewQuestionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
