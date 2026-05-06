export default function BentoSectionHeader({ 
  title, 
  subtitle, 
  titleColor = 'pink',
  className = '' 
}) {
  const titleColorClass = titleColor === 'pink' ? 'text-ast_pink' : 'text-ast_turquoise'
  
  return (
    <div className={`mb-12 ${className}`}>
      <h2
        className={`
          text-3xl md:text-4xl font-bold
          ${titleColorClass}
          pb-2
          relative
          inline-block
          after:content-['']
          after:block
          after:h-[2px]
          after:bg-ast_blue
          after:mt-2
          after:w-full
        `}
      >
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-ast_coral/80 text-sm md:text-base mt-4">
          {subtitle}
        </p>
      )}
    </div>
  )
}
