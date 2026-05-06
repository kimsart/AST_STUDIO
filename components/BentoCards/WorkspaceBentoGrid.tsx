import React from 'react';

export interface WorkspaceBentoGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
  columns?: number;
}

const variantSpacing = {
  default: 'gap-4 sm:gap-6',
  compact: 'gap-2 sm:gap-3',
  spacious: 'gap-6 sm:gap-8',
};

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-1 auto-rows-auto',
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
    const spacingClass = variantSpacing[variant];
    const columnClass = columnClasses[columns] || columnClasses[3];

    return (
      <div
        ref={ref}
        className={`
          grid
          ${columnClass}
          ${spacingClass}
          auto-rows-max
          w-full
          ${className}
        `}
        role="main"
        aria-label="Workspace grid"
      >
        {children}
      </div>
    );
  }
);

WorkspaceBentoGrid.displayName = 'WorkspaceBentoGrid';
