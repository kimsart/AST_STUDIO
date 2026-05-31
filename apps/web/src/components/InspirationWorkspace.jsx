import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getTodayInArtHistory, allEntries } from "../data/inspirationFeed/index.js";
import kevinPortrait   from "../assets/studiospotlight/kevinlewis/portrait-01.jpg";
import kevinArtwork01  from "../assets/studiospotlight/kevinlewis/artwork-01.jpg";
import kevinArtwork02  from "../assets/studiospotlight/kevinlewis/artwork-02.jpg";
import kevinArtwork03  from "../assets/studiospotlight/kevinlewis/artwork-03.jpg";
import kevinArtwork04  from "../assets/studiospotlight/kevinlewis/artwork-04.jpg";
import kevinStudio     from "../assets/studiospotlight/kevinlewis/studio-01.jpeg";

// ── Static spotlight data ──────────────────────────────────────────────────

const SPOTLIGHT_ENTRIES = [
  {
    id: "kevin-lewis",
    name: "Kevin Lewis",
    handle: "@kevinlewisart",
    studio: "Kevin Lewis Studio",
    bio: "Kevin Lewis is a San Diego artist whose work is vivid, intense, and sometimes frightening. His imagery carries forward the ideas, moods, and theatrical instincts he developed while working in makeup and costume design on horror movie sets.",
    tags: ["Mixed Media", "Textile", "Spotlight"],
    tagColors: [
      "text-ast_pink bg-ast_pink/20",
      "text-ast_purple bg-ast_purple/20",
      "text-ast_turquoise bg-ast_turquoise/20",
    ],
    profileUrl: kevinPortrait,
    gallery: [
      { url: kevinArtwork01, alt: "Kevin Lewis — artwork 1" },
      { url: kevinArtwork02, alt: "Kevin Lewis — artwork 2" },
      { url: kevinArtwork03, alt: "Kevin Lewis — artwork 3" },
      { url: kevinArtwork04, alt: "Kevin Lewis — artwork 4" },
      { url: kevinStudio,    alt: "Kevin Lewis's studio" },
    ],
    rightsNote: "Artwork by Kevin Lewis. Used with artist permission.",
  },
  {
    id: "kim-wyatt",
    name: "Kim Wyatt",
    handle: "@kims_studio_labs",
    studio: "Kim Wyatt Studio Art Labs",
    bio: "Artist and founder behind AST Studio. Kim Wyatt Studio Art Labs is the real-world studio practice this app was built to support.",
    tags: ["Founder", "Studio Artist", "Beta"],
    tagColors: ["text-ast_turquoise bg-ast_turquoise/20", "text-ast_lavender bg-ast_lavender/20", "text-ast_faint bg-ast_lavender/10"],
    website: "https://www.kimwyatt.art/",
    websiteLabel: "kimwyatt.art",
    profileUrl: "https://static.wixstatic.com/media/0669c1_dccdd785631943a59238f81b9520c5e0~mv2.jpg",
    gallery: [
      {
        url: "https://static.wixstatic.com/media/0669c1_26396aee2e914839814b379e8efd0070~mv2.jpg/v1/fill/w_460,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Liberty%20With%20Mask%20by%20Kim%20Wyatt.jpg",
        alt: "Liberty With Mask by Kim Wyatt",
      },
    ],
    rightsNote: "Artwork by Kim Wyatt. Used with artist permission for Art Supply Tracker beta testing.",
  },
];

const SPOTLIGHT_MIN_SLOTS = 2;
const SPOTLIGHT_CTA_LABELS = ["Request to be featured", "Share your studio"];

// ── Shared sub-components ──────────────────────────────────────────────────

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

// ── Safe image (hides broken icon, shows fallback on error) ───────────────

function SafeImage({ src, alt, className, style, fallback = null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback;
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

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
        <SafeImage
          src={imageUrl}
          alt={imageAlt}
          className="ast-img-safe shrink-0 w-14 rounded-xl object-contain object-center bg-transparent"
          style={{ maxHeight: "3.5rem" }}
          fallback={
            <div className="shrink-0 w-14 rounded-xl bg-gradient-to-br from-ast_purple/20 via-ast_lavender/15 to-ast_blue/20" style={{ height: "3.5rem" }} />
          }
        />
      </div>
    </button>
  );
}

