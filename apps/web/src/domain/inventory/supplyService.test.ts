import assert from "node:assert/strict";
import { after, test } from "node:test";

import {
  InventoryNotFoundError,
  InventoryPersistenceError,
  InventoryValidationError,
} from "./errors.ts";
import { SupplyService, type RawSupplyRecord, type SupplyDataClient } from "./supplyService.ts";
import { validateSupplyCreateInput } from "./validation.ts";

let assertionCount = 0;
const verify = {
  equal(actual: unknown, expected: unknown): void {
    assertionCount += 1;
    assert.equal(actual, expected);
  },
  deepEqual(actual: unknown, expected: unknown): void {
    assertionCount += 1;
    assert.deepEqual(actual, expected);
  },
  ok(value: unknown): void {
    assertionCount += 1;
    assert.ok(value);
  },
};

after(() => {
  console.log(`SupplyService assertions: ${assertionCount}`);
});

const baseRecord: RawSupplyRecord = {
  id: "supply-1",
  name: "Stoneware clay",
  category: "Ceramics",
  subcategory: "Clay bodies",
  quantity: 7,
  location: "Clay cabinet",
  notes: "Cone 6",
  createdAt: "2026-07-01T00:00:00.000Z",
  updatedAt: "2026-07-02T00:00:00.000Z",
};

type Result = { data?: RawSupplyRecord | RawSupplyRecord[] | null; errors?: { message: string }[]; nextToken?: string | null };

function createMockClient(overrides: Partial<Record<"list" | "get" | "create" | "update" | "delete", Result>> = {}) {
  const calls = {
    list: [] as unknown[],
    get: [] as unknown[],
    create: [] as unknown[],
    update: [] as unknown[],
    delete: [] as unknown[],
  };
  const defaults: Record<keyof typeof calls, Result> = {
    list: { data: [baseRecord], nextToken: null },
    get: { data: baseRecord },
    create: { data: baseRecord },
    update: { data: baseRecord },
    delete: { data: baseRecord },
  };
  const result = (operation: keyof typeof calls) => overrides[operation] ?? defaults[operation];
  const client: SupplyDataClient = {
    models: {
      Supply: {
        list: async (options) => { calls.list.push(options); return result("list") as never; },
        get: async (input) => { calls.get.push(input); return result("get") as never; },
        create: async (input) => { calls.create.push(input); return result("create") as never; },
        update: async (input) => { calls.update.push(input); return result("update") as never; },
        delete: async (input) => { calls.delete.push(input); return result("delete") as never; },
      },
    },
  };
  return { client, calls };
}

async function captureError(action: () => Promise<unknown>): Promise<unknown> {
  try {
    await action();
  } catch (error) {
    return error;
  }
  throw new Error("Expected action to reject.");
}

test("list maps current records and preserves pagination", async () => {
  const { client, calls } = createMockClient({
    list: { data: [baseRecord, { ...baseRecord, id: "supply-2", quantity: null }], nextToken: "page-2" },
  });
  const page = await new SupplyService(client).list({ limit: 2, nextToken: "page-1" });

  verify.equal(page.items.length, 2);
  verify.equal(page.nextToken, "page-2");
  verify.deepEqual(calls.list[0], { limit: 2, nextToken: "page-1" });
  verify.deepEqual(page.items[0].tags, []);
  verify.equal(page.items[0].quantityValue, 7);
  verify.equal(page.items[1].quantityValue, null);
});

test("get maps a Supply and preserves arbitrary current-schema terminology", async () => {
  const record = { ...baseRecord, category: "Photographic darkroom gear", subcategory: "Odd enlarger parts" };
  const { client, calls } = createMockClient({ get: { data: record } });
  const supply = await new SupplyService(client).get("  supply-1  ");

  verify.equal(supply.category, "Photographic darkroom gear");
  verify.equal(supply.subcategory, "Odd enlarger parts");
  verify.deepEqual(supply.tags, []);
  verify.deepEqual(calls.get[0], { id: "supply-1" });
});

