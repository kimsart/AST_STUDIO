export default function InspirationCard() {
  return (
    <div className="bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-6">
      <h2 className="text-sm font-bold text-slate-300 mb-4">INSPIRATION</h2>
      
      <div className="space-y-3">
        <div className="h-20 rounded-lg bg-gradient-to-r from-ast_purple via-ast_pink to-ast_turquoise opacity-70 hover:opacity-100 transition cursor-pointer" />
        <div className="h-20 rounded-lg bg-gradient-to-r from-ast_turquoise via-ast_purple to-ast_pink opacity-70 hover:opacity-100 transition cursor-pointer" />
        <div className="h-20 rounded-lg bg-gradient-to-r from-ast_pink via-ast_yellow to-ast_purple opacity-70 hover:opacity-100 transition cursor-pointer" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs bg-ast_pink/20 text-ast_pink px-2 py-1 rounded">Watercolor</span>
        <span className="text-xs bg-ast_turquoise/20 text-ast_turquoise px-2 py-1 rounded">Nature</span>
        <span className="text-xs bg-ast_purple/20 text-ast_purple px-2 py-1 rounded">Botanical</span>
      </div>
    </div>
  )
}
