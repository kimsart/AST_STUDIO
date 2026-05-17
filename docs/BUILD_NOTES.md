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
## 2026-05-16

Worked on: Phase 2A functional wiring.

Changed:
- Connected dashboard cards to centralized mock data.
- Added project selection behavior.
- Added inventory filter state.
- Added QuickActions feedback for placeholder actions.

Confirmed working:
- App runs locally with `npm run dev`.
- Dashboard remains visually intact.
- Quick action buttons now respond.
- Project cards and inventory filters are no longer static-only.

Problems:
- None known.

Next:
- Phase 2B: mock Add Project and Add Supply forms.
Deferred:
- Palette cleanup from Phase 2B.
- Some new states/buttons lean too green/teal.
- Fix after MVP functionality pass, before public beta screenshots or pitch/demo assets.
## 2026-05-16

Worked on: Phase 2C browser persistence.

Changed:
- Added localStorage persistence for projects and supplies.
- Wired Dashboard state to load saved projects and supplies.
- Saved updated project and supply state after changes.
- Kept mockData.js as fallback seed data.

Confirmed working:
- Added project persists after refresh.
- Added supply persists after refresh.
- Existing dashboard behavior remains intact.
- No UI, routing, palette, or layout changes.

Problems:
- None known.

Next:
- Continue MVP functionality pass.
- Decide whether routing or project/supply detail behavior comes next.
- Palette cleanup remains deferred until after MVP behavior is stable.
## 2026-05-16

Worked on: Phase 2C browser persistence.

Changed:
- Added local browser persistence for projects and supplies.
- Wired dashboard project and supply state to localStorage helpers.
- Projects and supplies now survive browser refresh.

Confirmed working:
- Added project persisted after refresh.
- Added supply persisted after refresh.
- App still runs locally.
- Dashboard layout remains intact.

Problems:
- Persistence is browser-local only.
- Data is still tied to the current browser/device.
- Cloud persistence will be needed before serious/public beta testing.

Next:
- Decide whether Phase 2D should be routing, detail views, export safety, or cloud persistence planning.
## 2026-05-16

Worked on: Phase 2D export safety.

Changed:
- Added JSON export for local AST Studio data.
- Export includes app label, export timestamp, version, projects, and supplies.
- Fixed project duplication caused by mock projects being injected after sessionProjects became the single source of truth.

Confirmed working:
- Export Data downloads a JSON file.
- Export includes current projects and supplies.
- Newly added projects and supplies are included in export.
- Projects no longer duplicate.
- Clicking a project highlights the correct item.
- Dashboard layout remains intact.

Problems:
- Export is backup-only. Import is not built yet.
- Browser-local persistence still depends on the current browser/device.

Next:
- Phase 2E: add JSON import/restore, or defer import and build detail views.
git status
git add apps/web/src/dashboard/Dashboard.jsx apps/web/src/utils/localStorage.js
git commit -m "Add JSON import restore for local studio data"
git push
git status
Future import decision:
- JSON import/export is the first backup system for MVP safety.
- Before broader beta, add artist-friendly import options.
- Priority import formats:
  1. CSV for spreadsheets
  2. Excel .xlsx if simple and safe
  3. Copy/paste table import
  4. Photo/receipt/barcode import later
- User-facing copy should avoid technical language like JSON where possible.
- Rename JSON export in the UI later to something like “Backup Studio Data” and “Restore Backup.”
## 2026-05-16

Worked on: Phase 3A-1 project-supply linking data model.

Changed:
- Added `supplyIds` arrays to project objects.
- Added `usedInProjectIds` arrays to supply objects.
- Added normalization for older localStorage data.
- Updated add project and add supply flows to include linking fields.
- Updated import flow to normalize older backup files.

Confirmed working:
- App loads with existing projects and supplies.
- New projects include `supplyIds: []`.
- New supplies include `usedInProjectIds: []`.
- Exported JSON includes the new linking fields.
- Older data can be normalized without crashing the app.

Problems:
- No assignment UI yet.
- The linking fields exist, but users cannot connect projects and supplies yet.

Next:
- Phase 3A-2: add a minimal assign supplies to project interaction.
## 2026-05-16

Worked on: Phase 3A-2 supply assignment.

Changed:
- Added the ability to assign existing supplies to a selected project.
- Added a compact supply assignment UI inside the selected project detail block.
- Updated project `supplyIds` and supply `usedInProjectIds` together.
- Prevented duplicate supply assignments.

Confirmed working:
- Selecting a project shows the supply assignment area.
- Assigning a supply adds it to the project.
- Assigned supplies disappear from the assignment dropdown.
- Assignments persist after refresh.
- Exported JSON includes linked project and supply IDs.

Problems:
- No unlink/remove behavior yet.
- UI is functional but still MVP-simple.

Next:
- Phase 3A-3: show linked supply counts/details more clearly, or add unassign behavior.
## 2026-05-16

Worked on: Phase 3A-3 supply unassignment.

Changed:
- Added ability to remove an assigned supply from a selected project.
- Updated both project `supplyIds` and supply `usedInProjectIds` when unassigning.
- Assigned supplies now have a compact remove control.
- Removed supplies return to the available assignment dropdown.

Confirmed working:
- Supplies can be assigned to projects.
- Supplies can be removed from projects.
- Project and supply relationship data updates on both sides.
- Changes persist after refresh through localStorage.
- Exported JSON reflects the updated links.

Problems:
- UI is still MVP-simple.
- No full project or supply detail view yet.
- No photo support yet.
- No cloud sync yet.

Next:
- Phase 3A-4: show supply usage and project links more clearly.
- After Phase 3A is stable, move to photos or cloud persistence planning.