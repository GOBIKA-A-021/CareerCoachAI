class RoadmapService {
  constructor() {
    this.phaseCount = 4;
  }

  async generateRoadmap(userProfile, targetRole, timeline) {
    const months = this.parseTimeline(timeline);
    const phases = this.createPhases(userProfile, targetRole, months);
    
    return {
      targetRole,
      currentSkills: userProfile.skills,
      totalDuration: timeline,
      phases,
      prerequisites: this.identifyPrerequisites(userProfile),
      successMetrics: this.defineSuccessMetrics(targetRole)
    };
  }

  createPhases(userProfile, targetRole, months) {
    const monthsPerPhase = Math.max(1, Math.ceil(months / this.phaseCount));
    const phases = [];

    for (let i = 0; i < this.phaseCount; i++) {
      const phaseNumber = i + 1;
      const phaseSkills = this.getPhaseSkills(targetRole, i);

      // Show duration in weeks when < 1 month, otherwise months
      const durationLabel = monthsPerPhase < 1
        ? `${Math.round(monthsPerPhase * 4)} weeks`
        : `${monthsPerPhase} ${monthsPerPhase === 1 ? 'month' : 'months'}`;

      phases.push({
        phaseNumber,
        title: this.getPhaseTitle(i),
        duration: durationLabel,
        objectives: this.generateObjectives(phaseSkills),
        skillsToLearn: phaseSkills.map(skill => ({
          skill,
          resources: this.getResources(skill)
        })),
        projects: this.suggestProjects(phaseSkills),
        certifications: this.suggestCertifications(phaseSkills),
        milestones: this.generateMilestones(phaseSkills, phaseNumber)
      });
    }

    return phases;
  }

  getPhaseTitle(phaseIndex) {
    const titles = [
      'Foundation Building',
      'Core Development',
      'Advanced Skills',
      'Industry Preparation'
    ];

    return titles[phaseIndex] || `Phase ${phaseIndex + 1}`;
  }

  getPhaseSkills(targetRole, phaseIndex) {
    const phaseSkills = {
      'Full Stack Developer': [
        ['TypeScript', 'Advanced JavaScript'],
        ['React Advanced', 'State Management'],
        ['Node.js Advanced', 'API Design'],
        ['DevOps Basics', 'Docker']
      ],
      'Backend Developer': [
        ['Advanced Node.js', 'Microservices'],
        ['Database Optimization', 'Caching'],
        ['System Design', 'Scalability'],
        ['DevOps', 'CI/CD']
      ],
      'Frontend Developer': [
        ['TypeScript', 'Advanced React'],
        ['State Management', 'Performance'],
        ['Testing', 'Accessibility'],
        ['Build Tools', 'Deployment']
      ]
    };

    return phaseSkills[targetRole]?.[phaseIndex] || phaseSkills['Full Stack Developer'][phaseIndex];
  }

  generateObjectives(skills) {
    return skills.map(skill => `Master ${skill} fundamentals`);
  }

  suggestProjects(skills) {
    const projectMap = {
      'TypeScript': [
        { name: 'TypeScript Migration Project', description: 'Convert JS project to TypeScript', technologies: ['TypeScript', 'JavaScript'] }
      ],
      'React': [
        { name: 'E-commerce Dashboard', description: 'Admin dashboard with charts', technologies: ['React', 'Chart.js', 'Redux'] }
      ],
      'Node.js': [
        { name: 'REST API Server', description: 'Scalable API with authentication', technologies: ['Node.js', 'Express', 'MongoDB'] }
      ],
      'Docker': [
        { name: 'Containerized App', description: 'Dockerize full-stack application', technologies: ['Docker', 'Node.js', 'React'] }
      ]
    };

    const projects = [];
    skills.forEach(skill => {
      if (projectMap[skill]) {
        projects.push(...projectMap[skill]);
      }
    });

    return projects.length > 0 ? projects : [{ name: 'Portfolio Project', description: 'Build a portfolio showcasing skills', technologies: skills }];
  }

  suggestCertifications(skills) {
    const certMap = {
      'Docker': [{ name: 'Docker Certified Associate', provider: 'Docker', url: 'https://www.docker.com/certification' }],
      'AWS': [{ name: 'AWS Cloud Practitioner', provider: 'Amazon', url: 'https://aws.amazon.com/certification' }],
      'React': [{ name: 'Meta Front-End Developer', provider: 'Meta', url: 'https://coursera.org' }]
    };

    const certifications = [];
    skills.forEach(skill => {
      if (certMap[skill]) {
        certifications.push(...certMap[skill]);
      }
    });

    return certifications;
  }

  generateMilestones(skills, phaseNumber) {
    return [
      `Complete ${skills.length} skill modules`,
      `Build ${Math.ceil(skills.length / 2)} projects`,
      `Pass ${Math.ceil(skills.length / 3)} assessments`
    ];
  }

  getResources(skill) {
    const resourceMap = {
      'TypeScript': [
        { name: 'TypeScript Documentation', type: 'documentation', url: 'https://typescriptlang.org/docs', duration: 'Ongoing' },
        { name: 'TypeScript Deep Dive', type: 'course', url: 'https://udemy.com', duration: '10 hours' }
      ],
      'React': [
        { name: 'React Documentation', type: 'documentation', url: 'https://react.dev', duration: 'Ongoing' },
        { name: 'React Advanced Patterns', type: 'course', url: 'https://udemy.com', duration: '15 hours' }
      ],
      'Node.js': [
        { name: 'Node.js Documentation', type: 'documentation', url: 'https://nodejs.org/docs', duration: 'Ongoing' },
        { name: 'Node.js Best Practices', type: 'course', url: 'https://coursera.org', duration: '12 hours' }
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

  identifyPrerequisites(userProfile) {
    const prerequisites = [];

    if (!userProfile.skills.includes('Git')) {
      prerequisites.push('Learn Git version control');
    }

    if (!userProfile.skills.includes('JavaScript')) {
      prerequisites.push('Learn JavaScript fundamentals');
    }

    return prerequisites;
  }

  defineSuccessMetrics(targetRole) {
    return [
      `Complete all ${targetRole} required skills`,
      'Build portfolio with 3+ projects',
      'Pass mock technical interviews',
      'Achieve 80+ ATS score on resume'
    ];
  }

  parseTimeline(timeline) {
    if (!timeline) return 6;
    const tl = timeline.toLowerCase().trim();

    // Match "6 weeks", "12 weeks", etc.
    const weeksMatch = tl.match(/^(\d+)\s*weeks?$/);
    if (weeksMatch) {
      // Convert weeks to months (round up so phases still make sense)
      return Math.max(1, Math.ceil(parseInt(weeksMatch[1]) / 4));
    }

    // Match "3 months", "6 months", etc.
    const monthsMatch = tl.match(/^(\d+)\s*months?$/);
    if (monthsMatch) return parseInt(monthsMatch[1]);

    // Match plain numbers
    const numMatch = tl.match(/^(\d+)$/);
    if (numMatch) return parseInt(numMatch[1]);

    return 6; // safe default
  }
}

module.exports = RoadmapService;
