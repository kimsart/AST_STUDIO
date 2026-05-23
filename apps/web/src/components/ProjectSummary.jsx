export default function ProjectSummary() {
  return (
    <div className="col-span-2 bg-[#120724] border border-ast_turquoise/20 rounded-xl p-6">
      <h3 className="text-sm font-bold text-ast_lavender/70 mb-4">CURRENT FOCUS</h3>
      
      <h2 className="text-2xl font-bold text-ast_turquoise mb-2">Watercolor Botanicals</h2>
      <p className="text-ast_turquoise/60 text-sm mb-4">
        A series of 12 botanical illustrations exploring local California wildflowers using wet-on-wet technique.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-white/55">Progress</p>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-1">
            <div className="h-full w-2/3 bg-gradient-to-r from-ast_turquoise to-ast_pink" />
          </div>
          <p className="text-sm font-bold text-ast_turquoise mt-1">67%</p>
        </div>
        <div>
          <p className="text-xs text-white/55">Pieces</p>
          <p className="text-2xl font-bold text-ast_turquoise mt-1">8 of 12</p>
        </div>
        <div>
          <p className="text-xs text-white/55">Status</p>
          <p className="text-sm font-bold text-ast_turquoise mt-2">In Progress</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-ast_turquoise/20 border border-ast_turquoise text-ast_turquoise px-4 py-2 rounded-lg hover:bg-ast_turquoise/30 transition text-sm font-medium">
          Open Project
        </button>
        <button className="flex-1 text-white/55 hover:text-ast_turquoise transition text-sm font-medium">
          Log Hours
        </button>
      </div>

      <div className="mt-4 flex gap-3 text-xs text-white/50">
        <span>📅 Due May 28</span>
        <span>💰 Budget $340/500</span>
        <span>⏱️ Hours: 45.2</span>
      </div>
    </div>
  )
}
