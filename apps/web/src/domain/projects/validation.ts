import type { ProjectCreateInput, ProjectUpdateInput } from "./types.ts";

export type ProjectValidationField =
  | "id"
  | "title"
  | "description"
  | "status"
  | "notes"
  | "coverImageUrl"
  | "imageKeys";

export interface ProjectValidationIssue {
  field: ProjectValidationField;
  code: "required" | "too_long" | "too_many" | "empty_path";
  message: string;
}

export type ProjectValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: ProjectValidationIssue[] };

function required(value: string, field: "id" | "title", issues: ProjectValidationIssue[]): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) issues.push({ field, code: "required", message: `${field} is required.` });
  if (normalized.length > 200) issues.push({ field, code: "too_long", message: `${field} is too long.` });
  return normalized;
}

function optional(
  value: string | null | undefined,
  field: Exclude<ProjectValidationField, "id" | "title" | "imageKeys">,
  max: number,
  issues: ProjectValidationIssue[],
): string | null | undefined {
  if (value == null) return value;
  const normalized = value.trim();
  if (normalized.length > max) issues.push({ field, code: "too_long", message: `${field} is too long.` });
  return normalized || undefined;
}

function images(
  value: readonly string[] | null | undefined,
  issues: ProjectValidationIssue[],
): string[] | null | undefined {
  if (value == null) return value as null | undefined;
  if (value.length > 29) {
    issues.push({ field: "imageKeys", code: "too_many", message: "imageKeys supports at most 29 gallery images after the cover." });
  }
  return value.map((path) => {
    const normalized = typeof path === "string" ? path.trim() : "";
    if (!normalized) issues.push({ field: "imageKeys", code: "empty_path", message: "imageKeys cannot contain an empty path." });
    if (normalized.length > 1_024) issues.push({ field: "imageKeys", code: "too_long", message: "An image key is too long." });
    return normalized;
  });
}

export function validateProjectCreateInput(input: ProjectCreateInput): ProjectValidationResult<ProjectCreateInput> {
  const issues: ProjectValidationIssue[] = [];
  const value: ProjectCreateInput = {
    title: required(input.title, "title", issues),
    description: optional(input.description, "description", 5_000, issues) ?? undefined,
    status: optional(input.status, "status", 200, issues) ?? undefined,
    notes: optional(input.notes, "notes", 10_000, issues) ?? undefined,
    coverImageUrl: optional(input.coverImageUrl, "coverImageUrl", 1_024, issues) ?? undefined,
    imageKeys: images(input.imageKeys, issues) ?? undefined,
  };
  return issues.length ? { ok: false, issues } : { ok: true, value };
}

export function validateProjectUpdateInput(input: ProjectUpdateInput): ProjectValidationResult<ProjectUpdateInput> {
  const issues: ProjectValidationIssue[] = [];
  const value: ProjectUpdateInput = { id: required(input.id, "id", issues) };
  if ("title" in input) value.title = required(input.title ?? "", "title", issues);
  if ("description" in input) value.description = optional(input.description, "description", 5_000, issues) ?? null;
  if ("status" in input) value.status = optional(input.status, "status", 200, issues) ?? null;
  if ("notes" in input) value.notes = optional(input.notes, "notes", 10_000, issues) ?? null;
  if ("coverImageUrl" in input) value.coverImageUrl = optional(input.coverImageUrl, "coverImageUrl", 1_024, issues) ?? null;
  if ("imageKeys" in input) value.imageKeys = images(input.imageKeys, issues) ?? null;
  return issues.length ? { ok: false, issues } : { ok: true, value };
}

