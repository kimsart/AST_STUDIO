import { mockProjects, mockSupplies } from '../data/mockData.js';
import { normalizeSupplyIds } from './projectSupplyLinks.js';

// Malformed/missing/legacy input never throws here — it normalizes to safe
// defaults instead, so a bad entry (e.g. a null in an imported array) can't
// crash the app with "Cannot read properties of null".
export function normalizeProject(p) {
  const base = (p && typeof p === "object") ? p : {};
  // Migrate old single imageDataUrl field to images array
  let images = Array.isArray(base.images) ? base.images.filter(Boolean) : [];
  if (images.length === 0 && base.imageDataUrl) images = [base.imageDataUrl];
  return {
    ...base,
    supplyIds: normalizeSupplyIds(base.supplyIds),
    images,
  };
}

export function normalizeSupply(s) {
  const base = (s && typeof s === "object") ? s : {};
  return {
    ...base,
    // usedInProjectIds is UI-derived (see utils/projectSupplyLinks.js) — kept
    // here only so any legacy/imported value doesn't leak through untouched.
    usedInProjectIds: Array.isArray(base.usedInProjectIds) ? base.usedInProjectIds : [],
    subcategory: typeof base.subcategory === "string" ? base.subcategory : "",
  };
}

export function validateImportedData(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray(data.projects) &&
    Array.isArray(data.supplies) &&
    data.projects.every((p) => p !== null && typeof p === 'object') &&
    data.supplies.every((s) => s !== null && typeof s === 'object')
  );
}

export function cleanImportedLinks(projects, supplies) {
  const supplyIdSet = new Set(supplies.map(s => s.id));
  const projectIdSet = new Set(projects.map(p => p.id));
  let removed = 0;

  const cleanedProjects = projects.map(p => {
    const valid = p.supplyIds.filter(id => supplyIdSet.has(id));
    removed += p.supplyIds.length - valid.length;
    return valid.length === p.supplyIds.length ? p : { ...p, supplyIds: valid };
  });

  const cleanedSupplies = supplies.map(s => {
    const valid = s.usedInProjectIds.filter(id => projectIdSet.has(id));
    removed += s.usedInProjectIds.length - valid.length;
    return valid.length === s.usedInProjectIds.length ? s : { ...s, usedInProjectIds: valid };
  });

  if (removed > 0) {
    console.warn(`[AST Studio] Import removed ${removed} broken link reference(s).`);
  }
  return { projects: cleanedProjects, supplies: cleanedSupplies };
}

const KEYS = {
  projects: 'ast_projects',
  supplies: 'ast_supplies',
};

export function loadProjects() {
  try {
    const raw = localStorage.getItem(KEYS.projects);
    if (raw === null) return mockProjects.map(normalizeProject);
    return JSON.parse(raw).map(normalizeProject);
  } catch (e) {
    console.warn('[localStorage] Failed to parse ast_projects:', e);
    return mockProjects.map(normalizeProject);
  }
}

export function saveProjects(projects) {
  if (!Array.isArray(projects)) return;
  try {
    localStorage.setItem(KEYS.projects, JSON.stringify(projects));
  } catch (e) {
    console.warn('[localStorage] Failed to save ast_projects:', e);
  }
}

export function loadSupplies() {
  try {
    const raw = localStorage.getItem(KEYS.supplies);
    if (raw === null) return mockSupplies.map(normalizeSupply);
    return JSON.parse(raw).map(normalizeSupply);
  } catch (e) {
    console.warn('[localStorage] Failed to parse ast_supplies:', e);
    return mockSupplies.map(normalizeSupply);
  }
}

export function saveSupplies(supplies) {
  if (!Array.isArray(supplies)) return;
  try {
    localStorage.setItem(KEYS.supplies, JSON.stringify(supplies));
  } catch (e) {
    console.warn('[localStorage] Failed to save ast_supplies:', e);
  }
}
