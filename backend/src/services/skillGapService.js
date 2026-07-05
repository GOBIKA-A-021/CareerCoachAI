class SkillGapService {
  constructor() {
    this.roleRequirements = {
      'Full Stack Developer': {
        requiredSkills: [
          { skill: 'JavaScript', level: 'advanced', mandatory: true },
          { skill: 'React', level: 'intermediate', mandatory: true },
          { skill: 'Node.js', level: 'intermediate', mandatory: true },
          { skill: 'MongoDB', level: 'intermediate', mandatory: true },
          { skill: 'TypeScript', level: 'intermediate', mandatory: false },
          { skill: 'Docker', level: 'beginner', mandatory: false },
          { skill: 'Git', level: 'intermediate', mandatory: true }
        ]
      },
      'Backend Developer': {
        requiredSkills: [
          { skill: 'Node.js', level: 'advanced', mandatory: true },
          { skill: 'Python', level: 'intermediate', mandatory: false },
          { skill: 'SQL', level: 'intermediate', mandatory: true },
          { skill: 'APIs', level: 'advanced', mandatory: true },
          { skill: 'Databases', level: 'intermediate', mandatory: true }
        ]
      },
      'Frontend Developer': {
        requiredSkills: [
          { skill: 'React', level: 'advanced', mandatory: true },
          { skill: 'JavaScript', level: 'advanced', mandatory: true },
          { skill: 'HTML', level: 'advanced', mandatory: true },
          { skill: 'CSS', level: 'advanced', mandatory: true },
          { skill: 'TypeScript', level: 'intermediate', mandatory: false }
        ]
      }
    };
  }

  async analyzeSkillGap(userSkills, targetRole) {
    // Guard: skills may be undefined/null when the user hasn't set them yet
    const safeSkills = Array.isArray(userSkills) ? userSkills : [];
    const roleRequirements =
      this.roleRequirements[targetRole] || this.roleRequirements['Full Stack Developer'];

    const presentSkills       = this.categorizeSkills(safeSkills, roleRequirements);
    const missingSkills       = this.identifyMissingSkills(safeSkills, roleRequirements);
    const skillLevelAssessment = this.assessSkillLevels(safeSkills, roleRequirements);

    return {
      presentSkills,
      missingSkills,
      skillLevelAssessment,
      recommendations: this.generateRecommendations(missingSkills)
    };
  }

  categorizeSkills(userSkills, requirements) {
    const safeSkills = Array.isArray(userSkills) ? userSkills : [];
    return safeSkills.map(skill => {
      const requirement = requirements.requiredSkills.find(
        req => req.skill.toLowerCase() === skill.toLowerCase()
      );
      return {
        skill,
        currentLevel: this.estimateLevel(skill),
        requiredLevel: requirement ? requirement.level : 'N/A',
        match: !!requirement
      };
    });
  }

  identifyMissingSkills(userSkills, requirements) {
    const safeSkills = Array.isArray(userSkills) ? userSkills : [];
    return requirements.requiredSkills
      .filter(req =>
        !safeSkills.some(s => s.toLowerCase() === req.skill.toLowerCase())
      )
      .map(req => ({
        skill:              req.skill,
        priority:           req.mandatory ? 'high' : 'medium',
        requiredLevel:      req.level,
        learningDifficulty: this.estimateDifficulty(req.skill),
        estimatedTime:      this.estimateLearningTime(req.skill, req.level),
        resources:          this.getResources(req.skill)
      }));
  }

  assessSkillLevels(userSkills, requirements) {
    const safeSkills = Array.isArray(userSkills) ? userSkills : [];
    const assessments = [];
    safeSkills.forEach(skill => {
      const requirement = requirements.requiredSkills.find(
        req => req.skill.toLowerCase() === skill.toLowerCase()
      );
      if (requirement) {
        const currentLevel = this.estimateLevel(skill);
        assessments.push({
          skill,
          currentLevel,
          requiredLevel: requirement.level,
          gap: this.calculateGap(currentLevel, requirement.level)
        });
      }
    });
    return assessments;
  }

  estimateLevel(skill) {
    const beginnerSkills = ['HTML', 'CSS', 'Git'];
    const intermediateSkills = ['JavaScript', 'React', 'Node.js', 'SQL'];
    const advancedSkills = ['System Design', 'Microservices', 'DevOps'];

    const skillLower = skill.toLowerCase();

    if (beginnerSkills.some(s => s.toLowerCase() === skillLower)) {
      return 'beginner';
    } else if (intermediateSkills.some(s => s.toLowerCase() === skillLower)) {
      return 'intermediate';
    } else if (advancedSkills.some(s => s.toLowerCase() === skillLower)) {
      return 'advanced';
    }

    return 'intermediate';
  }

  estimateDifficulty(skill) {
    const beginnerSkills = ['HTML', 'CSS', 'Git'];
    const intermediateSkills = ['React', 'Node.js', 'Python', 'SQL'];
    const advancedSkills = ['System Design', 'Microservices', 'DevOps'];

    const skillLower = skill.toLowerCase();

    if (beginnerSkills.some(s => s.toLowerCase() === skillLower)) {
      return 'easy';
    } else if (intermediateSkills.some(s => s.toLowerCase() === skillLower)) {
      return 'medium';
    } else if (advancedSkills.some(s => s.toLowerCase() === skillLower)) {
      return 'hard';
    }

    return 'medium';
  }

  estimateLearningTime(skill, level) {
    const baseTimes = {
      easy: { beginner: '1-2 weeks', intermediate: '3-4 weeks', advanced: '2-3 months' },
      medium: { beginner: '1-2 months', intermediate: '3-4 months', advanced: '6-8 months' },
      hard: { beginner: '2-3 months', intermediate: '6-8 months', advanced: '1-2 years' }
    };

    const difficulty = this.estimateDifficulty(skill);
    return baseTimes[difficulty][level] || '3-6 months';
  }

  getResources(skill) {
    const resourceMap = {
      'React': [
        { name: 'React Documentation', type: 'documentation', url: 'https://react.dev', duration: 'Ongoing' },
        { name: 'React - The Complete Guide', type: 'course', url: 'https://udemy.com', duration: '40 hours' }
      ],
      'Node.js': [
        { name: 'Node.js Documentation', type: 'documentation', url: 'https://nodejs.org', duration: 'Ongoing' },
        { name: 'Node.js Course', type: 'course', url: 'https://coursera.org', duration: '30 hours' }
      ],
      'TypeScript': [
        { name: 'TypeScript Documentation', type: 'documentation', url: 'https://typescriptlang.org', duration: 'Ongoing' },
        { name: 'TypeScript for Beginners', type: 'course', url: 'https://udemy.com', duration: '20 hours' }
      ],
      'Docker': [
        { name: 'Docker Documentation', type: 'documentation', url: 'https://docs.docker.com', duration: 'Ongoing' },
        { name: 'Docker Mastery', type: 'course', url: 'https://udemy.com', duration: '15 hours' }
      ]
    };

    return resourceMap[skill] || [
      { name: `${skill} Documentation`, type: 'documentation', url: `https://google.com/search?q=${skill}+docs`, duration: 'Ongoing' }
    ];
  }

  calculateGap(currentLevel, requiredLevel) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const current = levels[currentLevel] || 1;
    const required = levels[requiredLevel] || 2;
    
    const diff = required - current;
    
    if (diff <= 0) return 'none';
    if (diff === 1) return 'small';
    if (diff === 2) return 'medium';
    return 'large';
  }

  generateRecommendations(missingSkills) {
    const recommendations = [];

    const highPriority = missingSkills.filter(s => s.priority === 'high');
    const mediumPriority = missingSkills.filter(s => s.priority === 'medium');

    if (highPriority.length > 0) {
      recommendations.push(`Focus on ${highPriority.length} high-priority skills first`);
    }

    recommendations.push('Complete one skill at a time for better retention');
    recommendations.push('Build projects to apply learned skills');
    recommendations.push('Get certifications for high-demand skills');

    if (highPriority.length > 3) {
      recommendations.push('Consider extending learning timeline');
    }

    return recommendations;
  }
}

module.exports = SkillGapService;
