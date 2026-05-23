export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#050009]/90 px-6 py-4 backdrop-blur-xl">
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

        {/* Top nav removed: workspace navigation lives in Studio Tools/sidebar */}

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