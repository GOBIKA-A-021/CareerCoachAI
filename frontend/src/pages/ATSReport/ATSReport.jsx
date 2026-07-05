import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import { 
  Target, AlertTriangle, CheckCircle, FileText, 
  HelpCircle, Sparkles, BookOpen, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const ATSReport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [resume, setResume] = useState(null)
  const [atsData, setAtsData] = useState(null)
  const [targetRole, setTargetRole] = useState('Full Stack Developer')

  useEffect(() => {
    loadRecentResumeAndAnalysis()
  }, [])

  const loadRecentResumeAndAnalysis = async () => {
    setLoading(true)
    try {
      const resumesRes = await resumeService.getUserResumes()
      const resumes = resumesRes.resumes || resumesRes.data?.resumes || []
      
      if (resumes.length > 0) {
        const currentResume = resumes.find(r => r.isCurrent) || resumes[0]
        setResume(currentResume)
        setTargetRole(currentResume.targetRole || 'Full Stack Developer')

        // Fetch latest analysis
        const analysesRes = await analysisService.getUserAnalyses()
        const analyses = analysesRes.analyses || analysesRes.data?.analyses || []
        
        // Find analysis matching current resume
        const analysisForResume = analyses.find(a => a.resumeId?._id === currentResume._id || a.resumeId === currentResume._id)
        const latestAnalysis = analysisForResume || analyses[0]
        
        if (latestAnalysis?.results?.atsScore) {
          setAtsData(latestAnalysis.results.atsScore)
        } else if (currentResume) {
          // If no analysis exists, run it
          await triggerATSAnalysis(currentResume._id, currentResume.targetRole || targetRole)
        }
      }
    } catch (error) {
      console.error('Failed to load recent resume or analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerATSAnalysis = async (resumeId, role) => {
    setAnalyzing(true)
    try {
      const response = await analysisService.performATSAnalysis({
        resumeId,
        targetRole: role
      })
      setAtsData(response.atsScore || response.data?.atsScore)
      toast.success('ATS analysis completed successfully!')
    } catch (error) {
      console.error('ATS analysis failed:', error)
      toast.error('Failed to run ATS analysis')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReanalyze = () => {
    if (!resume) return
    triggerATSAnalysis(resume._id, targetRole)
  }

  if (loading) {
    return <Loader text="Retrieving ATS scorecard details..." />
  }

  if (!resume) {
    return (
      <div className="page-container text-center py-20">
        <AlertCircle className="w-16 h-16 text-slate-350 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Active Resume Found</h1>
        <p className="text-slate-500 mb-6">Upload a resume to initialize the ATS scorer.</p>
        <Button onClick={() => navigate('/upload-resume')}>Upload Resume</Button>
      </div>
    )
  }

  // Calculate SVG stroke dashes for circular progress
  const score = atsData?.overall || 0
  const radius = 60
  const stroke = 8
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  const suggestions = [
    { id: 1, text: 'Add GitHub links: Links to repositories demonstrate project experience.', status: 'pending' },
    { id: 2, text: 'Improve project description: Use STAR method (Situation, Task, Action, Result).', status: 'pending' },
    { id: 3, text: 'Add quantified results: Showcase impact using percentages and timeframes.', status: 'pending' },
    { id: 4, text: 'Remove double column formats: Simple single column layouts parse better.', status: 'completed' },
    { id: 5, text: 'Verify core developer keyword densities.', status: 'completed' }
  ]

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">ATS Report</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            ATS parser analysis for <strong className="text-blue-600 font-semibold">{resume.fileName}</strong>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={() => navigate('/resume-analysis')} className="text-xs">
            View Extracted Data
          </Button>
          <Button onClick={handleReanalyze} loading={analyzing} className="text-xs">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Refresh ATS Scorer
          </Button>
        </div>
      </div>

      {/* Target Config Selection */}
      <Card className="flex flex-col md:flex-row md:items-end gap-4 p-5 bg-white dark:bg-slate-800">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Configure Target Role</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Java Developer">Java Developer</option>
            <option value="Python Developer">Python Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="AI Engineer">AI Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>
        <Button onClick={handleReanalyze} loading={analyzing} className="text-xs px-6 py-2.5">
          Refresh Scorecard
        </Button>
      </Card>

      {/* Scorer Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Circular SVG Scorecard */}
        <Card className="lg:col-span-1 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center">
            <Target className="w-4.5 h-4.5 text-blue-500 mr-2" />
            Overall ATS Score
          </h3>
          
          <div className="relative flex items-center justify-center mb-6">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="#e2e8f0"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="dark:stroke-slate-700"
              />
              <circle
                stroke="#2563eb"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 stroke-blue-600"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{score}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Score</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            {score >= 80 
              ? 'Excellent compatibility score. Your resume formatting and keyword density meet top employer standards.'
              : 'Moderate layout and keyword matches. Implement the recommendations on the right to optimize parser parsing.'
            }
          </p>
        </Card>

        {/* Right Side: Score breakdowns */}
        <Card className="lg:col-span-2 p-6 justify-between flex flex-col">
          <div>
            <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-4">ATS Compatibility Breakdown</h3>
          </div>
          
          <div className="space-y-4">
            {/* Keyword Match */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                <span>Keyword Match density</span>
                <span className="text-slate-800 dark:text-white">{atsData?.keywordMatch || 0}%</span>
              </div>
              <ProgressBar value={atsData?.keywordMatch || 0} />
            </div>

            {/* Formatting */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                <span>Formatting and Layouts</span>
                <span className="text-slate-800 dark:text-white">{atsData?.formatScore || 0}%</span>
              </div>
              <ProgressBar value={atsData?.formatScore || 0} color="success" />
            </div>

            {/* Action Verbs */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                <span>Action Verbs usage</span>
                <span className="text-slate-800 dark:text-white">{atsData?.actionVerbs || 0}%</span>
              </div>
              <ProgressBar value={atsData?.actionVerbs || 0} color="warning" />
            </div>

            {/* Readability */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                <span>Readability and Spacing</span>
                <span className="text-slate-800 dark:text-white">{atsData?.sectionCompleteness || 0}%</span>
              </div>
              <ProgressBar value={atsData?.sectionCompleteness || 0} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-700/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
            <span>Powered by Gemini-Pro models</span>
            <span>Refreshed: just now</span>
          </div>
        </Card>
      </div>

      {/* ATS Improvement Suggestions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
          ATS Score Optimization Checklist
        </h3>
        
        <div className="space-y-3">
          {suggestions.map(sug => (
            <div 
              key={sug.id} 
              className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-colors ${
                sug.status === 'completed'
                  ? 'bg-green-50/50 dark:bg-green-950/10 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350'
              }`}
            >
              <div className="mt-0.5">
                {sug.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium leading-relaxed">{sug.text}</p>
              </div>
              <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                sug.status === 'completed' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800' 
                  : 'bg-amber-100 dark:bg-slate-700 text-amber-800 dark:text-amber-400'
              }`}>
                {sug.status === 'completed' ? 'Pass' : 'Improve'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ATSReport
