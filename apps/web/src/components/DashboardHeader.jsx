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
        <div className="flex min-w-fit items-center gap-4">
          <button className="text-xl text-ast_lavender hover:text-ast_yellow">
            ✧
          </button>

          <button className="relative text-xl text-ast_yellow hover:text-ast_pink">
            🔔
            <span className="absolute -right-1 -top-1 rounded-full bg-ast_pink px-1.5 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          <button className="rounded-xl bg-gradient-to-r from-ast_purple to-ast_pink px-4 py-2 text-sm font-semibold text-white shadow-astPink hover:scale-[1.02]">
            + New
          </button>

          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-ast_pink/60 bg-gradient-to-br from-ast_purple to-ast_pink text-sm font-bold text-white shadow-astPink">
              AP
            </div>
            <div className="hidden text-sm md:block">
              <p className="font-semibold text-ast_yellow">Artist Pro</p>
              <p className="text-xs text-white/50">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}