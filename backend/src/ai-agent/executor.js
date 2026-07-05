const ResumeTool = require('./resumeTool');
const GeminiTool = require('./geminiTool');
const RAGRetriever = require('./ragRetriever');

class Executor {
  constructor() {
    this.tools = {
      parse_resume: ResumeTool,
      extract_skills: ResumeTool,
      ats_analysis: GeminiTool,
      skill_gap: GeminiTool,
      placement_score: GeminiTool
    };
  }

  async executeQueue(taskQueue, context) {
    const results = {};
    const completedTasks = new Set();

    for (const task of taskQueue) {
      // Check if dependencies are met
      const dependenciesMet = task.dependsOn.every(depId => completedTasks.has(depId));
      
      if (!dependenciesMet) {
        console.log(`Skipping task ${task.id} - dependencies not met`);
        continue;
      }

      try {
        const toolClass = this.tools[task.type];
        if (!toolClass) {
          throw new Error(`Tool not found for task type: ${task.type}`);
        }

        const tool = new toolClass();
        const result = await this.executeWithRetry(task, tool, context);
        
        results[task.type] = result;
        completedTasks.add(task.id);
        
        console.log(`Task ${task.id} (${task.type}) completed successfully`);
      } catch (error) {
        console.error(`Task ${task.id} failed:`, error);
        results[task.type] = { error: error.message };
      }
    }

    return results;
  }

  async executeWithRetry(task, tool, context, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await tool.execute(task, context);
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt + 1} failed for task ${task.id}. Retrying...`);
        
        if (attempt < maxRetries - 1) {
          await this.delay(1000 * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  async execute(task, tool, context) {
    return await this.executeWithRetry(task, tool, context);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = Executor;
