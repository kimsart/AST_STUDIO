import { mockSupplies } from "../data/mockData.js";

export default function InventoryTable({ inventoryFilter, onFilterChange }) {
  const getFilteredItems = () => {
    switch (inventoryFilter) {
      case "Low Stock":
        return mockSupplies.filter((s) => s.status === "low" || s.status === "critical");
      case "Out of Stock":
        return mockSupplies.filter((s) => s.status === "critical");
      case "All":
      default:
        return mockSupplies;
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
          </tr>
        </thead>
        <tbody className="space-y-2">
          {filteredItems.map((item) => (
            <tr key={item.id} className="border-b border-slate-800/50 hover:bg-ast_bg_blue/50 transition">
              <td className="py-3 text-slate-200">{item.name}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
