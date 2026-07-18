import assert from "node:assert/strict";
import test from "node:test";

import { parseFlexibleNumber, isValidFlexibleNumber } from "./numericInput.js";

test("parseFlexibleNumber parses plain integers and decimals", () => {
  assert.equal(parseFlexibleNumber("3"), 3);
  assert.equal(parseFlexibleNumber("1.5"), 1.5);
  assert.equal(parseFlexibleNumber("0.25"), 0.25);
  assert.equal(parseFlexibleNumber("  2  "), 2);
});

test("parseFlexibleNumber parses simple fractions", () => {
  assert.equal(parseFlexibleNumber("1/2"), 0.5);
  assert.equal(parseFlexibleNumber("3/4"), 0.75);
  assert.equal(parseFlexibleNumber("1 / 2"), 0.5);
});

test("parseFlexibleNumber returns null for empty input", () => {
  assert.equal(parseFlexibleNumber(""), null);
  assert.equal(parseFlexibleNumber("   "), null);
  assert.equal(parseFlexibleNumber(null), null);
  assert.equal(parseFlexibleNumber(undefined), null);
});

test("parseFlexibleNumber returns NaN for invalid input, including division by zero", () => {
  assert.ok(Number.isNaN(parseFlexibleNumber("abc")));
  assert.ok(Number.isNaN(parseFlexibleNumber("1/0")));
  assert.ok(Number.isNaN(parseFlexibleNumber("1//2")));
  assert.ok(Number.isNaN(parseFlexibleNumber("--5")));
});

test("isValidFlexibleNumber distinguishes empty, valid, and invalid input", () => {
  assert.equal(isValidFlexibleNumber(""), false);
  assert.equal(isValidFlexibleNumber("1/2"), true);
  assert.equal(isValidFlexibleNumber("1.5"), true);
  assert.equal(isValidFlexibleNumber("abc"), false);
});
