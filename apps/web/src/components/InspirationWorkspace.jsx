import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTodayInArtHistory, getQuoteOfTheDay, allEntries } from "../data/inspirationFeed/index.js";

// ── Shared detail sub-components ───────────────────────────────────────────

function TagList({ tags }) {
  if (!tags?.length) return null;
  const visible = tags.slice(0, 4);
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {visible.map(tag => (
        <span key={tag} className="text-[10px] uppercase tracking-wide bg-ast_lavender/10 text-ast_muted px-2 py-0.5 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  );
}

function Attribution({ entry }) {
  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs text-ast_muted">
        <span className="font-medium text-ast_body/80">{entry.artwork_title}</span>
        {entry.year && <span className="text-ast_muted"> ({entry.year})</span>}
        {entry.artist_name && <span className="text-ast_muted"> · {entry.artist_name}</span>}
      </p>
      {entry.source_name && (
        entry.source_url ? (
          <a
            href={entry.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ast_turquoise/80 hover:text-ast_turquoise transition underline underline-offset-2"
          >
            {entry.source_name}
          </a>
        ) : (
          <p className="text-xs text-ast_muted">{entry.source_name}</p>
        )
      )}
      {entry.rights_note && (
        <p className="text-[10px] text-ast_muted/70 leading-snug mt-1">{entry.rights_note}</p>
      )}
    </div>
  );
}

// ── Compact grid cards ─────────────────────────────────────────────────────

function CompactCard({ eyebrow, eyebrowColor, title, preview, imageUrl, imageAlt, borderClass, highlightClass, selected, onSelect, italic = false }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border bg-[#120724] p-4 transition ${
        selected
          ? `${highlightClass} ring-1 ring-white/10`
          : `${borderClass} hover:brightness-110`
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${eyebrowColor} mb-1.5`}>{eyebrow}</p>
          <p className={`text-sm font-semibold text-ast_body leading-snug line-clamp-2 ${italic ? "italic" : ""}`}>{title}</p>
          {preview && (
            <p className="mt-1 text-[11px] text-ast_body/55 leading-snug line-clamp-1">{preview}</p>
          )}
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt ?? ""}
            className="ast-img-safe shrink-0 w-14 rounded-xl object-contain object-center bg-transparent"
            style={{ maxHeight: "3.5rem" }}
          />
        )}
      </div>
    </button>
  );
}

function SpotlightCompactCard({ selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border bg-[#120724] overflow-hidden transition ${
        selected
          ? "border-ast_purple/70 ring-1 ring-white/10"
          : "border-ast_purple/30 hover:brightness-110"
      }`}
    >
      <div className="h-10 bg-gradient-to-r from-ast_electric_blue/60 via-ast_purple/60 to-ast_pink/50" />
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ast_faint mb-1">Studio Spotlight</p>
          <p className="text-sm font-bold text-ast_turquoise leading-snug">Kim Wyatt</p>
          <p className="text-[11px] text-ast_muted mt-0.5 leading-snug">Kim Wyatt Studio Art Labs</p>
        </div>
        <img
          src="https://static.wixstatic.com/media/0669c1_dccdd785631943a59238f81b9520c5e0~mv2.jpg"
          alt="Kim Wyatt"
          className="ast-img-safe shrink-0 w-12 rounded-xl object-contain object-center border border-ast_purple/40"
          style={{ maxHeight: "3rem" }}
        />
      </div>
    </button>
  );
}

function PartnerCompactCard({ selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border bg-[#120724] p-4 transition ${
        selected
          ? "border-ast_blue/60 ring-1 ring-white/10"
          : "border-ast_blue/20 hover:brightness-110"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender mb-1.5">Partners</p>
      <p className="text-sm font-semibold text-[#8D5CFF] leading-snug line-clamp-2">Retailer & Manufacturer Picks</p>
      <p className="text-[11px] text-ast_body/55 mt-1 leading-snug">Supply deals & partner inspiration.</p>
    </button>
  );
}

// ── Detail panels ──────────────────────────────────────────────────────────

function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="shrink-0 text-ast_faint hover:text-ast_body transition text-sm leading-none"
    >
      ✕
    </button>
  );
}

function ArtHistoryDetail({ entry, onClose }) {
  return (
    <div className="rounded-2xl border border-ast_lavender/40 bg-[#0d0420] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender">Today in Art History</p>
        <CloseButton onClose={onClose} />
      </div>
      {entry.image_url ? (
        <img
          src={entry.image_url}
          alt={entry.image_alt_text ?? ""}
          className="ast-img-safe w-full rounded-xl object-contain object-center mb-4"
          style={{ maxHeight: "11rem" }}
        />
      ) : (
        <p className="text-[10px] text-ast_faint/60 italic mb-3 leading-snug">
          Image unavailable · rights protected — search the web to discover this artist's work.
        </p>
      )}
      <h3 className="text-base font-bold text-ast_body mb-2 leading-snug">{entry.title}</h3>
      <p className="text-sm text-ast_body/75 leading-relaxed">{entry.body_text}</p>
      <Attribution entry={entry} />
      <TagList tags={entry.tags} />
    </div>
  );
}

function QuoteDetail({ entry, onClose }) {
  return (
    <div className="rounded-2xl border border-ast_turquoise/40 bg-[#0d0420] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ast_turquoise">Quote of the Day</p>
        <CloseButton onClose={onClose} />
      </div>
      <div className={entry.image_url ? "flex gap-4" : ""}>
        {entry.image_url && (
          <img
            src={entry.image_url}
            alt={entry.image_alt_text ?? ""}
            className="ast-img-safe shrink-0 w-20 rounded-xl object-contain object-top"
            style={{ maxHeight: "8rem" }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-ast_body/80 mb-2 leading-snug">{entry.title}</h3>
          <blockquote className="text-base font-medium text-ast_body leading-relaxed italic border-l-2 border-ast_turquoise/50 pl-4">
            &ldquo;{entry.body_text}&rdquo;
          </blockquote>
          <p className="mt-2 text-xs text-ast_muted">— {entry.artist_name}</p>
        </div>
      </div>
      <Attribution entry={entry} />
      <TagList tags={entry.tags} />
    </div>
  );
}

function SpotlightDetail({ onClose }) {
  return (
    <div className="rounded-2xl border border-ast_purple/50 bg-[#0d0420] p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ast_faint">Studio Spotlight</p>
        <CloseButton onClose={onClose} />
      </div>
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-ast_turquoise text-base leading-snug">Kim Wyatt</h3>
          <p className="text-[10px] text-ast_muted mt-0.5 mb-2">@kims_studio_labs · Kim Wyatt Studio Art Labs</p>
          <p className="text-xs text-ast_body/65 mb-2 leading-relaxed">
            Artist and founder behind AST Studio. Kim Wyatt Studio Art Labs is the real-world studio practice this app was built to support.
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[9px] bg-ast_turquoise/20 text-ast_turquoise px-2 py-0.5 rounded-full">Founder</span>
            <span className="text-[9px] bg-ast_lavender/20 text-ast_lavender px-2 py-0.5 rounded-full">Studio Artist</span>
            <span className="text-[9px] bg-ast_lavender/10 text-ast_faint px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <a
            href="https://www.kimwyatt.art/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ast_turquoise/70 hover:text-ast_turquoise transition"
          >
            kimwyatt.art →
          </a>
          <p className="mt-1.5 text-[8px] text-ast_faint/50 leading-snug">
            Artwork by Kim Wyatt. Used with artist permission for Art Supply Tracker beta testing.
          </p>
        </div>
        <img
          src="https://static.wixstatic.com/media/0669c1_26396aee2e914839814b379e8efd0070~mv2.jpg/v1/fill/w_460,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Liberty%20With%20Mask%20by%20Kim%20Wyatt.jpg"
          alt="Liberty With Mask by Kim Wyatt"
          className="ast-img-safe shrink-0 w-24 rounded-xl object-contain"
          style={{ maxHeight: "8rem" }}
        />
      </div>
    </div>
  );
}

function PartnerDetail({ onClose }) {
  return (
    <div className="rounded-2xl border border-ast_blue/40 bg-[#0d0420] p-5">
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender">Partners</p>
        <CloseButton onClose={onClose} />
      </div>
      <p className="text-sm font-semibold text-[#8D5CFF] mb-1">Retailer & Manufacturer Picks</p>
      <p className="text-xs text-ast_body/55 leading-relaxed">
        Product demos, supply deals, and partner inspiration live here.
      </p>
    </div>
  );
}

// ── Main workspace ─────────────────────────────────────────────────────────

const TABS = [
  { id: "today",       label: "Today"      },
  { id: "art-history", label: "Art History" },
  { id: "inspire-me",  label: "Inspire Me"  },
];

export default function InspirationWorkspace() {
  const location = useLocation();
  const focusSection = location.state?.section ?? null;

  const [activeTab, setActiveTab]   = useState("today");
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (focusSection) setSelectedCard(focusSection);
  }, [focusSection]);

  const artHistory    = getTodayInArtHistory();
  const quote         = getQuoteOfTheDay();
  const artHistoryAll = allEntries.filter(e => e.type === "art_history");

  const toggle = (id) => setSelectedCard(prev => prev === id ? null : id);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-ast_lavender">Inspiration</p>
        <h2 className="mt-1 text-2xl font-bold text-ast_body">Feed</h2>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex gap-1.5 mb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedCard(null); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === tab.id
                ? "bg-ast_lavender/15 text-ast_lavender border border-ast_lavender/40"
                : "text-ast_muted hover:text-ast_body border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-left space-y-3 pr-1 pb-2">

        {/* TODAY — 2×2 compact card grid + detail panel */}
        {activeTab === "today" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {artHistory ? (
                <CompactCard
                  eyebrow="Today in Art History"
                  eyebrowColor="text-ast_lavender"
                  title={artHistory.title}
                  preview={artHistory.artist_name}
                  imageUrl={artHistory.image_url}
                  imageAlt={artHistory.image_alt_text}
                  borderClass="border-ast_purple/40"
                  highlightClass="border-ast_lavender/60"
                  selected={selectedCard === "art-history-today"}
                  onSelect={() => toggle("art-history-today")}
                />
              ) : (
                <div className="rounded-2xl border border-ast_purple/20 bg-[#120724] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender mb-1">Today in Art History</p>
                  <p className="text-xs text-ast_body/30">No entry for today</p>
                </div>
              )}

              {quote ? (
                <CompactCard
                  eyebrow="Quote of the Day"
                  eyebrowColor="text-ast_turquoise"
                  title={quote.body_text}
                  preview={`— ${quote.artist_name}`}
                  imageUrl={quote.image_url}
                  imageAlt={quote.image_alt_text}
                  borderClass="border-ast_turquoise/30"
                  highlightClass="border-ast_turquoise/60"
                  selected={selectedCard === "quote"}
                  onSelect={() => toggle("quote")}
                  italic
                />
              ) : (
                <div className="rounded-2xl border border-ast_turquoise/20 bg-[#120724] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_turquoise mb-1">Quote of the Day</p>
                  <p className="text-xs text-ast_body/30">Coming soon</p>
                </div>
              )}

              <SpotlightCompactCard
                selected={selectedCard === "featured-artist"}
                onSelect={() => toggle("featured-artist")}
              />

              <PartnerCompactCard
                selected={selectedCard === "partner"}
                onSelect={() => toggle("partner")}
              />
            </div>

            {selectedCard === "art-history-today" && artHistory && (
              <ArtHistoryDetail entry={artHistory} onClose={() => setSelectedCard(null)} />
            )}
            {selectedCard === "quote" && quote && (
              <QuoteDetail entry={quote} onClose={() => setSelectedCard(null)} />
            )}
            {selectedCard === "featured-artist" && (
              <SpotlightDetail onClose={() => setSelectedCard(null)} />
            )}
            {selectedCard === "partner" && (
              <PartnerDetail onClose={() => setSelectedCard(null)} />
            )}
          </>
        )}

        {/* ART HISTORY — compact card grid with inline detail */}
        {activeTab === "art-history" && (
          artHistoryAll.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {artHistoryAll.map(e => (
                  <CompactCard
                    key={e.date}
                    eyebrow={e.date}
                    eyebrowColor="text-ast_lavender"
                    title={e.title}
                    preview={e.artist_name}
                    imageUrl={e.image_url}
                    imageAlt={e.image_alt_text}
                    borderClass="border-ast_purple/30"
                    highlightClass="border-ast_lavender/60"
                    selected={selectedCard === e.date}
                    onSelect={() => toggle(e.date)}
                  />
                ))}
              </div>
              {artHistoryAll.filter(e => selectedCard === e.date).map(e => (
                <ArtHistoryDetail key={e.date} entry={e} onClose={() => setSelectedCard(null)} />
              ))}
            </>
          ) : (
            <p className="text-xs text-ast_body/30 text-center py-8">No art history entries yet</p>
          )
        )}

        {/* INSPIRE ME */}
        {activeTab === "inspire-me" && (
          <div className="rounded-2xl border border-ast_lavender/20 bg-ast_lavender/5 px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender/60 mb-1">Discovery Mode</p>
            <p className="text-xs text-ast_body/50">Random inspiration coming soon.</p>
          </div>
        )}

      </div>
    </div>
  );
}
