const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  reportType: {
    type: String,
    enum: ['comprehensive', 'ats', 'skill_gap', 'roadmap'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  sections: [{
    name: String,
    pageNumbers: [Number]
  }],
  metadata: {
    atsScore: Number,
    placementScore: Number,
    skillCount: Number,
    roadmapPhases: Number,
    interviewQuestions: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ analysisId: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
