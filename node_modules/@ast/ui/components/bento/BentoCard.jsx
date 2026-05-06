export default function BentoCard({ 
  title, 
  description, 
  icon, 
  children, 
  className = '' 
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-br from-ast_purple/10 to-ast_blue/10
        border border-ast_blue/40
        p-6
        shadow-[0_8px_32px_rgba(46,196,182,0.1)]
        hover:shadow-[0_8px_48px_rgba(254,95,167,0.2)]
        hover:scale-[1.02]
        transition-all duration-300
        backdrop-blur-sm
        ${className}
      `}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-ast_turquoise/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        {icon && (
          <div className="mb-4 text-3xl">
            {icon}
          </div>
        )}
        
        {/* Title */}
        {title && (
          <h3 className="text-xl font-bold text-ast_turquoise mb-2">
            {title}
          </h3>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-sm text-ast_pink/80 mb-4">
            {description}
          </p>
        )}
        
        {/* Children */}
        {children && (
          <div className="text-ast_yellow/90">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
