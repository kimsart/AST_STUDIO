# AST Studio build notes

## Current checkpoint

Date: 2026-05-16  
Branch: layout-three-zone-dashboard  
Repo path: C:\Users\kimsa\AST_STUDIO  
Package manager: npm  
Dev command: npm run dev  
Local preview: http://localhost:5173/

## Current status

AST Studio is running locally through Turbo and Vite.

The current build has the three-zone/bento dashboard layout restored and visually intact enough for MVP/beta. The design is not yet at final mockup quality, but it is usable and recognizable as the AST Studio product direction.

VS Code Problems tab is clear.

Git status is clean.

Branch is up to date with origin/layout-three-zone-dashboard.

## What happened today

Opened VS Code and saw TypeScript/React-related errors in WorkspaceBentoGrid.tsx.

Errors included:
- Could not find declaration file for react/jsx-runtime
- JSX element implicitly has type any
- children implicitly has any type
- no index signature errors

Initial assumption was that React type packages might be missing.

Tried pnpm, but the repo reported that it is configured to use npm, not pnpm.

Ran npm run dev and confirmed the app launches correctly.

VS Code Problems tab cleared after the environment refreshed.

Created a temporary custom VS Code theme JSON file, then removed it because it was not worth the distraction.

Confirmed git working tree is clean.

## Important decisions

Do not convert this repo to pnpm right now.

Use npm for this repo.

Do not redesign the dashboard right now.

The current dashboard is good enough for MVP/beta unless something blocks usability.

Focus next on beta readiness, navigation, functionality, and obvious broken pieces.

## Next punch list

- Confirm main navigation works
- Confirm three-zone layout behaves on desktop
- Confirm project cards display correctly
- Confirm supply/inventory cards display correctly
- Confirm right-side studio/chat/help panel is acceptable for beta
- Identify missing beta-critical features
- Avoid cosmetic rabbit holes unless they block usability
