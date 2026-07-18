# Worktree README — Integration Branch

Current branch: feature/pre-ai-integration

Purpose: combine the validated Sol backend and Claude frontend for integration and testing.

## Sol-owned concerns
- Amplify
- Schema
- Data models
- Services
- Authorization
- Storage
- Backend validation
- Backend tests
- Shared infrastructure

## Claude-owned concerns
- React components
- Forms
- UX
- Loading/error states
- Async behavior
- Image galleries
- Frontend validation
- Mobile polish

## Cross-boundary rule

Do not redesign or silently alter another agent's domain; document issues before making cross-domain changes.

## Integration exception

Changes touching both domains are allowed only when necessary to connect the already-approved backend and frontend contracts.
