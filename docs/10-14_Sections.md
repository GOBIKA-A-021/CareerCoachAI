# AI Career Coach - Sections 10-14

---

<a name="section-10"></a>
# SECTION 10: INTERVIEW GENERATOR

## 10.1 Technical Questions

```javascript
// services/interviewService.js
class InterviewService {
  async generateTechnicalQuestions(role, difficulty = 'medium') {
    const questionDatabase = {
      'Full Stack Developer': {
        easy: [
          {
            question: 'What is the difference between let, const, and var in JavaScript?',
            answer: 'let and const are block-scoped, while var is function-scoped. const cannot be reassigned, while let can.',
            topics: ['JavaScript', 'ES6'],
            frequency: 85
          },
          {
            question: 'Explain the concept of closures in JavaScript.',
            answer: 'A closure is a function that has access to variables from its outer (enclosing) function, even after the outer function has returned.',
            topics: ['JavaScript', 'Functions'],
            frequency: 90
          }
        ],
        medium: [
          {
            question: 'Explain the virtual DOM in React and how it improves performance.',
            answer: 'The virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to minimize direct DOM manipulation by comparing the virtual DOM with the real DOM and only updating the changed elements.',
            topics: ['React', 'Performance'],
            frequency: 95
          },
          {
            question: 'What are React Hooks and why were they introduced?',
            answer: 'Hooks are functions that let you use state and lifecycle features in functional components. They were introduced to solve problems with class components like complex state logic and difficulty in reusing stateful logic.',
            topics: ['React', 'Hooks'],
            frequency: 92
          }
        ],
        hard: [
          {
            question: 'Design a scalable architecture for a real-time chat application.',
            answer: 'Use WebSocket for real-time communication, Redis for pub/sub, load balancer for scaling, microservices for different features, and database sharding for data distribution.',
            topics: ['System Design', 'Scalability', 'WebSockets'],
            frequency: 80
          }
        ]
      },
      'Backend Developer': {
        easy: [
          {
            question: 'What is REST and what are its main principles?',
            answer: 'REST (Representational State Transfer) is an architectural style for designing networked applications. Main principles: stateless, client-server, cacheable, uniform interface, layered system.',
            topics: ['REST', 'API Design'],
            frequency: 90
          }
        ],
        medium: [
          {
            question: 'Explain event loop in Node.js.',
            answer: 'The event loop is the mechanism that allows Node.js to perform non-blocking I/O operations. It continuously checks the call stack and callback queue, pushing callbacks from the queue to the stack when the stack is empty.',
            topics: ['Node.js', 'Async'],
            frequency: 88
          }
        ],
        hard: [
          {
            question: 'Design a rate limiter for an API.',
            answer: 'Implement token bucket or sliding window algorithm. Use Redis for distributed rate limiting. Store request counts with expiration times. Check and update counts on each request.',
            topics: ['System Design', 'Rate Limiting', 'Redis'],
            frequency: 75
          }
        ]
      }
    };

    const roleQuestions = questionDatabase[role] || questionDatabase['Full Stack Developer'];
    return roleQuestions[difficulty] || roleQuestions.medium;
  }
}
```

## 10.2 HR and Behavioral Questions

```javascript
async generateBehavioralQuestions() {
  const questions = [
    {
      category: 'Teamwork',
      questions: [
        {
          question: 'Tell me about a time you had a conflict with a team member. How did you resolve it?',
          answer: 'Use STAR method: Situation, Task, Action, Result. Focus on communication, empathy, and finding a mutually beneficial solution.',
          topics: ['Conflict Resolution', 'Communication'],
          frequency: 95
        },
        {
          question: 'Describe a situation where you had to work with a difficult team member.',
          answer: 'Highlight professionalism, patience, and focusing on shared goals rather than personal differences.',
          topics: ['Teamwork', 'Professionalism'],
          frequency: 88
        }
      ]
    },
    {
      category: 'Problem Solving',
      questions: [
        {
          question: 'Tell me about a complex problem you solved recently.',
          answer: 'Describe the problem, your analysis process, the solution you implemented, and the measurable impact of your solution.',
          topics: ['Problem Solving', 'Analytical Thinking'],
          frequency: 92
        },
        {
          question: 'Describe a time when you had to make a decision with limited information.',
          answer: 'Explain your decision-making framework, how you assessed risks, and how you validated your decision later.',
          topics: ['Decision Making', 'Risk Assessment'],
          frequency: 85
        }
      ]
    },
    {
      category: 'Leadership',
      questions: [
        {
          question: 'Tell me about a time you led a team project.',
          answer: 'Discuss your leadership style, how you motivated the team, handled challenges, and achieved project goals.',
          topics: ['Leadership', 'Project Management'],
          frequency: 80
        }
      ]
    },
    {
      category: 'Adaptability',
      questions: [
        {
          question: 'Describe a time when you had to adapt to significant changes at work.',
          answer: 'Show flexibility, positive attitude, and how you helped others adapt to the change.',
          topics: ['Adaptability', 'Change Management'],
          frequency: 78
        }
      ]
    }
  ];

  return questions;
}
```

