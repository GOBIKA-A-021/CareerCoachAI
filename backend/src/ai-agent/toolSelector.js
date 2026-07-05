class ToolSelector {
  constructor() {
    this.toolRegistry = {
      parse_resume: 'resumeTool',
      extract_skills: 'resumeTool',
      ats_analysis: 'geminiTool',
      skill_gap: 'geminiTool',
      placement_score: 'geminiTool'
    };
  }

  selectTool(task) {
    const toolName = this.toolRegistry[task.type];
    if (!toolName) {
      throw new Error(`No tool registered for task type: ${task.type}`);
    }
    return toolName;
  }

  registerTool(taskType, toolName) {
    this.toolRegistry[taskType] = toolName;
  }

  getTool(toolName) {
    const toolMap = {
      resumeTool: require('./resumeTool'),
      geminiTool: require('./geminiTool'),
      ragRetriever: require('./ragRetriever')
    };
    return toolMap[toolName];
  }
}

module.exports = ToolSelector;
