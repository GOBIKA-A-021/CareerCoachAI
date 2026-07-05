const ProgressBar = ({ value, max = 100, color = 'primary', size = 'md' }) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`${colors[color]} ${sizes[size]} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar
