import { Link } from 'react-router-dom'
import { BrainCircuit, ArrowUpRight, Sparkles } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'ATS Analysis', to: '/register' },
    { label: 'Skill Gap', to: '/register' },
    { label: 'Career Roadmap', to: '/register' },
    { label: 'Interview Prep', to: '/register' },
    { label: 'Placement Score', to: '/register' },
  ],
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Press Kit', to: '#' },
    { label: 'Privacy Policy', to: '#' },
  ],
  Support: [
    { label: 'Documentation', to: '#' },
    { label: 'API Reference', to: '#' },
    { label: 'Community', to: '#' },
    { label: 'Status Page', to: '#' },
    { label: 'Contact Us', to: '#' },
  ],
}

const HomeFooter = () => {
  return (
    <footer id="footer" className="relative border-t border-white/5 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050510 0%, #020208 100%)' }}
    >
      {/* Gradient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="py-14 text-center border-b border-white/5">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-4">Ready to Start?</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Accelerate Your Career <span className="gradient-text">Today</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            Join 50,000+ professionals who've used CareerCoach AI to land dream roles at top companies.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Get Started Free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-500 mt-3">No credit card required · Free resume analysis</p>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold gradient-text">CareerCoach AI</span>
                <span className="text-[9px] text-indigo-400 font-medium tracking-widest uppercase">Resume Intelligence</span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              AI-powered career coaching that helps you land your dream job faster. From resume analysis to interview prep.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-slate-300 tracking-wider uppercase mb-4">{section}</p>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© 2025 CareerCoach AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Cookies</a>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-slate-600">All systems operational</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default HomeFooter
