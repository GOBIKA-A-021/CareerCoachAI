const pdfParse = require('pdf-parse');
const fs = require('fs');

class ResumeParser {
  constructor() {
    this.skillDatabase = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'Git', 'CI/CD', 'REST APIs', 'GraphQL',
      'Machine Learning', 'Data Science', 'AI'
    ];
  }

  async parseResume(filePath) {
    try {
      // Read PDF file
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      
      const text = this.cleanText(data.text);
      
      const parsedContent = {
        rawText: text,
        skills: this.extractSkills(text),
        education: this.extractEducation(text),
        experience: this.extractExperience(text),
        projects: this.extractProjects(text),
        certifications: this.extractCertifications(text),
        achievements: this.extractAchievements(text)
      };

      return parsedContent;
    } catch (error) {
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  cleanText(text) {
    // Remove extra whitespace
    text = text.replace(/\s+/g, ' ');
    
    // Remove special characters
    text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    
    // Normalize line breaks
    text = text.replace(/\r\n/g, '\n');
    
    return text.trim();
  }

  extractSkills(text) {
    const foundSkills = [];
    const lowerText = text.toLowerCase();

    this.skillDatabase.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    return [...new Set(foundSkills)];
  }

  extractEducation(text) {
    const education = [];
    
    const patterns = [
      /(?:B\.Tech|B\.E\.|M\.Tech|M\.E\.|B\.Sc|M\.Sc|Ph\.D|Bachelor|Master)[\s\S]*?(?=\n\n|\n[A-Z]|\Z)/gi,
      /(?:University|College|Institute)[\s\S]*?(?=\n\n|\n[A-Z]|\Z)/gi
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          education.push({
            degree: this.extractDegree(match),
            institution: this.extractInstitution(match),
            year: this.extractYear(match),
            gpa: this.extractGPA(match)
          });
        });
      }
    });

    return education;
  }

  extractDegree(text) {
    const patterns = [
      /B\.Tech\s+(?:in\s+)?(.+?)(?:,|\n)/i,
      /B\.E\.?\s+(?:in\s+)?(.+?)(?:,|\n)/i,
      /M\.Tech\s+(?:in\s+)?(.+?)(?:,|\n)/i,
      /Bachelor(?:'s)?\s+(?:of\s+)?(?:Arts|Science|Engineering)\s+(?:in\s+)?(.+?)(?:,|\n)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Not specified';
  }

  extractInstitution(text) {
    const patterns = [
      /(?:at|@)\s+([A-Z][A-Za-z\s&]+)(?:,|\n|\.)/i,
      /^([A-Z][A-Za-z\s&]+)(?:,|\n|\.)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Not specified';
  }

  extractYear(text) {
    const match = text.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : 'Not specified';
  }

  extractGPA(text) {
    const match = text.match(/\b\d+\.\d+\s*(?:GPA|CGPA)?/i);
    return match ? match[0] : 'Not specified';
  }

  extractExperience(text) {
    const experience = [];
    const expSection = this.extractSection(text, ['Experience', 'Work Experience', 'Employment']);
    
    if (expSection) {
      const expBlocks = this.splitByDate(expSection);
      
      expBlocks.forEach(block => {
        experience.push({
          company: this.extractCompany(block),
          position: this.extractPosition(block),
          duration: this.extractDuration(block),
          description: this.extractJobDescription(block)
        });
      });
    }

    return experience;
  }

  extractProjects(text) {
    const projects = [];
    const projectSection = this.extractSection(text, ['Projects', 'Personal Projects', 'Key Projects']);
    
    if (projectSection) {
      const projectBlocks = projectSection.split(/\n(?=[A-Z])/);
      
      projectBlocks.forEach(block => {
        if (block.length > 50) {
          projects.push({
            name: this.extractProjectName(block),
            description: this.extractDescription(block),
            technologies: this.extractTechnologies(block),
            duration: this.extractDuration(block)
          });
        }
      });
    }

    return projects;
  }

  extractCertifications(text) {
    const certifications = [];
    const certSection = this.extractSection(text, ['Certifications', 'Certificates', 'Courses']);
    
    if (certSection) {
      const patterns = [
        /([A-Z][^,\n]+(?:Certified|Certificate|Certification)[^\n]*)/gi
      ];

      patterns.forEach(pattern => {
        const matches = certSection.match(pattern);
        if (matches) {
          matches.forEach(match => {
            certifications.push({
              name: match.trim(),
              issuer: this.extractIssuer(match),
              date: this.extractCertDate(match)
            });
          });
        }
      });
    }

    return certifications;
  }

  extractAchievements(text) {
    const achievements = [];
    const patterns = [
      /(?:Achieved|Accomplished|Won|Awarded|Improved|Increased|Reduced)[^.\n]*\./gi
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        achievements.push(...matches);
      }
    });

    return achievements;
  }

  extractSection(text, headings) {
    for (const heading of headings) {
      const regex = new RegExp(`${heading}[:\\s]*([\\s\\S]*?)(?=\\n(?:[A-Z][a-z]+\\s*:|\\n\\n|$))`, 'i');
      const match = text.match(regex);
      if (match) return match[1];
    }
    return null;
  }

  splitByDate(text) {
    return text.split(/\n(?=\d+\s*(?:years?|months?))/i);
  }

  extractCompany(text) {
    const patterns = [
      /(?:at|@)\s+([A-Z][A-Za-z\s&]+)(?:,|\n|\.)/i,
      /^([A-Z][A-Za-z\s&]+)(?:,|\n|\.)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Not specified';
  }

  extractPosition(text) {
    const patterns = [
      /(?:as|a|an)\s+([A-Z][A-Za-z\s]+)(?:,|\n|at)/i,
      /^([A-Z][A-Za-z\s]+)(?:,|\n|at)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Not specified';
  }

  extractDuration(text) {
    const match = text.match(/\d+\s*(?:years?|months?|days?)/i);
    return match ? match[0] : 'Not specified';
  }

  extractJobDescription(text) {
    return text.substring(0, 200);
  }

  extractProjectName(text) {
    const lines = text.split('\n');
    return lines[0].trim();
  }

  extractDescription(text) {
    const lines = text.split('\n');
    return lines.slice(1, 3).join(' ').trim();
  }

  extractTechnologies(text) {
    const techKeywords = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'MongoDB', 'SQL', 'AWS', 'Docker'];
    const found = [];
    
    techKeywords.forEach(tech => {
      if (text.toLowerCase().includes(tech.toLowerCase())) {
        found.push(tech);
      }
    });

    return found;
  }

  extractIssuer(text) {
    const patterns = [
      /(?:from|by)\s+([A-Z][A-Za-z\s]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }

    return 'Not specified';
  }

  extractCertDate(text) {
    const match = text.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i);
    return match ? match[0] : 'Not specified';
  }
}

module.exports = ResumeParser;
