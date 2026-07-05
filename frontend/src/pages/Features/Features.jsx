import { motion } from 'framer-motion'
import { Brain, Target, Zap, BarChart3, FileText, Sparkles, BookOpen, TrendingUp, Shield, Clock, Globe, Users } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your resume with industry-leading accuracy using Google Gemini API',
      gradient: 'from-purple-500 to-pink-500',
      details: ['Natural Language Processing', 'Contextual Understanding', 'Industry-Specific Insights']
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Get detailed ATS scoring with actionable improvement suggestions',
      gradient: 'from-blue-500 to-cyan-500',
      details: ['Keyword Matching', 'Format Compliance', 'Content Optimization']
    },
    {
      icon: Zap,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get personalized learning paths',
      gradient: 'from-orange-500 to-red-500',
      details: ['Skill Assessment', 'Learning Resources', 'Progress Tracking']
    },
    {
      icon: BarChart3,
      title: 'Placement Score',
      description: 'Calculate your job placement readiness with precision metrics',
      gradient: 'from-green-500 to-emerald-500',
      details: ['Multi-factor Analysis', 'Industry Benchmarks', 'Actionable Insights']
    },
    {
      icon: FileText,
      title: 'Career Roadmaps',
      description: 'AI-generated learning paths tailored to your target role',
      gradient: 'from-indigo-500 to-purple-500',
      details: ['Personalized Paths', 'Timeline Planning', 'Milestone Tracking']
    },
    {
      icon: BookOpen,
      title: 'Interview Preparation',
      description: 'Practice with role-specific interview questions and answers',
      gradient: 'from-pink-500 to-rose-500',
      details: ['Technical Questions', 'Behavioral Prep', 'Company-Specific']
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Track your progress with comprehensive dashboards and metrics',
      gradient: 'from-yellow-500 to-orange-500',
      details: ['Progress Tracking', 'Performance Metrics', 'Growth Charts']
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Enterprise-grade security to protect your personal information',
      gradient: 'from-slate-500 to-gray-500',
      details: ['End-to-End Encryption', 'Secure Storage', 'Privacy Compliance']
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get AI-powered insights in seconds, not hours or days',
      gradient: 'from-teal-500 to-cyan-500',
      details: ['Fast Processing', 'Real-time Analysis', 'Quick Turnaround']
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Support for multiple languages and international job markets',
      gradient: 'from-blue-600 to-indigo-600',
      details: ['Language Detection', 'Regional Insights', 'Global Standards']
    },
    {
      icon: Users,
      title: 'Community Insights',
      description: 'Learn from successful career paths of others in your field',
      gradient: 'from-purple-600 to-pink-600',
      details: ['Success Stories', 'Industry Trends', 'Best Practices']
    },
    {
      icon: Sparkles,
      title: 'Continuous Learning',
      description: 'AI that learns and improves with each analysis',
      gradient: 'from-amber-500 to-yellow-500',
      details: ['Machine Learning', 'Pattern Recognition', 'Adaptive Insights']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to accelerate your career with AI-powered intelligence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="glass-dark rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/20">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
