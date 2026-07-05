import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Lock, Circle, ArrowRight, Building2, TrendingUp } from 'lucide-react'

const milestones = [
  { label: 'Resume Polished', status: 'done', desc: 'ATS-optimised, strong verbs, quantified achievements' },
  { label: 'Skills Levelled Up', status: 'done', desc: 'Completed React Advanced + System Design modules' },
  { label: 'Portfolio Built', status: 'active', desc: '3 / 5 projects deployed — in progress' },
  { label: 'Mock Interviews', status: 'locked', desc: 'Complete portfolio to unlock interview practice' },
  { label: 'Job Applications', status: 'locked', desc: 'Unlocks after 80% placement readiness' },
  { label: 'Offer Received 🎉', status: 'locked', desc: 'The final milestone — your dream role' },
]

const companies = [
  { name: 'Google', match: 88, color: 'from-blue-500 to-cyan-500', logo: '🔵' },
  { name: 'Microsoft', match: 82, color: 'from-teal-500 to-emerald-500', logo: '🟢' },
  { name: 'Amazon', color: 'from-orange-500 to-amber-500', match: 76, logo: '🟠' },
  { name: 'Meta', color: 'from-indigo-500 to-blue-500', match: 71, logo: '🔷' },
  { name: 'Stripe', color: 'from-violet-500 to-purple-500', match: 94, logo: '🟣' },
  { name: 'Atlassian', color: 'from-pink-500 to-rose-500', match: 68, logo: '🔴' },
]

const statusStyle = {
  done: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40', line: 'bg-emerald-500/40' },
  active: { icon: Circle, color: 'text-indigo-400', bg: 'bg-indigo-500/20 border-indigo-500/40', line: 'bg-white/10' },
  locked: { icon: Lock, color: 'text-slate-500', bg: 'bg-white/5 border-white/10', line: 'bg-white/5' },
}

const CareerRoadmapPreview = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080818 0%, #0a0a1f 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-3">Your Journey</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Career <span className="gradient-text">Roadmap Preview</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            A dynamic roadmap that evolves with your progress. Unlock new milestones as you grow.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Roadmap Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Software Engineer Roadmap
            </h3>
            <div className="space-y-1">
              {milestones.map((m, i) => {
                const style = statusStyle[m.status]
                return (
                  <div key={m.label} className="flex gap-3">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border ${style.bg} flex items-center justify-center`}>
                        <style.icon className={`w-3.5 h-3.5 ${style.color} ${m.status === 'active' ? 'animate-pulse' : ''}`} />
                      </div>
                      {i < milestones.length - 1 && (
                        <div className={`w-px flex-1 ${style.line} my-1`} style={{ minHeight: 20 }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-4">
                      <p className={`text-sm font-semibold mb-0.5 ${m.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>{m.label}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Company Readiness Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-pink-400" />
              Company Readiness
            </h3>
            <div className="space-y-4">
              {companies.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-2xl">{c.logo}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{c.name}</span>
                      <span className={`text-sm font-bold ${c.match >= 80 ? 'text-emerald-400' : c.match >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {c.match}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${c.match}%` } : {}}
                        transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                      />
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-5 text-center">Scores based on your resume vs. real job postings</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CareerRoadmapPreview