## 10.3 Coding Questions

```javascript
async generateCodingQuestions(role, difficulty = 'medium') {
  const codingQuestions = {
    'Full Stack Developer': {
      easy: [
        {
          question: 'Write a function to reverse a string.',
          answer: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          topics: ['Strings', 'Arrays'],
          frequency: 90
        },
        {
          question: 'Check if a string is a palindrome.',
          answer: `function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`,
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          topics: ['Strings'],
          frequency: 85
        }
      ],
      medium: [
        {
          question: 'Implement a debounce function.',
          answer: `function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(1)',
          topics: ['Functions', 'Performance'],
          frequency: 88
        },
        {
          question: 'Find the first non-repeating character in a string.',
          answer: `function firstNonRepeating(str) {
  const count = {};
  for (const char of str) {
    count[char] = (count[char] || 0) + 1;
  }
  for (const char of str) {
    if (count[char] === 1) return char;
  }
  return null;
}`,
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          topics: ['Strings', 'Hash Maps'],
          frequency: 82
        }
      ],
      hard: [
        {
          question: 'Implement LRU Cache.',
          answer: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}`,
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(capacity)',
          topics: ['Data Structures', 'Design'],
          frequency: 75
        }
      ]
    }
  };

  return codingQuestions[role]?.[difficulty] || codingQuestions['Full Stack Developer'].medium;
}
```

## 10.4 Company-Specific Questions

```javascript
async generateCompanySpecificQuestions(company, role) {
  const companyData = {
    'Google': {
      culture: 'Focus on innovation, technical excellence, and "moonshot" thinking.',
      questions: [
        {
          question: 'How would you improve Google Search?',
          answer: 'Discuss user experience, technical improvements, AI integration, and measurable impact.',
          topics: ['Product Thinking', 'Innovation'],
          frequency: 80
        },
        {
          question: 'Design a system for Google Maps real-time updates.',
          answer: 'Consider data sources, update frequency, caching strategies, and scalability.',
          topics: ['System Design', 'Real-time Systems'],
          frequency: 75
        }
      ]
    },
    'Amazon': {
      culture: 'Customer obsession, ownership, and bias for action. Leadership principles are key.',
      questions: [
        {
          question: 'Tell me about a time you demonstrated "Customer Obsession".',
          answer: 'Provide a specific example where you put customer needs first and the impact it had.',
          topics: ['Leadership Principles', 'Customer Focus'],
          frequency: 90
        },
        {
          question: 'Design a system for Amazon product recommendations.',
          answer: 'Discuss collaborative filtering, content-based filtering, scalability, and personalization.',
          topics: ['System Design', 'Machine Learning'],
          frequency: 85
        }
      ]
    },
    'Microsoft': {
      culture: 'Growth mindset, diversity, and inclusive innovation.',
      questions: [
        {
          question: 'How would you improve Microsoft Teams?',
          answer: 'Focus on user feedback, performance, new features, and integration with other Microsoft products.',
          topics: ['Product Thinking', 'Collaboration'],
          frequency: 78
        }
      ]
    },
    'Meta': {
      culture: 'Move fast, build things, and focus on social connection.',
      questions: [
        {
          question: 'Design a feature for Facebook that increases user engagement.',
          answer: 'Consider user behavior, social dynamics, technical implementation, and metrics.',
          topics: ['Product Design', 'Social Media'],
          frequency: 82
        }
      ]
    }
  };

  return companyData[company] || {
    culture: 'Focus on technical excellence and innovation.',
    questions: [
      {
        question: 'Why do you want to work at our company?',
        answer: 'Research the company, align with their values, and show genuine interest.',
        topics: ['Company Research', 'Motivation'],
        frequency: 100
      }
    ]
  };
}
```

## 10.5 Complete Interview Generator

```javascript
class InterviewService {
  async generateInterviewPrep(role, company, difficulty) {
    const [technical, behavioral, coding, companySpecific] = await Promise.all([
      this.generateTechnicalQuestions(role, difficulty),
      this.generateBehavioralQuestions(),
      this.generateCodingQuestions(role, difficulty),
      company ? this.generateCompanySpecificQuestions(company, role) : null
    ]);

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

  getInterviewTips(role, company) {
    const tips = [
      'Research the company thoroughly before the interview',
      'Practice explaining your projects clearly',
      'Prepare questions to ask the interviewer',
      'Be honest about what you don\'t know',
      'Show enthusiasm for learning and growth'
    ];

    if (company === 'Google') {
      tips.push('Be ready for system design questions');
      tips.push('Practice explaining complex technical concepts');
    }

    if (company === 'Amazon') {
      tips.push('Review Amazon Leadership Principles');
      tips.push('Prepare STAR method examples for each principle');
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
```

---

<a name="section-11"></a>
# SECTION 11: PLACEMENT SCORE

## 11.1 Score Calculation Formula

```javascript
// services/placementService.js
class PlacementService {
  calculatePlacementScore(analysis) {
    const scores = {
      technical: this.calculateTechnicalScore(analysis),
      projects: this.calculateProjectScore(analysis),
      resume: this.calculateResumeScore(analysis),
      communication: this.calculateCommunicationScore(analysis)
    };

    // Weighted formula
    const weights = {
      technical: 0.40,      // 40% weight
      projects: 0.25,       // 25% weight
      resume: 0.25,         // 25% weight
      communication: 0.10    // 10% weight
    };

    scores.overall = 
      scores.technical * weights.technical +
      scores.projects * weights.projects +
      scores.resume * weights.resume +
      scores.communication * weights.communication;

    scores.placementProbability = this.calculateProbability(scores.overall);

    return scores;
  }

  calculateTechnicalScore(analysis) {
    const skillGap = analysis.skillGap;
    const presentSkills = skillGap.presentSkills || [];
    const missingSkills = skillGap.missingSkills || [];

    // Base score from skill match
    let score = (presentSkills.length / (presentSkills.length + missingSkills.length)) * 100;

    // Bonus for advanced skills
    const advancedSkills = presentSkills.filter(s => s.currentLevel === 'advanced');
    score += advancedSkills.length * 5;

    // Penalty for missing high-priority skills
    const highPriorityMissing = missingSkills.filter(s => s.priority === 'high');
    score -= highPriorityMissing.length * 10;

    return Math.max(0, Math.min(100, score));
  }

  calculateProjectScore(analysis) {
    const projects = analysis.resume?.parsedContent?.projects || [];
    
    if (projects.length === 0) return 20;

    let score = 0;
    
    // Points for number of projects
    score += Math.min(projects.length * 15, 45); // Max 45 points for quantity

    // Points for project complexity
    projects.forEach(project => {
      const techCount = project.technologies?.length || 0;
      if (techCount >= 5) score += 10;
      else if (techCount >= 3) score += 7;
      else score += 3;
    });

    // Points for real-world applicability
    const realWorldProjects = projects.filter(p => 
      p.description?.toLowerCase().includes('api') ||
      p.description?.toLowerCase().includes('database') ||
      p.description?.toLowerCase().includes('authentication')
    );
    score += realWorldProjects.length * 5;

    return Math.min(100, score);
  }

  calculateResumeScore(analysis) {
    const atsScore = analysis.atsScore || {};
    
    return atsScore.overall || 50;
  }

  calculateCommunicationScore(analysis) {
    // Since we can't actually assess communication, use proxy metrics
    const resume = analysis.resume?.parsedContent;
    
    let score = 70; // Base score

    // Check for clear descriptions
    if (resume?.experience?.length > 0) {
      const hasDescriptions = resume.experience.every(exp => 
        exp.description && exp.description.length > 50
      );
      if (hasDescriptions) score += 15;
    }

    // Check for achievements
    if (resume?.achievements?.length > 0) {
      score += 10;
    }

    // Check for professional formatting
    if (resume?.rawText?.length > 500 && resume?.rawText?.length < 10000) {
      score += 5;
    }

    return Math.min(100, score);
  }

  calculateProbability(overallScore) {
    if (overallScore >= 85) return 'Very High (80-90%)';
    if (overallScore >= 70) return 'High (60-80%)';
    if (overallScore >= 55) return 'Medium (40-60%)';
    if (overallScore >= 40) return 'Low (20-40%)';
    return 'Very Low (0-20%)';
  }
}
```

## 11.2 Score Breakdown

```
PLACEMENT SCORE BREAKDOWN:

Technical Score (40% weight):
- Skill match percentage: 0-60 points
- Advanced skills bonus: +5 points per advanced skill
- High-priority missing skills penalty: -10 points each
- Range: 0-100

Project Score (25% weight):
- Number of projects: 0-45 points (max 3 projects)
- Project complexity: 0-30 points (based on tech stack)
- Real-world applicability: 0-25 points (APIs, databases, etc.)
- Range: 0-100

Resume Score (25% weight):
- ATS overall score: Direct mapping
- Range: 0-100

Communication Score (10% weight):
- Base score: 70 points
- Clear descriptions: +15 points
- Achievements listed: +10 points
- Professional formatting: +5 points
- Range: 0-100

Overall Score:
= (Technical × 0.40) + (Projects × 0.25) + (Resume × 0.25) + (Communication × 0.10)
Range: 0-100
```

## 11.3 Score Interpretation

| Score Range | Probability | Interpretation | Recommendations |
|-------------|-------------|----------------|-----------------|
| > 85 | Very High (80-90%) | Excellent placement readiness | Apply to top companies, focus on interview prep |
| 70-84 | High (60-80%) | Good placement readiness | Work on remaining skill gaps, build more projects |
| 55-69 | Medium (40-60%) | Moderate readiness | Significant skill gap, need more projects |
| 40-54 | Low (20-40%) | Low readiness | Major skill gaps, resume needs improvement |
| < 40 | Very Low (0-20%) | Not ready | Complete skill development, rebuild resume |

---

<a name="section-12"></a>
# SECTION 12: PDF REPORT GENERATION

## 12.1 Report Structure

```javascript
// services/reportService.js
const PDFDocument = require('pdfkit');
const fs = require('fs');

class ReportService {
  async generateComprehensiveReport(analysis) {
    const doc = new PDFDocument();
    const outputPath = `reports/report_${analysis._id}.pdf`;
    const stream = fs.createWriteStream(outputPath);
    
    doc.pipe(stream);

    // Title Page
    this.addTitlePage(doc, analysis);

    // Executive Summary
    doc.addPage();
    this.addExecutiveSummary(doc, analysis);

    // ATS Analysis
    doc.addPage();
    this.addATSAnalysis(doc, analysis);

    // Skill Gap Analysis
    doc.addPage();
    this.addSkillGapAnalysis(doc, analysis);

    // Career Roadmap
    doc.addPage();
    this.addCareerRoadmap(doc, analysis);

    // Interview Questions
    doc.addPage();
    this.addInterviewQuestions(doc, analysis);

    // Placement Score
    doc.addPage();
    this.addPlacementScore(doc, analysis);

    // Recommendations
    doc.addPage();
    this.addRecommendations(doc, analysis);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

  addTitlePage(doc, analysis) {
    doc.fontSize(24).text('Career Intelligence Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Generated for: ${analysis.userId}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Target Role: ${analysis.targetRole}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
  }

  addExecutiveSummary(doc, analysis) {
    doc.fontSize(18).text('Executive Summary');
    doc.moveDown();

    const atsScore = analysis.atsScore?.overall || 0;
    const placementScore = analysis.placementScore?.overall || 0;

    doc.fontSize(14).text(`ATS Score: ${atsScore}/100`);
    doc.fontSize(14).text(`Placement Score: ${placementScore}/100`);
    doc.moveDown();

    doc.fontSize(12).text('Key Findings:');
    analysis.recommendations?.forEach(rec => {
      doc.text(`• ${rec}`);
    });
  }

  addATSAnalysis(doc, analysis) {
    doc.fontSize(18).text('ATS Analysis');
    doc.moveDown();

    const ats = analysis.atsScore;
    
    doc.fontSize(14).text(`Overall Score: ${ats.overall}/100`);
    doc.moveDown();

    doc.fontSize(12).text('Breakdown:');
    doc.text(`Keyword Match: ${ats.keywordMatch}/100`);
    doc.text(`Format Score: ${ats.formatScore}/100`);
    doc.text(`Section Completeness: ${ats.sectionCompleteness}/100`);
    doc.text(`Action Verbs: ${ats.actionVerbs}/100`);
    doc.text(`Quantifiable Achievements: ${ats.quantifiableAchievements}/100`);
    doc.moveDown();

    doc.fontSize(12).text('Strengths:');
    ats.feedback?.strengths?.forEach(strength => {
      doc.text(`• ${strength}`);
    });
    doc.moveDown();

    doc.fontSize(12).text('Areas for Improvement:');
    ats.feedback?.weaknesses?.forEach(weakness => {
      doc.text(`• ${weakness}`);
    });
  }

  addSkillGapAnalysis(doc, analysis) {
    doc.fontSize(18).text('Skill Gap Analysis');
    doc.moveDown();

    const skillGap = analysis.skillGap;

    doc.fontSize(14).text('Present Skills:');
    skillGap.presentSkills?.forEach(skill => {
      doc.text(`• ${skill.skill} (${skill.currentLevel})`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Missing Skills:');
    skillGap.missingSkills?.forEach(skill => {
      doc.text(`• ${skill.skill} [${skill.priority} priority]`);
      doc.text(`  Estimated time: ${skill.estimatedTime}`);
    });
  }

  addCareerRoadmap(doc, analysis) {
    doc.fontSize(18).text('Career Roadmap');
    doc.moveDown();

    const roadmap = analysis.roadmap;

    doc.fontSize(14).text(`Total Duration: ${roadmap.totalDuration}`);
    doc.moveDown();

    roadmap.phases?.forEach((phase, index) => {
      doc.fontSize(12).text(`Phase ${phase.phaseNumber}: ${phase.title}`);
      doc.text(`Duration: ${phase.duration}`);
      doc.text(`Objectives:`);
      phase.objectives?.forEach(obj => doc.text(`  • ${obj}`));
      doc.moveDown();
    });
  }

  addInterviewQuestions(doc, analysis) {
    doc.fontSize(18).text('Interview Preparation');
    doc.moveDown();

    const questions = analysis.interviewQuestions;

    doc.fontSize(14).text('Technical Questions:');
    questions?.technical?.forEach((q, i) => {
      doc.text(`${i + 1}. ${q.question}`);
      doc.text(`   Answer: ${q.answer}`);
      doc.moveDown();
    });
  }

  addPlacementScore(doc, analysis) {
    doc.fontSize(18).text('Placement Score');
    doc.moveDown();

    const score = analysis.placementScore;

    doc.fontSize(14).text(`Overall Score: ${score.overall}/100`);
    doc.moveDown();

    doc.fontSize(12).text('Breakdown:');
    doc.text(`Technical: ${score.technical}/100 (40% weight)`);
    doc.text(`Projects: ${score.projects}/100 (25% weight)`);
    doc.text(`Resume: ${score.resume}/100 (25% weight)`);
    doc.text(`Communication: ${score.communication}/100 (10% weight)`);
    doc.moveDown();

    doc.fontSize(14).text(`Placement Probability: ${score.placementProbability}`);
  }

  addRecommendations(doc, analysis) {
    doc.fontSize(18).text('Recommendations');
    doc.moveDown();

    doc.fontSize(12);
    analysis.recommendations?.forEach((rec, i) => {
      doc.text(`${i + 1}. ${rec}`);
      doc.moveDown();
    });
  }
}
```

## 12.2 Report Sections

1. **Title Page**
   - Report title
   - User information
   - Target role
   - Generation date

2. **Executive Summary**
   - ATS Score
   - Placement Score
   - Key findings
   - Top recommendations

3. **ATS Analysis**
   - Overall score
   - Score breakdown
   - Strengths
   - Weaknesses
   - Improvement suggestions

4. **Skill Gap Analysis**
   - Present skills
   - Missing skills
   - Priority levels
   - Learning time estimates

5. **Career Roadmap**
   - Total duration
   - Phase breakdown
   - Learning objectives
   - Milestones

6. **Interview Questions**
   - Technical questions
   - Behavioral questions
   - Coding questions
   - Sample answers

7. **Placement Score**
   - Overall score
   - Component scores
   - Placement probability
   - Improvement areas

8. **Recommendations**
   - Prioritized action items
   - Resource links
   - Timeline suggestions

---

<a name="section-13"></a>
# SECTION 13: AUTHENTICATION

## 13.1 JWT Login System

```javascript
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
```

## 13.2 Registration

```javascript
// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 13.3 Login

```javascript
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 13.4 Password Hashing

```javascript
// utils/passwordUtils.js
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const validatePasswordStrength = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
```

## 13.5 Protected Routes

```javascript
// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// All routes below require authentication
router.use(authMiddleware);

// Student routes
router.post('/resume/upload', resumeController.uploadResume);
router.get('/resume/analysis', resumeController.getAnalysis);
router.get('/roadmap', resumeController.getRoadmap);

// Admin routes (require admin role)
router.get('/admin/users', adminMiddleware, adminController.getAllUsers);
router.delete('/admin/users/:id', adminMiddleware, adminController.deleteUser);

module.exports = router;
```

## 13.6 Role-Based Access

```javascript
// middleware/roleMiddleware.js
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }
    next();
  };
};

// Usage in routes
router.get('/admin/dashboard', 
  authMiddleware, 
  checkRole(['admin']), 
  adminController.getDashboard
);

router.get('/student/dashboard', 
  authMiddleware, 
  checkRole(['student', 'admin']), 
  studentController.getDashboard
);
```

---

<a name="section-14"></a>
# SECTION 14: ADMIN PANEL

## 14.1 User Management

```javascript
// controllers/adminController.js
const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = search 
      ? { $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]}
      : {};

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's resumes
    const resumes = await Resume.find({ userId: user._id });
    
    // Get user's analyses
    const analyses = await Analysis.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      resumes,
      recentAnalyses: analyses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password update through this endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete user's data
    await User.findByIdAndDelete(id);
    await Resume.deleteMany({ userId: id });
    await Analysis.deleteMany({ userId: id });

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      isActive: user.isActive 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 14.2 Career Role Management

```javascript
const CareerRole = require('../models/CareerRole');

const getAllRoles = async (req, res) => {
  try {
    const roles = await CareerRole.find().sort({ title: 1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const role = new CareerRole(req.body);
    await role.save();
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await CareerRole.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    await CareerRole.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 14.3 Analytics Dashboard

```javascript
const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = await User.countDocuments(dateFilter);

    // Resume statistics
    const totalResumes = await Resume.countDocuments();
    const uploadedResumes = await Resume.countDocuments(dateFilter);

    // Analysis statistics
    const totalAnalyses = await Analysis.countDocuments();
    const completedAnalyses = await Analysis.countDocuments({
      ...dateFilter,
      'results.atsScore.overall': { $exists: true }
    });

    // Average scores
    const avgATSScore = await Analysis.aggregate([
      { $match: { 'results.atsScore.overall': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$results.atsScore.overall' } } }
    ]);

    const avgPlacementScore = await Analysis.aggregate([
      { $match: { 'results.placementScore.overall': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$results.placementScore.overall' } } }
    ]);

    // Role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers
      },
      resumes: {
        total: totalResumes,
        uploaded: uploadedResumes
      },
      analyses: {
        total: totalAnalyses,
        completed: completedAnalyses
      },
      scores: {
        avgATS: avgATSScore[0]?.avg || 0,
        avgPlacement: avgPlacementScore[0]?.avg || 0
      },
      roleDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 14.4 Reports Monitoring

```javascript
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;

    const query = userId ? { userId } : {};

    const reports = await Report.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('analysisId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ generatedAt: -1 });

    const total = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSystemHealth = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Check ChromaDB
    let chromaStatus = 'unknown';
    try {
      await chromaClient.heartbeat();
      chromaStatus = 'connected';
    } catch (error) {
      chromaStatus = 'disconnected';
    }

    // Check Gemini API
    let geminiStatus = 'unknown';
    try {
      await geminiService.healthCheck();
      geminiStatus = 'connected';
    } catch (error) {
      geminiStatus = 'disconnected';
    }

    // System resources
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    res.json({
      database: dbStatus,
      chromaDB: chromaStatus,
      geminiAPI: geminiStatus,
      system: {
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
        },
        uptime: `${Math.floor(uptime / 3600)} hours`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 14.5 Admin Panel Features

**User Management:**
- View all users with pagination
- Search users by name or email
- View user details and activity
- Update user information
- Activate/deactivate accounts
- Delete users (with data cleanup)

**Career Role Management:**
- View all career roles
- Create new roles
- Update role requirements
- Delete roles
- View role statistics

**Analytics Dashboard:**
- User growth charts
- Resume upload trends
- Analysis completion rates
- Average ATS scores
- Average placement scores
- Role distribution

**Reports Monitoring:**
- View all generated reports
- Filter by user or date
- Download reports
- Report statistics

**System Health:**
- Database connection status
- ChromaDB status
- Gemini API status
- Memory usage
- System uptime
