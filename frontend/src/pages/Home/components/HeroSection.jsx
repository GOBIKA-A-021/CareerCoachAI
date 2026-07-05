import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Sparkles, Upload, Brain, Target,
  TrendingUp, MessageSquare, Zap, PlayCircle
} from 'lucide-react'

/* ── tiny floating dashboard card ── */
const MiniCard = ({ icon: Icon, label, value, color, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className={`absolute glass rounded-2xl p-3 shadow-2xl border border-white/10 ${className}`}
  >
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <p className="text-[10px] text-slate-400 leading-none mb-0.5">{label}</p>
    <p className="text-base font-bold text-white">{value}</p>
  </motion.div>
)

/* ── animated AI brain / orbit ── */
const AIOrbit = () => (
  <div className="relative w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center">
    {/* Glow core */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-pink-600/20 blur-3xl" />

    {/* Spinning outer ring */}
    <div className="absolute w-full h-full rounded-full border border-indigo-500/20 animate-spin-slow" />

    {/* Orbit ring 1 */}
    <div className="absolute w-4/5 h-4/5 rounded-full border border-dashed border-violet-500/30" />

    {/* Center brain */}
    <div className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-pulse-glow">
      <Brain className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
    </div>

    {/* Orbiting icons */}
    {[
      { icon: Target, color: 'bg-pink-500', angle: 0 },
      { icon: TrendingUp, color: 'bg-emerald-500', angle: 72 },
      { icon: Zap, color: 'bg-amber-500', angle: 144 },
      { icon: MessageSquare, color: 'bg-blue-500', angle: 216 },
      { icon: Star, color: 'bg-violet-500', angle: 288 },
    ].map(({ icon: Icon, color, angle }, i) => {
      const r = 130
      const rad = (angle - 90) * (Math.PI / 180)
      const x = r * Math.cos(rad)
      const y = r * Math.sin(rad)
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.4, type: 'spring' }}
          className={`absolute w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg`}
          style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)` }}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
      )
    })}
  </div>
)

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen hero-gradient flex items-center overflow-hidden pt-16">
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl animate-blob" />
      <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl animate-blob" style={{ animationDelay: '6s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Copy */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">AI-Powered Career Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
            >
              Transform Your Career{' '}
              <span className="gradient-text">with AI Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl"
            >
              Upload your resume and unlock instant ATS scoring, skill gap analysis, career
              roadmaps, and personalised interview prep — all powered by cutting-edge AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/register"
                className="group flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                Analyze My Resume Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-300 rounded-2xl border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-200"
              >
                <PlayCircle className="w-4 h-4" />
                See How It Works
              </button>
            </motion.div>

          </div>


          {/* Right: AI Orbit + Floating Cards */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center">
            <AIOrbit />

            {/* Floating mini cards */}
            <MiniCard icon={Target} label="ATS Score" value="92%" color="bg-indigo-500" delay={0.7} className="top-4 -left-4 lg:-left-12 animate-float" />
            <MiniCard icon={TrendingUp} label="Placement Ready" value="87%" color="bg-emerald-500" delay={0.85} className="top-4 -right-4 lg:-right-12 animate-float" style={{ animationDelay: '1s' }} />
            <MiniCard icon={Brain} label="AI Insights" value="24 Tips" color="bg-violet-500" delay={1.0} className="bottom-8 -left-4 lg:-left-16 animate-float" style={{ animationDelay: '2s' }} />
            <MiniCard icon={Zap} label="Skills Found" value="18 / 22" color="bg-pink-500" delay={1.15} className="bottom-0 -right-4 lg:-right-12 animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
