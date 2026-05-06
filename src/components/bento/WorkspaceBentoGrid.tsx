import React from 'react';
import type { WorkspaceBentoGridProps } from './types';

const columnMap = {
  2: 'bento-grid-cols-2',
  3: 'bento-grid-cols-3',
  4: 'bento-grid-cols-4',
};

const gapMap = {
  default: 'bento-grid-gap-default',
  compact: 'bento-grid-gap-compact',
  spacious: 'bento-grid-gap-spacious',
};

/**
 * WorkspaceBentoGrid
 *
 * A responsive CSS Grid container for laying out Bento Cards
 *
 * Usage:
 * ```tsx
 * <WorkspaceBentoGrid columns={3} variant="default">
 *   <MetricCard title="Users" value={1234} />
 *   <ActionCard title="Add New" />
 *   <ListCard title="Recent" items={...} />
 * </WorkspaceBentoGrid>
 * ```
 *
 * Supports:
 * - Responsive columns (1 col mobile, 2+ on larger screens)
 * - All card sizes: small (1x1), medium (2x1), large (2x2), wide (full), tall (1x2)
 * - Flexible spacing variants
 * - Auto-fit for dynamic card counts
 */
export const WorkspaceBentoGrid = React.forwardRef<
  HTMLDivElement,
  WorkspaceBentoGridProps
>(
  (
    {
      children,
      className = '',
      variant = 'default',
      columns = 3,
    },
    ref
  ) => {
    const columnClass = columnMap[columns as keyof typeof columnMap] || columnMap[3];
    const gapClass = gapMap[variant];

    return (
      <div
        ref={ref}
        className={`bento-grid ${columnClass} ${gapClass} ${className}`}
        role="main"
        aria-label="Workspace grid"
      >
        {children}
      </div>
    );
  }
);

WorkspaceBentoGrid.displayName = 'WorkspaceBentoGrid';
