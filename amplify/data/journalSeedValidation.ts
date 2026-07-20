export interface JournalEntryInput {
  body: string;
  title?: string;
  category?: string;
  tags?: readonly string[];
  authoredAt?: string;
  projectId?: string;
}

export interface SeedInput {
  content: string;
  title?: string;
  category?: string;
  tags?: readonly string[];
  status?: string;
  projectId?: string;
}

export type JournalSeedValidationField =
  | 'body'
  | 'content'
  | 'title'
  | 'category'
  | 'tags'
  | 'authoredAt'
  | 'status'
  | 'projectId';

export interface JournalSeedValidationIssue {
  field: JournalSeedValidationField;
  code: 'required' | 'too_long' | 'too_many' | 'invalid_datetime';
  message: string;
}

export type JournalSeedValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: JournalSeedValidationIssue[] };

const LIMITS = {
  content: 50_000,
  title: 200,
  terminology: 200,
  tag: 100,
  tags: 100,
  projectId: 128,
} as const;

function requiredContent(
  value: string,
  field: 'body' | 'content',
  issues: JournalSeedValidationIssue[],
): string {
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (!normalized) {
    issues.push({ field, code: 'required', message: `${field} is required.` });
  } else if (normalized.length > LIMITS.content) {
    issues.push({
      field,
      code: 'too_long',
      message: `${field} must be ${LIMITS.content} characters or fewer.`,
    });
  }
  return normalized;
}

function optionalString(
  value: string | undefined,
  field: 'title' | 'category' | 'status' | 'projectId',
  maxLength: number,
  issues: JournalSeedValidationIssue[],
): string | undefined {
  if (value === undefined) return undefined;
  const normalized = typeof value === 'string' ? value.trim() : '';
  if (normalized.length > maxLength) {
    issues.push({
      field,
      code: 'too_long',
      message: `${field} must be ${maxLength} characters or fewer.`,
    });
  }
  return normalized || undefined;
}

function tags(
  value: readonly string[] | undefined,
  issues: JournalSeedValidationIssue[],
): string[] | undefined {
  if (value === undefined) return undefined;
  if (value.length > LIMITS.tags) {
    issues.push({
      field: 'tags',
      code: 'too_many',
      message: `tags must contain ${LIMITS.tags} values or fewer.`,
    });
  }

  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const tag of value) {
    const trimmed = typeof tag === 'string' ? tag.trim() : '';
    if (!trimmed) continue;
    if (trimmed.length > LIMITS.tag) {
      issues.push({
        field: 'tags',
        code: 'too_long',
        message: `each tag must be ${LIMITS.tag} characters or fewer.`,
      });
      continue;
    }
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      normalized.push(trimmed);
    }
  }
  return normalized;
}

function authoredAt(
  value: string | undefined,
  issues: JournalSeedValidationIssue[],
): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;
  const milliseconds = Date.parse(normalized);
  if (!Number.isFinite(milliseconds)) {
    issues.push({
      field: 'authoredAt',
      code: 'invalid_datetime',
      message: 'authoredAt must be a valid date-time.',
    });
    return normalized;
  }
  return new Date(milliseconds).toISOString();
}

export function validateJournalEntryInput(
  input: JournalEntryInput,
): JournalSeedValidationResult<JournalEntryInput> {
  const issues: JournalSeedValidationIssue[] = [];
  const value: JournalEntryInput = {
    body: requiredContent(input.body, 'body', issues),
    title: optionalString(input.title, 'title', LIMITS.title, issues),
    category: optionalString(input.category, 'category', LIMITS.terminology, issues),
    tags: tags(input.tags, issues),
    authoredAt: authoredAt(input.authoredAt, issues),
    projectId: optionalString(input.projectId, 'projectId', LIMITS.projectId, issues),
  };
  return issues.length ? { ok: false, issues } : { ok: true, value };
}

export function validateSeedInput(
  input: SeedInput,
): JournalSeedValidationResult<SeedInput> {
  const issues: JournalSeedValidationIssue[] = [];
  const value: SeedInput = {
    content: requiredContent(input.content, 'content', issues),
    title: optionalString(input.title, 'title', LIMITS.title, issues),
    category: optionalString(input.category, 'category', LIMITS.terminology, issues),
    tags: tags(input.tags, issues),
    status: optionalString(input.status, 'status', LIMITS.terminology, issues),
    projectId: optionalString(input.projectId, 'projectId', LIMITS.projectId, issues),
  };
  return issues.length ? { ok: false, issues } : { ok: true, value };
}
