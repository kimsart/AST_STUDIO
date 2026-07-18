import type {
  Supply,
  SupplyCreateInput,
  SupplyListOptions,
  SupplyPage,
  SupplyUpdateInput,
} from "./types.ts";
import type { ProjectService } from "../projects/projectService.ts";
import {
  InventoryNotFoundError,
  InventoryPersistenceError,
  InventoryValidationError,
  type InventoryGraphQLError,
} from "./errors.ts";
import {
  resolveQuantityValue,
  validateSupplyCreateInput,
  validateSupplyUpdateInput,
} from "./validation.ts";

export interface RawSupplyRecord {
  id: string;
  name: string;
  category?: string | null;
  subcategory?: string | null;
  quantity?: number | null;
  location?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;

  // These become available after the additive schema migration.
  quantityValue?: number | null;
  itemType?: string | null;
  unit?: string | null;
  barcode?: string | null;
  tags?: readonly (string | null)[] | null;
  imageKey?: string | null;
}

interface AmplifyResult<T> {
  data?: T | null;
  errors?: readonly InventoryGraphQLError[];
  nextToken?: string | null;
}

interface SupplyCreatePayload {
  name: string;
  category?: string;
  subcategory?: string;
  itemType?: string;
  unit?: string;
  barcode?: string;
  tags?: string[];
  quantityValue?: number | null;
  quantity?: number;
  location?: string;
  notes?: string;
  imageKey?: string | null;
}

interface SupplyUpdatePayload {
  id: string;
  name?: string;
  category?: string | null;
  subcategory?: string | null;
  itemType?: string | null;
  unit?: string | null;
  barcode?: string | null;
  tags?: string[] | null;
  quantityValue?: number | null;
  quantity?: number | null;
  location?: string | null;
  notes?: string | null;
  imageKey?: string | null;
}

/** Minimal injectable surface of the generated Amplify Supply model client. */
export interface SupplyDataClient {
  models: {
    Supply: {
      list(options?: SupplyListOptions): Promise<AmplifyResult<RawSupplyRecord[]>>;
      get(identifier: { id: string }): Promise<AmplifyResult<RawSupplyRecord>>;
      create(input: SupplyCreatePayload): Promise<AmplifyResult<RawSupplyRecord>>;
      update(input: SupplyUpdatePayload): Promise<AmplifyResult<RawSupplyRecord>>;
      delete(identifier: { id: string }): Promise<AmplifyResult<RawSupplyRecord>>;
    };
  };
}

interface ProjectRelationshipService {
  list(): Promise<{ items: Array<{ id: string; supplyIds: string[] }> }>;
  update(input: { id: string; supplyIds: string[] | null }): Promise<unknown>;
}

function hasGraphQLErrors(result: AmplifyResult<unknown>): boolean {
  return Boolean(result.errors?.length);
}

function toPersistenceError(
  operation: "list" | "get" | "create" | "update" | "delete",
  errors: readonly InventoryGraphQLError[],
): InventoryPersistenceError {
  return new InventoryPersistenceError(
    errors.map((error) => error.message).join("; ") || `Supply ${operation} failed.`,
    operation,
    errors,
  );
}

