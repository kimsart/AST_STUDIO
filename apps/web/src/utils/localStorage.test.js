import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeProject,
  normalizeSupply,
  validateImportedData,
  cleanImportedLinks,
} from "./localStorage.js";

test("normalizeProject preserves valid supplyIds and normalizes malformed entries to []", () => {
  assert.deepEqual(normalizeProject({ id: "p1", supplyIds: ["s1", "s2"] }).supplyIds, ["s1", "s2"]);
  assert.deepEqual(normalizeProject({ id: "p1", supplyIds: null }).supplyIds, []);
  assert.deepEqual(normalizeProject({ id: "p1" }).supplyIds, []);
  assert.deepEqual(normalizeProject({ id: "p1", supplyIds: [null, "s1", 42] }).supplyIds, ["s1"]);
});

test("normalizeProject does not throw on a null or non-object entry (regression: import crash)", () => {
  assert.doesNotThrow(() => normalizeProject(null));
  assert.doesNotThrow(() => normalizeProject(undefined));
  assert.doesNotThrow(() => normalizeProject("not-an-object"));
  assert.deepEqual(normalizeProject(null).supplyIds, []);
});

test("normalizeSupply does not throw on a null entry (regression: 'Cannot read properties of null')", () => {
  assert.doesNotThrow(() => normalizeSupply(null));
  assert.doesNotThrow(() => normalizeSupply(undefined));
  const result = normalizeSupply(null);
  assert.deepEqual(result.usedInProjectIds, []);
  assert.equal(result.subcategory, "");
});

test("normalizeSupply preserves a valid subcategory and defaults a malformed one", () => {
  assert.equal(normalizeSupply({ subcategory: "Watercolor" }).subcategory, "Watercolor");
  assert.equal(normalizeSupply({ subcategory: 42 }).subcategory, "");
  assert.equal(normalizeSupply({}).subcategory, "");
});

test("validateImportedData rejects null/non-object entries inside the projects or supplies arrays", () => {
  assert.equal(validateImportedData({ projects: [null], supplies: [] }), false);
  assert.equal(validateImportedData({ projects: [], supplies: [null] }), false);
  assert.equal(validateImportedData({ projects: ["not-an-object"], supplies: [] }), false);
  assert.equal(validateImportedData({ projects: [{ id: "p1" }], supplies: [{ id: "s1" }] }), true);
});

test("validateImportedData still rejects the existing missing-array cases", () => {
  assert.equal(validateImportedData(null), false);
  assert.equal(validateImportedData({}), false);
  assert.equal(validateImportedData({ projects: [] }), false);
});

test("cleanImportedLinks strips dangling references without touching valid ones", () => {
  const projects = [normalizeProject({ id: "p1", supplyIds: ["s1", "s-missing"] })];
  const supplies = [normalizeSupply({ id: "s1", usedInProjectIds: ["p1", "p-missing"] })];
  const { projects: cleanedProjects, supplies: cleanedSupplies } = cleanImportedLinks(projects, supplies);
  assert.deepEqual(cleanedProjects[0].supplyIds, ["s1"]);
  assert.deepEqual(cleanedSupplies[0].usedInProjectIds, ["p1"]);
});
