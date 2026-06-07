import { useState } from "react";
import { compressImage } from "../../utils/imageUtils.js";
import { SUPPLY_CATEGORIES, buildCategoryOptions } from "../../data/supplyCategories.js";

export default function AddSupplyFormInline({ onSubmit, onCancel, sessionProjects = [], sessionSupplies = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Paint",
    customCategory: "",
    subcategory: "",
    customSubcategory: "",
    qty: "",
    status: "ok",
    location: "",
    notes: "",
    assignedProjectId: "",
    barcode: "",
    image: null,
  });
  const [error, setError] = useState("");

  const categoryOptions = buildCategoryOptions(sessionSupplies);
  const activeCategoryDef = SUPPLY_CATEGORIES.find(c => c.value === formData.category);
  const availableSubcategories = activeCategoryDef ? activeCategoryDef.subcategories : [];
  const isOther = formData.category === "Other";
  const isCustomSubcategory = formData.subcategory === "__other__";

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const image = await compressImage(file);
      setFormData(prev => ({ ...prev, image }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      const catDef = SUPPLY_CATEGORIES.find(c => c.value === value);
      const validSubs = catDef ? catDef.subcategories : [];
      setFormData(prev => ({
        ...prev,
        category: value,
        customCategory: "",
        subcategory: validSubs.includes(prev.subcategory) ? prev.subcategory : "",
        customSubcategory: "",
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
    const qtyRaw = formData.qty === "" ? null : parseInt(formData.qty, 10);
    if (qtyRaw !== null && qtyRaw < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    const finalCategory = isOther && formData.customCategory.trim()
      ? formData.customCategory.trim()
      : formData.category;

    const finalSubcategory = isCustomSubcategory
      ? formData.customSubcategory.trim()
      : formData.subcategory;

    onSubmit({
      name: formData.name.trim(),
      category: finalCategory,
      subcategory: finalSubcategory,
      qty: qtyRaw,
      status: formData.status,
      location: formData.location.trim(),
      notes: formData.notes.trim(),
      condition: "Good",
      color: "bg-ast_purple",
      assignedProjectId: formData.assignedProjectId ? Number(formData.assignedProjectId) : null,
      barcode: formData.barcode.trim(),
      image: formData.image,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg md:max-w-2xl rounded-2xl border border-ast_pink/60 bg-ast_deep/95 shadow-astPink flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">

        <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-ast_pink">Add Supply</h2>
          <button onClick={onCancel} className="text-2xl text-ast_yellow/60 hover:text-ast_yellow transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6">
            <div className="pb-2 space-y-4">

              {/* Name + Photo — side by side at top */}
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Supply Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Winsor & Newton Cobalt Blue"
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>
                <div className="shrink-0">
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Photo</label>
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="" className="ast-img-safe w-16 h-16 rounded-xl object-cover border border-ast_pink/30" />
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, image: null }))}
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-white text-xs hover:bg-ast_pink transition"
                      >×</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-16 h-16 rounded-xl border border-ast_pink/30 bg-ast_bg_dark/70 text-ast_muted hover:border-ast_pink/60 hover:text-ast_body transition">
                      <span className="text-lg leading-none">📷</span>
                      <span className="text-[9px] mt-1">Add photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory or custom category text */}
                {isOther ? (
                  <div>
                    <label className="block text-sm font-medium text-ast_lavender mb-2">Custom Category</label>
                    <input
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      placeholder="e.g., Colored Pencil, Charcoal"
                      className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                    />
                  </div>
                ) : availableSubcategories.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-ast_lavender mb-2">Subcategory</label>
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
                      <option value="__other__">Other / Custom…</option>
                    </select>
                    {isCustomSubcategory && (
                      <input
                        type="text"
                        name="customSubcategory"
                        value={formData.customSubcategory}
                        onChange={handleChange}
                        placeholder="e.g., Dry brush, Palette knife…"
                        className="mt-2 w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                      />
                    )}
                  </div>
                ) : (
                  <div />
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Quantity</label>
                  <input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    placeholder="e.g., 2"
                    min="0"
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

                {/* Stock status */}
                <div>
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Stock Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  >
                    <option value="ok">OK</option>
                    <option value="low">Low</option>
                    <option value="critical">Critical / Out</option>
                  </select>
                </div>

                {/* Location — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Location</label>
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
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add details about the supply..."
                    rows={2}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

                {/* Project assignment — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Barcode / UPC</label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="e.g., 012345678901"
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  />
                </div>

                {/* Project assignment — full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-ast_lavender mb-2">Assign to Project</label>
                  <select
                    name="assignedProjectId"
                    value={formData.assignedProjectId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
                  >
                    <option value="">Unassigned — Studio inventory</option>
                    {sessionProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

              </div>

              {error && (
                <div className="rounded-lg border border-ast_pink/50 bg-ast_pink/10 px-3 py-2 text-sm text-ast_pink">
                  {error}
                </div>
              )}
            </div>
          </div>

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
