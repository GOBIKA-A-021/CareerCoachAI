const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500
          focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500
          outline-none transition-all duration-200
          ${error ? 'border-red-500/70 focus:ring-red-500/40' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}

export default Input

