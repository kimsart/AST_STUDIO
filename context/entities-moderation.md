# AI Moderation Entities

These models define the automated moderation layer for both social systems.  
They are used by AI to detect issues, block unsafe content, and provide redirects.

Each entity includes TypeScript + GraphQL patterns for Copilot reference.

---

## ModeratorEvent
### TypeScript
```ts
interface ModeratorEvent {
  id: string
  userId: string
  roomId: string
  inputType: "POST" | "COMMENT"
  inputId: string
  detectedIssue?: "OFF_TOPIC" | "PERSONAL_INFO" | "INAPPROPRIATE_CONTENT"
  createdAt: string
}
type ModeratorEvent @model {
  id: ID!
  userId: ID!
  roomId: ID!
  inputType: ModeratorInputType!
  inputId: ID!
  detectedIssue: ModeratorIssue
  createdAt: AWSDateTime!
}

enum ModeratorInputType {
  POST
  COMMENT
}

enum ModeratorIssue {
  OFF_TOPIC
  PERSONAL_INFO
  INAPPROPRIATE_CONTENT
}
interface ModeratorDecision {
  id: string
  eventId: string
  action: "ALLOW" | "BLOCK" | "REDIRECT" | "FLAG"
  reasonCode: string
  createdAt: string
}
type ModeratorDecision @model {
  id: ID!
  eventId: ID!
  action: ModeratorAction!
  reasonCode: String!
  createdAt: AWSDateTime!
}

enum ModeratorAction {
  ALLOW
  BLOCK
  REDIRECT
  FLAG
}
interface ModeratorRedirect {
  id: string
  eventId: string
  redirectPromptText: string
  createdAt: string
}
type ModeratorRedirect @model {
  id: ID!
  eventId: ID!
  redirectPromptText: String!
  createdAt: AWSDateTime!
}
interface ModeratorTrendFilterLog {
  id: string
  sourceTrendId: string
  resultStatus: "APPROVED" | "REJECTED"
  reason: string
  createdAt: string
}
type ModeratorTrendFilterLog @model {
  id: ID!
  sourceTrendId: ID!
  resultStatus: TrendFilterStatus!
  reason: String!
  createdAt: AWSDateTime!
}

enum TrendFilterStatus {
  APPROVED
  REJECTED
}