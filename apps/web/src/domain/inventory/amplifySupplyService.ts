import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../../amplify/data/resource";

import { SupplyService, type SupplyDataClient } from "./supplyService.ts";

/** Production composition root. Unit tests inject a structural client instead. */
export function createAmplifySupplyService(): SupplyService {
  const client = generateClient<Schema>();
  const supplyClient: SupplyDataClient = {
    models: {
      Supply: {
        list: (options) => client.models.Supply.list(options),
        get: (identifier) => client.models.Supply.get(identifier),
        create: (input) => client.models.Supply.create(input),
        update: (input) => client.models.Supply.update(input),
        delete: (identifier) => client.models.Supply.delete(identifier),
      },
    },
  };
  return new SupplyService(supplyClient);
}
