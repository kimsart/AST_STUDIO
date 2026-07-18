/**
 * Flexible numeric parsing for artist-facing quantity/budget fields.
 * Supports plain integers/decimals ("3", "1.5", "0.25") and simple
 * fractions ("1/2", "3/4"). Does not canonicalize input beyond parsing it
 * to a number — the raw string the artist typed is never rewritten for them.
 */

const FRACTION_PATTERN = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/;

/**
 * Returns:
 *  - null when the input is empty/blank (nothing entered)
 *  - a finite number when the input parses successfully
 *  - NaN when the input is non-empty but not a valid number or fraction
 */
export function parseFlexibleNumber(input) {
  if (input === null || input === undefined) return null;
  const trimmed = String(input).trim();
  if (trimmed === "") return null;

  const fractionMatch = trimmed.match(FRACTION_PATTERN);
  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return NaN;
    }
    return numerator / denominator;
  }

  const value = Number(trimmed);
  return Number.isFinite(value) ? value : NaN;
}

export function isValidFlexibleNumber(input) {
  const parsed = parseFlexibleNumber(input);
  return parsed !== null && !Number.isNaN(parsed);
}
