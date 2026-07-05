import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { Mail, ArrowLeft, Key, Lock, Sparkles, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const inputBase =
  'w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 ' +
  'bg-white/5 border border-white/10 ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 ' +
  'transition-all duration-200'

const inputError =
  'w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 ' +
  'bg-white/5 border border-red-500/70 ' +
  'focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 ' +
  'transition-all duration-200'

const labelClass = 'block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide'
const iconWrap = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email or reset
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateReset = () => {
    const newErrors = {}
    if (!resetToken) {
      newErrors.resetToken = 'Reset code is required'
    }
    if (!newPassword) {
      newErrors.newPassword = 'Password is required'
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendReset = async (e) => {
    e.preventDefault()
    if (!validateEmail()) return
    setLoading(true)
    try {
      await authService.requestPasswordReset(email)
      toast.success('Reset code sent to your email!')
      setStep('reset')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!validateReset()) return
    setLoading(true)
    try {
      await authService.resetPassword({
        email,
        resetToken,
        newPassword
      })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f0f23 50%, #0a0a1a 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>

          {step === 'email' ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-white mb-2">Forgot Password?</h1>
              <p className="text-slate-400 text-center text-sm mb-8">
                Enter your email address and we'll send you a code to reset your password.
              </p>

              <form onSubmit={handleSendReset} className="space-y-6">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <span className={iconWrap}><Mail className="w-4 h-4" /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={errors.email ? inputError : inputBase}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3 flex-shrink-0" />{errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Code...' : 'Send Reset Code'}
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Key className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center text-white mb-2">Reset Password</h1>
              <p className="text-slate-400 text-center text-sm mb-8">
                Enter the reset code sent to your email and create a new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className={labelClass}>Reset Code</label>
                  <div className="relative">
                    <span className={iconWrap}><Key className="w-4 h-4" /></span>
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Enter reset code"
                      className={errors.resetToken ? inputError : inputBase}
                      required
                    />
                  </div>
                  {errors.resetToken && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3 flex-shrink-0" />{errors.resetToken}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <span className={iconWrap}><Lock className="w-4 h-4" /></span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={errors.newPassword ? inputError : inputBase}
                      required
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3 flex-shrink-0" />{errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <span className={iconWrap}><Lock className="w-4 h-4" /></span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={errors.confirmPassword ? inputError : inputBase}
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <XCircle className="w-3 h-3 flex-shrink-0" />{errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setStep('email')
                    setEmail('')
                    setResetToken('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setErrors({})
                  }}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
                >
                  Use a different email?
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
