import type { ProjectValidationIssue } from "./validation.ts";

export class ProjectValidationError extends Error {
  readonly code = "PROJECT_VALIDATION_FAILED";
  readonly issues: ProjectValidationIssue[];

  constructor(issues: ProjectValidationIssue[]) {
    super("Project input validation failed.");
    this.name = "ProjectValidationError";
    this.issues = issues;
  }
}

export class ProjectNotFoundError extends Error {
  readonly code = "PROJECT_NOT_FOUND";
  readonly projectId: string;

  constructor(projectId: string) {
    super(`Project ${projectId} was not found.`);
    this.name = "ProjectNotFoundError";
    this.projectId = projectId;
  }
}

export interface ProjectGraphQLError {
  message: string;
  errorType?: string;
  path?: readonly (string | number | null)[];
}

export class ProjectPersistenceError extends Error {
  readonly code = "PROJECT_PERSISTENCE_FAILED";
  readonly operation: "list" | "get" | "create" | "update" | "delete";
  readonly graphqlErrors: readonly ProjectGraphQLError[];

  constructor(
    message: string,
    operation: "list" | "get" | "create" | "update" | "delete",
    graphqlErrors: readonly ProjectGraphQLError[] = [],
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ProjectPersistenceError";
    this.operation = operation;
    this.graphqlErrors = graphqlErrors;
  }
}

