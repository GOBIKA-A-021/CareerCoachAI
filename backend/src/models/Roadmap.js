const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  targetRole: {
    type: String,
    required: true
  },
  currentSkills: [String],
  totalDuration: String,
  phases: [
    {
      phaseNumber: Number,
      title: String,
      duration: String,
      objectives: [String],
      skillsToLearn: [{ skill: String, resources: [{ name: String, type: String, url: String, duration: String }] }],
      projects: [{ name: String, description: String, technologies: [String] }],
      certifications: [{ name: String, provider: String, url: String }],
      milestones: [String]
    }
  ],
  prerequisites: [String],
  successMetrics: [String]
}, { timestamps: true });

roadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
