class InterviewService {
  constructor() {
    this.questionDatabase = {
      'Full Stack Developer': {
        easy: [
          {
            question: 'What is the difference between let, const, and var in JavaScript?',
            answer: 'let and const are block-scoped, while var is function-scoped. const cannot be reassigned.',
            topics: ['JavaScript', 'ES6'],
            frequency: 85
          },
          {
            question: 'Explain the concept of closures in JavaScript.',
            answer: 'A closure is a function that has access to variables from its outer function.',
            topics: ['JavaScript', 'Functions'],
            frequency: 90
          }
        ],
        medium: [
          {
            question: 'Explain the virtual DOM in React and how it improves performance.',
            answer: 'The virtual DOM is a lightweight representation of the actual DOM. React uses it to minimize direct DOM manipulation.',
            topics: ['React', 'Performance'],
            frequency: 95
          },
          {
            question: 'What are React Hooks and why were they introduced?',
            answer: 'Hooks are functions that let you use state and lifecycle features in functional components.',
            topics: ['React', 'Hooks'],
            frequency: 92
          }
        ],
        hard: [
          {
            question: 'Design a scalable architecture for a real-time chat application.',
            answer: 'Use WebSocket for real-time communication, Redis for pub/sub, load balancer for scaling.',
            topics: ['System Design', 'Scalability'],
            frequency: 80
          }
        ]
      }
    };
  }

  async generateInterviewPrep(role, company, difficulty) {
    const technical = this.generateTechnicalQuestions(role, difficulty);
    const behavioral = this.generateBehavioralQuestions();
    const coding = this.generateCodingQuestions(role, difficulty);
    const companySpecific = company ? this.generateCompanySpecificQuestions(company, role) : [];

    return {
      role,
      company,
      difficulty,
      questions: {
        technical: this.shuffleArray(technical).slice(0, 10),
        behavioral: behavioral.flatMap(cat => cat.questions).slice(0, 5),
        coding: this.shuffleArray(coding).slice(0, 5),
        companySpecific: companySpecific?.questions || []
      },
      tips: this.getInterviewTips(role, company)
    };
  }

  generateTechnicalQuestions(role, difficulty) {
    const roleQuestions = this.questionDatabase[role] || this.questionDatabase['Full Stack Developer'];
    return roleQuestions[difficulty] || roleQuestions.medium;
  }

  generateBehavioralQuestions() {
    return [
      {
        category: 'Teamwork',
        questions: [
          {
            question: 'Tell me about a time you had a conflict with a team member.',
            answer: 'Use STAR method: Situation, Task, Action, Result.',
            topics: ['Conflict Resolution'],
            frequency: 95
          }
        ]
      },
      {
        category: 'Problem Solving',
        questions: [
          {
            question: 'Describe a complex problem you solved recently.',
            answer: 'Describe the problem, your analysis, solution, and impact.',
            topics: ['Problem Solving'],
            frequency: 92
          }
        ]
      }
    ];
  }

  generateCodingQuestions(role, difficulty) {
    const codingQuestions = {
      'Full Stack Developer': {
        easy: [
          {
            question: 'Write a function to reverse a string.',
            answer: 'function reverseString(str) { return str.split("").reverse().join(""); }',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            topics: ['Strings']
          }
        ],
        medium: [
          {
            question: 'Implement a debounce function.',
            answer: 'function debounce(func, wait) { let timeout; return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); }; }',
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(1)',
            topics: ['Functions']
          }
        ]
      }
    };

    return codingQuestions[role]?.[difficulty] || codingQuestions['Full Stack Developer'].medium;
  }

  generateCompanySpecificQuestions(company, role) {
    const companyData = {
      'Google': {
        culture: 'Focus on innovation and technical excellence.',
        questions: [
          {
            question: 'How would you improve Google Search?',
            answer: 'Discuss user experience, technical improvements, and AI integration.',
            topics: ['Product Thinking'],
            frequency: 80
          }
        ]
      },
      'Amazon': {
        culture: 'Customer obsession and ownership.',
        questions: [
          {
            question: 'Tell me about a time you demonstrated "Customer Obsession".',
            answer: 'Provide specific example where you put customer needs first.',
            topics: ['Leadership Principles'],
            frequency: 90
          }
        ]
      }
    };

    return companyData[company] || {
      culture: 'Focus on technical excellence.',
      questions: [
        {
          question: 'Why do you want to work at our company?',
          answer: 'Research the company and align with their values.',
          topics: ['Company Research'],
          frequency: 100
        }
      ]
    };
  }

  getInterviewTips(role, company) {
    const tips = [
      'Research the company thoroughly',
      'Practice explaining your projects',
      'Prepare questions to ask',
      'Be honest about what you don\'t know'
    ];

    if (company === 'Google') {
      tips.push('Be ready for system design questions');
    }

    if (company === 'Amazon') {
      tips.push('Review Amazon Leadership Principles');
    }

    return tips;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = InterviewService;
