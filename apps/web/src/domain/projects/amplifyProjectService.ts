import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../../amplify/data/resource";

import { ProjectService, type ProjectDataClient } from "./projectService.ts";

export function createAmplifyProjectService(): ProjectService {
  const client = generateClient<Schema>();
  const projectClient: ProjectDataClient = {
    models: {
      Project: {
        list: (options) => client.models.Project.list(options),
        get: (identifier) => client.models.Project.get(identifier),
        create: (input) => client.models.Project.create(input),
        update: (input) => client.models.Project.update(input),
        delete: (identifier) => client.models.Project.delete(identifier),
      },
    },
  };
  return new ProjectService(projectClient);
}

