const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ReportService {
  async generateComprehensiveReport(analysis) {
    const doc = new PDFDocument();
    const reportsDir = process.env.REPORT_DIR || './reports';
    const outputPath = path.join(reportsDir, `report_${analysis._id}.pdf`);
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

    const atsScore = analysis.results.atsScore?.overall || 0;
    const placementScore = analysis.results.placementScore?.overall || 0;

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

    const ats = analysis.results.atsScore;
    
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

    const skillGap = analysis.results.skillGap;

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

  addPlacementScore(doc, analysis) {
    doc.fontSize(18).text('Placement Score');
    doc.moveDown();

    const score = analysis.results.placementScore;

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

module.exports = ReportService;
