import { useState } from "react";

export default function EditSupplyFormInline({ supply, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: supply.name ?? "",
    category: supply.category ?? "Paint",
    qty: supply.qty ?? "",
    status: supply.status ?? "ok",
    location: supply.location ?? "",
    notes: supply.notes ?? "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      qty: parseInt(formData.qty),
      status: formData.status,
      location: formData.location.trim(),
      notes: formData.notes.trim(),
    });
  };

  const categories = ["Paint", "Brush", "Paper", "Canvas", "Medium", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-ast_pink/60 bg-ast_deep/95 p-6 shadow-astPink">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ast_pink">Edit Supply</h2>
          <button
            onClick={onCancel}
            className="text-2xl text-ast_yellow/60 hover:text-ast_yellow transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Supply Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
            />
          </div>

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
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Quantity *
            </label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              min="1"
              className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-ast_pink/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_pink focus:outline-none focus:ring-2 focus:ring-ast_pink/30 transition"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-ast_pink/50 bg-ast_pink/10 px-3 py-2 text-sm text-ast_pink">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
