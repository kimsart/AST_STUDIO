# Minors' Social Entities (Protected Space)

These models define the COPPA‑safe, image‑only, parent‑approved social layer.  
This domain is isolated from the main social system.

Each entity includes TypeScript + GraphQL patterns for Copilot reference.

---

## MinorProfile
### TypeScript
```ts
interface MinorProfile {
  id: string
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  createdAt: string
  updatedAt: string
}
type MinorProfile @model {
  id: ID!
  skillLevel: SkillLevel!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
interface MinorRoom {
  id: string
  name: string
  type: "WORKSHOP" | "THEMED"
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  isActive: boolean
  createdAt: string
  updatedAt: string
}
type MinorRoom @model {
  id: ID!
  name: String!
  type: MinorRoomType!
  skillLevel: SkillLevel
  isActive: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum MinorRoomType {
  WORKSHOP
  THEMED
}
interface MinorPost {
  id: string
  userId: string
  roomId: string
  text: string
  createdAt: string
}
type MinorPost @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  roomId: ID!
  text: String!
  createdAt: AWSDateTime!
}
interface MinorUpload {
  id: string
  userId: string
  postId: string
  imageId: string
  passedSafetyCheck: boolean
  failedReason?: string
  createdAt: string
}
type MinorUpload @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  imageId: ID!
  passedSafetyCheck: Boolean!
  failedReason: String
  createdAt: AWSDateTime!
}
interface MinorShowcaseEntry {
  id: string
  userId: string
  uploadId: string
  showcasedAt: string
}
type MinorShowcaseEntry @model {
  id: ID!
  userId: ID!
  uploadId: ID!
  showcasedAt: AWSDateTime!
}
interface ParentApproval {
  id: string
  parentUserId: string
  minorUserId: string
  status: "PENDING" | "APPROVED" | "REVOKED"
  createdAt: string
  updatedAt: string
}
type ParentApproval @model {
  id: ID!
  parentUserId: ID!
  minorUserId: ID!
  status: ApprovalStatus!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REVOKED
}
interface ParentDashboardSettings {
  id: string
  parentUserId: string
  minorUserId: string
  activityDigestFrequency: "DAILY" | "WEEKLY" | "NONE"
  flagsEnabled: boolean
  createdAt: string
  updatedAt: string
}
type ParentDashboardSettings @model {
  id: ID!
  parentUserId: ID!
  minorUserId: ID!
  activityDigestFrequency: DigestFrequency!
  flagsEnabled: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum DigestFrequency {
  DAILY
  WEEKLY
  NONE
}