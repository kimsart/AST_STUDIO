# Social Entities (Main Social — Adults / General Users)

These models define the main social layer of AST Studio.  
This space is image‑only, public or unlisted, and separate from minors’ social.

Each entity includes TypeScript + GraphQL patterns for Copilot reference.

---

## SocialRoom
### TypeScript
```ts
interface SocialRoom {
  id: string
  name: string
  description?: string
  isSystemRoom: boolean
  createdAt: string
  updatedAt: string
}
type SocialRoom @model {
  id: ID!
  name: String!
  description: String
  isSystemRoom: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface SocialPost {
  id: string
  userId: string
  roomId: string
  text: string
  visibility: "PUBLIC" | "UNLISTED"
  createdAt: string
  updatedAt: string
}
type SocialPost @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  roomId: ID!
  text: String!
  visibility: Visibility!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum Visibility {
  PUBLIC
  UNLISTED
}
interface SocialComment {
  id: string
  userId: string
  postId: string
  text: string
  createdAt: string
}
type SocialComment @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  text: String!
  createdAt: AWSDateTime!
}
interface SocialMedia {
  id: string
  userId: string
  postId: string
  imageId: string
  role: "PRIMARY" | "DETAIL"
  createdAt: string
}
type SocialMedia @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  imageId: ID!
  role: MediaRole!
  createdAt: AWSDateTime!
}

enum MediaRole {
  PRIMARY
  DETAIL
}
interface SocialLike {
  id: string
  userId: string
  postId: string
  createdAt: string
}
type SocialLike @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  createdAt: AWSDateTime!
}
interface SocialReport {
  id: string
  reporterUserId: string
  targetType: "POST" | "COMMENT"
  targetId: string
  reason: string
  status: "PENDING" | "REVIEWED"
  createdAt: string
}
type SocialReport @model {
  id: ID!
  reporterUserId: ID!
  targetType: ReportTarget!
  targetId: ID!
  reason: String!
  status: ReportStatus!
  createdAt: AWSDateTime!
}

enum ReportTarget {
  POST
  COMMENT
}

enum ReportStatus {
  PENDING
  REVIEWED
}
interface SocialTrend {
  id: string
  label: string
  type: "PALETTE" | "CHALLENGE" | "TECHNIQUE" | "THEME"
  sourceWindow: string
  createdAt: string
}
type SocialTrend @model {
  id: ID!
  label: String!
  type: TrendType!
  sourceWindow: String!
  createdAt: AWSDateTime!
}

enum TrendType {
  PALETTE
  CHALLENGE
  TECHNIQUE
  THEME
}