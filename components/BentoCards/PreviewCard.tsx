import React from 'react';
import { BaseBentoCard } from './BaseBentoCard';
import { PreviewCardProps } from './types';

export const PreviewCard = React.forwardRef<HTMLDivElement, PreviewCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'amber',
      size = 'large',
      imageUrl,
      imageAlt,
      actionLabel,
      onAction,
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
        onAction={onAction}
        className={className}
      >
        <div className="flex flex-col gap-4 h-full">
          {imageUrl && (
            <div className="relative w-full flex-1 rounded-lg overflow-hidden bg-white/5">
              <img
                src={imageUrl}
                alt={imageAlt || title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {children && <div className="text-sm text-white/80">{children}</div>}
        </div>
      </BaseBentoCard>
    );
  }
);

PreviewCard.displayName = 'PreviewCard';
