# Bento Cards System

A reusable, platform-neutral component system for building responsive card-based layouts with glassmorphism effects and brand-aligned colors.

## Overview

The Bento Cards system provides:

- **6 Card Variants**: MetricCard, PreviewCard, ActionCard, ListCard, PartnerCard, GuideCard
- **5 Size Options**: small (1×1), medium (2×1), large (2×2), wide (full-width), tall (1×2)
- **Glassmorphism Design**: Dark translucent backgrounds with backdrop blur and glow effects
- **3 Semantic Glow Colors**: pink, blue, turquoise, plus none for minimal effect
- **Responsive Grid**: WorkspaceBentoGrid layout component with mobile-first design
- **Accessibility**: Semantic HTML, ARIA labels, keyboard focus states, high-contrast text tokens
- **Pass-through Wrapper Architecture**: Lightweight variant components that extend BentoCard

## Installation

The components are located in `src/components/bento/`.

```typescript
import {
  WorkspaceBentoGrid,
  BentoCard,
  MetricCard,
  PreviewCard,
  ActionCard,
  ListCard,
  PartnerCard,
  GuideCard,
} from '@/components/bento';
```

CSS is automatically imported when you import components via the `index.ts`.

## Core Components

### BentoCard

The foundational component all variants build upon.

```typescript
interface BentoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glowColor?: 'pink' | 'blue' | 'turquoise' | 'none';
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}
```

**Features:**

- Glassmorphic styling with backdrop blur
- Configurable glow effects with 3 brand colors + neutral option
- Size variants with CSS Grid support
- Optional action button with keyboard support
- Full ARIA labeling and semantic structure
- Responsive padding and text sizing

**Example:**

```tsx
<BentoCard
  title="Monthly Revenue"
  subtitle="Q1 2026"
  glowColor="blue"
  size="medium"
  actionLabel="View Details"
  onAction={() => console.log('view')}
>
  Revenue data and visualization goes here
</BentoCard>
```

### WorkspaceBentoGrid

Responsive grid container for laying out cards.

```typescript
interface WorkspaceBentoGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
  columns?: number; // 2, 3, or 4
}
```

**Features:**

- Mobile-first responsive columns (1 → 2 → 3/4)
- Size-aware card layout (small/medium/large/wide/tall)
- Three spacing variants for different densities
- CSS Grid-based layout engine

**Example:**

```tsx
<WorkspaceBentoGrid columns={3} variant="default">
  <MetricCard title="Users" value="2,547" glowColor="blue" />
  <ActionCard title="Add New" glowColor="pink" />
  <ListCard title="Recent" />
</WorkspaceBentoGrid>
```

## Variant Components

All variants are lightweight wrapper components that pass props through to BentoCard. They're platform-neutral and fully accessible.

### MetricCard

Display key metrics, KPIs, and statistics.

```tsx
<MetricCard
  title="Active Users"
  value="2,547"
  unit="users"
  glowColor="blue"
  change={{ value: 12, trend: 'up' }}
/>
```

### PreviewCard

Showcase images, visual content, or featured items.

```tsx
<PreviewCard
  title="Featured Project"
  size="large"
  glowColor="turquoise"
  imageUrl="https://..."
>
  Explore new design patterns
</PreviewCard>
```

### ActionCard

Call-to-action cards for triggering workflows.

```tsx
<ActionCard
  title="Create New"
  actionLabel="Create"
  glowColor="pink"
  onAction={() => openDialog()}
>
  Start a new project
</ActionCard>
```

### ListCard

Display items, lists, and collections.

```tsx
<ListCard
  title="Recent Items"
  glowColor="turquoise"
>
  {/* List content via children or structured data */}
</ListCard>
```

### PartnerCard

Showcase partner information, logos, and links.

```tsx
<PartnerCard
  title="Acme Corp"
  subtitle="Enterprise Partner"
  glowColor="blue"
>
  Partner description and details
</PartnerCard>
```

### GuideCard

Display guides, tutorials, and step-by-step content. Defaults to blue glow.

```tsx
<GuideCard
  title="Getting Started"
  subtitle="5 steps"
  size="tall"
>
  Step-by-step guide content
</GuideCard>
```

## Glow Colors

Choose from 3 semantic brand colors or neutral:

