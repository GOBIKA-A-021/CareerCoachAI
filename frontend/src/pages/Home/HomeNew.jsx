import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Target, TrendingUp, Zap, Brain, FileText, Users, BarChart3, CheckCircle } from 'lucide-react'
import Button from '../../components/Button/Button'

const Home = () => {
  const stats = [
    { value: '50K+', label: 'Students Guided', icon: Users },
    { value: '100K+', label: 'Resumes Analyzed', icon: FileText },
    { value: '85%', label: 'ATS Improved', icon: TrendingUp },
    { value: '95%', label: 'Jobs Matched', icon: Target }
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your resume with industry-leading accuracy',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Get detailed ATS scoring with actionable improvement suggestions',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get personalized learning paths',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: BarChart3,
      title: 'Placement Score',
      description: 'Calculate your job placement readiness with precision',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: FileText,
      title: 'Career Roadmaps',
      description: 'AI-generated learning paths tailored to your target role',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Interview Prep',
      description: 'Practice with role-specific interview questions and answers',
      gradient: 'from-pink-500 to-rose-500'
    }
  ]

  const steps = [
    { step: '01', title: 'Upload Resume', icon: FileText, description: 'Upload your PDF resume for instant analysis' },
    { step: '02', title: 'AI Analysis', icon: Brain, description: 'Our AI performs comprehensive ATS and skill analysis' },
    { step: '03', title: 'Skill Gap', icon: Target, description: 'Identify missing skills with learning resources' },
    { step: '04', title: 'Career Roadmap', icon: BarChart3, description: 'Get personalized learning paths and timelines' },
    { step: '05', title: 'Interview Prep', icon: Sparkles, description: 'Practice with AI-generated interview questions' },
    { step: '06', title: 'Placement Score', icon: TrendingUp, description: 'Calculate your job placement readiness' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 mb-8"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">AI-Powered Career Intelligence Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
                Transform Your Career
              </span>
              <br />
              <span className="text-white">with AI Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              Upload your resume and get instant ATS analysis, skill gap assessment, 
              career roadmaps, and interview preparation powered by advanced AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 hover:scale-105">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 relative"
            >
              <div className="gradient-border">
                <div className="bg-slate-900 rounded-2xl p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-5 h-5 text-primary-400" />
                        <span className="text-sm text-gray-400">ATS Score</span>
                      </div>
                      <p className="text-2xl font-bold text-white">85/100</p>
                    </div>
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Placement</span>
                      </div>
                      <p className="text-2xl font-bold text-white">78%</p>
                    </div>
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Skills</span>
                      </div>
                      <p className="text-2xl font-bold text-white">12/15</p>
                    </div>
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-400">AI Score</span>
                      </div>
                      <p className="text-2xl font-bold text-white">92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Statistics */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                How AI Works
              </span>
            </h2>
            <p className="text-xl text-gray-400">From resume to dream job in 6 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-dark rounded-2xl p-6 h-full hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-primary-400 mb-4">{step.step}</div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to accelerate your career</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="glass-dark rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-border"
          >
            <div className="bg-slate-900 rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Join thousands of professionals who have improved their resumes with AI.
              </p>
              <Link to="/register">
                <Button size="lg" className="group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Sparkles className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold text-white">CareerCoach AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 CareerCoach AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
