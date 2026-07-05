import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import {
  TrendingUp, Award, Target, AlertCircle, Sparkles,
  RefreshCw, Brain, Briefcase, FileText, MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

const ScoreGauge = ({ value, label, color }) => {
  const radius = 54
  const stroke = 9
  const norm = radius - stroke * 2
  const circ = norm * 2 * Math.PI
  const offset = circ - (Math.min(value, 100) / 100) * circ

  const colorMap = {
    blue:   '#3b82f6',
    green:  '#22c55e',
    purple: '#a855f7',
    orange: '#f97316',
  }
  const hex = colorMap[color] || colorMap.blue

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[108px] h-[108px]">
        <svg width="108" height="108" className="-rotate-90">
          <circle stroke="#1e293b" fill="transparent" strokeWidth={stroke} r={norm} cx="54" cy="54" />
          <circle
            stroke={hex} fill="transparent" strokeWidth={stroke}
            strokeDasharray={`${circ} ${circ}`}
            style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 0.6s ease' }}
            strokeLinecap="round" r={norm} cx="54" cy="54"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white">{Math.round(value)}</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-400 mt-2 text-center">{label}</p>
    </div>
  )
}

const PlacementScore = () => {
  const navigate = useNavigate()
  const [loading, setLoading]           = useState(true)
  const [calculating, setCalculating]   = useState(false)
  const [resume, setResume]             = useState(null)
  const [placementData, setPlacementData] = useState(null)
  const [analysis, setAnalysis]         = useState(null)

  // ── Auto-load on mount ───────────────────────────────────────────────────────
  useEffect(() => { loadLatestPlacement() }, [])

  const loadLatestPlacement = async () => {
    setLoading(true)
    try {
      // 1. Get resumes
      const resumesRes = await resumeService.getUserResumes()
      const resumes = resumesRes.resumes || resumesRes.data?.resumes || []
      if (resumes.length === 0) { setLoading(false); return }

      const currentResume = resumes.find(r => r.isCurrent) || resumes[0]
      setResume(currentResume)

      // 2. Get all analyses (sorted newest first from backend)
      const analysesRes = await analysisService.getUserAnalyses()
      const analyses = analysesRes.analyses || analysesRes.data?.analyses || []

      if (analyses.length === 0) {
        // No analyses at all — show empty state with Generate button
        setLoading(false)
        return
      }

      // 3. Prefer: comprehensive analysis for this resume that already has a placement score
      const withScore =
        analyses.find(a =>
          (a.resumeId?._id === currentResume._id || a.resumeId === currentResume._id) &&
          Number.isFinite(a.results?.placementScore?.overall)
        ) ||
        analyses.find(a => Number.isFinite(a.results?.placementScore?.overall))

      if (withScore) {
        setAnalysis(withScore)
        setPlacementData(withScore.results.placementScore)
      } else {
        // Analyses exist but none has a placement score — calculate for the most recent
        const target = analyses[0]
        setAnalysis(target)
        await calculateFor(target._id)
      }
    } catch (err) {
      console.error('Failed to load placement score:', err)
      toast.error('Failed to load placement data')
    } finally {
      setLoading(false)
    }
  }

  const calculateFor = async (analysisId) => {
    setCalculating(true)
    try {
      const res = await analysisService.calculatePlacementScore({ analysisId })
      const score = res.placementScore || res.data?.placementScore
      if (score) {
        setPlacementData(score)
        toast.success('Placement score calculated!')
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Calculation failed')
    } finally {
      setCalculating(false)
    }
  }

  const handleRecalculate = async () => {
    if (!analysis) {
      toast.error('No analysis found — run a Resume Analysis first')
      return
    }
    await calculateFor(analysis._id)
  }

  const handleRunAnalysis = async () => {
    if (!resume) return
    setCalculating(true)
    try {
      const res = await analysisService.performComprehensiveAnalysis({
        resumeId: resume._id,
        targetRole: resume.targetRole || 'Full Stack Developer'
      })
      // Comprehensive analysis already includes placementScore — use it directly
      // res = { analysisId, comprehensive: { atsScore, skillGap, placementScore }, recommendations }
      const score = res.comprehensive?.placementScore
      if (score) {
        setPlacementData(score)
        // Store analysis reference for recalculate
        setAnalysis({ _id: res.analysisId })
        toast.success('Placement score generated!')
      } else {
        // Fallback: calculate separately if comprehensive didn't return it
        const analysisId = res.analysisId
        if (analysisId) await calculateFor(analysisId)
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Analysis failed. Please try again.')
    } finally {
      setCalculating(false)
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) return <Loader text="Loading placement score..." />

  // ── No resume state ──────────────────────────────────────────────────────────
  if (!resume) {
    return (
      <div className="page-container text-center py-20">
        <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">No Resume Found</h1>
        <p className="text-slate-400 mb-6">Upload a resume to calculate your placement readiness score.</p>
        <Button onClick={() => navigate('/upload-resume')}>Upload Resume</Button>
      </div>
    )
  }

  // ── No analysis state ────────────────────────────────────────────────────────
  if (!placementData) {
    return (
      <div className="page-container space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Placement Score</h1>
          <p className="text-slate-400 text-sm mt-1">Job placement readiness calculator</p>
        </div>

        <Card className="p-8 text-center">
          <TrendingUp className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Placement Score Yet</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Run a comprehensive AI analysis on your resume to generate your placement readiness score.
          </p>
          <Button onClick={handleRunAnalysis} loading={calculating} className="px-8">
            <Sparkles className="w-4 h-4 mr-2" />
            {calculating ? 'Analysing...' : 'Generate Placement Score'}
          </Button>
        </Card>
      </div>
    )
  }

  // ── Scores available ─────────────────────────────────────────────────────────
  const overall = Math.round(placementData.overall ?? 0)

  const probabilityColor = (prob) => {
    if (!prob) return 'text-slate-400'
    if (prob.toLowerCase().includes('very high')) return 'text-emerald-400'
    if (prob.toLowerCase().includes('high'))      return 'text-green-400'
    if (prob.toLowerCase().includes('medium'))    return 'text-yellow-400'
    return 'text-red-400'
  }

  const breakdownItems = [
    { label: 'Technical Skills',  key: 'technical',    weight: '40%', color: 'blue',   icon: Brain },
    { label: 'Projects',          key: 'projects',     weight: '25%', color: 'green',  icon: Briefcase },
    { label: 'Resume Quality',    key: 'resume',       weight: '25%', color: 'purple', icon: FileText },
    { label: 'Communication',     key: 'communication',weight: '10%', color: 'orange', icon: MessageSquare },
  ]

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Placement Score</h1>
          <p className="text-slate-400 text-sm mt-1">
            Job readiness score for <span className="font-semibold text-indigo-400">{resume.fileName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/resume-analysis')} className="text-xs">
            View Analysis
          </Button>
          <Button onClick={handleRecalculate} loading={calculating} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* Overall Score Hero */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Overall Score</h3>

          {/* Big circular gauge */}
          <div className="relative w-40 h-40 mb-4">
            <svg width="160" height="160" className="-rotate-90">
              <circle stroke="#1e293b" fill="transparent" strokeWidth={14} r={67} cx="80" cy="80" />
              <circle
                stroke={overall >= 70 ? '#22c55e' : overall >= 50 ? '#f59e0b' : '#ef4444'}
                fill="transparent" strokeWidth={14}
                strokeDasharray={`${2 * Math.PI * 67} ${2 * Math.PI * 67}`}
                style={{
                  strokeDashoffset: 2 * Math.PI * 67 - (overall / 100) * 2 * Math.PI * 67,
                  transition: 'stroke-dashoffset 0.8s ease'
                }}
                strokeLinecap="round" r={67} cx="80" cy="80"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{overall}</span>
              <span className="text-xs text-slate-500 font-bold">/100</span>
            </div>
          </div>

          <p className={`text-base font-bold ${probabilityColor(placementData.placementProbability)}`}>
            {placementData.placementProbability || '—'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Placement Probability</p>
        </Card>

        {/* Score breakdown gauges */}
        <Card className="md:col-span-2 p-6">
          <h3 className="text-sm font-bold text-white mb-6">Score Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {breakdownItems.map(item => (
              <ScoreGauge
                key={item.key}
                value={placementData[item.key] ?? 0}
                label={`${item.label} (${item.weight})`}
                color={item.color}
              />
            ))}
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            {breakdownItems.map(item => (
              <div key={item.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </span>
                  <span className="text-white font-bold">{Math.round(placementData[item.key] ?? 0)}/100</span>
                </div>
                <ProgressBar value={placementData[item.key] ?? 0} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Improve ATS Score',     path: '/ats-report',          icon: Target,     color: 'from-blue-600 to-blue-700' },
          { label: 'Close Skill Gaps',      path: '/skill-gap',           icon: TrendingUp, color: 'from-green-600 to-emerald-700' },
          { label: 'Prep for Interviews',   path: '/interview-questions', icon: Award,      color: 'from-purple-600 to-violet-700' },
        ].map(action => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity`}
          >
            <action.icon className="w-5 h-5 flex-shrink-0" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlacementScore
