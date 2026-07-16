import assert from "node:assert/strict";
import test from "node:test";

import { ProjectNotFoundError, ProjectPersistenceError } from "./errors.ts";
import { ProjectService, type ProjectDataClient, type RawProjectRecord } from "./projectService.ts";

const base: RawProjectRecord = {
  id: "project-1",
  title: "Ceramic installation",
  coverImageUrl: "project-images/identity/cover.jpg",
  createdAt: "2026-07-01T00:00:00.000Z",
  updatedAt: "2026-07-02T00:00:00.000Z",
};

type Result = { data?: RawProjectRecord | RawProjectRecord[] | null; errors?: { message: string }[]; nextToken?: string | null };

function mock(overrides: Partial<Record<"list" | "get" | "create" | "update" | "delete", Result>> = {}) {
  const calls = { list: [] as unknown[], get: [] as unknown[], create: [] as unknown[], update: [] as unknown[], delete: [] as unknown[] };
  const defaults: Record<keyof typeof calls, Result> = {
    list: { data: [base] }, get: { data: base }, create: { data: base }, update: { data: base }, delete: { data: base },
  };
  const result = (operation: keyof typeof calls) => overrides[operation] ?? defaults[operation];
  const client: ProjectDataClient = { models: { Project: {
    list: async (input) => { calls.list.push(input); return result("list") as never; },
    get: async (input) => { calls.get.push(input); return result("get") as never; },
    create: async (input) => { calls.create.push(input); return result("create") as never; },
    update: async (input) => { calls.update.push(input); return result("update") as never; },
    delete: async (input) => { calls.delete.push(input); return result("delete") as never; },
  } } };
  return { client, calls };
}

async function errorFrom(action: () => Promise<unknown>): Promise<unknown> {
  try { await action(); } catch (error) { return error; }
  throw new Error("Expected rejection.");
}

test("maps legacy records containing only coverImageUrl", async () => {
  const { client } = mock();
  const project = await new ProjectService(client).get("project-1");
  assert.equal(project.coverImageUrl, "project-images/identity/cover.jpg");
  assert.deepEqual(project.imageKeys, []);
});

test("maps cover plus multiple ordered imageKeys without reordering", async () => {
  const imageKeys = ["gallery/third-choice.jpg", "gallery/first-sketch.jpg", "gallery/detail-z.jpg"];
  const { client } = mock({ get: { data: { ...base, imageKeys } } });
  const project = await new ProjectService(client).get("project-1");
  assert.equal(project.coverImageUrl, base.coverImageUrl);
  assert.deepEqual(project.imageKeys, imageKeys);
});

test("round-trips empty imageKeys", async () => {
  const { client, calls } = mock({ create: { data: { ...base, imageKeys: [] } } });
  const project = await new ProjectService(client).create({ title: "Ceramic installation", imageKeys: [] });
  assert.deepEqual((calls.create[0] as { imageKeys: string[] }).imageKeys, []);
  assert.deepEqual(project.imageKeys, []);
});

test("update explicitly clears the gallery with []", async () => {
  const { client, calls } = mock({ update: { data: { ...base, imageKeys: [] } } });
  const project = await new ProjectService(client).update({ id: "project-1", imageKeys: [] });
  assert.deepEqual(calls.update[0], { id: "project-1", imageKeys: [] });
  assert.deepEqual(project.imageKeys, []);
});

test("create preserves gallery order and excludes caller-supplied owner", async () => {
  const imageKeys = ["gallery/b.jpg", "gallery/a.jpg", "gallery/c.jpg"];
  const { client, calls } = mock({ create: { data: { ...base, imageKeys } } });
  const project = await new ProjectService(client).create({
    title: "  Mixed-media archive  ",
    coverImageUrl: "  project-images/identity/cover.jpg  ",
    imageKeys,
    owner: "caller-selected-owner",
  } as never);
  assert.deepEqual((calls.create[0] as { imageKeys: string[] }).imageKeys, imageKeys);
  assert.equal(Object.prototype.hasOwnProperty.call(calls.create[0] as object, "owner"), false);
  assert.deepEqual(project.imageKeys, imageKeys);
});

test("update excludes caller-supplied owner", async () => {
  const { client, calls } = mock();
  await new ProjectService(client).update({ id: "project-1", notes: "updated", owner: "caller-selected-owner" } as never);
  assert.equal(Object.prototype.hasOwnProperty.call(calls.update[0] as object, "owner"), false);
});

test("GraphQL errors are surfaced even when no exception is thrown", async () => {
  const { client } = mock({ get: { data: base, errors: [{ message: "Not authorized" }] } });
  const error = await errorFrom(() => new ProjectService(client).get("project-1"));
  assert.ok(error instanceof ProjectPersistenceError);
  assert.equal((error as ProjectPersistenceError).graphqlErrors[0].message, "Not authorized");
});

test("get, update, and delete consistently report missing projects", async () => {
  const { client } = mock({ get: { data: null }, update: { data: null }, delete: { data: null } });
  const service = new ProjectService(client);
  assert.ok(await errorFrom(() => service.get("missing")) instanceof ProjectNotFoundError);
  assert.ok(await errorFrom(() => service.update({ id: "missing", title: "Missing" })) instanceof ProjectNotFoundError);
  assert.ok(await errorFrom(() => service.delete("missing")) instanceof ProjectNotFoundError);
});

