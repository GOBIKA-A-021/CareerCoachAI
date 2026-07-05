import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { resumeService } from '../../services/resumeService'
import { analysisService } from '../../services/analysisService'
import { motion } from 'framer-motion'
import { 
  FileText, 
  TrendingUp, 
  Target, 
  BookOpen,
  Upload,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Brain,
  Zap,
  BarChart3,
  Users,
  Activity
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
      const [resumesRes, analysesRes] = await Promise.allSettled([
        resumeService.getUserResumes(),
        analysisService.getUserAnalyses()
      ])

      // Safely extract arrays — both services return { resumes: [] } or { analyses: [] }
      // but fall back gracefully if the shape is unexpected or the call failed
      const resumes =
        resumesRes.status === 'fulfilled'
          ? (resumesRes.value?.resumes ?? resumesRes.value ?? [])
          : []

      const analyses =
        analysesRes.status === 'fulfilled'
          ? (analysesRes.value?.analyses ?? analysesRes.value ?? [])
          : []

      const resumeList  = Array.isArray(resumes)  ? resumes  : []
      const analysesList = Array.isArray(analyses) ? analyses : []

      setStats({
        resumes: resumeList.length,
        analyses: analysesList.length,
        atsScore: analysesList[0]?.results?.atsScore?.overall ?? 0,
        placementScore: analysesList[0]?.results?.placementScore?.overall ?? 0
      })

      setRecentActivity(analysesList.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader text="Loading dashboard..." />
  }

  const quickActions = [
    {
      icon: Upload,
      title: 'Upload Resume',
      description: 'Upload a new resume for analysis',
      link: '/upload-resume',
      gradient: 'from-primary-600 to-primary-700'
    },
    {
      icon: Target,
      title: 'View Analysis',
      description: 'Check your resume analysis results',
      link: '/resume-analysis',
      gradient: 'from-green-600 to-green-700'
    },
    {
      icon: BookOpen,
      title: 'Interview Prep',
      description: 'Practice interview questions',
      link: '/interview-questions',
      gradient: 'from-purple-600 to-purple-700'
    }
  ]

  const aiFeatures = [
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Advanced AI-powered resume analysis',
      color: 'text-purple-400'
    },
    {
      icon: Zap,
      title: 'Skill Gap',
      description: 'Identify and bridge skill gaps',
      color: 'text-yellow-400'
    },
    {
      icon: BarChart3,
      title: 'Career Roadmap',
      description: 'Personalized learning paths',
      color: 'text-blue-400'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 page-container">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName}!
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Here's your career intelligence overview
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-2xl px-6 py-3 border border-white/10">
              <Sparkles className="w-6 h-6 text-primary-400" />
              <span className="text-white font-medium">AI-Powered Dashboard</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-primary-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Resumes</p>
            <p className="text-3xl font-bold text-white">{stats.resumes}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Analyses</p>
            <p className="text-3xl font-bold text-white">{stats.analyses}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">ATS Score</p>
            <p className="text-3xl font-bold text-white">{stats.atsScore}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full" />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">Placement Score</p>
            <p className="text-3xl font-bold text-white">{stats.placementScore}</p>
            <div className="mt-3 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
                className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-dark rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Clock className="w-6 h-6 text-primary-400" />
              <span>Recent Activity</span>
            </h2>
            <Link to="/reports" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Recent Activity</h3>
              <p className="text-gray-400 mb-6">Upload a resume to get started with AI analysis</p>
              <Link to="/upload-resume">
                <Button className="group">
                  Upload Resume
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary-500/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{activity.analysisType} Analysis</p>
                    <p className="text-sm text-gray-400">
                      Target: {activity.targetRole}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
