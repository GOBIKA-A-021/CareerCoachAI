const mongoose = require('mongoose');

// ── Explicit sub-schemas avoid the inline [{ key: Type }] CastError ───────────
const ResourceSchema = new mongoose.Schema(
  { name: String, type: String, url: String, duration: String },
  { _id: false }
);

const SkillToLearnSchema = new mongoose.Schema(
  { skill: String, resources: { type: [ResourceSchema], default: [] } },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  { name: String, description: String, technologies: [String] },
  { _id: false }
);

const CertificationSchema = new mongoose.Schema(
  { name: String, provider: String, url: String },
  { _id: false }
);

const PhaseSchema = new mongoose.Schema(
  {
    phaseNumber:   Number,
    title:         String,
    duration:      String,
    objectives:    [String],
    skillsToLearn: { type: [SkillToLearnSchema], default: [] },
    projects:      { type: [ProjectSchema],      default: [] },
    certifications:{ type: [CertificationSchema],default: [] },
    milestones:    [String]
  },
  { _id: false }
);

// ── Main schema ────────────────────────────────────────────────────────────────
const roadmapSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true
  },
  targetRole:     { type: String, required: true },
  currentSkills:  [String],
  totalDuration:  String,
  phases:         { type: [PhaseSchema], default: [] },
  prerequisites:  [String],
  successMetrics: [String]
}, { timestamps: true });

roadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
