import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeSupplyIds,
  buildSupplyToProjectIdsMap,
  deriveUsedInProjectIds,
  withDerivedUsedInProjectIds,
} from "./projectSupplyLinks.js";

test("normalizeSupplyIds normalizes to [] for missing, null, and malformed values", () => {
  assert.deepEqual(normalizeSupplyIds(undefined), []);
  assert.deepEqual(normalizeSupplyIds(null), []);
  assert.deepEqual(normalizeSupplyIds("not-an-array"), []);
  assert.deepEqual(normalizeSupplyIds([null, 42, "", "  ", "supply-1"]), ["supply-1"]);
});

test("normalizeSupplyIds trims and dedupes without discarding valid ids", () => {
  assert.deepEqual(
    normalizeSupplyIds([" supply-1 ", "supply-2", "supply-1", "supply-3"]),
    ["supply-1", "supply-2", "supply-3"],
  );
});

test("deriveUsedInProjectIds finds every project whose supplyIds includes the supply", () => {
  const projects = [
    { id: "p1", supplyIds: ["s1", "s2"] },
    { id: "p2", supplyIds: ["s2"] },
    { id: "p3", supplyIds: [] },
  ];
  assert.deepEqual(deriveUsedInProjectIds(projects, "s2"), ["p1", "p2"]);
  assert.deepEqual(deriveUsedInProjectIds(projects, "s1"), ["p1"]);
  assert.deepEqual(deriveUsedInProjectIds(projects, "s-missing"), []);
});

test("deriveUsedInProjectIds tolerates malformed project.supplyIds", () => {
  const projects = [
    { id: "p1", supplyIds: null },
    { id: "p2", supplyIds: undefined },
    { id: "p3" },
    { id: "p4", supplyIds: ["s1"] },
  ];
  assert.deepEqual(deriveUsedInProjectIds(projects, "s1"), ["p4"]);
});

test("buildSupplyToProjectIdsMap groups every project per supply in one pass", () => {
  const projects = [
    { id: "p1", supplyIds: ["s1", "s2"] },
    { id: "p2", supplyIds: ["s2", "s3"] },
  ];
  const map = buildSupplyToProjectIdsMap(projects);
  assert.deepEqual(map.get("s1"), ["p1"]);
  assert.deepEqual(map.get("s2"), ["p1", "p2"]);
  assert.deepEqual(map.get("s3"), ["p2"]);
  assert.equal(map.get("s-missing"), undefined);
});

test("withDerivedUsedInProjectIds overwrites any stale per-supply field with the fresh derivation", () => {
  const sessionSupplies = [
    { id: "s1", name: "Easel", usedInProjectIds: ["stale-project-id"] },
    { id: "s2", name: "Brush" },
  ];
  const sessionProjects = [
    { id: "p1", title: "Roses", supplyIds: ["s1"] },
  ];
  const result = withDerivedUsedInProjectIds(sessionSupplies, sessionProjects);
  assert.deepEqual(result[0].usedInProjectIds, ["p1"]);
  assert.deepEqual(result[1].usedInProjectIds, []);
  // Original supply objects are untouched (new objects returned).
  assert.deepEqual(sessionSupplies[0].usedInProjectIds, ["stale-project-id"]);
});

test("withDerivedUsedInProjectIds recomputes correctly after a project deletion (no separate supply-side cleanup needed)", () => {
  const sessionSupplies = [{ id: "s1", name: "Easel" }];
  const beforeDelete = withDerivedUsedInProjectIds(sessionSupplies, [{ id: "p1", supplyIds: ["s1"] }]);
  assert.deepEqual(beforeDelete[0].usedInProjectIds, ["p1"]);

  const afterDelete = withDerivedUsedInProjectIds(sessionSupplies, []);
  assert.deepEqual(afterDelete[0].usedInProjectIds, []);
});