export function mapSupplyRecord(record: RawSupplyRecord): Supply {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    subcategory: record.subcategory,
    itemType: record.itemType,
    unit: record.unit,
    barcode: record.barcode,
    tags: (record.tags ?? []).filter((tag): tag is string => typeof tag === "string"),
    quantityValue: resolveQuantityValue(record.quantityValue, record.quantity),
    quantity: record.quantity,
    location: record.location,
    notes: record.notes,
    imageKey: record.imageKey,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class SupplyService {
  constructor(
    private readonly client: SupplyDataClient,
    private readonly projectService?: ProjectRelationshipService,
  ) {}

  async list(options?: SupplyListOptions): Promise<SupplyPage> {
    try {
      const result = await this.client.models.Supply.list(options);
      if (hasGraphQLErrors(result)) throw toPersistenceError("list", result.errors ?? []);
      return {
        items: (result.data ?? []).map(mapSupplyRecord),
        nextToken: result.nextToken,
      };
    } catch (error) {
      if (error instanceof InventoryPersistenceError) throw error;
      throw new InventoryPersistenceError("Supply list failed.", "list", [], { cause: error });
    }
  }

  async get(id: string): Promise<Supply> {
    const validated = validateSupplyUpdateInput({ id });
    if (validated.ok === false) throw new InventoryValidationError(validated.issues);

    try {
      const result = await this.client.models.Supply.get({ id: validated.value.id });
      if (hasGraphQLErrors(result)) throw toPersistenceError("get", result.errors ?? []);
      if (!result.data) throw new InventoryNotFoundError(validated.value.id);
      return mapSupplyRecord(result.data);
    } catch (error) {
      if (error instanceof InventoryNotFoundError || error instanceof InventoryPersistenceError) throw error;
      throw new InventoryPersistenceError("Supply get failed.", "get", [], { cause: error });
    }
  }

  async create(input: SupplyCreateInput): Promise<Supply> {
    const validated = validateSupplyCreateInput(input);
    if (validated.ok === false) throw new InventoryValidationError(validated.issues);

    const payload: SupplyCreatePayload = {
      name: validated.value.name,
      category: validated.value.category,
      subcategory: validated.value.subcategory,
      itemType: validated.value.itemType,
      unit: validated.value.unit,
      barcode: validated.value.barcode,
      tags: validated.value.tags ? [...validated.value.tags] : undefined,
      quantityValue: validated.value.quantityValue,
      location: validated.value.location,
      notes: validated.value.notes,
      imageKey: validated.value.imageKey,
    };
    if (Number.isInteger(validated.value.quantityValue)) {
      payload.quantity = validated.value.quantityValue ?? undefined;
    }

    try {
      const result = await this.client.models.Supply.create(payload);
      if (hasGraphQLErrors(result)) throw toPersistenceError("create", result.errors ?? []);
      if (!result.data) throw new InventoryPersistenceError("Supply create returned no record.", "create");
      return mapSupplyRecord(result.data);
    } catch (error) {
      if (error instanceof InventoryPersistenceError) throw error;
      throw new InventoryPersistenceError("Supply create failed.", "create", [], { cause: error });
    }
  }

  async update(input: SupplyUpdateInput): Promise<Supply> {
    const validated = validateSupplyUpdateInput(input);
    if (validated.ok === false) throw new InventoryValidationError(validated.issues);

    const payload: SupplyUpdatePayload = { id: validated.value.id };
    if ("name" in validated.value) payload.name = validated.value.name;
    if ("category" in validated.value) payload.category = validated.value.category;
    if ("subcategory" in validated.value) payload.subcategory = validated.value.subcategory;
    if ("itemType" in validated.value) payload.itemType = validated.value.itemType;
    if ("unit" in validated.value) payload.unit = validated.value.unit;
    if ("barcode" in validated.value) payload.barcode = validated.value.barcode;
    if ("tags" in validated.value) {
      payload.tags = validated.value.tags ? [...validated.value.tags] : null;
    }
    if ("quantityValue" in validated.value) {
      payload.quantityValue = validated.value.quantityValue;
      if (validated.value.quantityValue === null || Number.isInteger(validated.value.quantityValue)) {
        payload.quantity = validated.value.quantityValue;
      }
    }
    if ("location" in validated.value) payload.location = validated.value.location;
    if ("notes" in validated.value) payload.notes = validated.value.notes;
    if ("imageKey" in validated.value) payload.imageKey = validated.value.imageKey;

    try {
      const result = await this.client.models.Supply.update(payload);
      if (hasGraphQLErrors(result)) throw toPersistenceError("update", result.errors ?? []);
      if (!result.data) throw new InventoryNotFoundError(validated.value.id);
      return mapSupplyRecord(result.data);
    } catch (error) {
      if (error instanceof InventoryNotFoundError || error instanceof InventoryPersistenceError) throw error;
      throw new InventoryPersistenceError("Supply update failed.", "update", [], { cause: error });
    }
  }

  async delete(id: string): Promise<void> {
    const validated = validateSupplyUpdateInput({ id });
    if (validated.ok === false) throw new InventoryValidationError(validated.issues);

    try {
      const result = await this.client.models.Supply.delete({ id: validated.value.id });
      if (hasGraphQLErrors(result)) throw toPersistenceError("delete", result.errors ?? []);
      if (!result.data) throw new InventoryNotFoundError(validated.value.id);

      if (this.projectService) {
        const projects = await this.projectService.list();
        await Promise.all(
          projects.items
            .filter((project) => project.supplyIds.includes(validated.value.id))
            .map((project) => this.projectService!.update({
              id: project.id,
              supplyIds: project.supplyIds.filter((supplyId) => supplyId !== validated.value.id),
            })),
        );
      }
    } catch (error) {
      if (error instanceof InventoryNotFoundError || error instanceof InventoryPersistenceError) throw error;
      throw new InventoryPersistenceError("Supply delete failed.", "delete", [], { cause: error });
    }
  }
}
