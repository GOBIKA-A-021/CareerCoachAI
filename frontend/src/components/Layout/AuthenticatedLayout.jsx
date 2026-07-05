import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import {
  Menu, X, Bell, Search, LogOut,
  LayoutDashboard, Upload, FileText, Target, BookOpen, Map,
  HelpCircle, TrendingUp, Folder, User, Settings, CheckCircle2,
  AlertCircle, BrainCircuit, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const AuthenticatedLayout = ({ children }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Resume analysis is completed.', type: 'success', time: '10m ago' },
    { id: 2, text: 'Improve your Spring Boot skills to increase placement score.', type: 'warning', time: '1h ago' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  // Force dark mode class on document element
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#search-area')) setShowSearchModal(false)
      if (!e.target.closest('#notif-area')) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  // Sidebar Links
  const navGroups = [
    {
      title: 'Main',
      links: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Resume',
      links: [
        { name: 'Upload Resume', path: '/upload-resume', icon: Upload },
        { name: 'Resume Analysis', path: '/resume-analysis', icon: FileText },
        { name: 'ATS Report', path: '/ats-report', icon: Target },
      ]
    },
    {
      title: 'Career',
      links: [
        { name: 'Skill Gap', path: '/skill-gap', icon: BookOpen },
        { name: 'Career Roadmap', path: '/career-roadmap', icon: Map },
        { name: 'Interview Prep', path: '/interview-questions', icon: HelpCircle },
        { name: 'Placement Score', path: '/placement-score', icon: TrendingUp },
      ]
    },
    {
      title: 'Account',
      links: [
        { name: 'Reports', path: '/reports', icon: Folder },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ]

  const allLinks = navGroups.flatMap(g => g.links)
  const filteredSearch = searchQuery.trim() === '' ? [] : allLinks.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearchSelect = (path) => {
    setShowSearchModal(false)
    setSearchQuery('')
    navigate(path)
  }

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onLinkClick}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold text-white">CareerCoach AI</span>
            <span className="text-[9px] text-indigo-400 font-medium tracking-widest uppercase">Resume Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map(group => (
          <div key={group.title}>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3 mb-2">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.links.map(link => {
                const active = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <link.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="flex-1">{link.name}</span>
                    {active && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile + Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f0f23 50%, #0a0a1a 100%)' }}
    >
      {/* Top Navigation Bar */}
      <header
        className="h-[64px] fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 border-b border-white/5"
        style={{ background: 'rgba(5, 5, 16, 0.85)', backdropFilter: 'blur(20px)' }}
      >
        {/* Left: Hamburger + Logo on mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl hover:bg-white/10 lg:hidden text-slate-400 transition-colors"
            id="mobile-hamburger-btn"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Mobile Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">CareerCoach AI</span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-4 relative" id="search-area">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search features..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white/10 focus:border-indigo-500/50 placeholder-slate-500"
              onClick={() => setShowSearchModal(true)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="global-search-input"
            />
          </div>

          {/* Search suggestions dropdown */}
          {showSearchModal && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 shadow-xl z-50 p-2"
              style={{ background: 'rgba(10, 10, 30, 0.95)', backdropFilter: 'blur(20px)' }}
            >
              <div className="text-[10px] text-slate-500 font-bold px-3 py-1.5 uppercase tracking-wider">
                {searchQuery.trim() ? 'Results' : 'Quick Links'}
              </div>
              {(searchQuery.trim() ? filteredSearch : allLinks.slice(0, 6)).map(link => (
                <button
                  key={link.path}
                  onClick={() => handleSearchSelect(link.path)}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <link.icon className="w-4 h-4 text-indigo-400" />
                  <span>{link.name}</span>
                </button>
              ))}
              {searchQuery.trim() && filteredSearch.length === 0 && (
                <div className="text-sm text-slate-500 px-3 py-2">No results for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <div className="relative" id="notif-area">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors relative"
              id="notification-bell-btn"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 shadow-2xl z-50 p-2"
                style={{ background: 'rgba(10, 10, 30, 0.97)', backdropFilter: 'blur(20px)' }}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-500">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="flex items-start gap-2.5 p-2.5 hover:bg-white/5 rounded-lg text-xs transition-colors">
                        {notif.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-slate-300">{notif.text}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative group ml-1">
            <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium text-slate-300 hidden md:block">
                {user?.firstName || 'User'}
              </span>
            </button>

            {/* Dropdown */}
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1 z-50"
              style={{ background: 'rgba(10, 10, 30, 0.97)', backdropFilter: 'blur(20px)' }}
            >
              <Link to="/profile" className="block px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                My Profile
              </Link>
              <Link to="/settings" className="block px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                Settings
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 text-sm rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors font-medium">
                  Admin Panel
                </Link>
              )}
              <div className="my-1 border-t border-white/5" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 pt-[64px]">
        {/* Sidebar - Desktop */}
        <aside
          className="w-[240px] fixed top-[64px] bottom-0 left-0 z-30 hidden lg:block border-r border-white/5"
          style={{ background: 'rgba(5, 5, 16, 0.8)', backdropFilter: 'blur(20px)' }}
        >
          <SidebarContent onLinkClick={undefined} />
        </aside>

        {/* Sidebar - Mobile Drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="w-[240px] fixed top-0 bottom-0 left-0 z-50 flex flex-col lg:hidden border-r border-white/10"
              style={{ background: 'rgba(5, 5, 20, 0.97)', backdropFilter: 'blur(20px)' }}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pl-[240px] min-h-[calc(100vh-64px)]">
          <div className="animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthenticatedLayout
