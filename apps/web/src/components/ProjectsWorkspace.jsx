import { useState } from "react";
import { PROJECT_STATUSES, CANONICAL_STATUS_VALUES } from "../data/projectContainers.js";
import ProjectsCard from "./ProjectsCard.jsx";

const NEEDS_SORTING = "__needs_sorting__";

export default function ProjectsWorkspace({
  sessionProjects,
  sessionSupplies,
  selectedProjectId,
  onSelectProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAssignSupply,
  onUnassignSupply,
  onImport,
  onExport,
}) {
  const [projectNavView, setProjectNavView] = useState("overview");
  const [selectedStatus, setSelectedStatus] = useState(null);

  const getStatusCount = (statusValue) =>
    sessionProjects.filter(p => p.status === statusValue).length;

  const needsSortingCount = sessionProjects.filter(
    p => !CANONICAL_STATUS_VALUES.has(p.status)
  ).length;

  const getFilteredProjects = () => {
    if (selectedStatus === null) return sessionProjects;
    if (selectedStatus === NEEDS_SORTING)
      return sessionProjects.filter(p => !CANONICAL_STATUS_VALUES.has(p.status));
    return sessionProjects.filter(p => p.status === selectedStatus);
  };

  const selectedStatusDef = PROJECT_STATUSES.find(s => s.value === selectedStatus);
  const inProgressCount = getStatusCount("in-progress");

  const navigateTo = (view, status = null) => {
    onSelectProject(null);
    setSelectedStatus(status);
    setProjectNavView(view);
  };

  const handleBackToOverview = () => {
    onSelectProject(null);
    setSelectedStatus(null);
    setProjectNavView("overview");
  };

  const breadcrumbLabel =
    projectNavView === "series" ? "Series"
    : projectNavView === "groups" ? "Groups"
    : selectedStatus === NEEDS_SORTING ? "Needs Sorting"
    : projectNavView === "list" && selectedStatus === null ? "All Projects"
    : selectedStatusDef?.label ?? "";

  const filteredProjects = getFilteredProjects();

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ast_turquoise">
            Creative Workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ast_yellow">Projects</h1>

          {projectNavView !== "overview" && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
              <button
                onClick={handleBackToOverview}
                className="hover:text-ast_turquoise transition"
              >
                Projects
              </button>
              <span className="text-white/25">›</span>
              <span className="text-ast_turquoise">{breadcrumbLabel}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onImport}
            className="text-xs rounded-lg border border-ast_turquoise/40 px-3 py-1.5 text-ast_turquoise hover:bg-ast_turquoise/10 transition"
          >
            Import JSON
          </button>
          <button
            onClick={onExport}
            className="text-xs rounded-lg border border-ast_turquoise/40 px-3 py-1.5 text-ast_turquoise hover:bg-ast_turquoise/10 transition"
          >
            Export Data
          </button>
          <button
            onClick={onAddProject}
            className="rounded-xl border border-ast_turquoise/40 bg-ast_turquoise/10 px-4 py-2 text-sm font-semibold text-ast_turquoise hover:bg-ast_turquoise/20 transition"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* OVERVIEW: bento grid */}
      {projectNavView === "overview" && (
        <div className="grid grid-cols-4 gap-3">

          {/* All Projects — full row, featured */}
          <button
            onClick={() => navigateTo("list", null)}
            className="col-span-4 rounded-2xl border border-ast_turquoise/50 bg-ast_turquoise/10 p-5 text-left hover:border-ast_turquoise/80 hover:bg-ast_turquoise/15 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-ast_turquoise">All Projects</p>
              {inProgressCount > 0 && (
                <span className="text-xs bg-ast_turquoise/20 text-ast_turquoise px-2 py-0.5 rounded">
                  {inProgressCount} in progress
                </span>
              )}
            </div>
            <p className="text-4xl font-bold text-ast_yellow">{sessionProjects.length}</p>
            <p className="text-xs text-white/40 mt-1">
              {sessionProjects.length === 1 ? "project" : "projects"} in your studio
            </p>
          </button>

          {/* Series */}
          <button
            onClick={() => navigateTo("series")}
            className="col-span-2 rounded-2xl border border-ast_pink/30 bg-ast_pink/5 p-5 text-left hover:border-ast_pink/60 hover:bg-ast_pink/10 transition"
          >
            <p className="text-sm font-semibold text-ast_pink mb-2">Series</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Bodies of work, studies,<br />collections &amp; themes
            </p>
          </button>

          {/* Groups */}
          <button
            onClick={() => navigateTo("groups")}
            className="col-span-2 rounded-2xl border border-ast_lavender/30 bg-ast_lavender/5 p-5 text-left hover:border-ast_lavender/60 hover:bg-ast_lavender/10 transition"
          >
            <p className="text-sm font-semibold text-ast_lavender mb-2">Groups</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Shows, collectors, grants,<br />&amp; working collections
            </p>
          </button>

          {/* Status cards */}
          {PROJECT_STATUSES.map(s => {
            const count = getStatusCount(s.value);
            const styles = {
              "planned":     "border-ast_lavender/30 bg-ast_lavender/5 hover:border-ast_lavender/60 hover:bg-ast_lavender/10",
              "in-progress": "border-ast_turquoise/30 bg-ast_turquoise/5 hover:border-ast_turquoise/60 hover:bg-ast_turquoise/10",
              "on-hold":     "border-ast_yellow/30 bg-ast_yellow/5 hover:border-ast_yellow/60 hover:bg-ast_yellow/10",
              "completed":   "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10",
            }[s.value];
            const labelColor = {
              "planned":     "text-ast_lavender",
              "in-progress": "text-ast_turquoise",
              "on-hold":     "text-ast_yellow",
              "completed":   "text-white/50",
            }[s.value];

            return (
              <button
                key={s.value}
                onClick={() => navigateTo("list", s.value)}
                className={`col-span-1 rounded-2xl border p-5 text-left transition ${styles}`}
              >
                <p className={`text-sm font-semibold mb-2 ${labelColor}`}>{s.label}</p>
                <p className="text-2xl font-bold text-ast_yellow">{count}</p>
                <p className="text-xs text-white/30 mt-1">
                  {count === 1 ? "project" : "projects"}
                </p>
              </button>
            );
          })}

          {/* Needs Sorting */}
          <button
            onClick={() => navigateTo("list", NEEDS_SORTING)}
            className={`col-span-4 rounded-2xl border p-5 text-left transition ${
              needsSortingCount > 0
                ? "border-ast_coral/40 bg-ast_coral/5 hover:border-ast_coral/70 hover:bg-ast_coral/10"
                : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5 opacity-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${needsSortingCount > 0 ? "text-ast_coral" : "text-white/30"}`}>
                Needs Sorting
              </p>
              {needsSortingCount > 0 && (
                <span className="text-xs bg-ast_coral/20 text-ast_coral px-2 py-0.5 rounded">
                  {needsSortingCount} {needsSortingCount === 1 ? "project" : "projects"}
                </span>
              )}
            </div>
            <p className="text-xs text-white/30 mt-1.5">
              Projects with missing or unrecognized status
            </p>
          </button>
        </div>
      )}

      {/* LIST: all or status-filtered */}
      {projectNavView === "list" && (
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <p className="text-xs uppercase tracking-wider text-white/40">
              {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
              {selectedStatus !== null && (
                <span> · {breadcrumbLabel}</span>
              )}
            </p>
          </div>
          <ProjectsCard
            embedded
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            sessionProjects={filteredProjects}
            sessionSupplies={sessionSupplies}
            onAssignSupply={onAssignSupply}
            onUnassignSupply={onUnassignSupply}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
          />
        </div>
      )}

      {/* SERIES placeholder */}
      {projectNavView === "series" && (
        <div className="rounded-2xl border border-ast_pink/30 bg-ast_pink/5 p-10 text-center">
          <p className="text-base font-semibold text-ast_pink mb-3">Series</p>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
            Series will let you organize bodies of work, studies, or collections.
            Coming in the next project organization pass.
          </p>
        </div>
      )}

      {/* GROUPS placeholder */}
      {projectNavView === "groups" && (
        <div className="rounded-2xl border border-ast_lavender/30 bg-ast_lavender/5 p-10 text-center">
          <p className="text-base font-semibold text-ast_lavender mb-3">Groups</p>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
            Groups will let you organize projects for shows, collectors, website updates,
            grants, or working collections. Coming in the next project organization pass.
          </p>
        </div>
      )}
    </>
  );
}
