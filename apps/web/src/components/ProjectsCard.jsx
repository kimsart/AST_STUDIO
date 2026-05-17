import { mockProjects } from "../data/mockData.js";

export default function ProjectsCard({ selectedProjectId, onSelectProject, sessionProjects = [] }) {
  const allProjects = [...mockProjects, ...sessionProjects];
  const selectedProject = allProjects.find((p) => p.id === selectedProjectId);

  return (
    <section className="rounded-xl border border-ast_turquoise/40 bg-ast_bg_dark/70 p-4 text-ast_yellow shadow-astTurquoise">
      <h2 className="text-lg font-bold text-ast_turquoise">Projects</h2>
      
      <div className="mt-3 space-y-2">
        {allProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
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
        ))}
      </div>

      {selectedProject && (
        <div className="mt-4 rounded-lg border border-ast_yellow/30 bg-ast_yellow/5 p-3">
          <p className="text-xs uppercase tracking-wider text-ast_turquoise">Selected</p>
          <p className="mt-1 text-sm font-semibold text-ast_yellow">{selectedProject.title}</p>
          <p className="mt-1 text-xs text-white/60">
            <span className="inline-block bg-ast_purple/40 px-2 py-0.5 rounded text-ast_purple">
              {selectedProject.status}
            </span>
            {selectedProject.isNew && (
              <span className="ml-2 inline-block bg-ast_turquoise/40 px-2 py-0.5 rounded text-ast_turquoise text-xs font-semibold">
                NEW
              </span>
            )}
          </p>
          <p className="mt-2 text-xs text-white/60">{selectedProject.notes}</p>
        </div>
      )}
    </section>
  );
}