export default function InventoryTable({ inventoryFilter, onFilterChange, sessionSupplies = [], sessionProjects = [], onEditSupply, onDeleteSupply }) {
  const allSupplies = sessionSupplies;

  const getFilteredItems = () => {
    switch (inventoryFilter) {
      case "Low Stock":
        return allSupplies.filter((s) => s.status === "low" || s.status === "critical");
      case "Out of Stock":
        return allSupplies.filter((s) => s.status === "critical");
      case "All":
      default:
        return allSupplies;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="col-span-2 bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-sm font-bold text-slate-400 mb-4">INVENTORY OVERVIEW</h3>
      
      <div className="flex gap-2 mb-4">
        {['All', 'Low Stock', 'Out of Stock'].map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`text-xs px-3 py-1 rounded-lg transition ${
              filter === inventoryFilter
                ? 'bg-ast_turquoise/20 text-ast_turquoise'
                : 'text-slate-400 hover:text-ast_turquoise'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-2 text-slate-400 font-medium">ITEM</th>
            <th className="text-left py-2 text-slate-400 font-medium">CATEGORY</th>
            <th className="text-left py-2 text-slate-400 font-medium">QTY</th>
            <th className="text-left py-2 text-slate-400 font-medium">STATUS</th>
            <th className="text-left py-2 text-slate-400 font-medium">LOCATION</th>
            <th className="text-left py-2 text-slate-400 font-medium">PROJECTS</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody className="space-y-2">
          {filteredItems.map((item) => (
            <tr key={item.id} className="border-b border-slate-800/50 hover:bg-ast_bg_blue/50 transition">
              <td className="py-3 text-slate-200">
                <div className="flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.isNew && (
                    <span className="text-xs bg-ast_turquoise/40 text-ast_turquoise px-1.5 py-0.25 rounded-full font-semibold">
                      NEW
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 text-slate-400">{item.category}</td>
              <td className="py-3 text-slate-300">{item.qty}</td>
              <td className="py-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'ok'
                    ? 'bg-ast_turquoise/20 text-ast_turquoise'
                    : item.status === 'low'
                    ? 'bg-ast_yellow/20 text-ast_yellow'
                    : 'bg-ast_pink/20 text-ast_pink'
                }`}>
                  {item.status === 'ok' ? '✓' : '⚠️'} {item.status}
                </span>
              </td>
              <td className="py-3 text-slate-400">{item.location}</td>
              <td className="py-3">
                {(() => {
                  const ids = Array.isArray(item.usedInProjectIds) ? item.usedInProjectIds : [];
                  if (ids.length === 0) {
                    return <span className="text-xs text-white/25">—</span>;
                  }
                  const linked = ids
                    .map(id => {
                      const p = sessionProjects.find(proj => proj.id === id);
                      return p ? { id: p.id, title: p.title } : null;
                    })
                    .filter(Boolean);
                  if (linked.length === 0) {
                    return <span className="text-xs text-white/25">—</span>;
                  }
                  return (
                    <div className="flex flex-wrap gap-1">
                      {linked.map(({ id, title }) => (
                        <span
                          key={id}
                          className="text-xs bg-ast_lavender/20 text-ast_lavender px-1.5 py-0.5 rounded"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditSupply(item.id)}
                    className="text-xs text-ast_lavender/60 hover:text-ast_lavender transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteSupply(item.id)}
                    className="text-xs text-white/25 hover:text-ast_pink transition"
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
