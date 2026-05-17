import { Fragment, useState } from "react";

export default function InventoryTable({ inventoryFilter, onFilterChange, sessionSupplies = [], sessionProjects = [], onEditSupply, onDeleteSupply }) {
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);
  const [isEditingSupply, setIsEditingSupply] = useState(false);
  const [editDraft, setEditDraft] = useState({});

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
  const selectedSupply = allSupplies.find(s => s.id === selectedSupplyId) ?? null;

  const handleSelectSupply = (id) => {
    if (selectedSupplyId === id) {
      setSelectedSupplyId(null);
      setIsEditingSupply(false);
    } else {
      setSelectedSupplyId(id);
      setIsEditingSupply(false);
    }
  };

  const handleStartEdit = (supply) => {
    setEditDraft({
      name: supply.name ?? "",
      category: supply.category ?? "",
      qty: supply.qty ?? "",
      status: supply.status ?? "ok",
      location: supply.location ?? "",
      notes: supply.notes ?? "",
    });
    setIsEditingSupply(true);
  };

  const handleSaveEdit = () => {
    onEditSupply(selectedSupplyId, editDraft);
    setIsEditingSupply(false);
  };

  const handleCancelEdit = () => {
    setIsEditingSupply(false);
  };

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
        <tbody>
          {filteredItems.map((item) => (
            <Fragment key={item.id}>
              <tr
                onClick={() => handleSelectSupply(item.id)}
                className={`border-b border-slate-800/50 cursor-pointer transition ${
                  selectedSupplyId === item.id
                    ? 'bg-ast_pink/10'
                    : 'hover:bg-ast_bg_blue/50'
                }`}
              >
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
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSupply(item.id); }}
                    className="text-xs text-white/25 hover:text-ast_pink transition"
                  >
                    ×
                  </button>
                </td>
              </tr>

              {selectedSupplyId === item.id && selectedSupply && (
                <tr>
                  <td colSpan={7} className="pb-3 pt-0">
                    <div className="rounded-lg border border-ast_pink/30 bg-ast_pink/5 p-3">
                      {isEditingSupply ? (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wider text-ast_pink mb-2">Edit Supply</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-white/50 mb-0.5">Name</label>
                              <input
                                className="w-full rounded bg-ast_bg_dark/70 border border-ast_pink/30 px-2 py-1 text-xs text-white focus:outline-none focus:border-ast_pink"
                                value={editDraft.name}
                                onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/50 mb-0.5">Category</label>
                              <input
                                className="w-full rounded bg-ast_bg_dark/70 border border-ast_pink/30 px-2 py-1 text-xs text-white focus:outline-none focus:border-ast_pink"
                                value={editDraft.category}
                                onChange={e => setEditDraft(d => ({ ...d, category: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/50 mb-0.5">Qty</label>
                              <input
                                className="w-full rounded bg-ast_bg_dark/70 border border-ast_pink/30 px-2 py-1 text-xs text-white focus:outline-none focus:border-ast_pink"
                                value={editDraft.qty}
                                onChange={e => setEditDraft(d => ({ ...d, qty: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/50 mb-0.5">Status</label>
                              <select
                                className="w-full rounded bg-ast_bg_dark/70 border border-ast_pink/30 px-2 py-1 text-xs text-white focus:outline-none focus:border-ast_pink"
                                value={editDraft.status}
                                onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}
                              >
                                <option value="ok">ok</option>
                                <option value="low">low</option>
                                <option value="critical">critical</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-white/50 mb-0.5">Location</label>
                              <input
                                className="w-full rounded bg-ast_bg_dark/70 border border-ast_pink/30 px-2 py-1 text-xs text-white focus:outline-none focus:border-ast_pink"
                                value={editDraft.location}
                                onChange={e => setEditDraft(d => ({ ...d, location: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-white/50 mb-0.5">Notes</label>
                              <input
                                className="w-full rounded bg-ast_bg_dark/70 border border-ast_pink/30 px-2 py-1 text-xs text-white focus:outline-none focus:border-ast_pink"
                                value={editDraft.notes}
                                onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-xs bg-ast_pink/20 text-ast_pink px-3 py-1 rounded hover:bg-ast_pink/40 transition"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-xs text-white/40 hover:text-white/70 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-ast_pink mb-2">Selected</p>
                          <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-xs">
                            <div>
                              <p className="text-white/40">Name</p>
                              <p className="text-white/80">{selectedSupply.name}</p>
                            </div>
                            <div>
                              <p className="text-white/40">Category</p>
                              <p className="text-white/80">{selectedSupply.category}</p>
                            </div>
                            <div>
                              <p className="text-white/40">Qty</p>
                              <p className="text-white/80">{selectedSupply.qty}</p>
                            </div>
                            <div>
                              <p className="text-white/40">Status</p>
                              <p className="text-white/80">{selectedSupply.status}</p>
                            </div>
                            <div>
                              <p className="text-white/40">Location</p>
                              <p className="text-white/80">{selectedSupply.location || "—"}</p>
                            </div>
                            {selectedSupply.notes && (
                              <div className="col-span-3">
                                <p className="text-white/40">Notes</p>
                                <p className="text-white/80">{selectedSupply.notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex gap-3">
                            <button
                              onClick={() => handleStartEdit(selectedSupply)}
                              className="text-xs text-ast_lavender/70 hover:text-ast_lavender transition"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
