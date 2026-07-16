import type { SupplyValidationIssue } from "./validation.ts";

export class InventoryValidationError extends Error {
  readonly code = "INVENTORY_VALIDATION_FAILED";

  constructor(readonly issues: SupplyValidationIssue[]) {
    super("Inventory input validation failed.");
    this.name = "InventoryValidationError";
  }
}

export class InventoryNotFoundError extends Error {
  readonly code = "INVENTORY_NOT_FOUND";

  constructor(readonly supplyId: string) {
    super(`Supply ${supplyId} was not found.`);
    this.name = "InventoryNotFoundError";
  }
}

export interface InventoryGraphQLError {
  message: string;
  errorType?: string;
  path?: readonly (string | number | null)[];
}

export class InventoryPersistenceError extends Error {
  readonly code = "INVENTORY_PERSISTENCE_FAILED";

  constructor(
    message: string,
    readonly operation: "list" | "get" | "create" | "update" | "delete",
    readonly graphqlErrors: readonly InventoryGraphQLError[] = [],
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "InventoryPersistenceError";
  }
}
