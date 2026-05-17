import { useState, useEffect } from "react";

export default function ProjectsCard({ selectedProjectId, onSelectProject, sessionProjects = [], sessionSupplies = [], onAssignSupply, onUnassignSupply, onEditProject, onDeleteProject }) {
  const [pendingSupplyId, setPendingSupplyId] = useState("");
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editDraft, setEditDraft] = useState({ title: "", status: "", notes: "", budget: "" });

  const allProjects = sessionProjects;
  const selectedProject = allProjects.find((p) => p.id === selectedProjectId);

  useEffect(() => {
    setIsEditingProject(false);
  }, [selectedProjectId]);

  const assignedSupplies = selectedProject
    ? sessionSupplies.filter(s => selectedProject.supplyIds.includes(s.id))
    : [];
  const unassignedSupplies = selectedProject
    ? sessionSupplies.filter(s => !selectedProject.supplyIds.includes(s.id))
    : [];

  const handleAssign = () => {
    if (!pendingSupplyId || !selectedProject) return;
    onAssignSupply(selectedProject.id, Number(pendingSupplyId));
    setPendingSupplyId("");
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setEditDraft({
      title: selectedProject.title ?? "",
      status: selectedProject.status ?? "",
      notes: selectedProject.notes ?? "",
      budget: selectedProject.budget ?? "",
    });
    setIsEditingProject(true);
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    onEditProject(selectedProject.id, editDraft);
    setIsEditingProject(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setIsEditingProject(false);
  };

  return (
    <section className="rounded-xl border border-ast_turquoise/40 bg-ast_bg_dark/70 p-4 text-ast_yellow shadow-astTurquoise">
      <h2 className="text-lg font-bold text-ast_turquoise">Projects</h2>

      <div className="mt-3 space-y-1">
        {allProjects.map((project) => (
          <div key={project.id}>
            <button
              onClick={() => { onSelectProject(project.id); setIsEditingProject(false); }}
              className={`relative block w-full text-left px-2 py-1 rounded transition ${
                selectedProjectId === project.id
                  ? "bg-ast_turquoise/30 text-ast_yellow font-semibold"
                  : "text-ast_yellow/70 hover:text-ast_yellow hover:bg-ast_turquoise/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{project.title}</span>
                {project.isNew && (
                  <span className="ml-2 text-xs bg-ast_turquoise/40 text-ast_turquoise px-2 py-0.5 rounded-full font-semibold">
                    NEW
                  </span>
                )}
              </div>
            </button>

            {selectedProjectId === project.id && selectedProject && (
              <div className="mt-2 mb-1 rounded-2xl border border-ast_turquoise/60 bg-ast_deep/95 p-6 shadow-astTurquoise">

                {isEditingProject ? (
                  <>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-ast_turquoise">Edit Project</h2>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xl text-ast_yellow/60 hover:text-ast_yellow transition"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-ast_yellow mb-2">Project Title</label>
                        <input
                          className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                          value={editDraft.title}
                          onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ast_yellow mb-2">Status</label>
                        <select
                          className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                          value={editDraft.status}
                          onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}
                        >
                          <option value="in-progress">In Progress</option>
                          <option value="planning">Planning</option>
                          <option value="on-hold">On Hold</option>
                          <option value="complete">Complete</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ast_yellow mb-2">Notes</label>
                        <textarea
                          rows={3}
                          className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition resize-none"
                          value={editDraft.notes}
                          onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ast_yellow mb-2">Estimated Budget</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                          value={editDraft.budget}
                          onChange={e => setEditDraft(d => ({ ...d, budget: e.target.value }))}
                        />
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-ast_yellow hover:bg-ast_yellow/10 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-4 py-2 font-semibold text-white shadow-astTurquoise hover:shadow-lg transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider text-ast_turquoise mb-1">Project</p>
                      <h2 className="text-lg font-bold text-ast_yellow">
                        {selectedProject.title}
                        {selectedProject.isNew && (
                          <span className="ml-2 text-xs bg-ast_turquoise/40 text-ast_turquoise px-2 py-0.5 rounded-full font-semibold align-middle">
                            NEW
                          </span>
                        )}
                      </h2>
                      <div className="mt-2">
                        <span className="inline-block bg-ast_purple/40 px-2 py-0.5 rounded text-ast_purple text-xs">
                          {selectedProject.status}
                        </span>
                      </div>
                    </div>

                    {selectedProject.notes && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-ast_yellow mb-1">Notes</p>
                        <p className="text-sm text-white/80">{selectedProject.notes}</p>
                      </div>
                    )}

                    {selectedProject.budget > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-ast_yellow mb-1">Budget</p>
                        <p className="text-sm text-white/80">${selectedProject.budget}</p>
                      </div>
                    )}

                    <div className="border-t border-ast_turquoise/20 pt-4 mb-4">
                      <p className="text-xs font-medium text-ast_yellow mb-2">Supplies</p>
                      {assignedSupplies.length > 0 && (
                        <ul className="mb-3 space-y-1">
                          {assignedSupplies.map(s => (
                            <li key={s.id} className="flex items-center justify-between text-sm text-white/70">
                              <span>· {s.name}</span>
                              <button
                                onClick={() => onUnassignSupply(selectedProject.id, s.id)}
                                className="shrink-0 ml-2 text-white/30 hover:text-ast_pink transition"
                                title="Remove"
                              >×</button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {unassignedSupplies.length === 0 ? (
                        <p className="text-xs text-white/40">All supplies assigned</p>
                      ) : (
                        <div className="flex gap-2">
                          <select
                            value={pendingSupplyId}
                            onChange={e => setPendingSupplyId(e.target.value)}
                            className="flex-1 min-w-0 rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-sm text-white focus:outline-none focus:border-ast_turquoise transition"
                          >
                            <option value="">Pick supply…</option>
                            {unassignedSupplies.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={handleAssign}
                            disabled={!pendingSupplyId}
                            className="shrink-0 rounded-lg bg-ast_turquoise/20 px-4 py-2 text-sm text-ast_turquoise hover:bg-ast_turquoise/40 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            Assign
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteProject(selectedProject.id); }}
                        className="rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-sm text-ast_yellow hover:bg-ast_yellow/10 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={handleStartEdit}
                        className="flex-1 rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-4 py-2 text-sm font-semibold text-white shadow-astTurquoise hover:shadow-lg transition"
                      >
                        Edit Project
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
