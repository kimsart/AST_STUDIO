export default function StudioChat() {
  return (
    <div className="bg-[#120724] border border-ast_blue/20 rounded-xl p-4 h-full flex flex-col">
      <h2 className="text-sm font-bold text-ast_lavender/70 mb-4">STUDIO CHAT</h2>
      
      <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-ast_purple/30 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-ast_turquoise">You</p>
            <p className="text-xs text-ast_body/80">Working on botanicals today</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-ast_pink/30 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-ast_turquoise">Sarah</p>
            <p className="text-xs text-ast_body/80">Love your progress! 🎨</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-ast_yellow/30 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-ast_turquoise">Studio</p>
            <p className="text-xs text-ast_body/80">New supplies available 📦</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 bg-ast_deep/70 border border-ast_lavender/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-ast_turquoise"
        />
        <button className="bg-ast_turquoise/20 border border-ast_turquoise text-ast_turquoise px-3 py-2 rounded-lg hover:bg-ast_turquoise/30 transition text-xs font-medium">
          →
        </button>
      </div>
    </div>
  )
}
