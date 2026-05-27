import { Link } from 'react-router-dom';

export default function StubPage({ title, description }) {
  return (
    <main className="min-h-screen bg-[#050009] text-white flex flex-col items-center justify-center px-6">
      <div className="mb-12">
        <img
          src="/assets/ast-logo-horizontal-cropped.png"
          alt="ArtSupplyTracker"
          className="h-10 object-contain"
        />
      </div>

      <h1 className="text-4xl font-bold mb-4 bg-[linear-gradient(90deg,#00E6FF_0%,#2E64FF_35%,#8D5CFF_65%,#FF2FB3_100%)] bg-clip-text text-transparent">
        {title}
      </h1>

      <p className="text-sm text-white/50 mb-10">
        {description || 'This page is coming soon.'}
      </p>

      <Link
        to="/dashboard"
        className="rounded-xl border border-[#8D5CFF]/40 bg-white/5 px-5 py-2.5 text-sm text-[#8D5CFF] transition hover:border-[#8D5CFF]/70 hover:bg-white/10"
      >
        ← Back to Studio
      </Link>
    </main>
  );
}
