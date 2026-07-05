class ReportGenerator {
  async generate(results) {
    const report = {
      userId: results.userId,
      resumeId: results.resumeId,
      analysisType: 'comprehensive',
      results: {
        ats: results.atsScore,
        skillGap: results.skillGap,
        placementScore: results.placementScore
      },
      recommendations: results.recommendations || [],
      generatedAt: new Date()
    };

    return report;
  }

  structureData(results) {
    return {
      summary: {
        atsScore: results.atsScore?.overall || 0,
        placementScore: results.placementScore?.overall || 0,
        skillCount: results.skillGap?.presentSkills?.length || 0
      },
      details: results
    };
  }
}

module.exports = ReportGenerator;
