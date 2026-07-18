import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveQuantityValue,
  validateSupplyCreateInput,
  validateSupplyUpdateInput,
} from "./validation.ts";

test("accepts arbitrary artist-defined terminology without canonicalizing it", () => {
  const result = validateSupplyCreateInput({
    name: "  Floor loom #2  ",
    category: "  Fiber studio equipment  ",
    subcategory: "  Looms I maintain myself  ",
    itemType: "  8-shaft countermarch loom  ",
    unit: "  working loom  ",
    barcode: "  STUDIO:LOOM/A-02  ",
    tags: ["  weaving  ", "studio-built", "weaving", "Weaving"],
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value, {
    name: "Floor loom #2",
    category: "Fiber studio equipment",
    subcategory: "Looms I maintain myself",
    itemType: "8-shaft countermarch loom",
    unit: "working loom",
    barcode: "STUDIO:LOOM/A-02",
    tags: ["weaving", "studio-built", "Weaving"],
    quantityValue: undefined,
    location: undefined,
    notes: undefined,
    imageKey: undefined,
  });
});

test("accepts fractional and zero quantities", () => {
  for (const quantityValue of [0, 0.125, 2.75, 1000.5]) {
    const result = validateSupplyCreateInput({ name: "User-defined item", quantityValue });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.quantityValue, quantityValue);
  }
});

test("rejects negative and non-finite quantities without requiring integers", () => {
  for (const quantityValue of [-0.01, Number.NaN, Number.POSITIVE_INFINITY]) {
    const result = validateSupplyCreateInput({ name: "Item", quantityValue });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.issues[0]?.field, "quantityValue");
  }
});

test("preserves explicit nulls in updates so optional values can be cleared", () => {
  const result = validateSupplyUpdateInput({
    id: "supply-1",
    category: null,
    tags: null,
    quantityValue: null,
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.value, {
    id: "supply-1",
    category: null,
    tags: null,
    quantityValue: null,
  });
});

test("uses legacy integer quantity only when quantityValue is absent", () => {
  assert.equal(resolveQuantityValue(1.25, 7), 1.25);
  assert.equal(resolveQuantityValue(0, 7), 0);
  assert.equal(resolveQuantityValue(null, 7), 7);
  assert.equal(resolveQuantityValue(undefined, null), null);
});

