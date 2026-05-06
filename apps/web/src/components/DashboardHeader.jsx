export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-ast_turquoise/20 bg-ast_bg_dark/90 px-6 py-4 text-ast_yellow">
      <h1 className="text-2xl font-bold text-ast_turquoise">
        Art Supply Tracker Studio
      </h1>

      <nav className="flex gap-4 text-sm">
        <button>Dashboard</button>
        <button>Projects</button>
        <button>Inventory</button>
        <button>Community</button>
      </nav>
    </header>
  );
}
