import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    avatar: 'PS',
    avatarColor: 'from-pink-500 to-rose-500',
    rating: 5,
    text: "CareerCoach AI completely transformed my job search. My ATS score jumped from 58% to 94% in two weeks. The AI Mentor helped me prepare for Google's system design rounds with laser-precise feedback. Got the offer in 6 weeks!",
    company: '🔵 Google',
  },
  {
    name: 'Arjun Mehta',
    role: 'ML Engineer at Microsoft',
    avatar: 'AM',
    avatarColor: 'from-indigo-500 to-violet-500',
    rating: 5,
    text: "The Skill Gap Analysis was eye-opening. I had no idea what I was missing for ML roles. The personalised roadmap guided me through exactly the right courses. Landed at Microsoft 3 months later with a 40% salary jump!",
    company: '🟢 Microsoft',
  },
  {
    name: 'Sneha Patel',
    role: 'Product Manager at Stripe',
    avatar: 'SP',
    avatarColor: 'from-emerald-500 to-teal-500',
    rating: 5,
    text: "The Career Roadmap feature is incredible. It's not just a list — it's an adaptive plan that updates as you progress. The Interview Prep AI asked me the exact questions Stripe asked in my actual interview. 10/10 would recommend!",
    company: '🟣 Stripe',
  },
  {
    name: 'Rahul Gupta',
    role: 'Backend Engineer at Amazon',
    avatar: 'RG',
    avatarColor: 'from-amber-500 to-orange-500',
    rating: 5,
    text: "I was applying for 3 months with zero responses. After one week with CareerCoach AI, I optimised my resume and started getting interview calls immediately. The ATS report showed me I had been making basic formatting mistakes!",
    company: '🟠 Amazon',
  },
  {
    name: 'Divya Nair',
    role: 'Data Scientist at Meta',
    avatar: 'DN',
    avatarColor: 'from-violet-500 to-purple-500',
    rating: 5,
    text: "The Placement Score gave me an honest assessment of where I stood. The AI Mentor's advice on my portfolio projects was game-changing. Meta interview was tough but I felt fully prepared. Best career investment I've made!",
    company: '🔷 Meta',
  },
  {
    name: 'Karan Singh',
    role: 'DevOps Engineer at Atlassian',
    avatar: 'KS',
    avatarColor: 'from-rose-500 to-pink-500',
    rating: 5,
    text: "As a career switcher from non-CS background, I was lost. CareerCoach AI built a 12-week DevOps learning plan just for me. Tracked my progress week by week. Got my dream job in 4 months — truly AI-powered career acceleration!",
    company: '🔴 Atlassian',
  },
]

const TestimonialCard = ({ t, delay, inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className="group relative glass rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-950/50 transition-all duration-400 overflow-hidden"
  >
    {/* Subtle hover glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
    />

    <Quote className="w-6 h-6 text-indigo-500/40 mb-3" />

    {/* Stars */}
    <div className="flex gap-0.5 mb-3">
      {[...Array(t.rating)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>

    <p className="text-sm text-slate-300 leading-relaxed mb-5 relative">"{t.text}"</p>

    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
        {t.avatar}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{t.name}</p>
        <p className="text-xs text-slate-500">{t.role}</p>
      </div>
      <span className="ml-auto text-xs font-medium text-slate-400">{t.company}</span>
    </div>
  </motion.div>
)

const Testimonials = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080818 0%, #050510 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-violet-900/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-rose-400 tracking-widest uppercase mb-3">Success Stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Students Who <span className="gradient-text">Made It</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Real people. Real results. From zero callbacks to dream offers at top companies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} delay={i * 0.08} inView={inView} />
          ))}
        </div>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 glass px-8 py-4 rounded-2xl border border-white/10">
            <div>
              <p className="text-4xl font-black text-white">4.9</p>
              <div className="flex gap-0.5 justify-center mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-left">
              <p className="text-sm font-semibold text-white">50,000+ Reviews</p>
              <p className="text-xs text-slate-400">Average rating across all platforms</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
