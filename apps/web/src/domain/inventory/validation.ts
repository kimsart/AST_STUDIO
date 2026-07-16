import type {
  SupplyCreateInput,
  SupplyUpdateInput,
} from "./types.ts";

export type SupplyValidationField =
  | "id"
  | "name"
  | "category"
  | "subcategory"
  | "itemType"
  | "unit"
  | "barcode"
  | "tags"
  | "quantityValue"
  | "location"
  | "notes"
  | "imageKey";

export interface SupplyValidationIssue {
  field: SupplyValidationField;
  code: "required" | "too_long" | "invalid_number" | "too_many";
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: SupplyValidationIssue[] };

const LIMITS = {
  id: 128,
  name: 200,
  terminology: 200,
  barcode: 200,
  tag: 100,
  tags: 100,
  location: 500,
  notes: 10_000,
  imageKey: 1_024,
} as const;

function normalizeRequiredString(
  value: string,
  field: "id" | "name",
  maxLength: number,
  issues: SupplyValidationIssue[],
): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    issues.push({ field, code: "required", message: `${field} is required.` });
  } else if (normalized.length > maxLength) {
    issues.push({ field, code: "too_long", message: `${field} must be ${maxLength} characters or fewer.` });
  }
  return normalized;
}

function normalizeOptionalString(
  value: string | null | undefined,
  field: Exclude<SupplyValidationField, "id" | "name" | "tags" | "quantityValue">,
  maxLength: number,
  issues: SupplyValidationIssue[],
): string | null | undefined {
  if (value === null || value === undefined) return value;
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    issues.push({ field, code: "too_long", message: `${field} must be ${maxLength} characters or fewer.` });
  }
  return normalized || undefined;
}

function normalizeTags(
  tags: readonly string[] | null | undefined,
  issues: SupplyValidationIssue[],
): string[] | null | undefined {
  if (tags == null) return tags as null | undefined;
  if (tags.length > LIMITS.tags) {
    issues.push({ field: "tags", code: "too_many", message: `tags must contain ${LIMITS.tags} values or fewer.` });
  }

  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const tag of tags) {
    const value = typeof tag === "string" ? tag.trim() : "";
    if (!value) continue;
    if (value.length > LIMITS.tag) {
      issues.push({ field: "tags", code: "too_long", message: `each tag must be ${LIMITS.tag} characters or fewer.` });
      continue;
    }
    // Exact-value deduplication only: user spelling and case remain authoritative.
    if (!seen.has(value)) {
      seen.add(value);
      normalized.push(value);
    }
  }
  return normalized;
}

function normalizeQuantity(
  value: number | null | undefined,
  issues: SupplyValidationIssue[],
): number | null | undefined {
  if (value === null || value === undefined) return value;
  if (!Number.isFinite(value) || value < 0) {
    issues.push({
      field: "quantityValue",
      code: "invalid_number",
      message: "quantityValue must be a finite, non-negative number.",
    });
  }
  return value;
}

export function validateSupplyCreateInput(
  input: SupplyCreateInput,
): ValidationResult<SupplyCreateInput> {
  const issues: SupplyValidationIssue[] = [];
  const value: SupplyCreateInput = {
    name: normalizeRequiredString(input.name, "name", LIMITS.name, issues),
    category: normalizeOptionalString(input.category, "category", LIMITS.terminology, issues) ?? undefined,
    subcategory: normalizeOptionalString(input.subcategory, "subcategory", LIMITS.terminology, issues) ?? undefined,
    itemType: normalizeOptionalString(input.itemType, "itemType", LIMITS.terminology, issues) ?? undefined,
    unit: normalizeOptionalString(input.unit, "unit", LIMITS.terminology, issues) ?? undefined,
    barcode: normalizeOptionalString(input.barcode, "barcode", LIMITS.barcode, issues) ?? undefined,
    tags: normalizeTags(input.tags, issues) ?? undefined,
    quantityValue: normalizeQuantity(input.quantityValue, issues),
    location: normalizeOptionalString(input.location, "location", LIMITS.location, issues) ?? undefined,
    notes: normalizeOptionalString(input.notes, "notes", LIMITS.notes, issues) ?? undefined,
    imageKey: normalizeOptionalString(input.imageKey, "imageKey", LIMITS.imageKey, issues) ?? undefined,
  };

  return issues.length ? { ok: false, issues } : { ok: true, value };
}

export function validateSupplyUpdateInput(
  input: SupplyUpdateInput,
): ValidationResult<SupplyUpdateInput> {
  const issues: SupplyValidationIssue[] = [];
  const value: SupplyUpdateInput = {
    id: normalizeRequiredString(input.id, "id", LIMITS.id, issues),
  };

  if ("name" in input) value.name = normalizeRequiredString(input.name ?? "", "name", LIMITS.name, issues);
  if ("category" in input) value.category = normalizeOptionalString(input.category, "category", LIMITS.terminology, issues) ?? null;
  if ("subcategory" in input) value.subcategory = normalizeOptionalString(input.subcategory, "subcategory", LIMITS.terminology, issues) ?? null;
  if ("itemType" in input) value.itemType = normalizeOptionalString(input.itemType, "itemType", LIMITS.terminology, issues) ?? null;
  if ("unit" in input) value.unit = normalizeOptionalString(input.unit, "unit", LIMITS.terminology, issues) ?? null;
  if ("barcode" in input) value.barcode = normalizeOptionalString(input.barcode, "barcode", LIMITS.barcode, issues) ?? null;
  if ("tags" in input) value.tags = normalizeTags(input.tags, issues) ?? null;
  if ("quantityValue" in input) value.quantityValue = normalizeQuantity(input.quantityValue, issues) ?? null;
  if ("location" in input) value.location = normalizeOptionalString(input.location, "location", LIMITS.location, issues) ?? null;
  if ("notes" in input) value.notes = normalizeOptionalString(input.notes, "notes", LIMITS.notes, issues) ?? null;
  if ("imageKey" in input) value.imageKey = normalizeOptionalString(input.imageKey, "imageKey", LIMITS.imageKey, issues) ?? null;

  return issues.length ? { ok: false, issues } : { ok: true, value };
}

/** Read compatibility during the additive quantity migration. */
export function resolveQuantityValue(
  quantityValue: number | null | undefined,
  legacyQuantity: number | null | undefined,
): number | null {
  return quantityValue ?? legacyQuantity ?? null;
}
