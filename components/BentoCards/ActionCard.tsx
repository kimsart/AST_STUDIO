import React from 'react';
import { BaseBentoCard } from './BaseBentoCard';
import { ActionCardProps } from './types';

export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'purple',
      size = 'medium',
      action,
      actionLabel = 'Take Action',
      children,
      className = '',
    },
    ref
  ) => {
    return (
      <BaseBentoCard
        ref={ref}
        title={title}
        subtitle={subtitle}
        icon={icon}
        glowColor={glowColor}
        size={size}
        actionLabel={actionLabel}
        onAction={action}
        className={className}
      >
        {children && (
          <div className="text-sm text-white/75 mb-4">{children}</div>
        )}
      </BaseBentoCard>
    );
  }
);

ActionCard.displayName = 'ActionCard';
