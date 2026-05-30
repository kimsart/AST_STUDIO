import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getTodayInArtHistory, getQuoteOfTheDay, allEntries } from "../data/inspirationFeed/index.js";

// ── Shared sub-components ──────────────────────────────────────────────────

function TagList({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tags.map(tag => (
        <span key={tag} className="text-[9px] uppercase tracking-wide bg-ast_lavender/10 text-ast_faint px-2 py-0.5 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  );
}

function Attribution({ entry }) {
  return (
    <div className="mt-3 space-y-0.5">
      <p className="text-[10px] text-ast_muted">
        <span className="font-medium text-ast_body/70">{entry.artwork_title}</span>
        {entry.year && <span className="text-ast_faint"> ({entry.year})</span>}
        {entry.artist_name && <span className="text-ast_faint"> · {entry.artist_name}</span>}
      </p>
      {entry.source_name && (
        entry.source_url ? (
          <a
            href={entry.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-ast_turquoise/70 hover:text-ast_turquoise transition underline underline-offset-2"
          >
            {entry.source_name}
          </a>
        ) : (
          <p className="text-[9px] text-ast_faint">{entry.source_name}</p>
        )
      )}
      {entry.rights_note && (
        <p className="text-[8px] text-ast_faint/50 leading-snug mt-1">{entry.rights_note}</p>
      )}
    </div>
  );
}

// ── Feed card types ────────────────────────────────────────────────────────

function ArtHistoryCard({ entry, highlight = false }) {
  return (
    <div className={`rounded-2xl bg-[#120724] overflow-hidden border transition ${
      highlight ? "border-ast_lavender/60 ring-1 ring-ast_lavender/25" : "border-ast_purple/40"
    }`}>
      {entry.image_url ? (
        <img
          src={entry.image_url}
          alt={entry.image_alt_text ?? ""}
          className="ast-img-safe w-full h-52 object-cover object-top"
        />
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-ast_purple/25 via-ast_lavender/10 to-transparent" />
      )}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ast_lavender mb-2">Today in Art History</p>
        <h3 className="text-base font-bold text-ast_body mb-2 leading-snug">{entry.title}</h3>
        <p className="text-sm text-ast_body/75 leading-relaxed">{entry.body_text}</p>
        <Attribution entry={entry} />
        <TagList tags={entry.tags} />
      </div>
    </div>
  );
}

function QuoteCard({ entry, highlight = false }) {
  return (
    <div className={`rounded-2xl bg-[#120724] overflow-hidden border transition ${
      highlight ? "border-ast_turquoise/60 ring-1 ring-ast_turquoise/25" : "border-ast_turquoise/30"
    }`}>
      {entry.image_url ? (
        <img
          src={entry.image_url}
          alt={entry.image_alt_text ?? ""}
          className="ast-img-safe w-full h-44 object-cover object-top"
        />
      ) : (
        <div className="w-full h-20 bg-gradient-to-br from-ast_turquoise/20 via-ast_cyan/10 to-transparent" />
      )}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ast_turquoise mb-3">Artist Quote of the Day</p>
        <h3 className="text-sm font-semibold text-ast_body/80 mb-3 leading-snug">{entry.title}</h3>
        <blockquote className="text-base font-medium text-ast_body leading-relaxed italic border-l-2 border-ast_turquoise/50 pl-4">
          &ldquo;{entry.body_text}&rdquo;
        </blockquote>
        <p className="mt-2 text-xs text-ast_muted">— {entry.artist_name}</p>
        <Attribution entry={entry} />
        <TagList tags={entry.tags} />
      </div>
    </div>
  );
}

function FeaturedArtistCard({ highlight = false }) {
  return (
    <div className={`rounded-2xl bg-[#120724] overflow-hidden border transition ${
      highlight ? "border-ast_purple/60 ring-1 ring-ast_purple/30" : "border-ast_purple/25"
    }`}>
      <div className="h-24 bg-gradient-to-br from-ast_purple via-ast_pink/60 to-ast_turquoise opacity-75" />
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ast_faint mb-2">Featured Artist</p>
        <h3 className="font-bold text-ast_turquoise text-sm mb-1">Maya Chen</h3>
        <p className="text-xs text-ast_body/65 mb-3 leading-relaxed">
          Contemporary watercolor artist exploring botanical themes and the intersection of scientific illustration and fine art.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[9px] bg-ast_turquoise/20 text-ast_turquoise px-2 py-0.5 rounded-full">Watercolor</span>
          <span className="text-[9px] bg-ast_lavender/20 text-ast_lavender px-2 py-0.5 rounded-full">Botanical</span>
          <span className="text-[9px] bg-ast_lavender/10 text-ast_faint px-2 py-0.5 rounded-full">Featured</span>
        </div>
        <button className="mt-3 text-xs text-ast_turquoise/70 hover:text-ast_turquoise transition">
          View Profile →
        </button>
      </div>
    </div>
  );
}

function PartnerCard({ highlight = false }) {
  return (
    <div className={`rounded-2xl bg-[#120724] px-5 py-4 border transition ${
      highlight ? "border-ast_blue/50 ring-1 ring-ast_blue/20" : "border-ast_blue/20"
    }`}>
      <p className="text-[10px] uppercase tracking-[0.3em] text-ast_lavender mb-2">Partners</p>
      <p className="text-sm font-semibold text-[#8D5CFF] mb-1">Retailer & Manufacturer Picks</p>
      <p className="text-xs text-ast_body/55 leading-relaxed">Product demos, supply deals, and partner inspiration live here.</p>
    </div>
  );
}

function PlaceholderCard({ label, color = "ast_lavender" }) {
  return (
    <div className="rounded-2xl border border-ast_lavender/15 bg-[#120724] px-5 py-4">
      <p className={`text-[10px] uppercase tracking-[0.3em] text-${color} mb-1`}>{label}</p>
      <p className="text-sm text-ast_body/30">Coming soon.</p>
    </div>
  );
}

// ── Main workspace ─────────────────────────────────────────────────────────

const TABS = [
  { id: "today",       label: "Today"       },
  { id: "art-history", label: "Art History"  },
  { id: "inspire-me",  label: "Inspire Me"   },
];

export default function InspirationWorkspace() {
  const location = useLocation();
  const focusSection = location.state?.section ?? null;
  const focusTag     = location.state?.tag ?? null;

  const [activeTab, setActiveTab] = useState("today");

  const artHistory    = getTodayInArtHistory();
  const quote         = getQuoteOfTheDay();
  const artHistoryAll = allEntries.filter(e => e.type === "art_history");

  const tagMatches = focusTag
    ? allEntries.filter(e => e.tags?.some(t => t.toLowerCase() === focusTag.toLowerCase()))
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-ast_lavender">Inspiration</p>
        <h2 className="mt-1 text-2xl font-bold text-ast_body">Feed</h2>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex gap-1.5 mb-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-left space-y-4 pr-1 pb-2">

        {/* Tag filter notice */}
        {focusTag && (
          <div className="rounded-xl border border-ast_lavender/20 bg-ast_lavender/5 px-4 py-2.5">
            <p className="text-xs text-ast_lavender/80">
              {tagMatches.length > 0
                ? `${tagMatches.length} result${tagMatches.length !== 1 ? "s" : ""} for "${focusTag}"`
                : `No entries yet for "${focusTag}" — showing full feed`}
            </p>
          </div>
        )}

        {/* TODAY */}
        {activeTab === "today" && (
          <>
            {artHistory
              ? <ArtHistoryCard entry={artHistory} highlight={focusSection === "art-history-today"} />
              : <PlaceholderCard label="Today in Art History" />}
            {quote
              ? <QuoteCard entry={quote} highlight={focusSection === "quote"} />
              : <PlaceholderCard label="Artist Quote of the Day" color="ast_turquoise" />}
            <FeaturedArtistCard highlight={focusSection === "featured-artist"} />
            <PlaceholderCard label="Technique of the Week" color="ast_cyan" />
            <PartnerCard highlight={focusSection === "partner"} />
          </>
        )}

        {/* ART HISTORY */}
        {activeTab === "art-history" && (
          artHistoryAll.length > 0
            ? artHistoryAll.map(e => <ArtHistoryCard key={e.date} entry={e} />)
            : <PlaceholderCard label="No art history entries yet" />
        )}

        {/* INSPIRE ME — defaults to today's content for beta */}
        {activeTab === "inspire-me" && (
          <>
            <div className="rounded-xl border border-ast_lavender/20 bg-ast_lavender/5 px-4 py-2.5">
              <p className="text-[10px] text-ast_lavender/60">
                Discovery mode · Random inspiration coming soon — showing today's featured content
              </p>
            </div>
            {artHistory && <ArtHistoryCard entry={artHistory} />}
            {quote && <QuoteCard entry={quote} />}
          </>
        )}

      </div>
    </div>
  );
}