function SpotlightCard({ entry, selected, onSelect }) {
  return (
    <div
      className={`p-1 rounded-2xl bg-gradient-to-br transition ${
        selected
          ? "from-ast_electric_blue via-ast_purple to-ast_pink"
          : "from-ast_electric_blue/70 via-ast_purple/70 to-ast_pink/60 hover:from-ast_electric_blue/90 hover:via-ast_purple/90 hover:to-ast_pink/80"
      }`}
    >
      <button
        onClick={onSelect}
        className="w-full aspect-square rounded-[12px] bg-[#120724] overflow-hidden relative block"
      >
        <SafeImage
          src={entry.profileUrl}
          alt={entry.name}
          className="ast-img-safe block w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-ast_electric_blue/20 via-ast_purple/20 to-ast_pink/15" />
          }
        />
        <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 bg-gradient-to-t from-black/65 to-transparent">
          <p className="text-[10px] font-bold text-white/90 leading-tight truncate">{entry.name}</p>
        </div>
      </button>
    </div>
  );
}

function SpotlightCTACard({ label }) {
  return (
    <div className="w-full aspect-square rounded-2xl border border-dashed border-ast_purple/20 bg-transparent flex items-center justify-center">
      <p className="text-[11px] text-ast_body/30 text-center leading-snug px-3">{label}</p>
    </div>
  );
}

