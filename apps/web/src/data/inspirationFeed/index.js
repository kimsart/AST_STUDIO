// Inspiration feed loader.
// To add a new month: import the JSON and add it to allMonths.
// When switching to an API, replace getClosestEntry() — component is untouched.

import may2026  from '../inspiration/may.json';
import june2026 from '../inspiration/june.json';
import july2026 from '../inspiration/july.json';

const allMonths = [may2026, june2026, july2026];
export const allEntries = allMonths.flatMap(m => m.entries);

// Returns the most recent past entry of the given type; falls back to soonest future entry.
export function getClosestEntry(type) {
  const today = new Date().toISOString().split('T')[0];
  const typed = allEntries.filter(e => e.type === type);
  if (typed.length === 0) return null;

  const past = typed.filter(e => e.date <= today).sort((a, b) => b.date.localeCompare(a.date));
  if (past.length > 0) return past[0];

  return typed.sort((a, b) => a.date.localeCompare(b.date))[0];
}

export const getTodayInArtHistory = () => getClosestEntry('art_history');
export const getQuoteOfTheDay    = () => getClosestEntry('artist_quote');
