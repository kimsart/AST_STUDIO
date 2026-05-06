export default function InventoryTable() {
  const items = [
    { name: 'Winsor & Newton Cobalt Blue', category: 'Paints', qty: '2 tubes', status: 'Low', date: 'Apr 12' },
    { name: 'Arches 300gsm Cold Press', category: 'Paper', qty: '15 sheets', status: 'OK', date: 'Mar 28' },
    { name: 'Da Vinci Round #8', category: 'Brushes', qty: '4', status: 'OK', date: 'Apr 5' },
    { name: 'Liquitex Gel Medium', category: 'Mediums', qty: '1 bottle', status: 'Low', date: 'Feb 14' },
  ]

  return (
    <div className="col-span-2 bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-sm font-bold text-slate-400 mb-4">INVENTORY OVERVIEW</h3>
      
      <div className="flex gap-2 mb-4">
        {['All', 'Low Stock', 'Out of Stock'].map((filter) => (
          <button
            key={filter}
            className={`text-xs px-3 py-1 rounded-lg transition ${
              filter === 'All'
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
            <th className="text-left py-2 text-slate-400 font-medium">LAST ORDERED</th>
          </tr>
        </thead>
        <tbody className="space-y-2">
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-800/50 hover:bg-ast_bg_blue/50 transition">
              <td className="py-3 text-slate-200">{item.name}</td>
              <td className="py-3 text-slate-400">{item.category}</td>
              <td className="py-3 text-slate-300">{item.qty}</td>
              <td className="py-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'OK'
                    ? 'bg-ast_turquoise/20 text-ast_turquoise'
                    : 'bg-ast_yellow/20 text-ast_yellow'
                }`}>
                  ⚠️ {item.status}
                </span>
              </td>
              <td className="py-3 text-slate-400">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
