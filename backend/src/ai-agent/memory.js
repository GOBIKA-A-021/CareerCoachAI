const { User, Resume, Analysis } = require('../models');

class Memory {
  constructor(userId) {
    this.userId = userId;
    this.shortTerm = {};
    this.longTerm = null;
  }

  async loadUserContext() {
    try {
      const user = await User.findById(this.userId);
      const resume = await Resume.findOne({ userId: this.userId, isCurrent: true });
      const previousAnalyses = await Analysis.find({ userId: this.userId })
        .sort({ createdAt: -1 })
        .limit(5);

      this.longTerm = {
        user,
        resume,
        previousAnalyses
      };

      return this.longTerm;
    } catch (error) {
      console.error('Failed to load user context:', error);
      return {};
    }
  }

  store(key, value) {
    this.shortTerm[key] = value;
  }

  retrieve(key) {
    return this.shortTerm[key];
  }

  getAll() {
    return {
      ...this.longTerm,
      ...this.shortTerm
    };
  }

  async persist() {
    try {
      // In a real implementation, this would save to an AgentMemory collection
      // For now, we'll just log it
      console.log('Memory persisted for user:', this.userId);
    } catch (error) {
      console.error('Failed to persist memory:', error);
    }
  }

  clear() {
    this.shortTerm = {};
  }
}

module.exports = Memory;
