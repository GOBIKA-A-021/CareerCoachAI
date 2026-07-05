const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass rounded-xl border border-white/10 p-6 text-white ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

