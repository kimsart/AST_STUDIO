# Bento Cards System

A reusable, platform-neutral component system for building responsive card-based layouts with glassmorphism effects.

## Overview

The Bento Cards system provides:

- **6 Card Variants**: MetricCard, PreviewCard, ActionCard, ListCard, PartnerCard, GuideCard
- **5 Size Options**: small (1x1), medium (2x1), large (2x2), wide (full-width), tall (1x2)
- **Glassmorphism Design**: Dark translucent backgrounds with backdrop blur and glow effects
- **Responsive Grid**: WorkspaceBentoGrid layout component with mobile-first design
- **Accessibility**: Semantic HTML, ARIA labels, keyboard focus states, high-contrast text
- **7 Glow Colors**: amber, blue, emerald, purple, rose, cyan, slate

## Installation

The components are located in `components/BentoCards/`.

```typescript
import {
  WorkspaceBentoGrid,
  MetricCard,
  PreviewCard,
  ActionCard,
  ListCard,
  PartnerCard,
  GuideCard,
} from '@/components/BentoCards';
```

## Core Components

### BaseBentoCard

The foundational component all variants build upon.

```typescript
interface BaseBentoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glowColor?: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'cyan' | 'slate';
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}
```

**Features:**

- Glassmorphic styling with backdrop blur
- Configurable glow effects per color
- Size variants with CSS Grid support
- Optional action button with keyboard support
- Full ARIA labeling and semantic structure

### WorkspaceBentoGrid

Responsive grid container for laying out cards.

```typescript
interface WorkspaceBentoGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
  columns?: number; // 2, 3, 4, or 'auto'
}
```

**Example:**

```tsx
<WorkspaceBentoGrid columns={3} variant="default">
  <MetricCard title="Users" value="2,547" />
  <ActionCard title="Add New" />
  <ListCard title="Recent" items={...} />
</WorkspaceBentoGrid>
```

## Variant Components

### MetricCard

Display key metrics, KPIs, and statistics.

```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  // ... other BaseBentoCardProps
}
```

**Example:**

```tsx
<MetricCard
  title="Active Users"
  value="2,547"
  unit="users"
  glowColor="blue"
  change={{ value: 12, trend: 'up' }}
  icon={<UserIcon />}
/>
```

**Features:**

- Trend indicators (↑↓→) with color coding
- Unit display
- Change percentage with trend
- Size locked to 'small'

---

### PreviewCard

Showcase images, visual content, or featured items.

```typescript
interface PreviewCardProps {
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  // ... other BaseBentoCardProps
}
```

**Example:**

```tsx
<PreviewCard
  title="Featured Project"
  size="large"
  glowColor="amber"
  imageUrl="https://..."
  imageAlt="Project thumbnail"
>
  Explore new design patterns
</PreviewCard>
```

**Features:**

- Image display with responsive sizing
- Support for all size variants
- Children content below image
- Perfect for showcase or hero content

---

### ActionCard

Call-to-action cards for triggering workflows.

```typescript
interface ActionCardProps {
  title: string;
  action: () => void;
  actionLabel?: string; // defaults to "Take Action"
  // ... other BaseBentoCardProps
}
```

**Example:**

```tsx
<ActionCard
  title="Create New"
  action={() => openCreateDialog()}
  actionLabel="Create"
  glowColor="purple"
>
  Start a new project or workspace
</ActionCard>
```

**Features:**

- Primary action button
- Custom action label
- Children for description text
- Keyboard accessible

---

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

**CSS Grid Mappings:**

```css
.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
.col-span-full { grid-column: 1 / -1; }
.row-span-1 { grid-row: span 1; }
.row-span-2 { grid-row: span 2; }
```

On mobile, cards automatically adapt to single-column layout.

---

## Glow Color System

7 semantic glow colors with gradient and shadow layers:

| Color | CSS Variable | Primary Tone | Usage |
|-------|--------|------|-------|
| `amber` | `from-amber-500` | Warm | Highlights, featured content |
| `blue` | `from-blue-500` | Cool | Data, metrics |
| `emerald` | `from-emerald-500` | Success | Guides, positive actions |
| `purple` | `from-purple-500` | Creative | Primary actions, CTAs |
| `rose` | `from-rose-500` | Attention | Partnerships, warnings |
| `cyan` | `from-cyan-500` | Info | Lists, secondary content |
| `slate` | `from-slate-500` | Neutral | Default, backgrounds |

Each color includes:
- Gradient overlay: `from-{color}-500/20 to-{color}-600/10`
- Glow shadow: `shadow-[0_0_30px_rgba(..., 0.25)]`
- Hover shadow: `shadow-[0_0_40px_rgba(..., 0.35)]` (40px, 0.35 opacity)

**Customization:**

Modify glow intensity in `BaseBentoCard.tsx`:

```typescript
const glowBoxShadowMap: Record<string, string> = {
  amber: 'shadow-[0_0_30px_rgba(217,119,6,0.25)]', // Adjust opacity or blur
  // ...
};
```

---

## Glassmorphism Design System

### Glass Tokens

