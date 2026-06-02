import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodayInArtHistory } from '../data/inspirationFeed/index.js'
import kevinPortrait from '../assets/studiospotlight/kevinlewis/portrait-01.jpg'

export default function HomeWorkspace({ onClickImport, onExport }) {
  const navigate = useNavigate()
  const artHistory = getTodayInArtHistory()
  const [artImgFailed, setArtImgFailed] = useState(false)
  return (
    <>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-ast_lavender">Studio</p>
        <h1 className="mt-2 text-3xl font-bold bg-[linear-gradient(90deg,#00E6FF_0%,#2E64FF_35%,#8D5CFF_65%,#FF2FB3_100%)] bg-clip-text text-transparent">Today in the Studio</h1>
        <p className="mt-2 text-sm text-ast_body/60">
          Open a workspace from the left, or explore what&apos;s on today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* 1. Partner Spotlight */}
        <div className="rounded-2xl border border-ast_blue/40 bg-[#120724] p-6">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.25em] text-ast_lavender">Partner Spotlight</p>
            <span className="text-xs bg-ast_lavender/20 text-ast_lavender/70 px-2 py-0.5 rounded">
              Sponsored
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#00E6FF] mb-2">Partner name placeholder</h2>
          <p className="text-sm text-ast_body/70 leading-relaxed">
            Partner description placeholder. Real partner content, demos, and product launches
            will appear here once partner integrations are confirmed.
          </p>
          <p className="mt-5 text-xs text-ast_body/30">Partner content — placeholder for MVP</p>
        </div>

        {/* 2. This Day in Art History */}
        <div className="rounded-2xl border border-ast_purple/40 bg-[#120724] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-ast_lavender mb-3">
            Art History
          </p>
          {artHistory?.image_url && !artImgFailed ? (
            <img
              src={artHistory.image_url}
              alt={artHistory.image_alt_text ?? artHistory.title}
              className="w-full h-28 object-cover rounded-xl mb-3"
              onError={() => setArtImgFailed(true)}
            />
          ) : (
            <div className="w-full h-28 rounded-xl bg-gradient-to-br from-ast_purple/20 via-ast_lavender/15 to-ast_blue/20 mb-3" />
          )}
          <h2 className="text-base font-semibold text-[#8D5CFF] mb-3">The Starry Night</h2>
          <p className="text-sm text-ast_body/70 leading-relaxed">
            Vincent van Gogh completed <em>The Starry Night</em> in June 1889 while a patient
            at Saint-Paul-de-Mausole in Saint-Rémy-de-Provence. Painted from memory rather than
            direct observation, it is now one of the most recognised works in Western art.
          </p>
          <p className="mt-5 text-xs text-ast_body/30">
            Daily art history — curated feed coming in a future release
          </p>
        </div>

        {/* 3. Artist Quote */}
        <div className="rounded-2xl border border-ast_turquoise/40 bg-[#120724] p-6 flex flex-col justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-ast_turquoise mb-6">
            Artist Quote
          </p>
          <blockquote className="text-2xl font-semibold text-[#2E64FF] leading-snug">
            Famous artist quote placeholder.
          </blockquote>
          <p className="mt-5 text-xs text-ast_body/30">
            Verified quote feed coming in a future release.
          </p>
        </div>

        {/* 4. Studio Spotlight */}
        <div
          className="rounded-2xl border border-ast_pink/40 bg-[#120724] p-6 cursor-pointer hover:brightness-110 transition"
          onClick={() => navigate('/inspiration', { state: { section: 'spotlight-kevin-lewis' } })}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-ast_pink mb-3">Studio Spotlight</p>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={kevinPortrait}
              alt="Kevin Lewis"
              className="w-14 h-14 rounded-full object-cover border border-ast_pink/30 shrink-0"
            />
            <div>
              <h2 className="text-lg font-bold text-[#FF2FB3]">Kevin Lewis</h2>
              <p className="text-xs text-ast_body/60">Mixed media &amp; textile artist</p>
            </div>
          </div>
          <p className="text-sm text-ast_body/70 leading-relaxed">
            Vivid, intense, and sometimes frightening work rooted in makeup and costume design for horror film.
          </p>
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onClickImport}
          className="text-xs text-ast_lavender/70 hover:text-ast_lavender transition underline underline-offset-2"
        >
          Import JSON
        </button>
        <button
          onClick={onExport}
          className="text-xs text-ast_lavender/70 hover:text-ast_lavender transition underline underline-offset-2"
        >
          Export Data
        </button>
      </div>
    </>
  );
}
