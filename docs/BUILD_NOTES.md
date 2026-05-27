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
## Build checkpoint: MVP controls and Phase 3A stabilization

Completed core MVP management controls and stabilized Phase 3A Linking / Studio Brain.

### Completed

- Add, edit, and delete projects
- Add, edit, and delete art supplies
- Inline workspace editing for projects and supplies
- Attach and remove supplies from projects
- Bidirectional project/supply linking
- Supply-side project usage display
- Delete cleanup to prevent orphaned project/supply references
- Import cleanup for broken link IDs
- Duplicate project title handling with artist-friendly choices
- localStorage persistence for edits, deletes, and links
- JSON import/export still working
- Removed misleading supply progress bars
- Removed duplicate upper supply preview list

### Product decisions

- Left panel stays high-level navigation only.
- Art Supplies and Projects open into the center workspace.
- Routine viewing/editing should happen inline, not in popups.
- Popups are acceptable for Add forms and delete confirmations during MVP.
- Generic supply progress bars do not fit artist workflows.
- Nested supply bento navigation is planned for beta.

### Next planned task

Architecture plan for beta supply bento navigation:

Art Supplies workspace → category bento boxes → subcategory boxes → filtered supply list.

Examples:
- Paint → Watercolor, Acrylic, Oil, Gouache, Ink
- Brushes → Watercolor brushes, Acrylic brushes, Oil brushes, Detail brushes
- Pastels → Oil pastel, Soft pastel, Chalk pastel, Pan pastel

### Deferred polish

- Full pre-beta color normalization across cards, buttons, badges, borders, glows, and overlays
- Styled delete confirmations
- Undo or soft delete
- Deeper supply condition system
- Phase 3B Studio Eyes / photo support
## Build checkpoint: bento workspace navigation

Completed the first beta version of bento workspace navigation for both Art Supplies and Projects.

### Completed

- Art Supplies workspace now opens with category bento boxes
- Supply categories can open into nested subcategory bento boxes
- Subcategory navigation opens the filtered Inventory Overview
- Supply bento navigation uses existing `category` data only
- No supply subcategory data model changes were made in this pass
- Projects workspace now opens with project bento navigation
- Project status boxes filter projects by canonical status
- Project result views now use visual project cards instead of plain lists
- Project cards stay simple when closed: title, status, and NEW badge if applicable
- Open project detail cards preserve inline view/edit behavior
- Project detail cards include a placeholder area for future artwork/sketch/photo
- Added a Needs Sorting safety view for projects with missing or non-canonical status
- Series and Groups are shown as future organization areas without fake filtering
- Art Supplies and Projects both use the center workspace for real work
- Left panel remains high-level navigation only

### Product decisions

- Left panel should not contain nested category trees or expanding project structures
- Center workspace is where categories, subcategories, project groups, series, and working lists belong
- Supply subcategories are visual navigation only until real subcategory tagging is added
- Project Groups and Series will be separate concepts
- A project may belong to multiple groups and one or more series
- Each group or series should eventually nest projects by status: Planned, In Progress, On Hold, and Completed
- Projects with missing or older status values should never disappear; they belong in Needs Sorting
- Routine viewing and editing should happen inline in the workspace, not in popups
- Popups are acceptable for Add forms and delete confirmations during MVP

### Next planned work

- Add real supply subcategory tagging
- Add Project Groups and Project Series data model
- Add `groupIds` and `seriesIds` to projects
- Add status nesting inside each group and series
- Add group/series assignment controls to project detail cards
- Pre-beta visual color normalization across cards, buttons, badges, borders, glows, and overlays
- Styled delete confirmations
- Undo or soft delete
- Phase 3B Studio Eyes / project and supply photo support

### Deferred polish

- Mobile tuning for bento grids
- Thumbnail placeholder sizing and visual balance
- Hover/focus glow consistency within the locked AST palette
- Stronger project card visual polish after real images/photos exist
- Export compatibility research for artist archive, portfolio, gallery, marketplace, and insurance platforms
## Build checkpoint: alpha workspace navigation and data actions

Completed another alpha workspace pass focused on navigation, visual work areas, and core data controls.

### Completed

- Added the default Home workspace with four bento cards:
  - Partner Spotlight
  - This Day in Art History
  - Famous Artist Quote placeholder
  - Featured Artist placeholder
- Added Art Supplies bento navigation:
  - Category bento boxes
  - Nested subcategory bento boxes
  - Supply result views
- Added Projects bento navigation:
  - All Projects
  - Planned
  - In Progress
  - On Hold
  - Completed
  - Needs Sorting
  - Series placeholder
  - Groups placeholder
- Added visual project cards instead of plain project lists
- Preserved inline project detail/edit behavior
- Preserved inline supply detail/edit behavior
- Restored Import JSON and Export Data controls
- Moved Import JSON and Export Data into the workspace header action area
- Kept + New Project and + Add Supply as the primary actions
- Confirmed import/export controls work from active workspaces

### Product decisions

- Current build should be described as an alpha preview, not beta
- Left panel remains high-level navigation only
- Center workspace is where bento navigation, project cards, supply cards, and active work happen
- Routine viewing and editing should happen inline in the workspace
- Tables/lists may become optional views later, but should not be the default artist-facing experience
- Projects should feel like an artwork/archive wall, not a plain database list
- Supplies should feel like artist-organized studio materials, not warehouse inventory
- Import/export are workspace-level data actions and belong near the top-right workspace controls

### Known follow-up work

- Fix any remaining card/detail placement issues so opened details appear near the selected card
- Prevent scroll jumps when opening or closing project/supply detail cards
- Add real supply subcategory tagging
- Add Project Groups and Project Series data model
- Add groupIds and seriesIds to projects
- Add status nesting inside each group and series
- Add placeholder image fields/slots for project and supply photos
- Full pre-beta color normalization across cards, buttons, badges, borders, glows, and overlays

