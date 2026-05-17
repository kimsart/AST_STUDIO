import { useState, useEffect, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader.jsx";
import ProjectsCard from "../components/ProjectsCard.jsx";
import SuppliesCard from "../components/SuppliesCard.jsx";
import InspirationCard from "../components/InspirationCard.jsx";
import MetricsStrip from "../components/MetricsStrip.jsx";
import ProjectSummary from "../components/ProjectSummary.jsx";
import QuickActions from "../components/QuickActions.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import StudioChat from "../components/StudioChat.jsx";
import CommunitySpotlight from "../components/CommunitySpotlight.jsx";
import AddProjectFormInline from "../components/forms/AddProjectFormInline.jsx";
import AddSupplyFormInline from "../components/forms/AddSupplyFormInline.jsx";
import { loadProjects, saveProjects, loadSupplies, saveSupplies, validateImportedData, normalizeProject, normalizeSupply } from "../utils/localStorage.js";

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showAddSupplyForm, setShowAddSupplyForm] = useState(false);
  const [sessionProjects, setSessionProjects] = useState(loadProjects);
  const [sessionSupplies, setSessionSupplies] = useState(loadSupplies);

  useEffect(() => { saveProjects(sessionProjects); }, [sessionProjects]);
  useEffect(() => { saveSupplies(sessionSupplies); }, [sessionSupplies]);

  const handleAddProject = (projectData) => {
    const newId = Math.max(...sessionProjects.map(p => p.id), 3) + 1;
    setSessionProjects((prev) => [
      ...prev,
      { id: newId, supplyIds: [], ...projectData, isNew: true },
    ]);
    setShowAddProjectForm(false);
  };

  const handleAddSupply = (supplyData) => {
    const newId = Math.max(...sessionSupplies.map(s => s.id), 100) + 1;
    setSessionSupplies((prev) => [
      ...prev,
      { id: newId, usedInProjectIds: [], ...supplyData, isNew: true },
    ]);
    setShowAddSupplyForm(false);
  };

  const handleAssignSupply = (projectId, supplyId) => {
    setSessionProjects(prev => prev.map(p =>
      p.id === projectId && !p.supplyIds.includes(supplyId)
        ? { ...p, supplyIds: [...p.supplyIds, supplyId] }
        : p
    ));
    setSessionSupplies(prev => prev.map(s =>
      s.id === supplyId && !s.usedInProjectIds.includes(projectId)
        ? { ...s, usedInProjectIds: [...s.usedInProjectIds, projectId] }
        : s
    ));
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onerror = () => alert("Could not read file. Import cancelled.");
    reader.onload = (event) => {
      let parsed;
      try {
        parsed = JSON.parse(event.target.result);
      } catch {
        alert("Invalid JSON file. Import cancelled.");
        return;
      }
      if (!validateImportedData(parsed)) {
        alert("File is missing required projects or supplies arrays. Import cancelled.");
        return;
      }
      setSessionProjects(parsed.projects.map(normalizeProject));
      setSessionSupplies(parsed.supplies.map(normalizeSupply));
      alert("Import successful.");
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    const payload = {
      app: "AST Studio",
      exportedAt: new Date().toISOString(),
      version: 1,
      projects: sessionProjects,
      supplies: sessionSupplies,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ast-studio-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-ast_bg_dark via-ast_deep to-ast_bg_blue text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,196,182,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,77,166,0.16),transparent_30%),radial-gradient(circle_at_center,rgba(90,58,142,0.22),transparent_42%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <DashboardHeader />

        <section className="grid flex-1 grid-cols-12 gap-4 px-4 pb-4">
          {/* LEFT PANEL: Creative Workspace */}
          <aside className="col-span-3 min-h-0 rounded-3xl border border-ast_turquoise/50 bg-ast_deep/70 p-4 shadow-astTurquoise backdrop-blur-xl">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.35em] text-ast_turquoise">
                Creative Workspace
              </p>
              <h2 className="mt-2 text-xl font-semibold text-ast_yellow">
                My Studio
              </h2>
            </div>

            <div className="space-y-4">
              <ProjectsCard
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                sessionProjects={sessionProjects}
                sessionSupplies={sessionSupplies}
                onAssignSupply={handleAssignSupply}
              />
              <SuppliesCard sessionSupplies={sessionSupplies} />
              <InspirationCard />

              <div className="rounded-2xl border border-ast_blue/30 bg-white/5 p-4 shadow-[0_0_16px_rgba(74,105,214,0.18)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-ast_lavender">
                  Partners
                </p>
                <h3 className="mt-2 text-lg font-semibold text-ast_yellow">
                  Retailer & Manufacturer Picks
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Product demos, supply deals, and partner inspiration live here.
                </p>
              </div>
            </div>
          </aside>

          {/* CENTER PANEL: Active Work Zone */}
          <main className="col-span-7 min-h-0 rounded-3xl border border-ast_purple/60 bg-ast_deep/75 p-6 shadow-astPurple backdrop-blur-xl">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.35em] text-ast_lavender">
                Active Work Zone
              </p>
              <h1 className="mt-2 text-3xl font-bold text-ast_yellow">
                Today in the Studio
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">
                Track your active project, supplies, progress, time, and inventory from one focused workspace.
              </p>
            </div>

            <div className="space-y-6">
              <MetricsStrip />
              <ProjectSummary />
              <QuickActions
                onNewProject={() => setShowAddProjectForm(true)}
                onAddSupply={() => setShowAddSupplyForm(true)}
              />
              <div className="flex justify-end gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportData}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-ast_lavender/70 hover:text-ast_lavender transition underline underline-offset-2"
                >
                  Import JSON
                </button>
                <button
                  onClick={handleExportData}
                  className="text-xs text-ast_lavender/70 hover:text-ast_lavender transition underline underline-offset-2"
                >
                  Export Data
                </button>
              </div>
              <InventoryTable 
                inventoryFilter={inventoryFilter} 
                onFilterChange={setInventoryFilter}
                sessionSupplies={sessionSupplies}
              />
            </div>
          </main>

          {/* RIGHT PANEL: Community + Chat */}
          <aside className="col-span-2 min-h-0 rounded-3xl border border-ast_pink/60 bg-ast_deep/75 p-4 shadow-astPink backdrop-blur-xl">
            <div className="sticky top-4 z-10 mb-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ast_pink">
                  Community
                </p>
                <h2 className="mt-2 text-lg font-semibold text-ast_yellow">
                  Studio Chat
                </h2>
              </div>

              <div className="rounded-2xl border border-ast_purple/35 bg-white/5 p-3">
                <p className="text-sm font-semibold text-ast_lavender">
                  Studio Memory
                </p>
                <p className="mt-1 text-xs text-white/65">
                  You were working on Watercolor Botanicals.
                </p>
              </div>

              <div className="rounded-2xl border border-ast_turquoise/30 bg-white/5 p-3">
                <p className="text-sm font-semibold text-ast_turquoise">
                  Need help?
                </p>
                <p className="mt-1 text-xs text-white/65">
                  Ask how to add supplies, track condition, or prep for a show.
                </p>
              </div>
            </div>

            <div className="max-h-[calc(100vh-16rem)] space-y-4 overflow-y-auto pr-1">
              <StudioChat />
              <CommunitySpotlight />
            </div>
          </aside>
        </section>
      </div>

      {/* Form Modals */}
      {showAddProjectForm && (
        <AddProjectFormInline
          onSubmit={handleAddProject}
          onCancel={() => setShowAddProjectForm(false)}
        />
      )}

      {showAddSupplyForm && (
        <AddSupplyFormInline
          onSubmit={handleAddSupply}
          onCancel={() => setShowAddSupplyForm(false)}
        />
      )}
    </main>
  );
}