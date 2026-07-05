const mongoose = require('mongoose');

// ── Reusable sub-schemas (explicit _id:false avoids CastError on nested arrays)
const ResourceSchema = new mongoose.Schema(
  { name: String, type: String, url: String, duration: String, difficulty: String },
  { _id: false }
);

const PresentSkillSchema = new mongoose.Schema(
  { skill: String, currentLevel: String, requiredLevel: String, match: Boolean },
  { _id: false }
);

const MissingSkillSchema = new mongoose.Schema(
  {
    skill:             String,
    priority:          String,
    requiredLevel:     String,
    learningDifficulty: String,
    estimatedTime:     String,
    resources:         { type: [ResourceSchema], default: [] }
  },
  { _id: false }
);

const SkillLevelSchema = new mongoose.Schema(
  { skill: String, currentLevel: String, requiredLevel: String, gap: String },
  { _id: false }
);

// ── Main schema ────────────────────────────────────────────────────────────────
const analysisSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true
  },
  resumeId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Resume',
    required: true,
    index:    true
  },
  targetRole: {
    type:     String,
    required: true
  },
  analysisType: {
    type:     String,
    enum:     ['ats', 'skill_gap', 'placement_score', 'comprehensive'],
    required: true
  },
  results: {
    // ATS Analysis
    atsScore: {
      overall:                  Number,
      keywordMatch:             Number,
      formatScore:              Number,
      sectionCompleteness:      Number,
      actionVerbs:              Number,
      quantifiableAchievements: Number,
      recommendations:          [String]
    },

    // Skill Gap Analysis — use explicit sub-schemas so Mongoose never casts objects to strings
    skillGap: {
      presentSkills:       { type: [PresentSkillSchema], default: [] },
      missingSkills:       { type: [MissingSkillSchema], default: [] },
      skillLevelAssessment:{ type: [SkillLevelSchema],   default: [] },
      recommendations:     [String]
    },

    // Placement Score
    placementScore: {
      technical:     Number,
      projects:      Number,
      resume:        Number,
      communication: Number,
      overall:       Number,
      breakdown: {
        technicalWeight:     Number,
        projectWeight:       Number,
        resumeWeight:        Number,
        communicationWeight: Number
      },
      placementProbability: String
    }
  },
  recommendations: [String],
  aiModel:         { type: String, default: 'gemini-pro' },
  processingTime:  Number
}, { timestamps: true });

analysisSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ resumeId: 1 });
analysisSchema.index({ analysisType: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);
