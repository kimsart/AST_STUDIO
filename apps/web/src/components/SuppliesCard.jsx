import { mockSupplies } from "../data/mockData.js";

export default function SuppliesCard() {
  return (
    <div className="bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border border-ast_blue/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-ast_pink">SUPPLIES</h2>
        <span className="text-xs bg-ast_yellow/20 text-ast_yellow px-2 py-1 rounded">LOW STOCK</span>
      </div>

      <div className="space-y-4">
        {mockSupplies.map((supply) => (
          <div key={supply.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300">{supply.name}</p>
              <p className="text-xs text-slate-400">{supply.qty} items</p>
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
