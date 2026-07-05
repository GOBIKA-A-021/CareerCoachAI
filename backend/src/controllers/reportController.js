const { Report, Analysis } = require('../models');
const ReportService = require('../services/reportService');
const path = require('path');

// Generate report
const generateReport = async (req, res) => {
  try {
    const { analysisId, reportType = 'comprehensive' } = req.body;

    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ANALYSIS_NOT_FOUND',
          message: 'Analysis not found'
        }
      });
    }

    // Generate report
    const reportService = new ReportService();
    const reportPath = await reportService.generateComprehensiveReport(analysis);

    // Save report metadata
    const report = new Report({
      userId: req.user._id,
      analysisId,
      resumeId: analysis.resumeId,
      reportType,
      fileUrl: reportPath,
      fileName: path.basename(reportPath),
      metadata: {
        atsScore: analysis.results.atsScore?.overall,
        placementScore: analysis.results.placementScore?.overall,
        skillCount: analysis.results.skillGap?.presentSkills?.length,
        roadmapPhases: 0,
        interviewQuestions: 0
      }
    });

    await report.save();

    res.status(201).json({
      success: true,
      data: {
        reportId: report._id,
        fileUrl: report.fileUrl,
        fileName: report.fileName
      },
      message: 'Report generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Get user's reports
const getUserReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reports = await Report.find({ userId: req.user._id })
      .populate('analysisId')
      .sort({ generatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Download report
const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REPORT_NOT_FOUND',
          message: 'Report not found'
        }
      });
    }

    const filePath = path.join(process.cwd(), report.fileUrl);
    
    res.download(filePath, report.fileName, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: {
            code: 'DOWNLOAD_ERROR',
            message: 'Failed to download report'
          }
        });
      }
    });

    // Increment download count
    report.downloadCount += 1;
    await report.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
};

module.exports = {
  generateReport,
  getUserReports,
  downloadReport
};
