import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, TrendingUp, Briefcase } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Students Guided', value: 52000, suffix: '+', color: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-500/20' },
  { icon: FileText, label: 'Resumes Analyzed', value: 128000, suffix: '+', color: 'from-violet-500 to-pink-500', glow: 'shadow-violet-500/20' },
  { icon: TrendingUp, label: 'ATS Score Improved', value: 94, suffix: '%', color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
  { icon: Briefcase, label: 'Jobs Matched', value: 38000, suffix: '+', color: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/20' },
]

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])

  return count
}

const StatCard = ({ stat, index, inView }) => {
  const count = useCountUp(stat.value, 2000, inView)
  const display = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k` : count

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      className={`relative glass rounded-2xl p-6 border border-white/10 shadow-2xl ${stat.glow} hover:scale-105 transition-transform duration-300 group overflow-hidden`}
    >
      {/* Subtle shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />

      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
        <stat.icon className="w-6 h-6 text-white" />
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="text-4xl font-black text-white">{display}</span>
        <span className="text-2xl font-bold gradient-text mb-0.5">{stat.suffix}</span>
      </div>
      <p className="text-sm text-slate-400 font-medium">{stat.label}</p>

      {/* Decorative gradient ring */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-xl`} />
    </motion.div>
  )
}

const StatsSection = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #0a0a1f 100%)' }}>
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">Proven Results</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Numbers That <span className="gradient-text">Speak Loud</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
