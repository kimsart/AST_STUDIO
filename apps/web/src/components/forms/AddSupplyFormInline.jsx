import { useState } from "react";
import { SUPPLY_CATEGORIES } from "../../data/supplyCategories.js";

export default function AddSupplyFormInline({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Paint",
    subcategory: "",
    qty: "",
    status: "ok",
    location: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const activeCategoryDef = SUPPLY_CATEGORIES.find(c => c.value === formData.category);
  const availableSubcategories = activeCategoryDef ? activeCategoryDef.subcategories : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      const catDef = SUPPLY_CATEGORIES.find(c => c.value === value);
      const validSubs = catDef ? catDef.subcategories : [];
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: validSubs.includes(prev.subcategory) ? prev.subcategory : "",
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Supply name is required");
      return;
    }
    if (!formData.qty || parseInt(formData.qty) <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      subcategory: formData.subcategory,
      qty: parseInt(formData.qty),
      status: formData.status,
      location: formData.location.trim(),
      notes: formData.notes.trim(),
      condition: "Good",
      color: "bg-ast_purple",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg md:max-w-2xl rounded-2xl border border-ast_pink/60 bg-ast_deep/95 shadow-astPink flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">

        {/* Header — never scrolls away */}
        <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-ast_pink">Add Supply</h2>
          <button
            onClick={onCancel}
            className="text-2xl text-ast_yellow/60 hover:text-ast_yellow transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6">
            <div className="pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Name — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ast_yellow mb-2">
                    Supply Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Winsor & Newton Cobalt Blue"
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-ast_yellow mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  >
                    {SUPPLY_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory — only when category has subcategories */}
                {availableSubcategories.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-ast_yellow mb-2">
                      Subcategory
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                    >
                      <option value="">— None —</option>
                      {availableSubcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div />
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-ast_yellow mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    placeholder="e.g., 2"
                    min="1"
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-ast_yellow mb-2">
                    Stock Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  >
                    <option value="ok">OK</option>
                    <option value="low">Low</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                {/* Location — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ast_yellow mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Shelf A, Cabinet"
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

                {/* Notes — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ast_yellow mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add details about the supply..."
                    rows={2}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-ast_pink/50 bg-ast_pink/10 px-3 py-2 text-sm text-ast_pink">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer — never scrolls away */}
          <div className="shrink-0 flex gap-3 px-6 pt-4 pb-6 border-t border-white/5">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-ast_yellow hover:bg-ast_yellow/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-ast_pink to-ast_purple px-4 py-2 font-semibold text-white shadow-astPink hover:shadow-lg transition"
            >
              Add Supply
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
