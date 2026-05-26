export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#050009]/90 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="min-w-fit">
          <img
            src="/assets/ast-logo-horizontal-cropped.png"
            alt="ArtSupplyTracker"
            className="h-10 md:h-12 lg:h-14 w-auto max-w-[320px] object-contain"
          />
        </div>

        {/* Top nav removed: workspace navigation lives in Studio Tools/sidebar */}

        {/* Actions */}
        <div className="flex min-w-fit items-center gap-3">
          {/* Placeholder: last-session resume — wire to last active project/view when session state exists */}
          <button className="flex items-center gap-2 rounded-xl border border-ast-purple/30 bg-white/5 px-3 py-1.5 text-sm text-ast-purple/70 transition hover:border-ast-purple/60 hover:text-ast-yellow">
            <span>✧</span>
            What was I working on?
          </button>

          {/* Placeholder: account/settings menu — no menu built yet */}
          <button className="rounded-xl border border-ast-purple/40 bg-white/5 px-3 py-2 text-sm font-semibold text-ast-yellow transition hover:bg-white/10">
            Hello Artist
          </button>
        </div>
      </div>
    </header>
  );
}