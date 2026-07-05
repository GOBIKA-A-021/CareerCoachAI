import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import { roadmapService } from '../../services/roadmapService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import { Map, Clock, CheckCircle2, ChevronRight, AlertCircle, Sparkles, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const CareerRoadmap = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [resume, setResume] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [targetRole, setTargetRole] = useState('Full Stack Developer')
  const [timeline, setTimeline] = useState('6 months')
  const [completedItems, setCompletedItems] = useState({})

  useEffect(() => {
    loadRecentResumeAndRoadmap()
  }, [])

  const loadRecentResumeAndRoadmap = async () => {
    setLoading(true)
    try {
      const resumesRes = await resumeService.getUserResumes()
      const resumes = resumesRes.resumes || resumesRes.data?.resumes || []

      if (resumes.length > 0) {
        const currentResume = resumes.find(r => r.isCurrent) || resumes[0]
        setResume(currentResume)
        const role = currentResume.targetRole || 'Full Stack Developer'
        setTargetRole(role)

        // ── GET existing roadmaps — do NOT POST on every page visit ──────────
        const existingRes = await roadmapService.getUserRoadmaps()
        const existingList = existingRes.roadmaps || existingRes.data?.roadmaps || []
        if (existingList.length > 0) {
          // Use the most recent roadmap for this role, or just the latest
          const match = existingList.find(r => r.targetRole === role) || existingList[0]
          setRoadmap(match)
        }
        // If no roadmap exists yet, the default placeholder renders below
      }
    } catch (error) {
      console.error('Failed to load recent resume or roadmap:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!resume) {
      toast.error('Upload a resume first')
      return
    }
    setAnalyzing(true)
    try {
      const response = await roadmapService.generateRoadmap({ targetRole, timeline })
      const rMap = response.roadmap || response.data?.roadmap
      if (rMap) {
        setRoadmap(rMap)
        toast.success('AI Roadmap generated successfully!')
      } else {
        toast.error('Roadmap generation returned no data')
      }
    } catch (error) {
      console.error('Failed to generate roadmap:', error)
      toast.error(error.response?.data?.error?.message || 'Roadmap generation failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const toggleComplete = (phaseIdx, taskIdx) => {
    const key = `${phaseIdx}-${taskIdx}`
    setCompletedItems(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      if (updated[key]) {
        toast.success('Goal marked as complete!')
      }
      return updated
    })
  }

  if (loading) {
    return <Loader text="Drafting career roadmap timeline..." />
  }

  if (!resume) {
    return (
      <div className="page-container text-center py-20">
        <AlertCircle className="w-16 h-16 text-slate-350 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Active Resume Found</h1>
        <p className="text-slate-500 mb-6">Upload a resume to model career roadmap timelines.</p>
        <Button onClick={() => navigate('/upload-resume')}>Upload Resume</Button>
      </div>
    )
  }

  // If no roadmap exists, we can show a placeholder default one to make it feel rich out of the box!
  const displayRoadmap = roadmap || {
    targetRole,
    totalDuration: '6 Weeks',
    phases: [
      { phaseNumber: 1, title: 'Core Java & OOPs Concepts', duration: 'Week 1', objectives: ['Learn Inheritance, Interface, Polymorphism', 'Practice Core Collections frameworks'], skillsToLearn: [{ skill: 'Java' }], milestones: ['Complete Java practice coding test'] },
      { phaseNumber: 2, title: 'Spring Boot & Rest APIs', duration: 'Week 2', objectives: ['Understand dependency injection and Bean lifecycle', 'Build simple REST endpoints'], skillsToLearn: [{ skill: 'Spring Boot' }], milestones: ['Deploy simple CRUD server'] },
      { phaseNumber: 3, title: 'Database Integration & Security', duration: 'Week 3', objectives: ['Connect database using Spring Data JPA', 'Implement JWT Spring Security middleware'], skillsToLearn: [{ skill: 'REST API' }], milestones: ['Build secure User Management app'] },
      { phaseNumber: 4, title: 'React Frontend Client', duration: 'Week 4', objectives: ['Understand states, hooks, and context APIs', 'Integrate backend endpoints using Axios'], skillsToLearn: [{ skill: 'React' }], milestones: ['Connect React to Spring Boot backend'] },
      { phaseNumber: 5, title: 'Containerization & Docker', duration: 'Week 5', objectives: ['Write Dockerfiles for Spring Boot & React apps', 'Run full stack apps using docker-compose'], skillsToLearn: [{ skill: 'Docker' }], milestones: ['Publish docker image to hub'] },
      { phaseNumber: 6, title: 'AWS Cloud Services', duration: 'Week 6', objectives: ['Deploy docker images to AWS ECS', 'Set up AWS RDS database instances'], skillsToLearn: [{ skill: 'AWS' }], milestones: ['Achieve live HTTPS staging endpoint'] }
    ]
  }

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Career Roadmap</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Weekly structured curriculum to land as a <span className="font-semibold text-blue-600">{displayRoadmap.targetRole}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={() => navigate('/interview-questions')} className="text-xs">
            Prepare Interview Questions
          </Button>
          <Button onClick={handleGenerate} loading={analyzing} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Re-Generate Path
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
        <div className="w-48">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Time Period</label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="6 weeks">6 weeks</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
          </select>
        </div>
        <Button onClick={handleGenerate} loading={analyzing} className="text-xs px-6 py-2.5">
          Generate Roadmap
        </Button>
      </Card>

      {/* Overview Stat */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-4 bg-blue-50/50 dark:bg-slate-800 border-blue-100 dark:border-slate-700 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase block">Total Duration</span>
            <span className="text-slate-800 dark:text-white text-base font-bold">{displayRoadmap.totalDuration}</span>
          </div>
          <Clock className="w-8 h-8 text-blue-500 opacity-80" />
        </Card>
        <Card className="p-4 bg-green-50/50 dark:bg-slate-800 border-green-100 dark:border-slate-700 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase block">Curriculum Phases</span>
            <span className="text-slate-800 dark:text-white text-base font-bold">{displayRoadmap.phases?.length || 0} Stages</span>
          </div>
          <Map className="w-8 h-8 text-green-500 opacity-80" />
        </Card>
        <Card className="p-4 bg-purple-50/50 dark:bg-slate-800 border-purple-100 dark:border-slate-700 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400 font-semibold uppercase block">Milestones Tracked</span>
            <span className="text-slate-800 dark:text-white text-base font-bold">
              {Object.values(completedItems).filter(Boolean).length} / {displayRoadmap.phases?.length || 0} Complete
            </span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-purple-500 opacity-80" />
        </Card>
      </div>

      {/* Week-by-Week Timeline */}
      <div className="space-y-4 mt-6">
        {displayRoadmap.phases?.map((phase, pIdx) => {
          const isFinished = completedItems[`${pIdx}-0`]
          return (
            <Card key={pIdx} className="hover:border-blue-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-700 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isFinished ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-350'
                  }`}>
                    {pIdx + 1}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">{phase.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Timeline: {phase.duration}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleComplete(pIdx, 0)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isFinished 
                      ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isFinished ? 'Marked Complete' : 'Mark Complete'}</span>
                </button>
              </div>

              {/* Detail specs */}
              <div className="grid md:grid-cols-3 gap-6 text-xs mt-4">
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-400 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 text-blue-500 mr-1.5" />
                    Learning Goals
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-350 pl-1.5">
                    {phase.objectives?.map((obj, oIdx) => (
                      <li key={oIdx} className="flex items-start">
                        <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-400 mb-2 flex items-center">
                    <Map className="w-4 h-4 text-green-500 mr-1.5" />
                    Skill Focus
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.skillsToLearn?.map((s, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded font-semibold text-[10px]">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-400 mb-2 flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 mr-1.5" />
                    Milestones
                  </h4>
                  <div className="space-y-1 text-slate-500 dark:text-slate-400 pl-1.5">
                    {phase.milestones?.map((m, mIdx) => (
                      <p key={mIdx}>• {m}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default CareerRoadmap
