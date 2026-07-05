const Planner = require('./planner');
const Executor = require('./executor');
const ToolSelector = require('./toolSelector');
const PromptBuilder = require('./promptBuilder');
const RAGRetriever = require('./ragRetriever');
const GeminiTool = require('./geminiTool');
const ResumeTool = require('./resumeTool');
const Memory = require('./memory');
const ReportGenerator = require('./reportGenerator');
const { Resume, Analysis } = require('../models');

class CareerAgent {
  constructor(userId) {
    this.userId = userId;
    this.state = {
      status: 'idle',
      currentTask: null,
      taskQueue: [],
      results: {},
      errors: []
    };
    this.memory = new Memory(userId);
    this.planner = new Planner();
    this.executor = new Executor();
    this.toolSelector = new ToolSelector();
    this.promptBuilder = new PromptBuilder();
  }

  async initialize() {
    try {
      await this.memory.loadUserContext();
      this.state.status = 'ready';
      console.log('Agent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      throw error;
    }
  }

  async processResume(resumeId, targetRole = 'Full Stack Developer', targetCompany) {
    try {
      await this.initialize();
      
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      const request = {
        type: 'resume_analysis',
        resumeId,
        targetRole,
        targetCompany
      };

      const plan = this.planner.plan(request, this.state.userContext);
      this.state.taskQueue = plan;

      const results = await this.executor.executeQueue(this.state.taskQueue, {
        userId: this.userId,
        resume,
        targetRole,
        targetCompany,
        toolSelector: this.toolSelector,
        memory: this.memory
      });

      await this.memory.persist();
      
      return results;
    } catch (error) {
      console.error('Agent processing error:', error);
      throw error;
    }
  }

  async processComprehensiveAnalysis(resumeId, targetRole) {
    try {
      await this.initialize();
      
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      const request = {
        type: 'comprehensive_analysis',
        resumeId,
        targetRole
      };

      const plan = this.planner.plan(request, this.state.userContext);
      this.state.taskQueue = plan;

      const results = await this.executor.executeQueue(this.state.taskQueue, {
        userId: this.userId,
        resume,
        targetRole,
        toolSelector: this.toolSelector,
        memory: this.memory
      });

      // Save comprehensive analysis
      const analysis = new Analysis({
        userId: this.userId,
        resumeId,
        targetRole,
        analysisType: 'comprehensive',
        results: results.comprehensive,
        recommendations: results.recommendations,
        aiModel: 'gemini-pro'
      });

      await analysis.save();

      await this.memory.persist();
      
      return {
        analysisId: analysis._id,
        ...results
      };
    } catch (error) {
      console.error('Agent processing error:', error);
      throw error;
    }
  }

  async shutdown() {
    this.state.status = 'shutdown';
    await this.memory.persist();
    console.log('Agent shutdown complete');
  }
}

// Static method for async processing
CareerAgent.processResume = async (resumeId, targetRole, targetCompany) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) return;

  const agent = new CareerAgent(resume.userId);
  await agent.processResume(resumeId, targetRole, targetCompany).catch(error => {
    console.error('Async agent processing error:', error);
  });
};

module.exports = CareerAgent;
