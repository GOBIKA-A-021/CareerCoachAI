import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BrainCircuit, Menu, X, Moon, Sun, Sparkles,
  Home, Info, Mail, Layers
} from 'lucide-react'
import useAuthStore from '../../../store/authStore'

const HomeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // default dark
    document.documentElement.classList.add('dark')
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const navLinks = [
    { label: 'Home', to: '#hero', icon: Home },
    { label: 'Features', to: '#features', icon: Layers },
    { label: 'About', to: '#how-it-works', icon: Info },
    { label: 'Contact', to: '#footer', icon: Mail },
  ]

  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-dark shadow-2xl shadow-indigo-950/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse-glow">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold gradient-text">CareerCoach AI</span>
              <span className="text-[9px] text-indigo-400 font-medium tracking-widest uppercase">Resume Intelligence</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, to }) => (
              <button
                key={label}
                onClick={() => scrollTo(to)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-white/20"
                >
                  Register
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ label, to, icon: Icon }) => (
              <button
                key={label}
                onClick={() => scrollTo(to)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                {label}
              </button>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 text-sm font-medium text-center text-slate-300 hover:text-white bg-white/5 rounded-xl transition-all">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-3 text-sm font-medium text-center text-red-400 hover:bg-red-500/10 rounded-xl transition-all">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 text-sm font-medium text-center text-slate-300 hover:text-white bg-white/5 rounded-xl transition-all">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl">Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default HomeNavbar