test("create persists and round-trips every open inventory field", async () => {
  const createdRecord: RawSupplyRecord = {
    ...baseRecord,
    name: "Mokuhanga baren",
    category: "Printmaking tools",
    subcategory: "Hand pressure tools",
    itemType: "baren I made myself",
    unit: "working baren",
    barcode: "STUDIO:BAREN/02",
    tags: ["mokuhanga", "handmade"],
    quantityValue: 2,
    quantity: 2,
    imageKey: "supply-images/identity/baren.jpg",
  };
  const { client, calls } = createMockClient({ create: { data: createdRecord } });
  const service = new SupplyService(client);
  const supply = await service.create({
    name: "  Mokuhanga baren  ",
    category: "  Printmaking tools  ",
    subcategory: "  Hand pressure tools  ",
    itemType: "  baren I made myself  ",
    unit: "  working baren  ",
    barcode: "  STUDIO:BAREN/02  ",
    tags: ["  mokuhanga  ", "handmade"],
    quantityValue: 2,
    imageKey: "  supply-images/identity/baren.jpg  ",
    owner: "attacker-selected-owner",
  } as never);

  verify.equal(calls.create.length, 1);
  verify.deepEqual(calls.create[0], {
    name: "Mokuhanga baren",
    category: "Printmaking tools",
    subcategory: "Hand pressure tools",
    itemType: "baren I made myself",
    unit: "working baren",
    barcode: "STUDIO:BAREN/02",
    tags: ["mokuhanga", "handmade"],
    quantityValue: 2,
    quantity: 2,
    location: undefined,
    notes: undefined,
    imageKey: "supply-images/identity/baren.jpg",
  });
  verify.equal(Object.prototype.hasOwnProperty.call(calls.create[0] as object, "owner"), false);
  verify.equal(supply.itemType, "baren I made myself");
  verify.equal(supply.unit, "working baren");
  verify.equal(supply.barcode, "STUDIO:BAREN/02");
  verify.deepEqual(supply.tags, ["mokuhanga", "handmade"]);
  verify.equal(supply.imageKey, "supply-images/identity/baren.jpg");
});

test("update persists and round-trips newly supported fields", async () => {
  const { client, calls } = createMockClient({
    update: {
      data: {
        ...baseRecord,
        category: "Sculpture armatures",
        itemType: "custom support system",
        unit: "assembled armature",
        barcode: "SCULPTURE/A-1",
        tags: ["steel", "reusable"],
        quantityValue: 3,
        quantity: 3,
        imageKey: "supply-images/identity/armature.jpg",
      },
    },
  });
  const supply = await new SupplyService(client).update({
    id: "supply-1",
    category: "  Sculpture armatures  ",
    itemType: "custom support system",
    unit: "assembled armature",
    barcode: "SCULPTURE/A-1",
    tags: ["steel", "reusable"],
    quantityValue: 3,
    imageKey: "supply-images/identity/armature.jpg",
    owner: "attacker-selected-owner",
  } as never);

  verify.deepEqual(calls.update[0], {
    id: "supply-1",
    category: "Sculpture armatures",
    itemType: "custom support system",
    unit: "assembled armature",
    barcode: "SCULPTURE/A-1",
    tags: ["steel", "reusable"],
    quantityValue: 3,
    quantity: 3,
    imageKey: "supply-images/identity/armature.jpg",
  });
  verify.equal(supply.category, "Sculpture armatures");
  verify.equal(supply.quantityValue, 3);
  verify.deepEqual(supply.tags, ["steel", "reusable"]);
  verify.equal(supply.imageKey, "supply-images/identity/armature.jpg");
  verify.equal(Object.prototype.hasOwnProperty.call(calls.update[0] as object, "owner"), false);
});

test("delete sends the validated identifier and prunes stale project references", async () => {
  const { client, calls } = createMockClient();
  const updates: Array<{ id: string; supplyIds: string[] | null }> = [];
  const projectService = {
    list: async () => ({ items: [{ id: "project-1", supplyIds: ["supply-1", "supply-2"] }, { id: "project-2", supplyIds: ["supply-3"] }] }),
    update: async (input: { id: string; supplyIds: string[] | null }) => {
      updates.push(input);
      return input;
    },
  };
  await new SupplyService(client, projectService).delete("  supply-1  ");
  verify.deepEqual(calls.delete[0], { id: "supply-1" });
  verify.deepEqual(updates, [{ id: "project-1", supplyIds: ["supply-2"] }]);
});

