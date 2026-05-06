This file is intentionally short so Copilot can load it quickly.
# Studio Entities (Core Artist Tools)

This file defines the core data models for AST Studio’s artist‑centric features.  
These models are stable, non‑social, and safe to use across all future app splits.

Each entity includes TypeScript + GraphQL patterns for Copilot reference.

---

## Vendor
### TypeScript
```ts
interface Vendor {
  id: string
  name: string
  website?: string
  createdAt: string
  updatedAt: string
}
type Vendor @model {
  id: ID!
  name: String!
  website: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Location {
  id: string
  name: string
  address?: string
  createdAt: string
  updatedAt: string
}
type Location @model {
  id: ID!
  name: String!
  address: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Supply {
  id: string
  name: string
  vendorId?: string
  locationId?: string
  quantity: number
  lowStockThreshold?: number
  createdAt: string
  updatedAt: string
}
type Supply @model {
  id: ID!
  name: String!
  vendorId: ID
  locationId: ID
  quantity: Int!
  lowStockThreshold: Int
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}
type Project @model {
  id: ID!
  name: String!
  description: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Artwork {
  id: string
  projectId?: string
  title: string
  notes?: string
  createdAt: string
  updatedAt: string
}
type Artwork @model {
  id: ID!
  projectId: ID
  title: String!
  notes: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}
type Client @model {
  id: ID!
  name: String!
  email: String
  phone: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Session {
  id: string
  clientId?: string
  projectId?: string
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}
type Session @model {
  id: ID!
  clientId: ID
  projectId: ID
  date: AWSDateTime!
  notes: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface InventoryLog {
  id: string
  supplyId: string
  change: number
  reason?: string
  createdAt: string
}
type InventoryLog @model {
  id: ID!
  supplyId: ID!
  change: Int!
  reason: String
  createdAt: AWSDateTime!
}
interface Exhibition {
  id: string
  name: string
  date: string
  location?: string
  createdAt: string
  updatedAt: string
}
type Exhibition @model {
  id: ID!
  name: String!
  date: AWSDateTime!
  location: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
interface Media {
  id: string
  ownerId: string
  storageKey: string
  createdAt: string
}
type Media @model {
  id: ID!
  ownerId: ID!
  storageKey: String!
  createdAt: AWSDateTime!
}
interface Tag {
  id: string
  label: string
}

interface Taggable {
  id: string
  tagId: string
  entityId: string
  entityType: string
}
type Tag @model {
  id: ID!
  label: String!
}

type Taggable @model {
  id: ID!
  tagId: ID!
  entityId: ID!
  entityType: String!
}
interface AuditLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
}
type AuditLog @model {
  id: ID!
  userId: ID!
  action: String!
  entityType: String!
  entityId: ID!
  createdAt: AWSDateTime!
}