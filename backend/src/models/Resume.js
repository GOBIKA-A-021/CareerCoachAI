const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: { type: String, required: true },
  fileUrl:  { type: String, required: true },
  fileSize: { type: Number, required: true },

  // ── NEW: stored at upload time ───────────────────────────────────────────
  targetRole:    { type: String, default: '' },
  targetCompany: { type: String, default: '' },
  // ────────────────────────────────────────────────────────────────────────

  uploadedAt: { type: Date, default: Date.now },

  parsedContent: {
    rawText: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    education: [{
      degree: String,
      institution: String,
      year: String,
      gpa: String
    }],
    experience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      duration: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String
    }],
    achievements: [String]
  },

  version:        { type: Number, default: 1 },
  isCurrent:      { type: Boolean, default: true },
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

resumeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ isCurrent: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