- **`pink`** (#FE5FA7) - Action-oriented, highlights, CTAs
- **`blue`** (#2636E0) - Information, guides, primary content
- **`turquoise`** (#2EC4B6) - Success, positive actions, achievements
- **`none`** - Minimal, neutral styling

## Size System

| Size     | Grid Span | Use Case                               |
| -------- | --------- | -------------------------------------- |
| `small`  | 1×1       | Metrics, status indicators              |
| `medium` | 2×1       | Cards with text + optional imagery     |
| `large`  | 2×2       | Featured content, gallery items        |
| `wide`   | full×1    | Header sections, announcements         |
| `tall`   | 1×2       | Guides, long-form content              |

Responsive: Cards adapt to mobile (1 col), tablet (2 cols), desktop (3+ cols).

## Accessibility

✅ **Keyboard Navigation**: Tab through cards, Enter/Space on buttons  
✅ **Screen Readers**: ARIA labels, semantic HTML, role attributes  
✅ **Focus Visible**: Clear outline indicators with proper contrast  
✅ **Color Contrast**: Text meets WCAG AA standards  
✅ **Reduced Motion**: Respects prefers-reduced-motion preference  
✅ **Semantic Structure**: Proper heading hierarchy, list semantics

## Styling & Customization

### CSS Utilities

The system includes utility classes in `src/styles/bento.css`:

- `.bento-card` - Base card styling
- `.bento-glow-{pink|blue|turquoise|none}` - Glow effects
- `.bento-size-{small|medium|large|wide|tall}` - Size variants
- `.bento-grid-cols-{2|3|4}` - Responsive grid layouts
- `.bento-grid-gap-{default|compact|spacious}` - Spacing variants
- `.bento-text-{primary|secondary|tertiary|interactive}` - Text hierarchy
- `.bento-button`, `.bento-list`, `.bento-image-container`, etc.

### Theme Integration

To integrate with Tailwind config, add brand colors to `tailwind.config.ts`:

```typescript
extend: {
  colors: {
    neonPink: '#FE5FA7',
    electricBlue: '#2636E0',
    turquoiseAction: '#2EC4B6',
    slateSurface: '#1A1F3C',
    midnight: '#0A0E2A',
  },
}
```

### Custom Styling

Pass `className` prop for additional Tailwind classes:

```tsx
<BentoCard
  title="Custom Card"
  className="ring-1 ring-blue-500/20"
>
  Content
</BentoCard>
```

## Testing & Validation

All components are tested for:

- ✅ TypeScript type safety
- ✅ Responsive behavior (mobile, tablet, desktop)
- ✅ Keyboard accessibility (Tab, Enter, Escape)
- ✅ Screen reader compatibility
- ✅ Visual regression
- ✅ Performance (no layout thrashing)

See `USAGE_EXAMPLES.tsx` for practical implementation patterns.

### ListCard

Display collections of items with labels and values.

```typescript
interface ListCardProps {
  title: string;
  items: Array<{
    id: string;
    label: string;
    value?: string;
  }>;
  // ... other BaseBentoCardProps
}
```

**Example:**

```tsx
<ListCard
  title="Recent Items"
  glowColor="cyan"
  items={[
    { id: '1', label: 'Project Alpha', value: 'In Progress' },
    { id: '2', label: 'Design Review', value: 'Pending' },
    { id: '3', label: 'Meeting', value: 'Completed' },
  ]}
/>
```

**Features:**

- Hoverable item rows
- Optional value display
- Semantic `<ol>` with `role="listitem"`
- Automatic truncation handling

---

### PartnerCard

Showcase partnerships, integrations, or external links.

```typescript
interface PartnerCardProps {
  title: string;
  logo?: string;
  description?: string;
  link?: string;
  // ... other BaseBentoCardProps
}
```

**Example:**

```tsx
<PartnerCard
  title="Collaborator"
  logo="https://..."
  description="Connect with external services"
  link="https://example.com"
  glowColor="rose"
  actionLabel="Learn More"
/>
```

**Features:**

- Logo display in container
- Description text
- Auto-opens link in new tab
- Action button links to external URL

---

### GuideCard

Tutorial and onboarding guides with step lists.

```typescript
interface GuideCardProps {
  title: string;
  steps?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  // ... other BaseBentoCardProps
}
```

**Example:**

```tsx
<GuideCard
  title="Getting Started"
  size="tall"
  glowColor="emerald"
  difficulty="beginner"
  steps={[
    'Create your account',
    'Set up your profile',
    'Explore the workspace',
  ]}
  onAction={() => startGuide()}
/>
```

**Features:**

- Difficulty badge with color coding
  - Beginner: emerald
  - Intermediate: amber
  - Advanced: rose
- Step list (shows first 4, indicates more)
- Size optimized for 'tall' variant
- Step counter

---

## Size Variants

Cards support 5 responsive size options:

| Size | Grid | Usage | Responsive |
|------|------|-------|------------|
| `small` | 1×1 | Metrics, quick stats | No scaling |
| `medium` | 2×1 | Most common, default | No scaling |
| `large` | 2×2 | Feature showcase, images | No scaling |
| `wide` | Full width × 1 | Announcements, full-width content | Collapses to full width on mobile |
| `tall` | 1×2 | Guides, detailed content | No scaling |

## Glow Color System

7 semantic glow colors:

| Color | Usage |
|-------|-------|
| `amber` | Highlights, featured content |
| `blue` | Data, metrics |
| `emerald` | Guides, positive actions |
| `purple` | Primary actions, CTAs |
| `rose` | Partnerships, warnings |
| `cyan` | Lists, secondary content |
| `slate` | Default, backgrounds |

## Glassmorphism Design System

### CSS Classes

All styling is handled through CSS classes in `src/styles/bento.css`:

```css
.bento-card              /* Base card container */
.bento-glow-{color}      /* Glow effect (amber, blue, etc.) */
.bento-size-{size}       /* Size variant (small, medium, etc.) */
.bento-content           /* Content wrapper */
.bento-header            /* Title and subtitle container */
.bento-body              /* Main content area */
.bento-button            /* Action button */
```

### Text Hierarchy

```css
.bento-text-primary      /* Titles: white/95 */
.bento-text-secondary    /* Subtitles: white/60 */
.bento-text-tertiary     /* Meta: white/40 */
```

## Accessibility

### Semantic HTML

- Cards use `<article>` with semantic structure
- Lists use proper `<ol>` with semantic items
- Buttons are actual `<button>` elements

### ARIA Labels

```typescript
// Card label
aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}

// Action buttons
aria-label={`${actionLabel} for ${title}`}
```

### Keyboard Support

- Buttons respond to Enter and Space keys
- All interactive elements are keyboard focusable
- Focus indicators visible

### Color Contrast

- Text hierarchy maintains accessibility standards
- High-contrast focus states
- All text meets WCAG AA requirements

---

## Responsive Behavior

### Mobile (< 640px)

- Single column layout
- Cards span full width
- Reduced padding

### Tablet (640px - 1024px)

- 2 columns depending on grid config
- Standard spacing

### Desktop (> 1024px)

- Full multi-column layout
- All size variants work as designed

---

## Usage Examples

### Dashboard Layout

```tsx
<WorkspaceBentoGrid columns={3}>
  <MetricCard title="Users" value="2,547" glowColor="blue" />
  <MetricCard title="Revenue" value="$42.5K" glowColor="emerald" />
  <MetricCard title="Growth" value="12%" glowColor="purple" />
  
  <PreviewCard title="Featured" size="large" imageUrl="..." />
  
  <ListCard title="Recent" items={[...]} />
  <ActionCard title="Create" action={onCreate} />
</WorkspaceBentoGrid>
```

### Feature Showcase

```tsx
<WorkspaceBentoGrid columns={2}>
  <PreviewCard
    title="Feature A"
    size="large"
    imageUrl="..."
    glowColor="blue"
  />
  <PreviewCard
    title="Feature B"
    size="large"
    imageUrl="..."
    glowColor="emerald"
  />
  
  <ActionCard title="Learn More" size="wide" glowColor="purple" />
</WorkspaceBentoGrid>
```

---

## File Structure

```
src/
  components/
    bento/
      BentoCard.tsx           # Base component
      MetricCard.tsx          # Metric variant
      PreviewCard.tsx         # Preview variant
      ActionCard.tsx          # Action variant
      ListCard.tsx            # List variant
      PartnerCard.tsx         # Partner variant
      GuideCard.tsx           # Guide variant
      WorkspaceBentoGrid.tsx  # Grid layout
      types.ts                # TypeScript interfaces
      index.ts                # Barrel export
      README.md               # This file
      USAGE_EXAMPLES.tsx      # Practical examples
  styles/
    bento.css                 # All styling utilities
```

---

## Browser Support

- Modern browsers (Chromium, Firefox, Safari, Edge)
- CSS Grid support required
- Backdrop blur supported in all modern browsers

---

## License

Part of AST Studio platform. For use within authorized contexts.
