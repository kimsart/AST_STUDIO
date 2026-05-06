import DashboardHeader from "../components/DashboardHeader.jsx";
import ProjectsCard from "../components/ProjectsCard.jsx";
import SuppliesCard from "../components/SuppliesCard.jsx";
import InspirationCard from "../components/InspirationCard.jsx";
import MetricsStrip from "../components/MetricsStrip.jsx";
import ProjectSummary from "../components/ProjectSummary.jsx";
import QuickActions from "../components/QuickActions.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import StudioChat from "../components/StudioChat.jsx";

export default function Dashboard() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-ast_bg_dark via-ast_deep to-ast_bg_blue text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,196,182,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,77,166,0.18),transparent_28%),radial-gradient(circle_at_center,rgba(90,58,142,0.22),transparent_38%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <DashboardHeader />

        <div className="grid flex-1 grid-cols-12 gap-4 px-4 pb-4">
          <aside className="col-span-3 rounded-2xl border border-ast_turquoise/50 bg-ast_deep/70 p-4 shadow-astTurquoise backdrop-blur-xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-ast_turquoise">
              My Studio
            </p>

            <div className="space-y-4">
              <ProjectsCard />
              <SuppliesCard />
              <InspirationCard />
            </div>
          </aside>

          <section className="col-span-9 rounded-2xl border border-ast_purple/60 bg-ast_deep/75 p-6 shadow-astPurple backdrop-blur-xl">
            <MetricsStrip />

            <div className="mt-6 grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-4">
                <ProjectSummary />
                <QuickActions />
                <InventoryTable />
              </div>

              <div className="col-span-4 space-y-4">
                <div className="rounded-2xl border border-ast_pink/40 bg-white/5 p-4 shadow-[0_0_18px_rgba(255,77,166,0.22)] backdrop-blur-xl">
                  <h3 className="text-lg font-semibold text-ast_yellow">
                    Studio Memory
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    You were working on Watercolor Botanicals.
                  </p>
                  <button className="mt-4 rounded-full border border-ast_turquoise/40 px-4 py-2 text-sm text-ast_turquoise hover:bg-ast_turquoise/10">
                    Resume project
                  </button>
                </div>

                <div className="rounded-2xl border border-ast_lavender/40 bg-white/5 p-4 shadow-[0_0_16px_rgba(141,124,235,0.2)] backdrop-blur-xl">
                  <h3 className="text-lg font-semibold text-ast_lavender">
                    Need help?
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    Open Studio Chat to ask how to add supplies, track condition,
                    or manage a project.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <StudioChat />
      </div>
    </main>
  );
}