function QuotePreviewCard({ entry, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full aspect-square rounded-2xl overflow-hidden transition border-2 ${
        selected
          ? "border-ast_turquoise/60"
          : "border-transparent hover:border-ast_turquoise/25"
      }`}
    >
      <SafeImage
        src={entry.image_url}
        alt={entry.artist_name ?? ""}
        className="ast-img-safe block w-full h-full object-cover"
        style={{ objectPosition: "center center" }}
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-ast_turquoise/25 via-ast_lavender/20 to-ast_purple/25" />
        }
      />
    </button>
  );
}

function QuotePlaceholderCard() {
  return (
    <div className="w-full aspect-square rounded-2xl border border-dashed border-ast_turquoise/15" />
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

function ArtHistoryDetail({ entry, onClose }) {
  return (
    <div className="rounded-2xl border border-ast_lavender/40 bg-[#0d0420] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender">Today in Art History</p>
        <CloseButton onClose={onClose} />
      </div>
      <SafeImage
        src={entry.image_url}
        alt={entry.image_alt_text}
        className="ast-img-safe w-full rounded-xl object-contain object-center mb-4"
        style={{ maxHeight: "11rem" }}
        fallback={
          <p className="text-[10px] text-ast_faint/60 italic mb-3 leading-snug">
            Image unavailable · rights protected — search the web to discover this artist's work.
          </p>
        }
      />
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
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-ast_body/80 mb-2 leading-snug">{entry.title}</h3>
          <blockquote className="text-xl font-medium italic leading-relaxed bg-gradient-to-r from-ast_lavender to-ast_turquoise bg-clip-text text-transparent">
            &ldquo;{entry.body_text}&rdquo;
          </blockquote>
          <p className="mt-2 text-xs text-ast_muted">— {entry.artist_name}</p>
        </div>
        <SafeImage
          src={entry.image_url}
          alt={entry.image_alt_text}
          className="ast-img-safe shrink-0 w-24 rounded-xl object-cover"
          style={{ maxHeight: "9rem", objectPosition: "center center" }}
        />
      </div>
      <Attribution entry={entry} />
      <TagList tags={entry.tags} />
    </div>
  );
}

function SpotlightDetail({ entry, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const gallery = entry.gallery ?? [];
  const active = gallery[activeIdx] ?? null;

  return (
    <div className="rounded-2xl border border-ast_purple/50 bg-[#0d0420] p-4 mt-3">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ast_faint">Studio Spotlight</p>
        <CloseButton onClose={onClose} />
      </div>

      {/* Main artwork */}
      {active && (
        <SafeImage
          src={active.url}
          alt={active.alt ?? entry.name}
          className="ast-img-safe w-full rounded-xl object-contain object-center mb-3"
          style={{ maxHeight: "16rem" }}
        />
      )}

      {/* Gallery thumbnail strip — shown only when > 1 image */}
      {gallery.length > 1 && (
        <div className="flex gap-2 mb-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-12 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                i === activeIdx
                  ? "border-ast_turquoise/60"
                  : "border-transparent hover:border-ast_purple/40"
              }`}
            >
              <SafeImage
                src={img.url}
                alt={img.alt ?? ""}
                className="ast-img-safe block w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Artist info */}
      <h3 className="font-bold text-ast_turquoise text-base leading-snug">{entry.name}</h3>
      <p className="text-[10px] text-ast_muted mt-0.5 mb-2">{entry.handle} · {entry.studio}</p>
      <p className="text-xs text-ast_body/65 mb-2 leading-relaxed">{entry.bio}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {entry.tags.map((tag, i) => (
          <span key={tag} className={`text-[9px] px-2 py-0.5 rounded-full ${entry.tagColors[i] ?? "text-ast_faint bg-ast_lavender/10"}`}>
            {tag}
          </span>
        ))}
      </div>
      {entry.website && (
        <a
          href={entry.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ast_turquoise/70 hover:text-ast_turquoise transition"
        >
          {entry.websiteLabel ?? entry.website} →
        </a>
      )}
      {entry.rightsNote && (
        <p className="mt-2 text-[8px] text-ast_faint/50 leading-snug">{entry.rightsNote}</p>
      )}
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

  const [activeTab, setActiveTab]     = useState("today");
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (focusSection) setSelectedCard(focusSection);
  }, [focusSection]);

  const artHistory    = getTodayInArtHistory();
  const artHistoryAll = allEntries.filter(e => e.type === "art_history");

  // Order quotes: most recent past first, then nearest future
  const today = new Date().toISOString().split('T')[0];
  const allQuotes = allEntries.filter(e => e.type === "artist_quote");
  const pastQuotes   = allQuotes.filter(e => e.date <= today).sort((a, b) => b.date.localeCompare(a.date));
  const futureQuotes = allQuotes.filter(e => e.date > today).sort((a, b) => a.date.localeCompare(b.date));
  const previewQuotes = [...pastQuotes, ...futureQuotes].slice(0, 4);

  const toggle = (id) => setSelectedCard(prev => prev === id ? null : id);

  const spotlightDetailRef = useRef(null);
  useEffect(() => {
    if (selectedCard?.startsWith("spotlight-")) {
      const timer = setTimeout(() => {
        spotlightDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [selectedCard]);

  const ctaNeeded = Math.max(0, SPOTLIGHT_MIN_SLOTS - SPOTLIGHT_ENTRIES.length);
  const ctaLabels = SPOTLIGHT_CTA_LABELS.slice(0, ctaNeeded);

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

        {/* TODAY */}
        {activeTab === "today" && (
          <>
            {/* 1. Quote preview row — 4 small cards */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-ast_turquoise mb-2.5 px-0.5">Artist Quotes</p>
              <div className="grid grid-cols-4 gap-2">
                {previewQuotes.map(entry => {
                  const id = `quote-${entry.date}`;
                  return (
                    <QuotePreviewCard
                      key={id}
                      entry={entry}
                      selected={selectedCard === id}
                      onSelect={() => toggle(id)}
                    />
                  );
                })}
                {Array.from({ length: Math.max(0, 4 - previewQuotes.length) }).map((_, i) => (
                  <QuotePlaceholderCard key={`qph-${i}`} />
                ))}
              </div>
              {previewQuotes.map(entry => {
                const id = `quote-${entry.date}`;
                return selectedCard === id ? (
                  <QuoteDetail key={id} entry={entry} onClose={() => setSelectedCard(null)} />
                ) : null;
              })}
            </div>

            {/* 2. Studio Spotlight grid */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ast_faint mb-2 px-0.5">Studio Spotlight</p>
              <div className="grid grid-cols-4 gap-2">
                {SPOTLIGHT_ENTRIES.map(entry => (
                  <SpotlightCard
                    key={entry.id}
                    entry={entry}
                    selected={selectedCard === `spotlight-${entry.id}`}
                    onSelect={() => toggle(`spotlight-${entry.id}`)}
                  />
                ))}
                {ctaLabels.map(label => (
                  <SpotlightCTACard key={label} label={label} />
                ))}
              </div>
              <div ref={spotlightDetailRef}>
                {SPOTLIGHT_ENTRIES.map(entry =>
                  selectedCard === `spotlight-${entry.id}` ? (
                    <SpotlightDetail key={entry.id} entry={entry} onClose={() => setSelectedCard(null)} />
                  ) : null
                )}
              </div>
            </div>

            {/* 3. Compact bottom row — Art History + Partners */}
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
              <PartnerCompactCard
                selected={selectedCard === "partner"}
                onSelect={() => toggle("partner")}
              />
            </div>
            {selectedCard === "art-history-today" && artHistory && (
              <ArtHistoryDetail entry={artHistory} onClose={() => setSelectedCard(null)} />
            )}
            {selectedCard === "partner" && (
              <PartnerDetail onClose={() => setSelectedCard(null)} />
            )}
          </>
        )}

        {/* ART HISTORY — full archive grid */}
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
