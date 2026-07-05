class PromptBuilder {
  constructor() {
    this.systemPrompt = `You are an expert AI Career Coach with 15+ years of experience in:
- Technical recruitment at top tech companies
- Resume optimization and ATS systems
- Skill assessment and career planning
- Interview preparation and coaching
- Industry trends and job market analysis

CORE PRINCIPLES:
1. Be accurate and realistic in assessments
2. Provide specific, actionable recommendations
3. Quantify advice with metrics where possible
4. Include resource links for learning
5. Consider current market trends (2024)
6. Tailor advice to user's experience level
7. Balance ambition with practicality

OUTPUT REQUIREMENTS:
- Always respond in valid JSON format
- Use clear, professional language
- Provide specific examples
- Include confidence scores for predictions
- Flag uncertain information`;
  }

  buildSystemPrompt(task, context) {
    let prompt = this.systemPrompt;

    if (task.type === 'ats_analysis') {
      prompt += `\n\nYou are an ATS analyzer. Evaluate resumes based on:
- Keyword matching
- Format compliance
- Section completeness
- Action verb usage
- Quantifiable achievements`;
    } else if (task.type === 'skill_gap') {
      prompt += `\n\nYou are a skill gap analyst. Identify:
- Present skills and their levels
- Missing skills with priority
- Learning resources
- Estimated learning time`;
    }

    return prompt;
  }

  buildUserPrompt(task, data) {
    switch (task.type) {
      case 'ats_analysis':
        return this.buildATSPrompt(data);
      case 'skill_gap':
        return this.buildSkillGapPrompt(data);
      case 'placement_score':
        return this.buildPlacementPrompt(data);
      default:
        return JSON.stringify(data);
    }
  }

  buildATSPrompt(data) {
    return `Analyze this resume for the role of "${data.targetRole}".

RESUME CONTENT:
${data.resume.parsedContent.rawText}

TARGET ROLE REQUIREMENTS:
- JavaScript, React, Node.js, MongoDB, HTML, CSS

ANALYSIS DIMENSIONS:
1. Keyword Match (0-100): Match technical skills
2. Format Score (0-100): Section organization, spacing
3. Section Completeness (0-100): Contact, summary, skills, experience, education
4. Action Verbs (0-100): Use of strong action verbs
5. Quantifiable Achievements (0-100): Metrics and numbers

Provide detailed feedback for each dimension with specific examples.

RESPONSE FORMAT:
{
  "atsScore": {
    "overall": number,
    "keywordMatch": number,
    "formatScore": number,
    "sectionCompleteness": number,
    "actionVerbs": number,
    "quantifiableAchievements": number
  },
  "feedback": {
    "strengths": [string],
    "weaknesses": [string],
    "improvements": [{
      "section": string,
      "issue": string,
      "suggestion": string
    }]
  },
  "recommendations": [string]
}`;
  }

  buildSkillGapPrompt(data) {
    return `Perform a skill gap analysis.

CURRENT SKILLS:
${data.resume.parsedContent.skills.join(', ')}

TARGET ROLE: ${data.targetRole}

ANALYSIS TASKS:
1. Identify Present Skills with levels
2. Identify Missing Skills with priority (high/medium/low)
3. Provide learning resources for each missing skill
4. Estimate learning time

RESPONSE FORMAT:
{
  "skillGap": {
    "presentSkills": [{
      "skill": string,
      "currentLevel": string,
      "requiredLevel": string,
      "match": boolean
    }],
    "missingSkills": [{
      "skill": string,
      "priority": string,
      "requiredLevel": string,
      "learningDifficulty": string,
      "estimatedTime": string,
      "resources": [{
        "name": string,
        "type": string,
        "url": string,
        "duration": string
      }]
    }]
  },
  "recommendations": [string]
}`;
  }

  buildPlacementPrompt(data) {
    return `Calculate placement readiness score.

PROFILE:
- Skills: ${data.resume.parsedContent.skills.join(', ')}
- Projects: ${data.resume.parsedContent.projects.length}
- Experience: ${data.resume.parsedContent.experience.length}

CALCULATE:
1. Technical Score (0-100): Based on skill match
2. Project Score (0-100): Based on project quality and quantity
3. Resume Score (0-100): Based on ATS analysis
4. Communication Score (0-100): Based on resume quality

RESPONSE FORMAT:
{
  "placementScore": {
    "technical": number,
    "projects": number,
    "resume": number,
    "communication": number,
    "overall": number,
    "placementProbability": string
  }
}`;
  }

  validatePrompt(prompt) {
    if (!prompt || prompt.length < 10) {
      throw new Error('Prompt too short');
    }
    return true;
  }
}

module.exports = PromptBuilder;
