const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiTool {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set, using mock responses');
      this.useMock = true;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.useMock = false;
    }
  }

  async execute(task, context) {
    if (this.useMock) {
      return this.getMockResponse(task, context);
    }

    try {
      const systemPrompt = context.promptBuilder.buildSystemPrompt(task, context);
      const userPrompt = context.promptBuilder.buildUserPrompt(task, context);

      const response = await this.model.generateContent({
        systemInstruction: systemPrompt,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json'
        }
      });

      const text = response.response.text();
      return this.parseResponse(text);
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to mock response on error
      return this.getMockResponse(task, context);
    }
  }

  parseResponse(text) {
    try {
      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '');
      text = text.replace(/```\n?/g, '');
      
      // Try direct parse
      return JSON.parse(text);
    } catch (error) {
      // Try to extract JSON from text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to parse Gemini response');
    }
  }

  getMockResponse(task, context) {
    // Return mock responses for development/testing
    switch (task.type) {
      case 'ats_analysis':
        return {
          atsScore: {
            overall: 75,
            keywordMatch: 80,
            formatScore: 70,
            sectionCompleteness: 85,
            actionVerbs: 60,
            quantifiableAchievements: 50
          },
          feedback: {
            strengths: ['Good keyword match', 'Well-organized sections'],
            weaknesses: ['Low action verb usage', 'Few quantifiable achievements'],
            improvements: [
              {
                section: 'Experience',
                issue: 'Action verbs',
                suggestion: 'Use strong action verbs like developed, implemented'
              }
            ]
          },
          recommendations: [
            'Add more action verbs to describe achievements',
            'Include quantifiable metrics where possible',
            'Improve section formatting'
          ]
        };

      case 'skill_gap':
        return {
          skillGap: {
            presentSkills: [
              { skill: 'JavaScript', currentLevel: 'advanced', requiredLevel: 'advanced', match: true },
              { skill: 'React', currentLevel: 'intermediate', requiredLevel: 'intermediate', match: true }
            ],
            missingSkills: [
              {
                skill: 'TypeScript',
                priority: 'high',
                requiredLevel: 'intermediate',
                learningDifficulty: 'medium',
                estimatedTime: '2-3 weeks',
                resources: [
                  { name: 'TypeScript Documentation', type: 'documentation', url: 'https://typescriptlang.org', duration: 'Ongoing' }
                ]
              },
              {
                skill: 'Docker',
                priority: 'medium',
                requiredLevel: 'beginner',
                learningDifficulty: 'medium',
                estimatedTime: '1-2 weeks',
                resources: [
                  { name: 'Docker Documentation', type: 'documentation', url: 'https://docs.docker.com', duration: 'Ongoing' }
                ]
              }
            ]
          },
          recommendations: [
            'Focus on TypeScript first (high priority)',
            'Complete one skill at a time',
            'Build projects to apply learned skills'
          ]
        };

      case 'placement_score':
        return {
          placementScore: {
            technical: 75,
            projects: 65,
            resume: 70,
            communication: 80,
            overall: 68,
            breakdown: {
              technicalWeight: 0.4,
              projectWeight: 0.25,
              resumeWeight: 0.25,
              communicationWeight: 0.1
            },
            placementProbability: 'High (60-80%)'
          }
        };

      default:
        return {};
    }
  }
}

module.exports = GeminiTool;
