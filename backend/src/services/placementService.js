class PlacementService {
  /**
   * Main entry point.
   * @param {object} analysis  - Mongoose Analysis document (resumeId must be populated)
   * @returns {object} scores
   */
  calculatePlacementScore(analysis) {
    const technical    = this.calculateTechnicalScore(analysis);
    const projects     = this.calculateProjectScore(analysis);
    const resume       = this.calculateResumeScore(analysis);
    const communication = this.calculateCommunicationScore(analysis);

    // Guard against NaN before weighting
    const safe = (n) => (Number.isFinite(n) ? n : 0);

    const weights = { technical: 0.40, projects: 0.25, resume: 0.25, communication: 0.10 };

    const overall =
      safe(technical)     * weights.technical +
      safe(projects)      * weights.projects  +
      safe(resume)        * weights.resume    +
      safe(communication) * weights.communication;

    return {
      technical:     Math.round(safe(technical)),
      projects:      Math.round(safe(projects)),
      resume:        Math.round(safe(resume)),
      communication: Math.round(safe(communication)),
      overall:       Math.round(overall),
      breakdown: {
        technicalWeight:     weights.technical,
        projectWeight:       weights.projects,
        resumeWeight:        weights.resume,
        communicationWeight: weights.communication
      },
      placementProbability: this.calculateProbability(overall)
    };
  }

  // ── Technical (skill gap ratio) ─────────────────────────────────────────────
  calculateTechnicalScore(analysis) {
    const skillGap    = analysis.results?.skillGap || {};
    const present     = skillGap.presentSkills  || [];
    const missing     = skillGap.missingSkills  || [];
    const total       = present.length + missing.length;

    // No skill data at all — give a neutral baseline so overall isn't NaN
    if (total === 0) return 50;

    let score = (present.length / total) * 100;

    // Bonus for advanced skills
    const advanced = present.filter(s => s.currentLevel === 'advanced').length;
    score += advanced * 5;

    // Penalty for high-priority gaps
    const highGaps = missing.filter(s => s.priority === 'high').length;
    score -= highGaps * 10;

    return Math.max(0, Math.min(100, score));
  }

  // ── Projects ────────────────────────────────────────────────────────────────
  calculateProjectScore(analysis) {
    // resumeId is populated — fall back to empty object if not
    const parsedContent = analysis.resumeId?.parsedContent || {};
    const projects      = parsedContent.projects || [];

    if (projects.length === 0) return 20; // baseline even with no projects

    let score = Math.min(projects.length * 15, 45);

    projects.forEach(p => {
      const tc = p.technologies?.length || 0;
      score += tc >= 5 ? 10 : tc >= 3 ? 7 : 3;
    });

    // Bonus for real-world complexity keywords
    const realWorld = projects.filter(p =>
      ['api', 'database', 'authentication', 'deploy', 'cloud', 'docker']
        .some(kw => p.description?.toLowerCase().includes(kw))
    );
    score += realWorld.length * 5;

    return Math.min(100, score);
  }

  // ── Resume quality (ATS overall) ────────────────────────────────────────────
  calculateResumeScore(analysis) {
    const ats = analysis.results?.atsScore || {};
    // If ATS overall exists use it, otherwise neutral 50
    return Number.isFinite(ats.overall) ? ats.overall : 50;
  }

  // ── Communication (resume description quality) ──────────────────────────────
  calculateCommunicationScore(analysis) {
    const parsedContent = analysis.resumeId?.parsedContent || {};
    let score = 65; // neutral baseline

    const experience = parsedContent.experience || [];
    if (experience.length > 0) {
      const allHaveDescriptions = experience.every(
        e => e.description && e.description.length > 50
      );
      if (allHaveDescriptions) score += 20;
      else score += 5;
    }

    const achievements = parsedContent.achievements || [];
    if (achievements.length > 0) score += 10;

    const rawLen = parsedContent.rawText?.length || 0;
    if (rawLen > 500 && rawLen < 12000) score += 5;

    return Math.min(100, score);
  }

  // ── Probability label ────────────────────────────────────────────────────────
  calculateProbability(overall) {
    const s = Number.isFinite(overall) ? overall : 0;
    if (s >= 85) return 'Very High (80-90%)';
    if (s >= 70) return 'High (60-80%)';
    if (s >= 55) return 'Medium (40-60%)';
    if (s >= 40) return 'Low (20-40%)';
    return 'Very Low (< 40%)';
  }
}

module.exports = PlacementService;
