import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import { reportService } from '../../services/reportService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import {
  FileText, Download, Calendar, Target, TrendingUp,
  AlertCircle, Sparkles, RefreshCw, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

const Reports = () => {
  const navigate = useNavigate()
  const [loading, setLoading]       = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reports, setReports]       = useState([])
  const [latestAnalysis, setLatestAnalysis] = useState(null)

  useEffect(() => { loadReports() }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      // Load reports and latest analysis in parallel
      const [reportsRes, analysesRes] = await Promise.allSettled([
        reportService.getUserReports(),
        analysisService.getUserAnalyses()
      ])

      if (reportsRes.status === 'fulfilled') {
        // reportService returns { reports, pagination } after unwrapping response.data.data
        const data = reportsRes.value
        setReports(data.reports || data || [])
      }

      if (analysesRes.status === 'fulfilled') {
        const data = analysesRes.value
        const list = data.analyses || data || []
        if (list.length > 0) setLatestAnalysis(list[0])
      }
    } catch (error) {
      console.error('Failed to load reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!latestAnalysis) {
      toast.error('Run a resume analysis first to generate a report')
      navigate('/resume-analysis')
      return
    }
    setGenerating(true)
    try {
      await reportService.generateReport({ analysisId: latestAnalysis._id })
      toast.success('Report generated!')
      await loadReports()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async (reportId, fileName) => {
    try {
      const blob = await reportService.downloadReport(reportId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || `report_${reportId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Report downloaded!')
    } catch (error) {
      toast.error('Failed to download report')
    }
  }

  if (loading) return <Loader text="Loading reports..." />

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Reports</h1>
          <p className="text-slate-400 text-sm mt-1">
            Download your full AI Career Intelligence reports as PDF
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadReports} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button onClick={handleGenerate} loading={generating} className="text-xs">
            <Sparkles className="w-4 h-4 mr-1.5" />
            {generating ? 'Generating…' : 'Generate New Report'}
          </Button>
        </div>
      </div>

      {/* Latest analysis context banner */}
      {latestAnalysis && (
        <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-500/10 border-indigo-500/30">
          <div className="flex items-center gap-3 text-sm">
            <Target className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">
                Latest analysis: <span className="text-indigo-400">{latestAnalysis.targetRole}</span>
              </p>
              <p className="text-xs text-slate-400">
                ATS: {latestAnalysis.results?.atsScore?.overall ?? '—'} &nbsp;|&nbsp;
                Placement: {latestAnalysis.results?.placementScore?.overall ?? '—'} &nbsp;|&nbsp;
                {new Date(latestAnalysis.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button onClick={handleGenerate} loading={generating} className="text-xs flex-shrink-0">
            Generate Report for This
          </Button>
        </Card>
      )}

      {/* Empty state */}
      {reports.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Reports Yet</h2>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">
            Run a resume analysis first, then generate a report to see it here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => navigate('/upload-resume')} className="text-xs">
              Upload Resume
            </Button>
            <Button onClick={() => navigate('/resume-analysis')} className="text-xs">
              Run Analysis
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <Card key={report._id} className="p-4 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{report.fileName || `Report ${report._id.slice(-6)}`}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.generatedAt || report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.generatedAt || report.createdAt).toLocaleTimeString()}
                      </span>
                      {report.reportType && (
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 font-semibold capitalize">
                          {report.reportType}
                        </span>
                      )}
                      {report.metadata?.atsScore != null && (
                        <span className="flex items-center gap-1 text-blue-400">
                          <Target className="w-3 h-3" /> ATS {report.metadata.atsScore}
                        </span>
                      )}
                      {report.metadata?.placementScore != null && (
                        <span className="flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-3 h-3" /> Placement {report.metadata.placementScore}
                        </span>
                      )}
                      <span className="text-slate-600">
                        {report.downloadCount ?? 0} downloads
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(report._id, report.fileName)}
                  className="text-xs flex-shrink-0"
                  size="sm"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reports
