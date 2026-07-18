import assert from "node:assert/strict";
import test from "node:test";

import { createAmplifySupplyService } from "./amplifySupplyService.ts";
import { ProjectService } from "../projects/projectService.ts";

test("createAmplifySupplyService wires a real ProjectService for delete-time cleanup", () => {
  const service = createAmplifySupplyService();
  const wired = (service as unknown as { projectService?: unknown }).projectService;

  assert.ok(wired, "SupplyService produced by the production factory must receive a projectService dependency");
  assert.ok(
    wired instanceof ProjectService,
    "the wired dependency must be a real ProjectService, not a stub or undefined",
  );
});
