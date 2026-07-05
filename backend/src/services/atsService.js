class ATSService {
  constructor() {
    this.actionVerbs = [
      'developed', 'implemented', 'designed', 'created',
      'managed', 'led', 'built', 'deployed', 'optimized',
      'increased', 'reduced', 'improved', 'achieved'
    ];
  }

  async analyzeResume(parsedContent, targetRole) {
    const results = {
      keywordMatch: this.calculateKeywordMatch(parsedContent, targetRole),
      formatScore: this.calculateFormatScore(parsedContent),
      sectionCompleteness: this.calculateSectionCompleteness(parsedContent),
      actionVerbs: this.calculateActionVerbs(parsedContent),
      quantifiableAchievements: this.calculateQuantifiableAchievements(parsedContent)
    };

    results.overall = (
      results.keywordMatch * 0.3 +
      results.formatScore * 0.2 +
      results.sectionCompleteness * 0.2 +
      results.actionVerbs * 0.15 +
      results.quantifiableAchievements * 0.15
    );

    results.recommendations = this.generateRecommendations(results);

    return results;
  }

  calculateKeywordMatch(parsedContent, targetRole) {
    const resumeSkills = parsedContent.skills || [];
    const roleSkills = this.getRoleSkills(targetRole);

    const matched = resumeSkills.filter(skill => 
      roleSkills.some(roleSkill => 
        roleSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    const score = roleSkills.length > 0 
      ? (matched.length / roleSkills.length) * 100 
      : 50;

    return Math.min(score, 100);
  }

  calculateFormatScore(parsedContent) {
    let score = 0;
    const text = parsedContent.rawText || '';

    const checks = [
      { condition: text.includes('•'), points: 20 },
      { condition: text.match(/\n\s*\n/), points: 20 },
      { condition: !text.includes('||'), points: 20 },
      { condition: text.length > 500, points: 20 },
      { condition: text.length < 10000, points: 20 }
    ];

    checks.forEach(check => {
      if (check.condition) score += check.points;
    });

    return score;
  }

  calculateSectionCompleteness(parsedContent) {
    const requiredSections = ['contact', 'summary', 'skills', 'experience', 'education'];
    let present = 0;
    const text = parsedContent.rawText || '';

    requiredSections.forEach(section => {
      if (this.hasSection(text, section)) present++;
    });

    return (present / requiredSections.length) * 100;
  }

  calculateActionVerbs(parsedContent) {
    const text = parsedContent.rawText || '';
    let count = 0;

    this.actionVerbs.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });

    return Math.min((count / 10) * 100, 100);
  }

  calculateQuantifiableAchievements(parsedContent) {
    const text = parsedContent.rawText || '';
    const patterns = [
      /\d+%/,
      /\$\d+/,
      /\d+\s*(?:users|customers|clients)/i,
      /\d+\s*(?:projects|tasks|features)/i
    ];

    let count = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) count += matches.length;
    });

    return Math.min((count / 5) * 100, 100);
  }

  generateRecommendations(results) {
    const recommendations = [];

    if (results.keywordMatch < 70) {
      recommendations.push('Add more relevant keywords from job description');
    }

    if (results.formatScore < 70) {
      recommendations.push('Improve resume formatting with bullet points and clear sections');
    }

    if (results.actionVerbs < 60) {
      recommendations.push('Use more action verbs to describe achievements');
    }

    if (results.quantifiableAchievements < 50) {
      recommendations.push('Add quantifiable achievements with numbers and metrics');
    }

    return recommendations;
  }

  getRoleSkills(targetRole) {
    const roleSkills = {
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'APIs', 'Databases'],
      'Frontend Developer': ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
      'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas']
    };

    return roleSkills[targetRole] || roleSkills['Full Stack Developer'];
  }

  hasSection(text, section) {
    const sectionKeywords = {
      contact: ['email', 'phone', 'address', 'linkedin'],
      summary: ['summary', 'objective', 'profile'],
      skills: ['skills', 'technologies', 'tools'],
      experience: ['experience', 'employment', 'work'],
      education: ['education', 'university', 'college']
    };

    const keywords = sectionKeywords[section] || [section];
    return keywords.some(kw => text.toLowerCase().includes(kw));
  }
}

module.exports = ATSService;
