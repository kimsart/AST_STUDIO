/**
 * @file Bento Cards System - Complete Reusable Component Library
 *
 * OVERVIEW
 * --------
 * A platform-neutral, glassmorphic card system for building responsive layouts
 * with TypeScript, React, and Tailwind CSS.
 *
 * QUICK START
 * -----------
 * import { WorkspaceBentoGrid, MetricCard, ActionCard } from '@/components/BentoCards';
 *
 * <WorkspaceBentoGrid columns={3}>
 *   <MetricCard title="Users" value="2,547" glowColor="blue" />
 *   <ActionCard title="Create" action={onCreate} glowColor="purple" />
 * </WorkspaceBentoGrid>
 *
 * COMPONENTS
 * ----------
 * 1. BaseBentoCard     - Foundational component with all props
 * 2. MetricCard        - KPIs and statistics (size: small)
 * 3. PreviewCard       - Images and visual content (size: configurable)
 * 4. ActionCard        - Call-to-action buttons (size: medium/large)
 * 5. ListCard          - Item collections (size: medium)
 * 6. PartnerCard       - External integrations (size: medium)
 * 7. GuideCard         - Tutorials and onboarding (size: tall)
 * 8. WorkspaceBentoGrid - Responsive grid layout
 *
 * SIZES
 * -----
 * small:  1×1 (one column, one row)
 * medium: 2×1 (two columns, one row)
 * large:  2×2 (two columns, two rows)
 * wide:   full width × 1 row
 * tall:   1×2 (one column, two rows)
 *
 * GLOW COLORS
 * -----------
 * amber   - Warm highlights
 * blue    - Data and metrics
 * emerald - Success states
 * purple  - Primary actions
 * rose    - Partnerships
 * cyan    - Info and lists
 * slate   - Neutral/default
 *
 * FEATURES
 * --------
 * ✓ Glassmorphism design (backdrop-blur, translucent backgrounds)
 * ✓ Configurable glow effects per color
 * ✓ Responsive CSS Grid layout
 * ✓ 5 size variants
 * ✓ 6 semantic card types
 * ✓ Full accessibility (ARIA, keyboard, semantic HTML)
 * ✓ TypeScript support
 * ✓ Tailwind CSS integration
 * ✓ Mobile-first responsive design
 * ✓ Dark mode optimized
 *
 * ACCESSIBILITY
 * --------------
 * ✓ Semantic HTML structure
 * ✓ ARIA labels for all interactive elements
 * ✓ Keyboard navigation support (Enter/Space)
 * ✓ Focus ring indicators
 * ✓ High-contrast text tokens
 * ✓ Reduced motion support (via CSS)
 *
 * CUSTOMIZATION
 * --------------
 * - Colors: Modify glowColorMap in BaseBentoCard.tsx
 * - Sizes: Extend sizeMap in BaseBentoCard.tsx
 * - Spacing: Use variant prop in WorkspaceBentoGrid
 * - Styling: Extend via className prop on any component
 *
 * FILES
 * -----
 * ├── types.ts                  - TypeScript interfaces
 * ├── BaseBentoCard.tsx         - Core component
 * ├── MetricCard.tsx            - Metrics variant
 * ├── PreviewCard.tsx           - Preview variant
 * ├── ActionCard.tsx            - Action variant
 * ├── ListCard.tsx              - List variant
 * ├── PartnerCard.tsx           - Partner variant
 * ├── GuideCard.tsx             - Guide variant
 * ├── WorkspaceBentoGrid.tsx    - Grid layout
 * ├── BentoGridExample.tsx      - Complete example
 * ├── tailwind.config.ts        - Tailwind utilities
 * ├── index.ts                  - Barrel export
 * └── README.md                 - Full documentation
 *
 * TOKENS
 * ------
 * Text Colors:
 *   Primary:   text-white/95   (titles)
 *   Secondary: text-white/60   (subtitles)
 *   Tertiary:  text-white/40   (meta)
 *
 * Backgrounds:
 *   Base:      from-white/5 to-white/0
 *   Border:    border-white/10
 *   Hover:     hover:bg-white/10
 *
 * Effects:
 *   Blur:      backdrop-blur-md
 *   Rounded:   rounded-2xl
 *   Glow:      shadow-[0_0_30px_rgba(...)]
 *
 * EXAMPLES
 * --------
 *
 * // Metric Dashboard
 * <MetricCard
 *   title="Active Users"
 *   value={2547}
 *   glowColor="blue"
 *   change={{ value: 12, trend: 'up' }}
 * />
 *
 * // Image Preview
 * <PreviewCard
 *   title="Featured"
 *   size="large"
 *   imageUrl="/preview.jpg"
 *   glowColor="amber"
 * />
 *
 * // Action Button
 * <ActionCard
 *   title="Create New"
 *   action={() => openDialog()}
 *   glowColor="purple"
 * >
 *   Start a new project
 * </ActionCard>
 *
 * // Item List
 * <ListCard
 *   title="Recent"
 *   glowColor="cyan"
 *   items={[
 *     { id: '1', label: 'Project A', value: 'Done' },
 *   ]}
 * />
 *
 * // External Link
 * <PartnerCard
 *   title="Integration"
 *   link="https://example.com"
 *   glowColor="rose"
 * />
 *
 * // Tutorial
 * <GuideCard
 *   title="Getting Started"
 *   size="tall"
 *   difficulty="beginner"
 *   steps={['Step 1', 'Step 2']}
 * />
 *
 * RESPONSIVE LAYOUT
 * -----------------
 * <WorkspaceBentoGrid columns={3} variant="default">
 *   {/* Cards automatically adjust:
 *      - Mobile: 1 column
 *      - Tablet: 2 columns
 *      - Desktop: 3 columns
 *   */}
 * </WorkspaceBentoGrid>
 *
 * BROWSER SUPPORT
 * ---------------
 * ✓ Chrome/Edge (latest)
 * ✓ Firefox (latest)
 * ✓ Safari (latest)
 * ✓ Mobile browsers
 *
 * Note: CSS Grid and backdrop-blur required
 *
 * PERFORMANCE
 * -----------
 * ✓ Optimized re-renders with React.memo
 * ✓ Lazy loading for images
 * ✓ Minimal animation overhead
 * ✓ CSS Grid layout (GPU accelerated)
 *
 * FUTURE EXTENSIONS
 * ------------------
 * - Skeleton loading states
 * - Drag-and-drop reordering
 * - Card animations (entrance, transitions)
 * - Custom theme builder
 * - Dark/light mode toggle
 * - Density selector (compact/standard/spacious)
 */

// Re-export everything for convenience
export * from './index';
