import { mockProjects, mockSupplies } from '../data/mockData.js';

export function normalizeProject(p) {
  return { ...p, supplyIds: Array.isArray(p.supplyIds) ? p.supplyIds : [] };
}

export function normalizeSupply(s) {
  return { ...s, usedInProjectIds: Array.isArray(s.usedInProjectIds) ? s.usedInProjectIds : [] };
}

export function validateImportedData(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    Array.isArray(data.projects) &&
    Array.isArray(data.supplies)
  );
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
