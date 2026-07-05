const ResumeParser = require('../services/resumeParser');

class ResumeTool {
  constructor() {
    this.parser = new ResumeParser();
  }

  async execute(task, context) {
    switch (task.type) {
      case 'parse_resume':
        return this.parseResume(context.resume);
      case 'extract_skills':
        return this.extractSkills(context.resume);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  async parseResume(resume) {
    // Resume is already parsed when uploaded
    return {
      parsed: true,
      data: resume.parsedContent
    };
  }

  async extractSkills(resume) {
    return {
      skills: resume.parsedContent.skills,
      count: resume.parsedContent.skills.length
    };
  }
}

module.exports = ResumeTool;