### Deferred

- Live partner/product APIs
- Real image upload and thumbnail generation
- Cloud sync
- Styled delete confirmations
- Undo or soft delete
- Custom supply category management
- Phase 3B Studio Eyes/photo recognition
## Phase 3A-3: Visual baseline restoration and website logo checkpoint

### Purpose

Restore the AST Studio visual baseline so the app matches the website direction more closely before continuing beta-readiness work. This pass focused on replacing the temporary hand-built header logo, correcting the dark studio palette, reducing overused gold/cream text, and creating a cleaner color hierarchy based on the approved website/mockup direction.

### Completed

#### Logo and favicon

- Replaced the temporary JSX/text-based header logotype with the uploaded website logo asset.
- Used the horizontal logo asset in the desktop header:
  - `apps/web/public/assets/ast-logo-horizontal-cropped.png`
- Added the icon asset for favicon use:
  - `apps/web/public/assets/ast_icon_1024.png`
- Updated `apps/web/index.html` with a favicon reference.
- Kept the existing header actions:
  - `What was I working on?`
  - `Hello Artist`
- Stopped pursuing the script-style “Art Supply Tracker Studio” logotype for the app header.
- Decided the icon + wordmark logo is the primary app/website identity because it matches the website and is more usable across favicon, app icon, mobile, social, and compact UI spaces.

#### Background and palette

- Replaced the cool/navy/ocean-feeling palette with a darker plum/violet studio baseline.
- Removed the page-wide gradient background.
- Removed the visible header divider line.
- Removed header glow/shadow that was bleeding into the workspace.
- Confirmed the current visual baseline uses:
  - Page/header: `#050009`
  - Main panels: `#0B0018`
  - Card interiors: `#120724`
- Kept the dashboard dark, structured, and readable.
- Avoided returning to blue/green atmosphere, emerald glow, or broad colored haze.
- Preserved thin panel/card outlines and accent colors.

#### Color hierarchy

- Reduced the overuse of warm gold/cream text.
- Kept gold/cream for semantic or limited accent use only, such as warning/status contexts.
- Added/used brand gradient and accent utilities aligned to the website direction.
- Established the working accent system:
  - Cyan: `#00E6FF`
  - Electric blue: `#2E64FF`
  - Periwinkle/blue: `#4DA3FF`
  - Violet/purple: `#8D5CFF`
  - Magenta: `#FF2FB3`
  - Soft readable body text: `#C9C3DF`
- Applied gradient treatment to major workspace headings where appropriate.
- Used accent colors for repeated headings and counts instead of defaulting everything to gold/cream.
- Avoided making lavender the new universal replacement color.

### Files intentionally changed

- `apps/web/index.html`
- `apps/web/public/assets/ast-logo-horizontal-cropped.png`
- `apps/web/public/assets/ast_icon_1024.png`
- `apps/web/src/components/DashboardHeader.jsx`
- `apps/web/src/components/HomeWorkspace.jsx`
- `apps/web/src/components/ProjectsCard.jsx`
- `apps/web/src/components/ProjectsWorkspace.jsx`
- `apps/web/src/components/SuppliesWorkspace.jsx`
- `apps/web/src/dashboard/Dashboard.jsx`
- `apps/web/src/tailwind.css`
- `tailwind.config.js`

### Guardrails followed

No intentional changes were made to:

- routing
- state variables
- data logic
- component names
- mobile behavior
- dashboard layout structure
- card content
- spacing
- typography sizing
- unrelated form behavior

### Not included in this checkpoint

The following files still have pre-existing or separate uncommitted work and should be reviewed in their own pass:

- `apps/web/src/components/forms/AddProjectFormInline.jsx`
- `apps/web/src/components/forms/AddSupplyFormInline.jsx`

The following files should be cleaned up separately if still present:

- `apps/web/public/assets/ast_logo_horizantal.png`
- `apps/web/public/assets/desktop.ini`

### Commit

Commit message used/planned:

`Restore AST visual baseline and website logo`

### Current approved visual baseline

This is the current baseline, not a forever-final palette.

- Very dark plum/violet background.
- Website logo asset in the app header.
- Icon asset used for favicon/app identity.
- Thin bright accents.
- No atmospheric glow.
- No emerald/green cast.
- No ocean-blue background.
- No universal gold, periwinkle, or lavender heading system.
- Accent colors should support the website gradient system:
  - cyan
  - blue
  - violet
  - magenta

### Next planned beta-focused work

#### Phase 3A-4: Default workspace onboarding cards

Replace the remaining placeholder/demo default workspace cards with practical beta onboarding cards.

Current placeholder/demo cards to replace:

- Partner Spotlight
- Art History
- Artist Quote
- Featured Artist / Community Spotlight

Planned beta onboarding cards:

1. Add inventory
   - Explain that users can add supplies by typing them in or importing an existing file.
   - Clearly state that photo, barcode, and AI-assisted supply recognition are coming soon.

2. Create a project
   - Explain that users can track supplies, costs, notes, and progress in one place.

3. Link supplies to projects
   - Explain that connecting materials to artworks helps estimate real project costs.

4. Import or export files
   - Explain that users can upload an existing inventory file or download a file for insurance, studio records, or backup.

Goal:

Make the default workspace useful for beta testers instead of showing fake editorial/demo content.

#### Later visual polish

- Slideshow/frame system should use the website gradient as a painted edge, not wallpaper:
  - `#00E6FF → #2E64FF → #8D5CFF → #FF2FB3`
- Use the gradient for thin outer frames, corner accents, progress indicators, and active/hover states.
- Do not use the gradient as a full background flood.