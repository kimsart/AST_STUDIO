import { Fragment, useState } from "react";
import { SUPPLY_CATEGORIES } from "../data/supplyCategories.js";

export default function InventoryTable({ inventoryFilter, onFilterChange, sessionSupplies = [], sessionProjects = [], onEditSupply, onDeleteSupply }) {
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);
  const [isEditingSupply, setIsEditingSupply] = useState(false);
  const [editDraft, setEditDraft] = useState({});

  const getFilteredItems = () => {
    switch (inventoryFilter) {
      case "Low Stock":
        return sessionSupplies.filter((s) => s.status === "low" || s.status === "critical");
      case "Out of Stock":
        return sessionSupplies.filter((s) => s.status === "critical");
      case "All":
      default:
        return sessionSupplies;
    }
  };

  const filteredItems = getFilteredItems();
  const selectedSupply = sessionSupplies.find(s => s.id === selectedSupplyId) ?? null;

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
      subcategory: supply.subcategory ?? "",
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

  const editCategoryDef = SUPPLY_CATEGORIES.find(c => c.value === editDraft.category);
  const editSubcategories = editCategoryDef ? editCategoryDef.subcategories : [];

  return (
    <div className="col-span-2 bg-[#120724] border border-ast_blue/20 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-sm font-bold text-ast_pink/70 mb-4">INVENTORY OVERVIEW</h3>

      <div className="flex gap-2 mb-4">
        {['All', 'Low Stock', 'Out of Stock'].map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`text-xs px-3 py-1 rounded-lg transition ${
              filter === inventoryFilter
                ? 'bg-ast_turquoise/20 text-ast_turquoise'
                : 'text-white/50 hover:text-ast_turquoise'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 text-ast_lavender/60 font-medium">ITEM</th>
            <th className="text-left py-2 text-ast_lavender/60 font-medium">CATEGORY</th>
            <th className="text-left py-2 text-ast_lavender/60 font-medium">QTY</th>
            <th className="text-left py-2 text-ast_lavender/60 font-medium">STATUS</th>
            <th className="text-left py-2 text-ast_lavender/60 font-medium">LOCATION</th>
            <th className="text-left py-2 text-ast_lavender/60 font-medium">PROJECTS</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <Fragment key={item.id}>
              <tr
                onClick={() => handleSelectSupply(item.id)}
                className={`border-b border-white/10 cursor-pointer transition ${
                  selectedSupplyId === item.id
                    ? 'bg-ast_pink/10'
                    : 'hover:bg-ast_bg_blue/50'
                }`}
              >
                <td className="py-3 text-white/90">
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.isNew && (
                      <span className="text-xs bg-ast_turquoise/40 text-ast_turquoise px-1.5 py-0.25 rounded-full font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 text-white/55">
                  {item.category}
                  {item.subcategory ? (
                    <span className="ml-1 text-white/30 text-xs">· {item.subcategory}</span>
                  ) : null}
                </td>
                <td className="py-3 text-white/75">{item.qty}</td>
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
                <td className="py-3 text-white/55">{item.location}</td>
                <td className="py-3">
                  {(() => {
                    const ids = Array.isArray(item.usedInProjectIds) ? item.usedInProjectIds : [];
                    if (ids.length === 0) return <span className="text-xs text-white/25">—</span>;
                    const linked = ids
                      .map(id => {
                        const p = sessionProjects.find(proj => proj.id === id);
                        return p ? { id: p.id, title: p.title } : null;
                      })
                      .filter(Boolean);
                    if (linked.length === 0) return <span className="text-xs text-white/25">—</span>;
                    return (
                      <div className="flex flex-wrap gap-1">
                        {linked.map(({ id, title }) => (
                          <span key={id} className="text-xs bg-ast_lavender/20 text-ast_lavender px-1.5 py-0.5 rounded">
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
                  <td colSpan={7} className="py-3">
                    <div className="rounded-2xl border border-ast_pink/60 bg-ast_deep/95 p-6 shadow-astPink">

                      {isEditingSupply ? (
                        <>
                          <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-ast_pink">Edit Supply</h2>
                            <button
                              onClick={handleCancelEdit}
                              className="text-xl text-ast_yellow/60 hover:text-ast_yellow transition"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Name</label>
                                <input
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.name}
                                  onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Category</label>
                                <select
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.category}
                                  onChange={e => {
                                    const newCat = e.target.value;
                                    const catDef = SUPPLY_CATEGORIES.find(c => c.value === newCat);
                                    const validSubs = catDef ? catDef.subcategories : [];
                                    setEditDraft(d => ({
                                      ...d,
                                      category: newCat,
                                      subcategory: validSubs.includes(d.subcategory) ? d.subcategory : "",
                                    }));
                                  }}
                                >
                                  {SUPPLY_CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Quantity</label>
                                <input
                                  type="number"
                                  min="0"
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.qty}
                                  onChange={e => setEditDraft(d => ({ ...d, qty: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Stock Status</label>
                                <select
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.status}
                                  onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}
                                >
                                  <option value="ok">OK</option>
                                  <option value="low">Low</option>
                                  <option value="critical">Critical</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Location</label>
                                <input
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.location}
                                  onChange={e => setEditDraft(d => ({ ...d, location: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Notes</label>
                                <input
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.notes}
                                  onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))}
                                />
                              </div>
                            </div>

                            {/* Subcategory — only shown when selected category has subcategories */}
                            {editSubcategories.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-ast_lavender/80 mb-2">Subcategory</label>
                                <select
                                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                                  value={editDraft.subcategory ?? ""}
                                  onChange={e => setEditDraft(d => ({ ...d, subcategory: e.target.value }))}
                                >
                                  <option value="">— None —</option>
                                  {editSubcategories.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-ast_yellow hover:bg-ast_yellow/10 transition"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                className="flex-1 rounded-lg bg-gradient-to-r from-ast_pink to-ast_purple px-4 py-2 font-semibold text-white shadow-astPink hover:shadow-lg transition"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-ast_pink mb-1">Supply</p>
                              <h2 className="text-lg font-bold text-ast_yellow">
                                {selectedSupply.name}
                                {selectedSupply.isNew && (
                                  <span className="ml-2 text-xs bg-ast_pink/40 text-ast_pink px-2 py-0.5 rounded-full font-semibold align-middle">
                                    NEW
                                  </span>
                                )}
                              </h2>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              selectedSupply.status === 'ok'
                                ? 'bg-ast_turquoise/20 text-ast_turquoise'
                                : selectedSupply.status === 'low'
                                ? 'bg-ast_yellow/20 text-ast_yellow'
                                : 'bg-ast_pink/20 text-ast_pink'
                            }`}>
                              {selectedSupply.status === 'ok' ? '✓' : '⚠️'} {selectedSupply.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-x-6 gap-y-3 mb-4">
                            <div>
                              <p className="text-xs font-medium text-ast_lavender/75 mb-1">Category</p>
                              <p className="text-sm text-white/80">{selectedSupply.category || "—"}</p>
                            </div>
                            {selectedSupply.subcategory && (
                              <div>
                                <p className="text-xs font-medium text-ast_lavender/75 mb-1">Subcategory</p>
                                <p className="text-sm text-white/80">{selectedSupply.subcategory}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-ast_lavender/75 mb-1">Quantity</p>
                              <p className="text-sm text-white/80">{selectedSupply.qty}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-ast_lavender/75 mb-1">Location</p>
                              <p className="text-sm text-white/80">{selectedSupply.location || "—"}</p>
                            </div>
                            {selectedSupply.notes && (
                              <div className="col-span-3">
                                <p className="text-xs font-medium text-ast_lavender/75 mb-1">Notes</p>
                                <p className="text-sm text-white/80">{selectedSupply.notes}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => { setSelectedSupplyId(null); setIsEditingSupply(false); }}
                              className="rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-sm text-ast_yellow hover:bg-ast_yellow/10 transition"
                            >
                              Close
                            </button>
                            <button
                              onClick={() => handleStartEdit(selectedSupply)}
                              className="rounded-lg bg-gradient-to-r from-ast_pink to-ast_purple px-4 py-2 text-sm font-semibold text-white shadow-astPink hover:shadow-lg transition"
                            >
                              Edit Supply
                            </button>
                          </div>
                        </>
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
