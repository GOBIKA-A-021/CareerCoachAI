import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'
import { Target, TrendingUp, Brain, Zap, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'

const atsData = [
  { subject: 'Keywords', A: 88 },
  { subject: 'Format', A: 92 },
  { subject: 'Skills', A: 74 },
  { subject: 'Experience', A: 85 },
  { subject: 'Education', A: 95 },
  { subject: 'Projects', A: 78 },
]

const areaData = [
  { name: 'Jan', score: 55 },
  { name: 'Feb', score: 62 },
  { name: 'Mar', score: 70 },
  { name: 'Apr', score: 74 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 92 },
]

const resumeChecks = [
  { label: 'Contact Information', status: 'ok' },
  { label: 'Professional Summary', status: 'ok' },
  { label: 'Work Experience (3+ years)', status: 'ok' },
  { label: 'Quantified Achievements', status: 'warn' },
  { label: 'Technical Skills', status: 'ok' },
  { label: 'Action Verbs Used', status: 'warn' },
  { label: 'ATS Keyword Match', status: 'ok' },
]

const skills = [
  { skill: 'React.js', have: true, level: 85 },
  { skill: 'Node.js', have: true, level: 75 },
  { skill: 'System Design', have: false, level: 30 },
  { skill: 'ML / AI Basics', have: false, level: 20 },
  { skill: 'TypeScript', have: true, level: 65 },
]

/* Circular arc score gauge */
const ScoreGauge = ({ score, color }) => {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="mx-auto">
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="url(#gaugeGrad)" strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        strokeDashoffset={circ * 0.25}
        style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <text x="55" y="50" textAnchor="middle" fill="white" fontSize="20" fontWeight="800">{score}</text>
      <text x="55" y="68" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">/ 100</text>
    </svg>
  )
}

const DashboardPreview = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } })
  }

  return (
    <section ref={ref} className="py-24 relative" style={{ background: 'linear-gradient(180deg, #0a0a1f 0%, #080818 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">Live Dashboard</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your AI Career <span className="gradient-text">Intelligence Center</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Every metric you need to land your dream job — all in one beautifully designed dashboard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Card 1: ATS Score */}
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="gradient-border col-span-1 group"
          >
            <div className="glass-dark rounded-[15px] p-6 h-full hover:bg-white/5 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">ATS Score</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Good</span>
              </div>
              <ScoreGauge score={92} />
              <p className="text-center text-xs text-slate-400 mt-3">Above 90% of applicants for Software Engineer roles</p>
            </div>
          </motion.div>

          {/* Card 2: Placement Readiness */}
          <motion.div custom={1} variants={cardVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="gradient-border col-span-1 group"
          >
            <div className="glass-dark rounded-[15px] p-6 h-full hover:bg-white/5 transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Placement Readiness</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#fff', fontSize: 11 }}
                    cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-400">Score improved 67% →</span>
                <span className="text-2xl font-black gradient-text">87%</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Resume Analysis */}
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="gradient-border col-span-1 group"
          >
            <div className="glass-dark rounded-[15px] p-6 h-full hover:bg-white/5 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Resume Analysis</span>
              </div>
              <div className="space-y-2">
                {resumeChecks.map(({ label, status }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    {status === 'ok'
                      ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      : <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    }
                    <span className="text-xs text-slate-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4: Skill Gap (Radar) */}
          <motion.div custom={3} variants={cardVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="gradient-border col-span-1 md:col-span-2 group"
          >
            <div className="glass-dark rounded-[15px] p-6 h-full hover:bg-white/5 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Skill Gap Analysis</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <ResponsiveContainer width={180} height={180}>
                    <RadarChart data={atsData}>
                      <PolarGrid stroke="rgba(99,102,241,0.15)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                      <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  {skills.map(({ skill, have, level }) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-300 flex items-center gap-1.5">
                          {have ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                          {skill}
                        </span>
                        <span className="text-xs font-semibold text-white">{level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${have ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-gradient-to-r from-red-500/50 to-orange-500/50'}`}
                          style={{ width: inView ? `${level}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 5: AI Mentor */}
          <motion.div custom={4} variants={cardVariants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="gradient-border col-span-1 group"
          >
            <div className="glass-dark rounded-[15px] p-6 h-full hover:bg-white/5 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">AI Mentor</span>
                <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                <div className="bg-indigo-600/20 rounded-xl rounded-tl-none px-3 py-2.5 border border-indigo-500/20">
                  <p className="text-xs text-slate-300 leading-relaxed">Your resume is missing quantified achievements. Try: "Increased performance by 40%" instead of generic descriptions.</p>
                </div>
                <div className="bg-white/5 rounded-xl rounded-tr-none px-3 py-2.5 ml-4 border border-white/10">
                  <p className="text-xs text-slate-400 leading-relaxed">How do I improve my ATS score for Google?</p>
                </div>
                <div className="bg-indigo-600/20 rounded-xl rounded-tl-none px-3 py-2.5 border border-indigo-500/20">
                  <p className="text-xs text-slate-300 leading-relaxed">Add keywords: "scalable systems", "distributed computing", "SRE". Target 85%+ match. 🚀</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default DashboardPreview
