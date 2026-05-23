export default function SuppliesCard({ sessionSupplies = [], sessionProjects = [] }) {
  const allSupplies = sessionSupplies;

  return (
    <div className="bg-[#120724] border border-ast_blue/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-ast_pink">SUPPLIES</h2>
        <span className="text-xs bg-ast_yellow/20 text-ast_yellow px-2 py-1 rounded">LOW STOCK</span>
      </div>

      <div className="space-y-4">
        {allSupplies.map((supply) => (
          <div key={supply.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/80">{supply.name}</p>
                {supply.isNew && (
                  <span className="text-xs bg-ast_pink/40 text-ast_pink px-1.5 py-0.25 rounded-full font-semibold">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-white/55">{supply.qty} items</p>
            </div>

            {(() => {
              const ids = Array.isArray(supply.usedInProjectIds) ? supply.usedInProjectIds : [];
              const count = ids.filter(id => sessionProjects.some(p => p.id === id)).length;
              if (count === 0) return null;
              return (
                <p className="text-xs text-ast_lavender/60 mt-0.5">
                  Used in {count} project{count > 1 ? 's' : ''}
                </p>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  )
}
