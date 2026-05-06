export default function SuppliesCard() {
  const supplies = [
    { name: 'Paints', count: 34, status: 'ok', color: 'bg-ast_purple' },
    { name: 'Brushes', count: 18, status: 'ok', color: 'bg-ast_turquoise' },
    { name: 'Paper', count: 7, status: 'low', color: 'bg-ast_pink' },
    { name: 'Canvas', count: 3, status: 'critical', color: 'bg-ast_pink' },
    { name: 'Mediums', count: 12, status: 'ok', color: 'bg-ast_turquoise' },
  ]

  return (
    <div className="bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-ast_pink">SUPPLIES</h2>
        <span className="text-xs bg-ast_yellow/20 text-ast_yellow px-2 py-1 rounded">LOW STOCK</span>
      </div>

      <div className="space-y-4">
        {supplies.map((supply) => (
          <div key={supply.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300">{supply.name}</p>
              <p className="text-xs text-slate-400">{supply.count} items</p>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${supply.color} w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
