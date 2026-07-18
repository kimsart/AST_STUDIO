# Data Model

## Purpose
Define the core data structures that power AST Studio, including entities, relationships, and constraints.

## Core Entities
List the primary data objects (e.g., Project, Material, Measurement, Workspace, User).

## Entity Definitions
Provide a structured definition for each entity, including:
- fields
- types
- constraints
- required vs optional
- relationships

### User Entity

**TypeScript Interface:**
```typescript
interface User {
  id: string
  username: string // globally unique
  isMinor: boolean
  ageGroup: "CHILD" | "TEEN" | "ADULT"
  parentId?: string
  minorApprovedAt?: string
  minorExpiresAt?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type User @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  username: String! @unique
  isMinor: Boolean!
  ageGroup: AgeGroup!
  parentId: ID
  minorApprovedAt: AWSDateTime
  minorExpiresAt: AWSDateTime
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum AgeGroup {
  CHILD
  TEEN
  ADULT
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `username`: Globally unique username (required)
- `isMinor`: Boolean flag for minor status (required)
- `ageGroup`: Age category enum (required)
- `parentId`: Reference to parent user for minors (optional)
- `minorApprovedAt`: Timestamp of minor approval (optional)
- `minorExpiresAt`: Expiration of minor approval (optional)
- `createdAt`: Account creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### Vendor Entity

**TypeScript Interface:**
```typescript
interface Vendor {
  id: string
  name: string
  website?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Vendor @model {
  id: ID!
  name: String!
  website: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Vendor name (required)
- `website`: Vendor website URL (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### Location Entity

**TypeScript Interface:**
```typescript
interface Location {
  id: string
  name: string
  address?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Location @model {
  id: ID!
  name: String!
  address: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Location name (required)
- `address`: Physical address (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### Supply Entity

**TypeScript Interface:**
```typescript
interface Supply {
  id: string
  name: string
  category?: string
  subcategory?: string
  itemType?: string
  unit?: string
  barcode?: string
  tags: string[]
  quantityValue?: number
  quantity?: number // legacy compatibility
  location?: string
  notes?: string
  imageKey?: string
  imageUrl?: string // legacy compatibility
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Supply @model {
  id: ID!
  name: String!
  category: String
  subcategory: String
  itemType: String
  unit: String
  barcode: String
  tags: [String]
  quantityValue: Float
  quantity: Int
  location: String
  notes: String
  imageKey: String
  imageUrl: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Artist-defined inventory item name (required)
- `category`, `subcategory`, `itemType`, `unit`, `barcode`: Open user-authored strings (optional)
- `tags`: Owner-contained user-authored string collection (optional; normalized to an empty array by the service)
- `quantityValue`: Fractional-capable inventory quantity (optional, authoritative when present)
- `quantity`: Legacy integer quantity retained temporarily (optional)
- `location`, `notes`: User-authored inventory details (optional)
- `imageKey`: Amplify Storage key (optional)
- `imageUrl`: Legacy image value retained temporarily (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

`Supply` is a migration-compatible model name for general inventory. It is not
limited to painting supplies and can represent materials, tools, equipment,
consumables, and other artist-owned items. No user-authored terminology field
uses an enum or canonical catalog.

### Project Entity

**TypeScript Interface:**
```typescript
interface Project {
  id: string
  title: string
  description?: string
  status?: string
  notes?: string
  coverImageUrl?: string
  imageKeys: string[]
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Project @model {
  id: ID!
  title: String!
  description: String
  status: String
  notes: String
  coverImageUrl: String
  imageKeys: [String]
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `title`: Project title (required)
- `description`: Project description (optional)
- `status`, `notes`: User-authored project details (optional)
- `coverImageUrl`: Backward-compatible first/cover image path (optional)
- `imageKeys`: Ordered additional gallery image paths after the cover (optional; normalized to an empty array when absent)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

Legacy projects require no migration because an absent `imageKeys` field is
equivalent to an empty additional gallery. `coverImageUrl` is not renamed or
removed.

### Artwork Entity

**TypeScript Interface:**
```typescript
interface Artwork {
  id: string
  projectId?: string
  title: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Artwork @model {
  id: ID!
  projectId: ID
  title: String!
  notes: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `projectId`: Reference to parent project (optional)
- `title`: Artwork title (required)
- `notes`: Additional notes (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### Client Entity

**TypeScript Interface:**
```typescript
interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Client @model {
  id: ID!
  name: String!
  email: String
  phone: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Client name (required)
- `email`: Client email (optional)
- `phone`: Client phone number (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### Session Entity

**TypeScript Interface:**
```typescript
interface Session {
  id: string
  clientId?: string
  projectId?: string
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Session @model {
  id: ID!
  clientId: ID
  projectId: ID
  date: AWSDateTime!
  notes: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `clientId`: Reference to client (optional)
- `projectId`: Reference to project (optional)
- `date`: Session date and time (required)
- `notes`: Session notes (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### InventoryLog Entity

**TypeScript Interface:**
```typescript
interface InventoryLog {
  id: string
  supplyId: string
  change: number
  reason?: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type InventoryLog @model {
  id: ID!
  supplyId: ID!
  change: Int!
  reason: String
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `supplyId`: Reference to supply item (required)
- `change`: Quantity change (positive or negative) (required)
- `reason`: Reason for inventory change (optional)
- `createdAt`: Creation timestamp (required)

### Exhibition Entity

**TypeScript Interface:**
```typescript
interface Exhibition {
  id: string
  name: string
  date: string
  location?: string
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type Exhibition @model {
  id: ID!
  name: String!
  date: AWSDateTime!
  location: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Exhibition name (required)
- `date`: Exhibition date (required)
- `location`: Exhibition location (optional)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### Media Entity

**TypeScript Interface:**
```typescript
interface Media {
  id: string
  ownerId: string
  storageKey: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type Media @model {
  id: ID!
  ownerId: ID!
  storageKey: String!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `ownerId`: Reference to owning user (required)
- `storageKey`: Storage system key/path (required)
- `createdAt`: Creation timestamp (required)

### Tag Entity

**TypeScript Interface:**
```typescript
interface Tag {
  id: string
  label: string
}
```

**GraphQL Schema:**
```graphql
type Tag @model {
  id: ID!
  label: String!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `label`: Tag text label (required)

### Taggable Entity

**TypeScript Interface:**
```typescript
interface Taggable {
  id: string
  tagId: string
  entityId: string
  entityType: string
}
```

**GraphQL Schema:**
```graphql
type Taggable @model {
  id: ID!
  tagId: ID!
  entityId: ID!
  entityType: String!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `tagId`: Reference to tag (required)
- `entityId`: Reference to tagged entity (required)
- `entityType`: Type of entity being tagged (required)

### AuditLog Entity

**TypeScript Interface:**
```typescript
interface AuditLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type AuditLog @model {
  id: ID!
  userId: ID!
  action: String!
  entityType: String!
  entityId: ID!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to user who performed action (required)
- `action`: Action performed (e.g., "CREATE", "UPDATE", "DELETE") (required)
- `entityType`: Type of entity affected (required)
- `entityId`: ID of affected entity (required)
- `createdAt`: Timestamp of action (required)

### SocialRoom Entity

**TypeScript Interface:**
```typescript
interface SocialRoom {
  id: string
  name: string
  description?: string
  isSystemRoom: boolean
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type SocialRoom @model {
  id: ID!
  name: String!
  description: String
  isSystemRoom: Boolean!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Room name (required)
- `description`: Room description (optional)
- `isSystemRoom`: Whether this is a system-created room (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### SocialPost Entity

**TypeScript Interface:**
```typescript
interface SocialPost {
  id: string
  userId: string
  roomId: string
  text: string
  visibility: "PUBLIC" | "UNLISTED"
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to posting user (required)
- `roomId`: Reference to social room (required)
- `text`: Post content (required)
- `visibility`: Post visibility level (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### SocialComment Entity

**TypeScript Interface:**
```typescript
interface SocialComment {
  id: string
  userId: string
  postId: string
  text: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type SocialComment @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  text: String!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to commenting user (required)
- `postId`: Reference to parent post (required)
- `text`: Comment content (required)
- `createdAt`: Creation timestamp (required)

### SocialMedia Entity

**TypeScript Interface:**
```typescript
interface SocialMedia {
  id: string
  userId: string
  postId: string
  imageId: string // references Media.storageKey
  role: "PRIMARY" | "DETAIL"
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to owning user (required)
- `postId`: Reference to associated post (required)
- `imageId`: Reference to Media entity storage key (required)
- `role`: Media role in post (PRIMARY or DETAIL) (required)
- `createdAt`: Creation timestamp (required)

### SocialLike Entity

**TypeScript Interface:**
```typescript
interface SocialLike {
  id: string
  userId: string
  postId: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type SocialLike @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to liking user (required)
- `postId`: Reference to liked post (required)
- `createdAt`: Creation timestamp (required)

### SocialReport Entity

**TypeScript Interface:**
```typescript
interface SocialReport {
  id: string
  reporterUserId: string
  targetType: "POST" | "COMMENT"
  targetId: string
  reason: string
  status: "PENDING" | "REVIEWED"
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `reporterUserId`: Reference to user making report (required)
- `targetType`: Type of content being reported (required)
- `targetId`: ID of reported content (required)
- `reason`: Reason for report (required)
- `status`: Report review status (required)
- `createdAt`: Creation timestamp (required)

### SocialTrend Entity

**TypeScript Interface:**
```typescript
interface SocialTrend {
  id: string
  label: string
  type: "PALETTE" | "CHALLENGE" | "TECHNIQUE" | "THEME"
  sourceWindow: string // e.g. "7d", "30d"
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `label`: Trend label/text (required)
- `type`: Category of trend (required)
- `sourceWindow`: Time window for trend calculation (required)
- `createdAt`: Creation timestamp (required)

### MinorProfile Entity

**TypeScript Interface:**
```typescript
interface MinorProfile {
  id: string // same as userId
  skillLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type MinorProfile @model {
  id: ID! # same as userId
  skillLevel: SkillLevel!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum SkillLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}
```

**Field Details:**
- `id`: Unique identifier (same as userId) (required)
- `skillLevel`: Minor's skill level (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### MinorRoom Entity

**TypeScript Interface:**
```typescript
interface MinorRoom {
  id: string
  name: string
  type: "WORKSHOP" | "THEMED"
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `name`: Room name (required)
- `type`: Room type (WORKSHOP or THEMED) (required)
- `skillLevel`: Required skill level for room (optional)
- `isActive`: Whether room is currently active (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### MinorPost Entity

**TypeScript Interface:**
```typescript
interface MinorPost {
  id: string
  userId: string
  roomId: string
  text: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type MinorPost @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  roomId: ID!
  text: String!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to posting minor (required)
- `roomId`: Reference to minor room (required)
- `text`: Post content (required)
- `createdAt`: Creation timestamp (required)

### MinorUpload Entity

**TypeScript Interface:**
```typescript
interface MinorUpload {
  id: string
  userId: string
  postId: string
  imageId: string
  passedSafetyCheck: boolean
  failedReason?: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type MinorUpload @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  userId: ID!
  postId: ID!
  imageId: ID!
  passedSafetyCheck: Boolean!
  failedReason: String
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to uploading minor (required)
- `postId`: Reference to associated post (required)
- `imageId`: Reference to Media entity (required)
- `passedSafetyCheck`: Whether upload passed safety validation (required)
- `failedReason`: Reason for safety check failure (optional)
- `createdAt`: Creation timestamp (required)

### MinorShowcaseEntry Entity

**TypeScript Interface:**
```typescript
interface MinorShowcaseEntry {
  id: string
  userId: string
  uploadId: string
  showcasedAt: string
}
```

**GraphQL Schema:**
```graphql
type MinorShowcaseEntry @model {
  id: ID!
  userId: ID!
  uploadId: ID!
  showcasedAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to minor whose work is showcased (required)
- `uploadId`: Reference to showcased upload (required)
- `showcasedAt`: Timestamp when work was showcased (required)

### ParentApproval Entity

**TypeScript Interface:**
```typescript
interface ParentApproval {
  id: string
  parentUserId: string
  minorUserId: string
  status: "PENDING" | "APPROVED" | "REVOKED"
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `parentUserId`: Reference to approving parent (required)
- `minorUserId`: Reference to minor being approved (required)
- `status`: Approval status (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### ParentDashboardSettings Entity

**TypeScript Interface:**
```typescript
interface ParentDashboardSettings {
  id: string
  parentUserId: string
  minorUserId: string
  activityDigestFrequency: "DAILY" | "WEEKLY" | "NONE"
  flagsEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `parentUserId`: Reference to parent (required)
- `minorUserId`: Reference to minor (required)
- `activityDigestFrequency`: How often to send activity summaries (required)
- `flagsEnabled`: Whether safety flags are enabled (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### ModeratorEvent Entity

**TypeScript Interface:**
```typescript
interface ModeratorEvent {
  id: string
  userId: string
  roomId: string
  inputType: "POST" | "COMMENT"
  inputId: string
  detectedIssue?: "OFF_TOPIC" | "PERSONAL_INFO" | "INAPPROPRIATE_CONTENT"
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to user who created the content (required)
- `roomId`: Reference to room where content was posted (required)
- `inputType`: Type of content being moderated (required)
- `inputId`: Reference to the specific post or comment (required)
- `detectedIssue`: Type of issue detected (optional)
- `createdAt`: Creation timestamp (required)

### ModeratorDecision Entity

**TypeScript Interface:**
```typescript
interface ModeratorDecision {
  id: string
  eventId: string
  action: "ALLOW" | "BLOCK" | "REDIRECT" | "FLAG"
  reasonCode: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `eventId`: Reference to the moderator event (required)
- `action`: Action taken by moderator (required)
- `reasonCode`: Code explaining the decision (required)
- `createdAt`: Creation timestamp (required)

### ModeratorRedirect Entity

**TypeScript Interface:**
```typescript
interface ModeratorRedirect {
  id: string
  eventId: string
  redirectPromptText: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type ModeratorRedirect @model {
  id: ID!
  eventId: ID!
  redirectPromptText: String!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `eventId`: Reference to the moderator event (required)
- `redirectPromptText`: Text to show user for redirection (required)
- `createdAt`: Creation timestamp (required)

### ModeratorTrendFilterLog Entity

**TypeScript Interface:**
```typescript
interface ModeratorTrendFilterLog {
  id: string
  sourceTrendId: string
  resultStatus: "APPROVED" | "REJECTED"
  reason: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
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
```

**Field Details:**
- `id`: Unique identifier (required)
- `sourceTrendId`: Reference to the trend being filtered (required)
- `resultStatus`: Whether trend was approved or rejected (required)
- `reason`: Explanation for the decision (required)
- `createdAt`: Creation timestamp (required)

### SafetyRule Entity

**TypeScript Interface:**
```typescript
interface SafetyRule {
  id: string
  code: string // e.g. "NO_PERSONAL_INFO"
  description: string
  severity: "LOW" | "MEDIUM" | "HIGH"
  createdAt: string
  updatedAt: string
}
```

**GraphQL Schema:**
```graphql
type SafetyRule @model {
  id: ID!
  code: String!
  description: String!
  severity: RuleSeverity!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

enum RuleSeverity {
  LOW
  MEDIUM
  HIGH
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `code`: Rule identifier code (required)
- `description`: Human-readable rule description (required)
- `severity`: Rule severity level (required)
- `createdAt`: Creation timestamp (required)
- `updatedAt`: Last update timestamp (required)

### SafetyViolation Entity

**TypeScript Interface:**
```typescript
interface SafetyViolation {
  id: string
  userId: string
  ruleId: string
  entityType: "POST" | "COMMENT" | "UPLOAD"
  entityId: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type SafetyViolation @model {
  id: ID!
  userId: ID!
  ruleId: ID!
  entityType: ViolationEntityType!
  entityId: ID!
  createdAt: AWSDateTime!
}

enum ViolationEntityType {
  POST
  COMMENT
  UPLOAD
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `userId`: Reference to user who violated the rule (required)
- `ruleId`: Reference to the violated safety rule (required)
- `entityType`: Type of content that violated the rule (required)
- `entityId`: Reference to the specific content (required)
- `createdAt`: Creation timestamp (required)

### SafetyAction Entity

**TypeScript Interface:**
```typescript
interface SafetyAction {
  id: string
  violationId: string
  action: "WARN" | "REMOVE_CONTENT" | "TEMP_RESTRICT" | "NOTIFY_PARENT"
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type SafetyAction @model {
  id: ID!
  violationId: ID!
  action: SafetyActionType!
  createdAt: AWSDateTime!
}

enum SafetyActionType {
  WARN
  REMOVE_CONTENT
  TEMP_RESTRICT
  NOTIFY_PARENT
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `violationId`: Reference to the safety violation (required)
- `action`: Action taken in response to violation (required)
- `createdAt`: Creation timestamp (required)

### SafetyAudit Entity

**TypeScript Interface:**
```typescript
interface SafetyAudit {
  id: string
  actorId: string // system or parent
  action: string
  details: string
  createdAt: string
}
```

**GraphQL Schema:**
```graphql
type SafetyAudit @model {
  id: ID!
  actorId: ID!
  action: String!
  details: String!
  createdAt: AWSDateTime!
}
```

**Field Details:**
- `id`: Unique identifier (required)
- `actorId`: Reference to system or parent who performed the action (required)
- `action`: Description of the safety action taken (required)
- `details`: Additional details about the action (required)
- `createdAt`: Creation timestamp (required)

## Relationships
- `Project` stores an authoritative `supplyIds` array for supply assignments.
- This is a lightweight one-to-many relationship from a project to supplies without introducing a join model.
- The backend treats the array as the single source of truth and normalizes missing or legacy values to an empty array.
- Supply-to-project lookups are derived by scanning projects for a matching supply ID.

## Data Integrity Rules
Define rules that ensure consistency and prevent invalid states.

## Storage Strategy
Describe how data is stored locally and/or remotely.

## Sync Behavior
Define how data syncs across devices or sessions.

## Security Considerations
Outline how sensitive data should be protected.

## Future Extensions
Describe how the data model can evolve without breaking existing functionality.
