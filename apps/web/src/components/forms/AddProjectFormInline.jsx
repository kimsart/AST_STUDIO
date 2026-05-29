import { useState } from "react";
import { compressImage } from "../../utils/imageUtils.js";

function getNextDraftTitle(baseTitle, projects) {
  for (let i = 1; i <= 9; i++) {
    const candidate = `${baseTitle} 1.${i}`;
    if (!projects.some(p => p.title.trim().toLowerCase() === candidate.toLowerCase())) {
      return candidate;
    }
  }
  return `${baseTitle} 1.9`;
}

export default function AddProjectFormInline({ onSubmit, onCancel, sessionProjects = [], onSelectExisting }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "planned",
    notes: "",
    budget: "",
    imageDataUrl: "",
  });
  const [error, setError] = useState("");
  const [duplicateState, setDuplicateState] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    try {
      const dataUrl = await compressImage(file);
      setFormData((prev) => ({ ...prev, imageDataUrl: dataUrl }));
    } catch {
      setError("Could not load image. Try a different file.");
    }
  };

  const buildPayload = (titleOverride) => ({
    title: titleOverride ?? formData.title.trim(),
    status: formData.status,
    notes: formData.notes.trim(),
    budget: formData.budget ? parseInt(formData.budget) : 0,
    imageDataUrl: formData.imageDataUrl,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setError("Project title is required");
      return;
    }
    const existingProject = sessionProjects.find(
      p => p.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
    );
    if (existingProject) {
      setDuplicateState({
        existingProject,
        draftTitle: getNextDraftTitle(trimmedTitle, sessionProjects),
      });
      return;
    }
    onSubmit(buildPayload());
  };

  const handleChooseUpdate = () => {
    if (onSelectExisting) onSelectExisting(duplicateState.existingProject.id);
  };

  const handleChooseDraft  = () => onSubmit(buildPayload(duplicateState.draftTitle));
  const handleChooseSeparate = () => onSubmit(buildPayload());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md md:max-w-xl rounded-2xl border border-ast_turquoise/60 bg-ast_deep/95 shadow-astTurquoise flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">

        {duplicateState ? (
          <>
            <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-2xl font-bold text-ast_turquoise">Duplicate Title</h2>
              <button onClick={onCancel} className="text-2xl text-ast_yellow/60 hover:text-ast_yellow transition">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <p className="text-sm text-ast_body mb-1">Another project already uses this title.</p>
              <p className="text-sm text-ast_muted mb-4">Is this the same project or a different one?</p>

              <div className="mb-5 rounded-lg border border-ast_turquoise/20 bg-ast_turquoise/5 px-3 py-2">
                <p className="text-xs uppercase tracking-wider text-ast_turquoise/70">Existing project</p>
                <p className="mt-0.5 text-sm font-semibold text-ast_yellow">{duplicateState.existingProject.title}</p>
                <p className="text-xs text-ast_faint">{duplicateState.existingProject.status}</p>
              </div>

              <div className="space-y-2">
                <button onClick={handleChooseUpdate} className="w-full rounded-lg border border-ast_turquoise/40 bg-ast_turquoise/10 px-4 py-2.5 text-left transition hover:bg-ast_turquoise/20">
                  <span className="text-sm font-semibold text-ast_turquoise">Update existing project</span>
                  <span className="mt-0.5 block text-xs text-ast_muted">Select the existing project and close this form</span>
                </button>
                <button onClick={handleChooseDraft} className="w-full rounded-lg border border-ast_lavender/40 bg-ast_lavender/10 px-4 py-2.5 text-left transition hover:bg-ast_lavender/20">
                  <span className="text-sm font-semibold text-ast_lavender">Create draft / version</span>
                  <span className="mt-0.5 block text-xs text-ast_muted">New card titled &ldquo;{duplicateState.draftTitle}&rdquo;</span>
                </button>
                <button onClick={handleChooseSeparate} className="w-full rounded-lg border border-ast_pink/40 bg-ast_pink/10 px-4 py-2.5 text-left transition hover:bg-ast_pink/20">
                  <span className="text-sm font-semibold text-ast_pink">Create separate project anyway</span>
                  <span className="mt-0.5 block text-xs text-ast_muted">This is a different project with the same title</span>
                </button>
                <button onClick={onCancel} className="w-full rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2.5 text-sm text-ast_yellow transition hover:bg-ast_yellow/10">
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="shrink-0 flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-2xl font-bold text-ast_turquoise">New Project</h2>
              <button onClick={onCancel} className="text-2xl text-ast_yellow/60 hover:text-ast_yellow transition">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-6">
                <div className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ast_lavender mb-2">Project Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Summer Exhibition Series"
                        className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ast_lavender mb-2">Status</label>
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
                      <label className="block text-sm font-medium text-ast_lavender mb-2">Estimated Budget</label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g., 150"
                        min="0"
                        className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ast_lavender mb-2">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add project details, goals, or inspiration..."
                        rows={3}
                        className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                      />
                    </div>

                    {/* Photo upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ast_lavender mb-2">Photo</label>
                      <div className="flex items-center gap-3">
                        {formData.imageDataUrl && (
                          <img
                            src={formData.imageDataUrl}
                            alt="preview"
                            className="w-16 h-16 rounded-lg object-cover border border-ast_turquoise/30 shrink-0"
                          />
                        )}
                        <label className="cursor-pointer rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-sm text-ast_muted hover:border-ast_turquoise/60 hover:text-ast_body transition">
                          {formData.imageDataUrl ? "Change photo" : "Add photo"}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                        {formData.imageDataUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData(d => ({ ...d, imageDataUrl: "" }))}
                            className="text-xs text-ast_faint hover:text-ast_pink transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {error && (
                    <div className="mt-4 rounded-lg border border-ast_pink/50 bg-ast_pink/10 px-3 py-2 text-sm text-ast_pink">
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
                  className="flex-1 rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-4 py-2 font-semibold text-white shadow-astTurquoise hover:shadow-lg transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
