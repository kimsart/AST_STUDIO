import assert from "node:assert/strict";
import test from "node:test";

import { buildCategoryOptions, buildSubcategoryOptions } from "./supplyCategories.js";

test("buildCategoryOptions surfaces a previously-used custom category for reuse", () => {
  const supplies = [{ category: "Ceramics" }];
  const options = buildCategoryOptions(supplies).map((o) => o.value);
  assert.ok(options.includes("Ceramics"));
  // Custom category comes before the trailing "Other" catch-all.
  assert.equal(options[options.length - 1], "Other");
});

test("buildSubcategoryOptions returns preset subcategories for a known category", () => {
  const options = buildSubcategoryOptions("Paint", []);
  assert.ok(options.includes("Watercolor"));
  assert.ok(options.includes("Acrylic"));
});

test("buildSubcategoryOptions merges in a custom subcategory previously typed for that category", () => {
  const supplies = [{ category: "Paint", subcategory: "Egg tempera" }];
  const options = buildSubcategoryOptions("Paint", supplies);
  assert.ok(options.includes("Egg tempera"));
  assert.ok(options.includes("Watercolor"));
});

test("buildSubcategoryOptions works for a fully custom (non-preset) category, including with no prior subcategories", () => {
  assert.deepEqual(buildSubcategoryOptions("Ceramics", []), []);
  const supplies = [{ category: "Ceramics", subcategory: "Glaze" }];
  assert.deepEqual(buildSubcategoryOptions("Ceramics", supplies), ["Glaze"]);
});

test("buildSubcategoryOptions returns [] for the Other/empty category", () => {
  assert.deepEqual(buildSubcategoryOptions("Other", []), []);
  assert.deepEqual(buildSubcategoryOptions("", []), []);
  assert.deepEqual(buildSubcategoryOptions(null, []), []);
});

test("buildSubcategoryOptions ignores supplies from a different category", () => {
  const supplies = [{ category: "Paper", subcategory: "Bristol" }];
  assert.deepEqual(buildSubcategoryOptions("Ceramics", supplies), []);
});