```css
/* Background layers */
.glass-base { @apply bg-gradient-to-br from-white/5 to-white/0; }
.glass-border { @apply border border-white/10; }
.glass-hover { @apply hover:bg-white/10; }

/* Text hierarchy */
.text-primary { @apply text-white/95; }
.text-secondary { @apply text-white/60; }
.text-tertiary { @apply text-white/40; }
.text-interactive { @apply text-white/85 hover:text-white; }

/* Focus states */
.focus-ring { @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50; }

/* Transitions */
.transition-interactive { @apply transition-all duration-200; }
.transition-hover { @apply transition-all duration-300; }
```

### CSS Features

- **Backdrop Blur**: `backdrop-blur-md` (12px blur)
- **Border Radius**: `rounded-2xl` (16px)
- **Border**: 1px `white/10` (subtle edge definition)
- **Background**: Gradient from `white/5` to `white/0` (dark translucent)

---

## Accessibility

### Semantic HTML

- Cards use `<article>` with semantic structure
- Lists use `<ol>` with `role="listitem"` for items
- Buttons are actual `<button>` elements

### ARIA Labels

```typescript
// Card label
aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}

// Action buttons
aria-label={`${actionLabel} for ${title}`}

// Icons
aria-hidden="true"
```

### Keyboard Support

- Buttons respond to Enter and Space keys
- All interactive elements are keyboard focusable
- Focus ring: `ring-2 ring-offset-2 ring-white/50`

### Color Contrast

- Text hierarchy maintains WCAG AA contrast
- Primary text (95% opacity): 15:1 ratio on dark background
- Secondary text (60% opacity): 5.5:1 ratio
- Interactive elements have high-contrast focus states

---

## Responsive Behavior

### Mobile (< 640px)

- Single column layout
- Cards span full width
- Reduced padding (p-4)
- Smaller text (text-sm)

### Tablet (640px - 1024px)

- 2-3 columns depending on grid config
- Full-width cards (if using `wide` size)
- Standard padding (p-6)

### Desktop (> 1024px)

- Full multi-column layout
- All size variants work as designed
- Larger text, standard spacing

---

## Usage Examples

### Dashboard Layout

```tsx
<WorkspaceBentoGrid columns={3}>
  <MetricCard title="Users" value="2,547" glowColor="blue" />
  <MetricCard title="Revenue" value="$42.5K" glowColor="emerald" />
  <MetricCard title="Growth" value="12%" glowColor="purple" />
  
  <PreviewCard title="Featured" size="large" glowColor="amber" imageUrl="..." />
  
  <ListCard title="Recent" items={[...]} glowColor="cyan" />
  <ActionCard title="Create" action={onCreate} glowColor="purple" />
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

### Onboarding Flow

```tsx
<WorkspaceBentoGrid columns={2}>
  <GuideCard
    title="Getting Started"
    size="tall"
    difficulty="beginner"
    steps={[...]}
  />
  
  <div className="col-span-1 row-span-2">
    <PartnerCard title="Integrations" items={[...]} />
  </div>
  
  <ActionCard title="Next Step" />
</WorkspaceBentoGrid>
```

---

## Tailwind Configuration

Ensure your `tailwind.config.ts` includes the Bento Card extensions:

```typescript
import { bentoCardTheme } from '@/components/BentoCards/tailwind.config';

export default {
  theme: {
    extend: bentoCardTheme,
  },
  safelist: [
    // Glow colors
    'from-amber-500/20', 'to-amber-600/10', 'shadow-[0_0_30px_rgba(217,119,6,0.25)]',
    'from-blue-500/20', 'to-blue-600/10', 'shadow-[0_0_30px_rgba(59,130,246,0.25)]',
    // ... add all color combinations
  ],
};
```

For dynamic color props, use inline styles or CSS variables as a fallback.

---

## Performance Tips

1. **Lazy Load Images**: Use `PreviewCard` imageUrl with lazy loading
2. **Memoize Cards**: Use `React.memo()` for cards in large grids
3. **Limit Animations**: Use `prefers-reduced-motion` media query
4. **Optimize Glow**: Reduce shadow complexity in non-critical cards

```typescript
// Memoized card
export const MemoizedMetricCard = React.memo(MetricCard);
```

---

## Customization

### Custom Glow Colors

Add to `BaseBentoCard.tsx`:

```typescript
const glowColorMap: Record<string, string> = {
  'custom-pink': 'from-pink-500/20 to-pink-600/10',
  // ...
};

const glowBoxShadowMap: Record<string, string> = {
  'custom-pink': 'shadow-[0_0_30px_rgba(236,72,153,0.25)]',
  // ...
};
```

### Custom Sizes

Add to size mappings:

```typescript
const sizeMap: Record<string, string> = {
  'xlarge': 'col-span-3 row-span-2',
  // ...
};
```

---

## Browser Support

- Modern browsers (Chromium, Firefox, Safari, Edge)
- CSS Grid support required
- Backdrop blur supported in all modern browsers
- Fallback for non-supporting browsers: solid backgrounds instead of blur

---

## Files

- `BaseBentoCard.tsx` - Core component
- `MetricCard.tsx`, `PreviewCard.tsx`, etc. - Variant components
- `WorkspaceBentoGrid.tsx` - Grid layout container
- `types.ts` - TypeScript interfaces
- `tailwind.config.ts` - Tailwind extensions and tokens
- `BentoGridExample.tsx` - Full working example
- `index.ts` - Barrel export

---

## License

Part of AST Studio platform. For use within authorized contexts.
