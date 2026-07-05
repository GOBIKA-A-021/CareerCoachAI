import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Send, Sparkles, X } from 'lucide-react'

const conversation = [
  { role: 'ai', text: "Hello! I'm your AI Career Coach. I've analysed your resume and found some key opportunities. 🎯" },
  { role: 'user', text: 'What should I focus on for Google SWE roles?' },
  { role: 'ai', text: "Great choice! Your profile is 88% compatible with Google SWE. Focus on: 1️⃣ System Design (LLD & HLD), 2️⃣ Distributed Systems, 3️⃣ Data Structures & Algorithms (LeetCode medium/hard)." },
  { role: 'user', text: 'How can I improve my ATS score?' },
  { role: 'ai', text: "Add these keywords: \"scalable architecture\", \"microservices\", \"CI/CD pipelines\". Quantify achievements — e.g. 'Reduced latency by 40%'. This alone can boost your ATS score by 15+ points! 🚀" },
]

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 glass rounded-2xl rounded-tl-none w-fit border border-white/10">
    {[0, 1, 2].map(i => (
      <div key={i} className={`w-2 h-2 rounded-full bg-indigo-400 typing-dot`} />
    ))}
  </div>
)

const AIChatPreview = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.2 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let idx = 0
    const show = () => {
      if (idx >= conversation.length) return
      const msg = conversation[idx]
      if (msg.role === 'ai' && idx > 0) {
        setShowTyping(true)
        setTimeout(() => {
          setShowTyping(false)
          setVisibleCount(v => v + 1)
          idx++
          setTimeout(show, 800)
        }, 1200)
      } else {
        setVisibleCount(v => v + 1)
        idx++
        setTimeout(show, 600)
      }
    }
    const t = setTimeout(show, 400)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a1f 0%, #080818 100%)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-3">AI Mentor</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Chat With Your <span className="gradient-text">AI Career Coach</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Get real-time career advice, resume tips, and interview strategies — available 24/7.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="gradient-border mx-auto max-w-2xl"
        >
          <div className="glass-dark rounded-[15px] overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center animate-pulse-glow">
                <Brain className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">CareerCoach AI</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Online · Powered by Gemini
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* Messages */}
            <div className="px-5 py-5 space-y-3 min-h-[280px]">
              {conversation.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mr-2 flex-shrink-0 self-end">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'ai'
                        ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                        : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none shadow-lg'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {showTyping && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <Brain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <TypingIndicator />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="px-4 py-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                <input
                  type="text"
                  placeholder="Ask me anything about your career..."
                  className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none"
                  readOnly
                />
                <button className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-600 mt-2">Sign up to start your free AI coaching session</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AIChatPreview
