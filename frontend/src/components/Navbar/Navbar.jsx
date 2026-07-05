import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerCoach AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/upload-resume" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Upload Resume
                </Link>
                <Link to="/reports" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Reports
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user?.firstName}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Dashboard
                </Link>
                <Link to="/upload-resume" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Upload Resume
                </Link>
                <Link to="/reports" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Reports
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Profile
                </Link>
                <Link to="/settings" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Settings
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
