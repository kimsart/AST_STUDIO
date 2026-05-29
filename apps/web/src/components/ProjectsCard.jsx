import { useState, useEffect } from "react";

const GRID_COLS = 3;

const STATUS_STYLES = {
  "planned":     { label: "Planned",     bg: "bg-ast_electric_blue/20", text: "text-ast_electric_blue" },
  "in-progress": { label: "In Progress", bg: "bg-ast_cyan/20",          text: "text-ast_cyan" },
  "on-hold":     { label: "On Hold",     bg: "bg-ast_yellow/20",        text: "text-ast_yellow" },
  "completed":   { label: "Completed",   bg: "bg-ast_lavender/20",      text: "text-ast_lavender" },
};

// Card border/background reflects project status.
// Selected state brightens the same color family — not a generic blue override.
// Theme/colorFamily is a separate metadata field shown as a small tag below the status pill.
const STATUS_CARD_STYLES = {
  "planned": {
    base:     "border-ast_electric_blue/30 bg-ast_electric_blue/5 hover:border-ast_electric_blue/55 hover:bg-ast_electric_blue/10",
    selected: "border-ast_electric_blue/70 bg-ast_electric_blue/15 shadow-astBlue",
  },
  "in-progress": {
    base:     "border-ast_cyan/30 bg-ast_cyan/5 hover:border-ast_cyan/55 hover:bg-ast_cyan/10",
    selected: "border-ast_cyan/70 bg-ast_cyan/15 shadow-astCyan",
  },
  "on-hold": {
    base:     "border-ast_yellow/30 bg-ast_yellow/5 hover:border-ast_yellow/55 hover:bg-ast_yellow/10",
    selected: "border-ast_yellow/70 bg-ast_yellow/15 shadow-astWarm",
  },
  "completed": {
    base:     "border-ast_lavender/25 bg-ast_lavender/5 hover:border-ast_lavender/45 hover:bg-ast_lavender/10",
    selected: "border-ast_lavender/60 bg-ast_lavender/10 shadow-astLavender",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { label: status || "?", bg: "bg-ast_coral/20", text: "text-ast_coral" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function ArtworkPlaceholder() {
  return (
    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-ast_purple/40 bg-gradient-to-br from-ast_purple/40 via-ast_blue/20 to-ast_turquoise/20">
      <div className="absolute top-3 left-2 w-14 h-px bg-ast_turquoise/30 rotate-12" />
      <div className="absolute top-7 left-1 w-10 h-px bg-ast_pink/30 rotate-6" />
      <div className="absolute top-11 left-4 w-16 h-px bg-ast_lavender/25 -rotate-3" />
      <div className="absolute top-14 left-2 w-8 h-px bg-ast_turquoise/20 rotate-12" />
      <div className="absolute bottom-5 left-3 w-12 h-px bg-ast_pink/20 -rotate-6" />
      <div className="absolute top-5 right-3 w-1.5 h-1.5 rounded-full bg-ast_yellow/40" />
      <div className="absolute bottom-8 right-4 w-1 h-1 rounded-full bg-ast_turquoise/50" />
      <span className="absolute bottom-1.5 right-1.5 text-[8px] text-ast_faint leading-none">no image</span>
    </div>
  );
}

export default function ProjectsCard({
  selectedProjectId,
  onSelectProject,
  sessionProjects = [],
  sessionSupplies = [],
  onAssignSupply,
  onUnassignSupply,
  onEditProject,
  onDeleteProject,
  embedded = false,
}) {
  const [pendingSupplyId, setPendingSupplyId] = useState("");
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editDraft, setEditDraft] = useState({ title: "", status: "planned", notes: "", budget: "" });

  const selectedProject = sessionProjects.find((p) => p.id === selectedProjectId);

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
      status: selectedProject.status || "planned",
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

  // Split flat project list into rows so the detail panel can be injected
  // directly below the row containing the selected card, not at the end of
  // the entire grid. This prevents scroll-position jumps when opening/closing.
  const rows = [];
  for (let i = 0; i < sessionProjects.length; i += GRID_COLS) {
    rows.push(sessionProjects.slice(i, i + GRID_COLS));
  }

  const detailPanel = selectedProject && (
    <div className="mt-3 rounded-2xl border border-ast_turquoise/60 bg-ast_deep/95 p-6 shadow-astTurquoise">
      {isEditingProject ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ast_turquoise">Edit Project</h2>
            <button
              onClick={handleCancelEdit}
              className="text-xl text-ast_yellow/60 hover:text-ast_yellow transition"
            >✕</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ast_lavender mb-2">Project Title</label>
              <input
                className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                value={editDraft.title}
                onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ast_lavender mb-2">Status</label>
              <select
                className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition"
                value={editDraft.status}
                onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))}
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ast_lavender mb-2">Notes</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-ast_turquoise/30 bg-ast_bg_dark/70 px-3 py-2 text-white placeholder-white/40 focus:border-ast_turquoise focus:outline-none focus:ring-2 focus:ring-ast_turquoise/30 transition resize-none"
                value={editDraft.notes}
                onChange={e => setEditDraft(d => ({ ...d, notes: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ast_lavender mb-2">Estimated Budget</label>
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
              >Cancel</button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-4 py-2 font-semibold text-white shadow-astTurquoise hover:shadow-lg transition"
              >Save Changes</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-ast_turquoise mb-1">Project</p>
              <h2 className="text-lg font-bold text-ast_cyan">
                {selectedProject.title}
                {selectedProject.isNew && (
                  <span className="ml-2 text-xs bg-ast_turquoise/40 text-ast_turquoise px-2 py-0.5 rounded-full font-semibold align-middle">
                    NEW
                  </span>
                )}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedProject.status} />
                {selectedProject.colorFamily && (
                  <span className="text-xs text-ast_faint bg-white/5 px-1.5 py-0.5 rounded">
                    {selectedProject.colorFamily}
                  </span>
                )}
              </div>
            </div>
            <ArtworkPlaceholder />
          </div>

          {selectedProject.notes && (
            <div className="mb-4">
              <p className="text-xs font-medium text-ast_lavender mb-1">Notes</p>
              <p className="text-sm text-ast_body">{selectedProject.notes}</p>
            </div>
          )}

          {selectedProject.budget > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-ast_lavender mb-1">Budget</p>
              <p className="text-sm text-ast_body">${selectedProject.budget}</p>
            </div>
          )}

          <div className="border-t border-ast_turquoise/20 pt-4 mb-4">
            <p className="text-xs font-medium text-ast_lavender mb-2">Supplies</p>
            {assignedSupplies.length > 0 && (
              <ul className="mb-3 space-y-1">
                {assignedSupplies.map(s => (
                  <li key={s.id} className="flex items-center justify-between text-sm text-ast_body/75">
                    <span>· {s.name}</span>
                    <button
                      onClick={() => onUnassignSupply(selectedProject.id, s.id)}
                      className="shrink-0 ml-2 text-ast_faint hover:text-ast_pink transition"
                      title="Remove"
                    >×</button>
                  </li>
                ))}
              </ul>
            )}
            {unassignedSupplies.length === 0 ? (
              <p className="text-xs text-ast_body/50">All supplies assigned</p>
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
                >Assign</button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteProject(selectedProject.id); }}
              className="rounded-lg border border-ast_yellow/30 bg-transparent px-4 py-2 text-sm text-ast_yellow hover:bg-ast_yellow/10 transition"
            >Delete</button>
            <button
              onClick={handleStartEdit}
              className="flex-1 rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-4 py-2 text-sm font-semibold text-white shadow-astTurquoise hover:shadow-lg transition"
            >Edit Project</button>
          </div>
        </>
      )}
    </div>
  );

  const content = (
    <div>
      {sessionProjects.length === 0 && (
        <p className="py-8 text-sm text-ast_body/40 text-center">No projects here yet.</p>
      )}

      <div className="space-y-3">
        {rows.map((row) => {
          const rowHasSelected = row.some(p => p.id === selectedProjectId);
          return (
            <div key={row[0].id}>
              <div className="grid grid-cols-3 gap-3">
                {row.map((project) => {
                  const isSelected = selectedProjectId === project.id;
                  const cardStyle = STATUS_CARD_STYLES[project.status] ?? {
                    base:     "border-ast_purple/30 bg-ast_purple/5 hover:border-ast_turquoise/40 hover:bg-ast_turquoise/10",
                    selected: "border-ast_turquoise/70 bg-ast_turquoise/15 shadow-astTurquoise",
                  };
                  return (
                    <button
                      key={project.id}
                      onClick={() => { onSelectProject(isSelected ? null : project.id); setIsEditingProject(false); }}
                      className={`relative rounded-2xl border p-4 text-left transition ${
                        isSelected ? cardStyle.selected : cardStyle.base
                      }`}
                    >
                      {project.isNew && (
                        <span className="absolute top-2 right-2 text-xs bg-ast_turquoise/40 text-ast_turquoise px-2 py-0.5 rounded-full font-semibold">
                          NEW
                        </span>
                      )}
                      <p className={`text-sm font-semibold leading-snug mb-2 ${project.isNew ? "pr-12" : "pr-2"} ${isSelected ? "text-ast_cyan" : "text-ast_body"}`}>
                        {project.title}
                      </p>
                      <StatusBadge status={project.status} />
                      {project.colorFamily && (
                        <span className="mt-2 inline-block text-xs text-ast_faint bg-white/5 px-1.5 py-0.5 rounded">
                          {project.colorFamily}
                        </span>
                      )}
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

  if (embedded) {
    return content;
  }

  return (
    <section className="rounded-xl border border-ast_turquoise/40 bg-ast_bg_dark/70 p-4 text-ast_yellow shadow-astTurquoise">
      <h2 className="text-lg font-bold text-ast_turquoise">Projects</h2>
      <div className="mt-3">
        {content}
      </div>
    </section>
  );
}
