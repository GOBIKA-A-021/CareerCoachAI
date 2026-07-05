import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Brain, Crosshair, Map, MessageSquare, Award, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Resume',
    desc: 'Drop your PDF — our parser extracts every detail in seconds.',
    color: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/30',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    desc: 'Deep NLP analysis checks ATS compatibility, tone, and structure.',
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/30',
  },
  {
    icon: Crosshair,
    title: 'Skill Gap',
    desc: 'Identify missing skills vs your target role requirements.',
    color: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/30',
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    desc: 'Get a step-by-step personalised learning & career action plan.',
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/30',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    desc: 'AI-generated Q&A tailored to your target company & role.',
    color: 'from-rose-500 to-orange-500',
    glow: 'shadow-rose-500/30',
  },
  {
    icon: Award,
    title: 'Placement Score',
    desc: 'Final composite score + company readiness report.',
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/30',
  },
]

const HowItWorks = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works" ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080818 0%, #0c0c24 100%)' }}
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3">The Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How AI <span className="gradient-text">Works For You</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Six intelligent steps that transform a raw resume into a career acceleration engine.
          </p>
        </motion.div>

        {/* Desktop: horizontal steps with connectors */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-4 relative">
            {/* Connector line */}
            <div className="absolute top-10 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 opacity-30" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon bubble */}
                <div className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl ${step.glow} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical steps */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-start gap-4 glass rounded-2xl p-4 border border-white/10"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${step.glow}`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500">Step {i + 1}</span>
                  {i < steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                </div>
                <h3 className="text-sm font-semibold text-white mb-0.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
