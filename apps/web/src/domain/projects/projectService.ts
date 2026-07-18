import type {
  Project,
  ProjectCreateInput,
  ProjectListOptions,
  ProjectPage,
  ProjectUpdateInput,
} from "./types.ts";
import {
  ProjectNotFoundError,
  ProjectPersistenceError,
  ProjectValidationError,
  type ProjectGraphQLError,
} from "./errors.ts";
import { validateProjectCreateInput, validateProjectUpdateInput } from "./validation.ts";

export interface RawProjectRecord {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  notes?: string | null;
  coverImageUrl?: string | null;
  imageKeys?: readonly (string | null)[] | null;
  supplyIds?: readonly (string | null)[] | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectResult<T> {
  data?: T | null;
  errors?: readonly ProjectGraphQLError[];
  nextToken?: string | null;
}

interface ProjectCreatePayload {
  title: string;
  description?: string;
  status?: string;
  notes?: string;
  coverImageUrl?: string | null;
  imageKeys?: string[];
  supplyIds?: string[];
}

interface ProjectUpdatePayload {
  id: string;
  title?: string;
  description?: string | null;
  status?: string | null;
  notes?: string | null;
  coverImageUrl?: string | null;
  imageKeys?: string[] | null;
  supplyIds?: string[] | null;
}

export interface ProjectDataClient {
  models: {
    Project: {
      list(options?: ProjectListOptions): Promise<ProjectResult<RawProjectRecord[]>>;
      get(identifier: { id: string }): Promise<ProjectResult<RawProjectRecord>>;
      create(input: ProjectCreatePayload): Promise<ProjectResult<RawProjectRecord>>;
      update(input: ProjectUpdatePayload): Promise<ProjectResult<RawProjectRecord>>;
      delete(identifier: { id: string }): Promise<ProjectResult<RawProjectRecord>>;
    };
  };
}

function persistenceError(
  operation: "list" | "get" | "create" | "update" | "delete",
  errors: readonly ProjectGraphQLError[],
): ProjectPersistenceError {
  return new ProjectPersistenceError(
    errors.map((error) => error.message).join("; ") || `Project ${operation} failed.`,
    operation,
    errors,
  );
}

function normalizeSupplyIds(value: readonly (string | null)[] | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}

export function mapProjectRecord(record: RawProjectRecord): Project {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    status: record.status,
    notes: record.notes,
    coverImageUrl: record.coverImageUrl,
    imageKeys: (record.imageKeys ?? []).filter((key): key is string => typeof key === "string"),
    supplyIds: normalizeSupplyIds(record.supplyIds),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class ProjectService {
  constructor(private readonly client: ProjectDataClient) {}

  async list(options?: ProjectListOptions): Promise<ProjectPage> {
    try {
      const result = await this.client.models.Project.list(options);
      if (result.errors?.length) throw persistenceError("list", result.errors);
      return { items: (result.data ?? []).map(mapProjectRecord), nextToken: result.nextToken };
    } catch (error) {
      if (error instanceof ProjectPersistenceError) throw error;
      throw new ProjectPersistenceError("Project list failed.", "list", [], { cause: error });
    }
  }

  async get(id: string): Promise<Project> {
    const validated = validateProjectUpdateInput({ id });
    if (validated.ok === false) throw new ProjectValidationError(validated.issues);
    try {
      const result = await this.client.models.Project.get({ id: validated.value.id });
      if (result.errors?.length) throw persistenceError("get", result.errors);
      if (!result.data) throw new ProjectNotFoundError(validated.value.id);
      return mapProjectRecord(result.data);
    } catch (error) {
      if (error instanceof ProjectNotFoundError || error instanceof ProjectPersistenceError) throw error;
      throw new ProjectPersistenceError("Project get failed.", "get", [], { cause: error });
    }
  }

  async create(input: ProjectCreateInput): Promise<Project> {
    const validated = validateProjectCreateInput(input);
    if (validated.ok === false) throw new ProjectValidationError(validated.issues);
    const payload: ProjectCreatePayload = {
      title: validated.value.title,
      description: validated.value.description,
      status: validated.value.status,
      notes: validated.value.notes,
      coverImageUrl: validated.value.coverImageUrl,
      imageKeys: validated.value.imageKeys ? [...validated.value.imageKeys] : undefined,
    };
    if (typeof validated.value.supplyIds !== "undefined") {
      payload.supplyIds = validated.value.supplyIds ? [...validated.value.supplyIds] : [];
    }
    try {
      const result = await this.client.models.Project.create(payload);
      if (result.errors?.length) throw persistenceError("create", result.errors);
      if (!result.data) throw new ProjectPersistenceError("Project create returned no record.", "create");
      return mapProjectRecord(result.data);
    } catch (error) {
      if (error instanceof ProjectPersistenceError) throw error;
      throw new ProjectPersistenceError("Project create failed.", "create", [], { cause: error });
    }
  }

  async update(input: ProjectUpdateInput): Promise<Project> {
    const validated = validateProjectUpdateInput(input);
    if (validated.ok === false) throw new ProjectValidationError(validated.issues);
    const payload: ProjectUpdatePayload = { id: validated.value.id };
    if ("title" in validated.value) payload.title = validated.value.title;
    if ("description" in validated.value) payload.description = validated.value.description;
    if ("status" in validated.value) payload.status = validated.value.status;
    if ("notes" in validated.value) payload.notes = validated.value.notes;
    if ("coverImageUrl" in validated.value) payload.coverImageUrl = validated.value.coverImageUrl;
    if ("imageKeys" in validated.value) {
      payload.imageKeys = validated.value.imageKeys ? [...validated.value.imageKeys] : null;
    }
    if ("supplyIds" in validated.value) {
      payload.supplyIds = validated.value.supplyIds == null ? null : [...validated.value.supplyIds];
    }
    try {
      const result = await this.client.models.Project.update(payload);
      if (result.errors?.length) throw persistenceError("update", result.errors);
      if (!result.data) throw new ProjectNotFoundError(validated.value.id);
      return mapProjectRecord(result.data);
    } catch (error) {
      if (error instanceof ProjectNotFoundError || error instanceof ProjectPersistenceError) throw error;
      throw new ProjectPersistenceError("Project update failed.", "update", [], { cause: error });
    }
  }

  async delete(id: string): Promise<void> {
    const validated = validateProjectUpdateInput({ id });
    if (validated.ok === false) throw new ProjectValidationError(validated.issues);
    try {
      const result = await this.client.models.Project.delete({ id: validated.value.id });
      if (result.errors?.length) throw persistenceError("delete", result.errors);
      if (!result.data) throw new ProjectNotFoundError(validated.value.id);
    } catch (error) {
      if (error instanceof ProjectNotFoundError || error instanceof ProjectPersistenceError) throw error;
      throw new ProjectPersistenceError("Project delete failed.", "delete", [], { cause: error });
    }
  }

  async assignSupply(projectId: string, supplyId: string): Promise<Project> {
    const normalizedProjectId = projectId.trim();
    const normalizedSupplyId = supplyId.trim();
    if (!normalizedProjectId) throw new ProjectValidationError([{ field: "id", code: "required", message: "id is required." }]);
    if (!normalizedSupplyId) throw new ProjectValidationError([{ field: "supplyIds", code: "empty_path", message: "supplyId cannot be empty." }]);

    const currentProject = await this.get(normalizedProjectId);
    const currentSupplyIds = currentProject.supplyIds;
    if (currentSupplyIds.includes(normalizedSupplyId)) return currentProject;
    return this.update({ id: normalizedProjectId, supplyIds: [...currentSupplyIds, normalizedSupplyId] });
  }

  async unassignSupply(projectId: string, supplyId: string): Promise<Project> {
    const normalizedProjectId = projectId.trim();
    const normalizedSupplyId = supplyId.trim();
    if (!normalizedProjectId) throw new ProjectValidationError([{ field: "id", code: "required", message: "id is required." }]);
    if (!normalizedSupplyId) throw new ProjectValidationError([{ field: "supplyIds", code: "empty_path", message: "supplyId cannot be empty." }]);

    const currentProject = await this.get(normalizedProjectId);
    const nextSupplyIds = currentProject.supplyIds.filter((id) => id !== normalizedSupplyId);
    if (nextSupplyIds.length === currentProject.supplyIds.length) return currentProject;
    return this.update({ id: normalizedProjectId, supplyIds: nextSupplyIds });
  }

  async listSupplyIds(projectId: string): Promise<string[]> {
    const normalizedProjectId = projectId.trim();
    if (!normalizedProjectId) throw new ProjectValidationError([{ field: "id", code: "required", message: "id is required." }]);
    const project = await this.get(normalizedProjectId);
    return [...project.supplyIds];
  }

  async listProjectIdsUsingSupply(supplyId: string): Promise<string[]> {
    const normalizedSupplyId = supplyId.trim();
    if (!normalizedSupplyId) throw new ProjectValidationError([{ field: "supplyIds", code: "empty_path", message: "supplyId cannot be empty." }]);
    const page = await this.list();
    return page.items.filter((project) => project.supplyIds.includes(normalizedSupplyId)).map((project) => project.id);
  }
}

