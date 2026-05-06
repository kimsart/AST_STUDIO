export default function CommunitySpotlight() {
  return (
    <div className="bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-4">
      <h2 className="text-sm font-bold text-slate-400 mb-4">FEATURED ARTIST</h2>
      
      <div className="mb-4">
        <div className="w-full h-24 rounded-lg bg-gradient-to-br from-ast_purple via-ast_pink to-ast_turquoise opacity-70 mb-3" />
        
        <h3 className="font-bold text-ast_turquoise text-sm mb-1">Maya Chen</h3>
        <p className="text-xs text-slate-400 mb-3">Contemporary watercolor artist exploring botanical themes</p>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-ast_turquoise/20 text-ast_turquoise px-2 py-1 rounded">Watercolor</span>
          <span className="text-xs bg-ast_pink/20 text-ast_pink px-2 py-1 rounded">Botanical</span>
          <span className="text-xs bg-ast_yellow/20 text-ast_yellow px-2 py-1 rounded">Featured</span>
        </div>
      </div>

      <button className="w-full text-ast_turquoise text-xs font-medium hover:text-ast_turquoise/80 transition py-2">
        View Profile →
      </button>
    </div>
  )
}
