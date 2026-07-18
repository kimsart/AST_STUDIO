/**
 * Project.supplyIds is the single persisted source of truth for the
 * supply<->project relationship. Supply.usedInProjectIds is never stored —
 * it is always derived from the current Project collection so there is
 * exactly one relationship truth, not two independently maintained arrays.
 */

export function normalizeSupplyIds(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

export function buildSupplyToProjectIdsMap(sessionProjects) {
  const map = new Map();
  if (!Array.isArray(sessionProjects)) return map;
  for (const project of sessionProjects) {
    if (!project || typeof project !== "object") continue;
    const supplyIds = normalizeSupplyIds(project.supplyIds);
    for (const supplyId of supplyIds) {
      if (!map.has(supplyId)) map.set(supplyId, []);
      map.get(supplyId).push(project.id);
    }
  }
  return map;
}

export function deriveUsedInProjectIds(sessionProjects, supplyId) {
  if (!supplyId) return [];
  return buildSupplyToProjectIdsMap(sessionProjects).get(supplyId) ?? [];
}

/** Returns sessionSupplies with a freshly-derived usedInProjectIds on every item. */
export function withDerivedUsedInProjectIds(sessionSupplies, sessionProjects) {
  const map = buildSupplyToProjectIdsMap(sessionProjects);
  return (Array.isArray(sessionSupplies) ? sessionSupplies : []).map((supply) => ({
    ...supply,
    usedInProjectIds: map.get(supply?.id) ?? [],
  }));
}
