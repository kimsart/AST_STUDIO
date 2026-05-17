import { mockProjects, mockSupplies } from '../data/mockData.js';

const KEYS = {
  projects: 'ast_projects',
  supplies: 'ast_supplies',
};

export function loadProjects() {
  try {
    const raw = localStorage.getItem(KEYS.projects);
    if (raw === null) return mockProjects;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[localStorage] Failed to parse ast_projects:', e);
    return mockProjects;
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
    if (raw === null) return mockSupplies;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[localStorage] Failed to parse ast_supplies:', e);
    return mockSupplies;
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
