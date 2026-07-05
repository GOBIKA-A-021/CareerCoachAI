import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../../services/resumeService'
import { interviewService } from '../../services/interviewService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import {
  MessageSquare, Code, Users, Building2,
  ChevronDown, ChevronUp, Sparkles, AlertCircle,
  Lightbulb, Brain, Star
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Single collapsible question card ─────────────────────────────────────────
const QuestionCard = ({ q, index, isCode }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-800/40 hover:border-indigo-500/30 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-start justify-between gap-3 px-4 py-3"
      >
        <div className="flex items-start gap-2.5 flex-1">
          <span className="mt-0.5 text-xs font-black text-indigo-400 w-5 flex-shrink-0">{index + 1}.</span>
          <p className="text-sm font-medium text-slate-200">{q.question}</p>
        </div>
        <div className="flex-shrink-0 mt-0.5 text-slate-500">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-white/10 px-4 py-3">
          {isCode ? (
            <pre className="text-xs text-emerald-300 bg-slate-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              <code>{q.answer}</code>
            </pre>
          ) : (
            <p className="text-sm text-slate-400 leading-relaxed">{q.answer}</p>
          )}
          {q.topics?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {q.topics.map((t, i) => (
                <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded text-[10px] font-semibold border border-indigo-500/20">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, color, questions = [], isCode = false, badge }) => {
  if (!questions.length) return null
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-5 h-5 ${color}`} />
          <h2 className="text-base font-bold text-white">{title}</h2>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
          {questions.length} {badge || 'questions'}
        </span>
      </div>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <QuestionCard key={i} q={q} index={i} isCode={isCode} />
        ))}
      </div>
    </Card>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const InterviewQuestions = () => {
  const navigate = useNavigate()
  const [loading, setLoading]         = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [questions, setQuestions]     = useState(null)
  const [resume, setResume]           = useState(null)
  const [targetRole, setTargetRole]   = useState('Full Stack Developer')
  const [company, setCompany]         = useState('')
  const [difficulty, setDifficulty]   = useState('medium')

  // Pre-fill target role from current resume on mount
  useEffect(() => {
    resumeService.getUserResumes()
      .then(res => {
        const list = res.resumes || res.data?.resumes || []
        if (list.length > 0) {
          const cur = list.find(r => r.isCurrent) || list[0]
          setResume(cur)
          if (cur.targetRole) setTargetRole(cur.targetRole)
        }
      })
      .catch(() => {})
      .finally(() => setPageLoading(false))
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await interviewService.generateQuestions({ targetRole, company, difficulty })

      // Backend returns: { success, data: { questionId, questions: { technical, behavioral, coding, companySpecific, tips } } }
      // interviewService unwraps response.data.data → { questionId, questions: {...} }
      const inner = response.questions ?? response.data?.questions ?? response
      setQuestions(inner)
      toast.success('Interview questions generated!')
    } catch (error) {
      console.error('Interview generation error:', error)
      toast.error(error.response?.data?.error?.message || 'Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) return <Loader text="Loading interview prep..." />

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Interview Preparation</h1>
          <p className="text-slate-400 text-sm mt-1">
            AI-generated questions tailored to your target role and company
          </p>
        </div>
        {resume && (
          <Button variant="secondary" onClick={() => navigate('/career-roadmap')} className="text-xs">
            View Career Roadmap
          </Button>
        )}
      </div>

      {/* Config Card */}
      <Card className="p-5">
        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Role</label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 text-white rounded-xl text-xs outline-none focus:border-indigo-500/60 transition-colors"
            >
              {['Java Developer','Python Developer','Data Analyst','AI Engineer',
                'Backend Developer','Frontend Developer','Full Stack Developer','Data Scientist'
              ].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company (Optional)</label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Google, Amazon, TCS"
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 text-white rounded-xl text-xs outline-none focus:border-indigo-500/60 transition-colors placeholder-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 text-white rounded-xl text-xs outline-none focus:border-indigo-500/60 transition-colors"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <Button onClick={handleGenerate} loading={loading} className="px-8">
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? 'Generating…' : 'Generate Interview Questions'}
        </Button>
      </Card>

      {/* Empty state before generation */}
      {!questions && !loading && (
        <Card className="p-10 text-center">
          <Brain className="w-14 h-14 text-indigo-400/60 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Ready to Prepare</h2>
          <p className="text-slate-400 text-sm">
            Select your target role and difficulty above, then click <span className="text-indigo-400 font-semibold">Generate</span>.
          </p>
        </Card>
      )}

      {/* Results */}
      {questions && (
        <div className="space-y-6">
          <Section
            title="Technical Questions"
            icon={Code}
            color="text-blue-400"
            questions={questions.technical || []}
            badge="technical"
          />
          <Section
            title="Behavioral Questions"
            icon={Users}
            color="text-green-400"
            questions={questions.behavioral || []}
            badge="behavioral"
          />
          <Section
            title="Coding Questions"
            icon={MessageSquare}
            color="text-purple-400"
            questions={questions.coding || []}
            isCode
            badge="coding"
          />
          {(questions.companySpecific?.length > 0) && (
            <Section
              title={`Company-Specific${company ? ` — ${company}` : ''}`}
              icon={Building2}
              color="text-orange-400"
              questions={questions.companySpecific}
              badge="company"
            />
          )}

          {/* Tips */}
          {questions.tips?.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h2 className="text-base font-bold text-white">Interview Tips</h2>
              </div>
              <ul className="space-y-2.5">
                {questions.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default InterviewQuestions
