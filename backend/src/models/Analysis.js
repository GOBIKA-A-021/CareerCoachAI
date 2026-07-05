const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
    index: true
  },
  targetRole: {
    type: String,
    required: true
  },
  analysisType: {
    type: String,
    enum: ['ats', 'skill_gap', 'placement_score', 'comprehensive'],
    required: true
  },
  results: {
    // ATS Analysis
    atsScore: {
      overall: Number,
      keywordMatch: Number,
      formatScore: Number,
      sectionCompleteness: Number,
      actionVerbs: Number,
      quantifiableAchievements: Number
    },
    // Skill Gap Analysis
    skillGap: {
      presentSkills: [{
        skill: String,
        currentLevel: String,
        requiredLevel: String,
        match: Boolean
      }],
      missingSkills: [{
        skill: String,
        priority: String,
        requiredLevel: String,
        learningDifficulty: String,
        estimatedTime: String,
        resources: [{
          name: String,
          type: String,
          url: String,
          duration: String,
          difficulty: String
        }]
      }],
      skillLevelAssessment: [{
        skill: String,
        currentLevel: String,
        requiredLevel: String,
        gap: String
      }]
    },
    // Placement Score
    placementScore: {
      technical: Number,
      projects: Number,
      resume: Number,
      communication: Number,
      overall: Number,
      breakdown: {
        technicalWeight: Number,
        projectWeight: Number,
        resumeWeight: Number,
        communicationWeight: Number
      },
      placementProbability: String
    }
  },
  recommendations: [String],
  aiModel: {
    type: String,
    default: 'gemini-pro'
  },
  processingTime: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update timestamp on save
analysisSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ resumeId: 1 });
analysisSchema.index({ analysisType: 1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
