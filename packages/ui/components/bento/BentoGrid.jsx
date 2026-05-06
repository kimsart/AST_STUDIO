export default function BentoGrid({ 
  columns = 3, 
  gap = 6, 
  className = '', 
  children 
}) {
  return (
    <div
      className={`
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}
        gap-${gap}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  )
}
