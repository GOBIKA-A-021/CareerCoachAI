import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import { 
  FileText, 
  TrendingUp, 
  Target, 
  BookOpen,
  Upload,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react'
import Card from '../../components/Card/Card'
import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    resumes: 0,
    analyses: 0,
    atsScore: 0,
    placementScore: 0
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [resumesRes, analysesRes] = await Promise.all([
        resumeService.getUserResumes(),
        analysisService.getUserAnalyses()
      ])

      setStats({
        resumes: resumesRes.data.resumes.length,
        analyses: analysesRes.data.analyses.length,
        atsScore: analysesRes.data.analyses[0]?.results?.atsScore?.overall || 0,
        placementScore: analysesRes.data.analyses[0]?.results?.placementScore?.overall || 0
      })

      setRecentActivity(analysesRes.data.analyses.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader text="Loading dashboard..." />
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's your career intelligence overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Resumes</p>
              <p className="text-3xl font-bold">{stats.resumes}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Analyses</p>
              <p className="text-3xl font-bold">{stats.analyses}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ATS Score</p>
              <p className="text-3xl font-bold">{stats.atsScore}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Placement Score</p>
              <p className="text-3xl font-bold">{stats.placementScore}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/upload-resume">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Upload Resume</h3>
                <p className="text-sm text-gray-600">Upload a new resume for analysis</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        <Link to="/resume-analysis">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">View Analysis</h3>
                <p className="text-sm text-gray-600">Check your resume analysis results</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        <Link to="/interview-questions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Interview Prep</h3>
                <p className="text-sm text-gray-600">Practice interview questions</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No recent activity. Upload a resume to get started!</p>
            <Link to="/upload-resume" className="mt-4 inline-block">
              <Button>Upload Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.analysisType} Analysis</p>
                  <p className="text-sm text-gray-600">
                    Target: {activity.targetRole}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Dashboard
