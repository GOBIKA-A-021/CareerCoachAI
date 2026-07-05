import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target, TrendingUp, Brain, Map, MessageSquare,
  Award, FileSearch, Zap, BarChart3, Users, Shield, Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'ATS Score Analysis',
    desc: 'Deep keyword matching against real ATS engines. Know exactly why you pass or fail automated screenings.',
    color: 'from-indigo-500 to-violet-500',
    glow: 'hover:shadow-indigo-500/20',
    tag: 'Core',
  },
  {
    icon: Zap,
    title: 'Skill Gap Detection',
    desc: 'Compare your current skills against 500+ job descriptions. Get precise skill gap reports per role.',
    color: 'from-violet-500 to-purple-500',
    glow: 'hover:shadow-violet-500/20',
    tag: 'AI',
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    desc: 'Personalised week-by-week learning plans, curated resources, and milestones for your target role.',
    color: 'from-purple-500 to-pink-500',
    glow: 'hover:shadow-purple-500/20',
    tag: 'Roadmap',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep AI',
    desc: 'Company-specific Q&A, STAR format coaching, and confidence scoring on your mock answers.',
    color: 'from-pink-500 to-rose-500',
    glow: 'hover:shadow-pink-500/20',
    tag: 'AI',
  },
  {
    icon: Award,
    title: 'Placement Score',
    desc: 'Composite readiness score across 8 dimensions. Benchmark against successful placements at top companies.',
    color: 'from-rose-500 to-orange-500',
    glow: 'hover:shadow-rose-500/20',
    tag: 'Analytics',
  },
  {
    icon: Brain,
    title: 'AI Mentor Chat',
    desc: '24/7 intelligent career coach. Ask anything about your resume, skills, or job search strategy.',
    color: 'from-orange-500 to-amber-500',
    glow: 'hover:shadow-orange-500/20',
    tag: 'AI',
  },
  {
    icon: FileSearch,
    title: 'Resume Intelligence',
    desc: 'Section-by-section feedback — grammar, tone, impact statements, and formatting compliance.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'hover:shadow-emerald-500/20',
    tag: 'Analysis',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    desc: 'Track your improvement over time with beautiful charts and weekly AI-generated progress reports.',
    color: 'from-teal-500 to-cyan-500',
    glow: 'hover:shadow-teal-500/20',
    tag: 'Analytics',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'End-to-end encrypted resume storage. Your data never trains third-party models. GDPR compliant.',
    color: 'from-cyan-500 to-blue-500',
    glow: 'hover:shadow-cyan-500/20',
    tag: 'Security',
  },
]

const tagColors = {
  Core: 'bg-indigo-500/20 text-indigo-400',
  AI: 'bg-violet-500/20 text-violet-400',
  Roadmap: 'bg-pink-500/20 text-pink-400',
  Analytics: 'bg-emerald-500/20 text-emerald-400',
  Analysis: 'bg-rose-500/20 text-rose-400',
  Security: 'bg-cyan-500/20 text-cyan-400',
}

const FeaturesSection = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0c0c24 0%, #080818 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-pink-400 tracking-widest uppercase mb-3">Everything You Need</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Powerful <span className="gradient-text">AI Features</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            From first upload to final offer — every tool you need to accelerate your career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
              className={`group relative glass rounded-2xl p-6 border border-white/10 hover:border-white/20 ${f.glow} hover:shadow-2xl transition-all duration-400 cursor-default overflow-hidden`}
            >
              {/* Hover glow overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${f.color} transition-opacity duration-300 rounded-2xl`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColors[f.tag] || 'bg-slate-700 text-slate-400'}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>

              {/* Bottom shine on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
