import { useState } from "react";

export default function EditProjectFormInline({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: project.title ?? "",
    status: project.status ?? "planned",
    notes: project.notes ?? "",
    budget: project.budget ?? "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Project title is required");
      return;
    }
    onSubmit({
      title: formData.title.trim(),
      status: formData.status,
      notes: formData.notes.trim(),
      budget: formData.budget !== "" ? parseInt(formData.budget) : 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-ast_turquoise/60 bg-ast_deep/95 p-6 shadow-astTurquoise">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ast_turquoise">Edit Project</h2>
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
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
            >
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ast_yellow mb-2">
              Estimated Budget
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
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
              className="flex-1 rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-4 py-2 font-semibold text-white shadow-astTurquoise hover:shadow-lg transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
