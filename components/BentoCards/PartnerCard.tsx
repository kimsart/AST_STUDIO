import React from 'react';
import { BaseBentoCard } from './BaseBentoCard';
import { PartnerCardProps } from './types';

export const PartnerCard = React.forwardRef<HTMLDivElement, PartnerCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'rose',
      size = 'medium',
      logo,
      description,
      link,
      actionLabel = 'Learn More',
      children,
      className = '',
    },
    ref
  ) => {
    const handleAction = () => {
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <BaseBentoCard
        ref={ref}
        title={title}
        subtitle={subtitle}
        icon={icon}
        glowColor={glowColor}
        size={size}
        actionLabel={link ? actionLabel : undefined}
        onAction={link ? handleAction : undefined}
        className={className}
      >
        <div className="flex flex-col gap-3 h-full justify-between">
          {logo && (
            <div className="w-full h-12 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden">
              <img
                src={logo}
                alt={`${title} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          {description && (
            <p className="text-sm text-white/75">{description}</p>
          )}
          {children && <div className="text-xs text-white/65">{children}</div>}
        </div>
      </BaseBentoCard>
    );
  }
);

PartnerCard.displayName = 'PartnerCard';