test("validation fails before an Amplify mutation", async () => {
  const { client, calls } = createMockClient();
  const error = await captureError(() => new SupplyService(client).create({ name: "   " }));

  verify.ok(error instanceof InventoryValidationError);
  verify.equal(calls.create.length, 0);
});

test("GraphQL errors fail operations even when the client does not throw", async () => {
  const { client: listClient } = createMockClient({ list: { data: [baseRecord], errors: [{ message: "List denied" }] } });
  const listError = await captureError(() => new SupplyService(listClient).list());
  verify.ok(listError instanceof InventoryPersistenceError);
  verify.equal((listError as InventoryPersistenceError).operation, "list");
  verify.equal((listError as InventoryPersistenceError).graphqlErrors[0].message, "List denied");

  const { client: createClient } = createMockClient({ create: { data: baseRecord, errors: [{ message: "Mutation rejected" }] } });
  const createError = await captureError(() => new SupplyService(createClient).create({ name: "Clay" }));
  verify.ok(createError instanceof InventoryPersistenceError);
  verify.equal((createError as InventoryPersistenceError).operation, "create");
});

test("get, update, and delete consistently throw not-found for absent data", async () => {
  const { client } = createMockClient({ get: { data: null }, update: { data: null }, delete: { data: null } });
  const service = new SupplyService(client);

  verify.ok(await captureError(() => service.get("missing")) instanceof InventoryNotFoundError);
  verify.ok(await captureError(() => service.update({ id: "missing", name: "Still missing" })) instanceof InventoryNotFoundError);
  verify.ok(await captureError(() => service.delete("missing")) instanceof InventoryNotFoundError);
});

test("fractional quantity persists without writing legacy quantity", async () => {
  const record = { ...baseRecord, name: "Silver wire", quantityValue: 1.25, quantity: 7 };
  const { client, calls } = createMockClient({ create: { data: record } });
  const supply = await new SupplyService(client).create({ name: "Silver wire", quantityValue: 1.25 });

  verify.equal((calls.create[0] as { quantityValue: number }).quantityValue, 1.25);
  verify.equal(Object.prototype.hasOwnProperty.call(calls.create[0] as object, "quantity"), false);
  verify.equal(supply.quantityValue, 1.25);
});

test("explicit nulls clear new fields and both quantity representations", async () => {
  const cleared = {
    ...baseRecord,
    itemType: null,
    unit: null,
    barcode: null,
    tags: null,
    quantityValue: null,
    quantity: null,
    imageKey: null,
  };
  const { client, calls } = createMockClient({ update: { data: cleared } });
  const supply = await new SupplyService(client).update({
    id: "supply-1",
    itemType: null,
    unit: null,
    barcode: null,
    tags: null,
    quantityValue: null,
    imageKey: null,
  });

  verify.deepEqual(calls.update[0], {
    id: "supply-1",
    itemType: null,
    unit: null,
    barcode: null,
    tags: null,
    quantityValue: null,
    quantity: null,
    imageKey: null,
  });
  verify.deepEqual(supply.tags, []);
  verify.equal(supply.quantityValue, null);
  verify.equal(supply.imageKey, null);
});

test("records containing both quantity fields prefer quantityValue", async () => {
  const { client } = createMockClient({ get: { data: { ...baseRecord, quantityValue: 2.75, quantity: 99 } } });
  const supply = await new SupplyService(client).get("supply-1");
  verify.equal(supply.quantityValue, 2.75);
  verify.equal(supply.quantity, 99);
});

test("domain validation accepts terminology from many artistic disciplines", () => {
  const examples = [
    ["Ceramics", "Raku tongs"],
    ["Sculpture", "Armature wire"],
    ["Photography", "Lens calibration target"],
    ["Fiber art", "Rigid heddle"],
    ["Printmaking", "Akua wiping fabric"],
    ["Jewelry", "Drawplate"],
    ["Woodworking", "Spokeshave"],
    ["Digital art", "Pen display nib"],
    ["Mixed-media", "Found-object fastener"],
  ];

  for (const [category, name] of examples) {
    const result = validateSupplyCreateInput({ name, category, itemType: `${category} item`, unit: `${category} unit` });
    verify.equal(result.ok, true);
    if (result.ok) verify.equal(result.value.category, category);
  }
});
