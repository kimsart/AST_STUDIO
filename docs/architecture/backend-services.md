# Backend Services

## Purpose
Define the backend architecture, services, and responsibilities that support AST Studio.

## Service Overview
Supply and Project persistence are accessed through typed services. Generated
Amplify clients are composed in dedicated adapters and are injectable for
tests. React components must not call these models directly once migrated to
these boundaries.

## Responsibilities
`SupplyService` validates domain input, maps Amplify records, checks returned
GraphQL errors, normalizes optional collections, and standardizes persistence
errors. It preserves artist-authored terminology and must not classify,
canonicalize, or overwrite it.

Recognition, barcode lookup, and AI providers are outside this service. Their
future outputs are editable suggestions and require explicit user confirmation
before a create or update call.

## API Structure
The initial boundary exposes paginated list, get, create, update, and delete
operations for the existing `Supply` model. The model name is retained for
migration compatibility but represents general artist-owned inventory,
including materials, tools, equipment, and consumables.

## Data Persistence
Names, categories, subcategories, item types, units, barcodes, and tags are
open user-authored values. Tags are stored as an owner-contained string array
on `Supply`; no global catalog or taxonomy model is used.

`quantityValue` is the authoritative fractional-capable value. During the
compatibility window, reads resolve `quantityValue ?? quantity ?? null`.
Integer writes may populate both fields; fractional writes never populate or
round into legacy `quantity`.

Migration will be lazy and owner-scoped: a later reviewed migration utility may
populate `quantityValue` from `quantity` while an authenticated owner processes
their own legacy records. This schema/service slice does not mutate records on
read and does not perform a global backfill. Removal of `quantity` and
`imageUrl` requires a later reviewed migration.

`imageKey` stores an Amplify Storage key. Legacy `imageUrl` remains temporarily,
and this schema change does not alter current upload behavior.

Project media retains `coverImageUrl` as the first/cover image for backward
compatibility. Optional `imageKeys` stores only additional gallery Storage
paths, in display order. Missing `imageKeys` on legacy records normalizes to an
empty array, so no data backfill is required. This field does not itself change
the current Dashboard upload or persistence behavior.

## Authentication & Authorization
`Supply` retains model-level owner authorization. Mutation payloads are built
from an explicit allowlist and never accept or forward caller-supplied owner
fields.

## Performance Requirements
Define expectations for speed, reliability, and responsiveness.

## Security Requirements
Every Amplify result must be checked for both returned data and GraphQL errors;
the service must not rely only on thrown exceptions. Storage keys and inventory
records remain owner-scoped.

## Scalability Considerations
Describe how backend services should scale as usage grows.

## Future Backend Extensions
Possible later additions include owner-defined terminology preferences and
non-mutating recognition suggestion services. Neither is required by the
current schema.
