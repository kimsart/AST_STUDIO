import { useState } from "react";
import { SUPPLY_CATEGORIES } from "../data/supplyCategories.js";

const GRID_COLS = 3;

function StatusBadge({ status }) {
  const map = {
    ok:       { label: "OK",       bg: "bg-ast_turquoise/20", text: "text-ast_turquoise" },
    low:      { label: "Low",      bg: "bg-ast_yellow/20",    text: "text-ast_yellow" },
    critical: { label: "Critical", bg: "bg-ast_pink/20",      text: "text-ast_pink" },
  };
  const s = map[status] ?? { label: status || "?", bg: "bg-white/10", text: "text-white/40" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function SuppliesGrid({ sessionSupplies = [], sessionProjects = [], onEditSupply, onDeleteSupply }) {
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);
  const [isEditingSupply, setIsEditingSupply] = useState(false);
  const [editDraft, setEditDraft] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");

  const getFilteredItems = () => {
    switch (statusFilter) {
      case "Low Stock":    return sessionSupplies.filter(s => s.status === "low" || s.status === "critical");
      case "Out of Stock": return sessionSupplies.filter(s => s.status === "critical");
      default:             return sessionSupplies;
    }
  };

  const filteredItems = getFilteredItems();
  // Resolve against filteredItems so detail closes if supply leaves the status filter.
  const selectedSupply = filteredItems.find(s => s.id === selectedSupplyId) ?? null;

  const editCategoryDef = SUPPLY_CATEGORIES.find(c => c.value === editDraft.category);
  const editSubcategories = editCategoryDef ? editCategoryDef.subcategories : [];

  const handleSelect = (id) => {
    setSelectedSupplyId(prev => prev === id ? null : id);
    setIsEditingSupply(false);
  };

  const handleStartEdit = () => {
    setEditDraft({
      name:        selectedSupply.name        ?? "",
      category:    selectedSupply.category    ?? "",
      subcategory: selectedSupply.subcategory ?? "",
      qty:         selectedSupply.qty         ?? "",
      status:      selectedSupply.status      ?? "ok",
      location:    selectedSupply.location    ?? "",
      notes:       selectedSupply.notes       ?? "",
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

  // Chunk supplies into rows so the detail panel injects directly below
  // the row containing the selected card — prevents scroll-position jumps.
  const rows = [];
  for (let i = 0; i < filteredItems.length; i += GRID_COLS) {
    rows.push(filteredItems.slice(i, i + GRID_COLS));
  }

  const detailPanel = selectedSupply && (
    <div className="mt-3 rounded-2xl border border-ast_pink/60 bg-ast_deep/95 p-6 shadow-astPink">

      {isEditingSupply ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ast_pink">Edit Supply</h2>
            <button
              onClick={handleCancelEdit}
              className="text-xl text-ast_yellow/60 hover:text-ast_yellow transition"
            >✕</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ast_yellow mb-2">Name</label>
                <input
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.name}
                  onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_yellow mb-2">Category</label>
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
                <label className="block text-sm font-medium text-ast_yellow mb-2">Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.qty}
                  onChange={e => setEditDraft(d => ({ ...d, qty: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_yellow mb-2">Stock Status</label>
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
                <label className="block text-sm font-medium text-ast_yellow mb-2">Location</label>
                <input
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.location}
                  onChange={e => setEditDraft(d => ({ ...d, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_yellow mb-2">Notes</label>
                <input
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.notes}
                  onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))}
                />
              </div>
            </div>

            {editSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-ast_yellow mb-2">Subcategory</label>
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
              >Cancel</button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-lg bg-gradient-to-r from-ast_pink to-ast_purple px-4 py-2 font-semibold text-white shadow-astPink hover:shadow-lg transition"
              >Save Changes</button>
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
              selectedSupply.status === "ok"
                ? "bg-ast_turquoise/20 text-ast_turquoise"
                : selectedSupply.status === "low"
                ? "bg-ast_yellow/20 text-ast_yellow"
                : "bg-ast_pink/20 text-ast_pink"
            }`}>
              {selectedSupply.status === "ok" ? "✓" : "⚠️"} {selectedSupply.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-x-6 gap-y-3 mb-4">
            <div>
              <p className="text-xs font-medium text-ast_yellow mb-1">Category</p>
              <p className="text-sm text-white/80">{selectedSupply.category || "—"}</p>
            </div>
            {selectedSupply.subcategory && (
              <div>
                <p className="text-xs font-medium text-ast_yellow mb-1">Subcategory</p>
                <p className="text-sm text-white/80">{selectedSupply.subcategory}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-ast_yellow mb-1">Quantity</p>
              <p className="text-sm text-white/80">{selectedSupply.qty ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-ast_yellow mb-1">Location</p>
              <p className="text-sm text-white/80">{selectedSupply.location || "—"}</p>
            </div>
            {selectedSupply.notes && (
              <div className="col-span-3">
                <p className="text-xs font-medium text-ast_yellow mb-1">Notes</p>
                <p className="text-sm text-white/80">{selectedSupply.notes}</p>
              </div>
            )}
          </div>

          {(() => {
            const ids = Array.isArray(selectedSupply.usedInProjectIds) ? selectedSupply.usedInProjectIds : [];
            const linked = ids.map(id => sessionProjects.find(p => p.id === id)).filter(Boolean);
            if (linked.length === 0) return null;
            return (
              <div className="mb-4">
                <p className="text-xs font-medium text-ast_yellow mb-2">Used in Projects</p>
                <div className="flex flex-wrap gap-1.5">
                  {linked.map(p => (
                    <span key={p.id} className="text-xs bg-ast_lavender/20 text-ast_lavender px-2 py-0.5 rounded">
                      {p.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="flex gap-3">
            <button
              onClick={() => { setSelectedSupplyId(null); setIsEditingSupply(false); }}
              className="rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-sm text-ast_yellow hover:bg-ast_yellow/10 transition"
            >Close</button>
            <button
              onClick={() => onDeleteSupply(selectedSupply.id)}
              className="rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-sm text-ast_yellow hover:bg-ast_yellow/10 transition"
            >Delete</button>
            <button
              onClick={handleStartEdit}
              className="flex-1 rounded-lg bg-gradient-to-r from-ast_pink to-ast_purple px-4 py-2 text-sm font-semibold text-white shadow-astPink hover:shadow-lg transition"
            >Edit Supply</button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      {/* Status filter bar */}
      <div className="flex gap-2 mb-4">
        {["All", "Low Stock", "Out of Stock"].map(f => (
          <button
            key={f}
            onClick={() => { setStatusFilter(f); setSelectedSupplyId(null); setIsEditingSupply(false); }}
            className={`text-xs px-3 py-1 rounded-lg transition ${
              f === statusFilter
                ? "bg-ast_turquoise/20 text-ast_turquoise"
                : "text-white/40 hover:text-ast_turquoise"
            }`}
          >{f}</button>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="py-8 text-sm text-white/30 text-center">No supplies match this filter.</p>
      )}

      <div className="space-y-3">
        {rows.map(row => {
          const rowHasSelected = row.some(s => s.id === selectedSupplyId);
          return (
            <div key={row[0].id}>
              <div className="grid grid-cols-3 gap-3">
                {row.map(supply => {
                  const isSelected = selectedSupplyId === supply.id;
                  const linkedCount = Array.isArray(supply.usedInProjectIds)
                    ? supply.usedInProjectIds.length
                    : 0;
                  return (
                    <button
                      key={supply.id}
                      onClick={() => handleSelect(supply.id)}
                      className={`relative rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-ast_pink/70 bg-ast_pink/15 shadow-astPink"
                          : "border-ast_purple/30 bg-ast_purple/5 hover:border-ast_pink/40 hover:bg-ast_pink/5"
                      }`}
                    >
                      {supply.isNew && (
                        <span className="absolute top-2 right-2 text-xs bg-ast_turquoise/40 text-ast_turquoise px-2 py-0.5 rounded-full font-semibold">
                          NEW
                        </span>
                      )}
                      <p className={`text-sm font-semibold leading-snug mb-1 ${supply.isNew ? "pr-12" : "pr-2"} ${isSelected ? "text-ast_yellow" : "text-ast_yellow/80"}`}>
                        {supply.name}
                      </p>
                      <p className="text-xs text-white/40 mb-3">
                        {supply.category}
                        {supply.subcategory ? ` · ${supply.subcategory}` : ""}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <StatusBadge status={supply.status} />
                        <div className="flex items-center gap-2">
                          {supply.qty != null && (
                            <span className="text-xs text-white/40">qty {supply.qty}</span>
                          )}
                          {linkedCount > 0 && (
                            <span className="text-xs bg-ast_lavender/20 text-ast_lavender px-1.5 py-0.5 rounded">
                              {linkedCount} {linkedCount === 1 ? "project" : "projects"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {rowHasSelected && detailPanel}
            </div>
          );
        })}
      </div>
    </div>
  );
}
