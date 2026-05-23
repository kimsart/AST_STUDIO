export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ast_purple/35 bg-ast_deep/85 px-6 py-4 backdrop-blur-xl shadow-[0_0_28px_rgba(74,105,214,0.18)]">
      <div className="flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="min-w-fit">
          <div className="relative inline-block">
            <h1 className="font-serif text-3xl italic tracking-wide">
              <span className="text-ast_blue">Art Supply Tracker</span>
              <span className="ml-2 text-ast_pink">Studio</span>
            </h1>

            {/* flourish underline */}
            <div className="mt-1 flex items-center">
              <div className="h-[2px] w-64 rounded-full bg-gradient-to-r from-ast_blue via-ast_lavender to-ast_pink shadow-[0_0_14px_rgba(255,77,166,0.45)]" />
              <div className="-ml-1 h-5 w-5 rounded-full border-2 border-ast_pink shadow-[0_0_14px_rgba(255,77,166,0.65)]" />
              <div className="-ml-1 h-[2px] w-5 rotate-45 rounded-full bg-ast_pink shadow-[0_0_10px_rgba(255,77,166,0.65)]" />
            </div>

            <p className="mt-1 text-center text-[10px] uppercase tracking-[0.45em] text-ast_yellow/70">
              Studio
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-2 rounded-2xl border border-ast_lavender/25 bg-white/5 p-1">
          {["Overview", "Projects", "Calendar", "Notes"].map((item, index) => (
            <button
              key={item}
              className={`rounded-xl px-4 py-2 text-sm transition-all duration-300 ${
                index === 0
                  ? "bg-ast_blue/35 text-white shadow-astBlue"
                  : "text-ast_yellow/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex min-w-fit items-center gap-3">
          {/* Placeholder: last-session resume — wire to last active project/view when session state exists */}
          <button className="flex items-center gap-2 rounded-xl border border-ast_lavender/30 bg-white/5 px-3 py-1.5 text-sm text-ast_lavender transition hover:border-ast_lavender/60 hover:text-ast_yellow">
            <span>✧</span>
            What was I working on?
          </button>

          {/* Placeholder: account/settings menu — no menu built yet */}
          <button className="rounded-xl border border-ast_purple/40 bg-white/5 px-3 py-2 text-sm font-semibold text-ast_yellow transition hover:bg-white/10">
            Hello Artist
          </button>
        </div>
      </div>
    </header>
  );
}