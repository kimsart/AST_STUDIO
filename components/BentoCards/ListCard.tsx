import React from 'react';
import { BaseBentoCard } from './BaseBentoCard';
import { ListCardProps } from './types';

export const ListCard = React.forwardRef<HTMLDivElement, ListCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'cyan',
      size = 'medium',
      items,
      actionLabel,
      onAction,
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
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              role="listitem"
            >
              <span className="text-sm text-white/85">{item.label}</span>
              {item.value && (
                <span className="text-xs text-white/60 font-medium">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </BaseBentoCard>
    );
  }
);

ListCard.displayName = 'ListCard';
