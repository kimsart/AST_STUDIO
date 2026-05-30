import { useState, useEffect, useRef } from "react";
import { SUPPLY_CATEGORIES, buildCategoryOptions } from "../data/supplyCategories.js";

const GRID_COLS = 3;

function StatusBadge({ status }) {
  const map = {
    ok:       { label: "OK",       bg: "bg-ast_cyan/15",   text: "text-ast_cyan" },
    low:      { label: "Low",      bg: "bg-ast_pink/20",   text: "text-ast_pink" },
    critical: { label: "Critical", bg: "bg-ast_pink/20",   text: "text-ast_pink" },
  };
  const s = map[status] ?? { label: status || "?", bg: "bg-white/10", text: "text-ast_faint" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function SuppliesGrid({ sessionSupplies = [], allSupplies, sessionProjects = [], onEditSupply, onDeleteSupply, onAssignSupply }) {
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);
  const [isEditingSupply, setIsEditingSupply] = useState(false);
  const [editDraft, setEditDraft] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");

  // Reset status filter when a new supply arrives so it's never hidden by an active filter.
  const prevCountRef = useRef(sessionSupplies.length);
  useEffect(() => {
    if (sessionSupplies.length > prevCountRef.current) {
      setStatusFilter("All");
      setSelectedSupplyId(null);
    }
    prevCountRef.current = sessionSupplies.length;
  }, [sessionSupplies.length]);

  const getFilteredItems = () => {
    switch (statusFilter) {
      case "Low Stock":    return sessionSupplies.filter(s => s.status === "low" || s.status === "critical");
      case "Out of Stock": return sessionSupplies.filter(s => s.status === "critical");
      default:             return sessionSupplies;
    }
  };

  const filteredItems = getFilteredItems();
  const selectedSupply = filteredItems.find(s => s.id === selectedSupplyId) ?? null;

  const categoryOptions = buildCategoryOptions(allSupplies ?? sessionSupplies);
  const editCategoryDef = SUPPLY_CATEGORIES.find(c => c.value === editDraft.category);
  const editSubcategories = editCategoryDef ? editCategoryDef.subcategories : [];
  const editIsOther = editDraft.category === "Other";
  const editIsCustomSubcategory = editDraft.subcategory === "__other__";

  const handleSelect = (id) => {
    setSelectedSupplyId(prev => prev === id ? null : id);
    setIsEditingSupply(false);
  };

  const handleStartEdit = () => {
    setEditDraft({
      name:              selectedSupply.name        ?? "",
      category:          selectedSupply.category    ?? "",
      customCategory:    "",
      subcategory:       selectedSupply.subcategory ?? "",
      customSubcategory: "",
      qty:               selectedSupply.qty         ?? "",
      status:            selectedSupply.status      ?? "ok",
      location:          selectedSupply.location    ?? "",
      notes:             selectedSupply.notes       ?? "",
      assignToProjectId: "",
    });
    setIsEditingSupply(true);
  };

  const handleSaveEdit = () => {
    const { customCategory, customSubcategory, assignToProjectId, ...rest } = editDraft;
    const finalCategory = rest.category === "Other" && customCategory?.trim()
      ? customCategory.trim()
      : rest.category;
    const finalSubcategory = rest.subcategory === "__other__"
      ? (customSubcategory?.trim() || "")
      : rest.subcategory;

    onEditSupply(selectedSupplyId, { ...rest, category: finalCategory, subcategory: finalSubcategory });

    if (assignToProjectId && onAssignSupply) {
      const projectIdNum = Number(assignToProjectId);
      const alreadyAssigned = (selectedSupply.usedInProjectIds || []).includes(projectIdNum);
      if (!alreadyAssigned) {
        onAssignSupply(projectIdNum, selectedSupplyId);
      }
    }

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

  // Projects not yet linked to this supply (for the add-to-project dropdown)
  const unlinkedProjects = selectedSupply
    ? sessionProjects.filter(p => !(selectedSupply.usedInProjectIds || []).includes(p.id))
    : [];

  const detailPanel = selectedSupply && (
    <div className="mt-3 rounded-2xl border border-ast_pink/60 bg-ast_deep/95 p-6 shadow-astPink">

      {isEditingSupply ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ast_pink">Edit Supply</h2>
            <button onClick={handleCancelEdit} className="text-xl text-ast_yellow/60 hover:text-ast_yellow transition">✕</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Name</label>
                <input
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.name}
                  onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Category</label>
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
                      customCategory: "",
                      subcategory: validSubs.includes(d.subcategory) ? d.subcategory : "",
                      customSubcategory: "",
                    }));
                  }}
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.qty}
                  onChange={e => setEditDraft(d => ({ ...d, qty: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Stock Status</label>
                <select
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.status}
                  onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}
                >
                  <option value="ok">OK</option>
                  <option value="low">Low</option>
                  <option value="critical">Critical / Out</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Location</label>
                <input
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.location}
                  onChange={e => setEditDraft(d => ({ ...d, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Notes</label>
                <input
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.notes}
                  onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))}
                />
              </div>
            </div>

            {/* Subcategory or custom category */}
            {editIsOther ? (
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Custom Category</label>
                <input
                  type="text"
                  placeholder="e.g., Colored Pencil, Charcoal"
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.customCategory ?? ""}
                  onChange={e => setEditDraft(d => ({ ...d, customCategory: e.target.value }))}
                />
              </div>
            ) : editSubcategories.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-ast_lavender mb-2">Subcategory</label>
                <select
                  className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  value={editDraft.subcategory ?? ""}
                  onChange={e => setEditDraft(d => ({ ...d, subcategory: e.target.value, customSubcategory: "" }))}
                >
                  <option value="">— None —</option>
                  {editSubcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="__other__">Other / Custom…</option>
                </select>
                {editIsCustomSubcategory && (
                  <input
                    type="text"
                    placeholder="e.g., Dry brush, Palette knife…"
                    className="mt-2 w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                    value={editDraft.customSubcategory ?? ""}
                    onChange={e => setEditDraft(d => ({ ...d, customSubcategory: e.target.value }))}
                  />
                )}
              </div>
            ) : null}

            {/* Project assignment */}
            <div>
              <label className="block text-sm font-medium text-ast_lavender mb-2">Add to Project</label>
              {(selectedSupply.usedInProjectIds || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(selectedSupply.usedInProjectIds || []).map(id => {
                    const p = sessionProjects.find(p => p.id === id);
                    return p ? (
                      <span key={id} className="text-xs bg-ast_lavender/20 text-ast_lavender px-2 py-0.5 rounded">
                        {p.title}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              <select
                className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                value={editDraft.assignToProjectId}
                onChange={e => setEditDraft(d => ({ ...d, assignToProjectId: e.target.value }))}
              >
                <option value="">— Studio inventory (unassigned) —</option>
                {unlinkedProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

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
              <h2 className="text-lg font-bold text-ast_cyan">
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
              <p className="text-xs font-medium text-ast_lavender mb-1">Category</p>
              <p className="text-sm text-ast_body">{selectedSupply.category || "—"}</p>
            </div>
            {selectedSupply.subcategory && (
              <div>
                <p className="text-xs font-medium text-ast_lavender mb-1">Subcategory</p>
                <p className="text-sm text-ast_body">{selectedSupply.subcategory}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-ast_lavender mb-1">Quantity</p>
              <p className="text-sm text-ast_body">{selectedSupply.qty ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-ast_lavender mb-1">Location</p>
              <p className="text-sm text-ast_body">{selectedSupply.location || "—"}</p>
            </div>
            {selectedSupply.notes && (
              <div className="col-span-3">
                <p className="text-xs font-medium text-ast_lavender mb-1">Notes</p>
                <p className="text-sm text-ast_body">{selectedSupply.notes}</p>
              </div>
            )}
          </div>

          {(() => {
            const ids = Array.isArray(selectedSupply.usedInProjectIds) ? selectedSupply.usedInProjectIds : [];
            const linked = ids.map(id => sessionProjects.find(p => p.id === id)).filter(Boolean);
            if (linked.length === 0) return null;
            return (
              <div className="mb-4">
                <p className="text-xs font-medium text-ast_lavender mb-2">Used in Projects</p>
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
      <div className="flex gap-2 mb-4">
        {["All", "Low Stock", "Out of Stock"].map(f => (
          <button
            key={f}
            onClick={() => { setStatusFilter(f); setSelectedSupplyId(null); setIsEditingSupply(false); }}
            className={`text-xs px-3 py-1 rounded-lg transition ${
              f === statusFilter
                ? "bg-ast_electric_blue/20 text-ast_electric_blue"
                : "text-ast_muted hover:text-ast_cyan"
            }`}
          >{f}</button>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="py-8 text-sm text-ast_body/40 text-center">No supplies match this filter.</p>
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
                          ? "border-ast_electric_blue/60 bg-ast_electric_blue/10 shadow-astBlue"
                          : "border-ast_purple/30 bg-ast_purple/5 hover:border-ast_lavender/40 hover:bg-ast_lavender/5"
                      }`}
                    >
                      {supply.isNew && (
                        <span className="absolute top-2 right-2 text-xs bg-ast_turquoise/40 text-ast_turquoise px-2 py-0.5 rounded-full font-semibold">
                          NEW
                        </span>
                      )}
                      <p className={`text-sm font-semibold leading-snug mb-1 ${supply.isNew ? "pr-12" : "pr-2"} ${isSelected ? "text-ast_cyan" : "text-ast_body"}`}>
                        {supply.name}
                      </p>
                      <p className="text-xs text-ast_body/50 mb-3">
                        {supply.category}
                        {supply.subcategory ? ` · ${supply.subcategory}` : ""}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <StatusBadge status={supply.status} />
                        <div className="flex items-center gap-2">
                          {supply.qty != null && (
                            <span className="text-xs text-ast_body/50">qty {supply.qty}</span>
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
