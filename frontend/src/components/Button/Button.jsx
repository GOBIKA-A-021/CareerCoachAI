import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg shadow-primary-500/25',
    secondary: 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white',
    danger: 'bg-red-600/80 text-white hover:bg-red-500 border border-red-500/30',
    outline: 'border border-primary-500/30 text-primary-400 hover:bg-primary-500/10'
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3.5 text-base rounded-2xl'
  }

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed scale-100' : 'hover:scale-[1.02] active:scale-[0.98]'}
        font-semibold transition-all duration-200
        flex items-center justify-center space-x-2
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
      <span>{children}</span>
    </button>
  )
}

export default Button

