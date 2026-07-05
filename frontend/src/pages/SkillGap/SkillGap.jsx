import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import { CheckCircle2, XCircle, Award, BookOpen, PenTool, AlertCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const SkillGap = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [resume, setResume] = useState(null)
  const [skillGapData, setSkillGapData] = useState(null)
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
        
        // Find matching analysis
        const analysisForResume = analyses.find(a => a.resumeId?._id === currentResume._id || a.resumeId === currentResume._id)
        const latestAnalysis = analysisForResume || analyses[0]

        if (latestAnalysis?.results?.skillGap) {
          setSkillGapData(latestAnalysis.results.skillGap)
        } else {
          await triggerSkillGapAnalysis(currentResume._id, currentResume.targetRole || targetRole)
        }
      }
    } catch (error) {
      console.error('Failed to load recent resume or skill gaps:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerSkillGapAnalysis = async (resumeId, role) => {
    setAnalyzing(true)
    try {
      // analysisService returns response.data.data = { analysisId, skillGap }
      const response = await analysisService.performSkillGapAnalysis({
        resumeId,
        targetRole: role
      })
      // Unwrap: service may return { analysisId, skillGap } or { skillGap } directly
      const gap = response?.skillGap ?? response?.data?.skillGap ?? response
      if (gap?.presentSkills !== undefined || gap?.missingSkills !== undefined) {
        setSkillGapData(gap)
        toast.success('Skill gap analysis completed!')
      } else {
        toast.error('Analysis returned unexpected data shape')
        console.error('Unexpected skillGap shape:', response)
      }
    } catch (error) {
      console.error('Skill gap calculation failed:', error)
      toast.error(error.response?.data?.error?.message || 'Failed to calculate skill gaps')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReanalyze = () => {
    if (!resume) return
    triggerSkillGapAnalysis(resume._id, targetRole)
  }

  if (loading) {
    return <Loader text="Parsing skills comparison nodes..." />
  }

  if (!resume) {
    return (
      <div className="page-container text-center py-20">
        <AlertCircle className="w-16 h-16 text-slate-350 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Active Resume Found</h1>
        <p className="text-slate-500 mb-6">Upload a resume to perform skill gap analysis.</p>
        <Button onClick={() => navigate('/upload-resume')}>Upload Resume</Button>
      </div>
    )
  }

  // Generate comparison items if backend returns nested arrays or fallback to structured values
  const present = skillGapData?.presentSkills || []
  const missing = skillGapData?.missingSkills || []

  // Mock list recommendations
  const courseRecommendations = [
    { name: 'TypeScript Deep Dive', platform: 'Udemy', duration: '12 hrs' },
    { name: 'Docker & Kubernetes Fundamentals', platform: 'Coursera', duration: '18 hrs' }
  ]
  const projectRecommendations = [
    { name: 'TypeScript E-commerce Store', description: 'Migrate a standard JavaScript project to TypeScript to demonstrate strong typing structures.' },
    { name: 'Dockerized Microservices Backend', description: 'Containerize node/express endpoints with Docker files and docker-compose.' }
  ]
  const certificationRecommendations = [
    { name: 'Docker Certified Associate (DCA)', issuer: 'Docker' },
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services' }
  ]

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Skill Gap Analysis</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Comparing profile skills against target requirements for <span className="font-semibold text-blue-600">{targetRole}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={() => navigate('/career-roadmap')} className="text-xs">
            Generate Roadmap
          </Button>
          <Button onClick={handleReanalyze} loading={analyzing} className="text-xs">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Refresh Analysis
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
          Refresh Comparison
        </Button>
      </Card>

      {/* Double Column Comparison Table */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Present Skills Table */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center border-b pb-2 dark:border-slate-700">
            <CheckCircle2 className="w-4.5 h-4.5 text-green-500 mr-2" />
            Present Competencies
          </h3>
          {present.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No matching present skills parsed.</p>
          ) : (
            <div className="space-y-3">
              {present.map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-slate-800 dark:text-green-300">{skill.skill}</span>
                  </div>
                  <span className="text-green-700 dark:text-green-400 font-semibold px-2 py-0.5 bg-green-100/50 dark:bg-green-900/30 rounded">
                    Match (✔)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Missing Skills Table */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center border-b pb-2 dark:border-slate-700">
            <XCircle className="w-4.5 h-4.5 text-red-500 mr-2" />
            Missing Skills
          </h3>
          {missing.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Excellent! No missing skills matching target role requirements.</p>
          ) : (
            <div className="space-y-3">
              {missing.map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-slate-800 dark:text-red-300">{skill.skill}</span>
                  </div>
                  <span className="text-red-700 dark:text-red-400 font-semibold px-2 py-0.5 bg-red-100/50 dark:bg-red-900/30 rounded">
                    Missing (❌)
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recommendations Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recommended Courses */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <BookOpen className="w-4.5 h-4.5 text-blue-500 mr-2" />
              Recommended Courses
            </h3>
            <div className="space-y-3">
              {courseRecommendations.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-750/30 border border-slate-100 dark:border-slate-700 rounded-lg text-xs">
                  <h4 className="font-bold text-slate-800 dark:text-white">{c.name}</h4>
                  <p className="text-slate-400 mt-1">{c.platform} • {c.duration}</p>
                </div>
              ))}
            </div>
          </div>
          <Button variant="secondary" className="text-xs mt-4 w-full">Browse all Courses</Button>
        </Card>

        {/* Recommended Projects */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <PenTool className="w-4.5 h-4.5 text-green-500 mr-2" />
              Upgrade Projects
            </h3>
            <div className="space-y-3">
              {projectRecommendations.map((p, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-750/30 border border-slate-100 dark:border-slate-700 rounded-lg text-xs">
                  <h4 className="font-bold text-slate-800 dark:text-white">{p.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
          <Button variant="secondary" className="text-xs mt-4 w-full">View project specs</Button>
        </Card>

        {/* Recommended Certifications */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <Award className="w-4.5 h-4.5 text-purple-500 mr-2" />
              Certifications
            </h3>
            <div className="space-y-3">
              {certificationRecommendations.map((cert, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-750/30 border border-slate-100 dark:border-slate-700 rounded-lg text-xs">
                  <h4 className="font-bold text-slate-800 dark:text-white">{cert.name}</h4>
                  <p className="text-slate-400 mt-1">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
          <Button variant="secondary" className="text-xs mt-4 w-full">Explore details</Button>
        </Card>
      </div>
    </div>
  )
}

export default SkillGap
