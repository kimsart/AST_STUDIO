import React from 'react';
import clsx from 'clsx';
import type { BentoCardProps } from './types';

const glowMap: Record<string, string> = {
  pink: 'bento-glow-pink',
  blue: 'bento-glow-blue',
  turquoise: 'bento-glow-turquoise',
  none: 'bento-glow-none',
};

const sizeMap: Record<string, string> = {
  small: 'bento-size-small',
  medium: 'bento-size-medium',
  large: 'bento-size-large',
  wide: 'bento-size-wide',
  tall: 'bento-size-tall',
};

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'none',
      size = 'medium',
      actionLabel,
      onAction,
      children,
      className = '',
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bento-card',
          glowMap[glowColor || 'none'],
          sizeMap[size || 'medium'],
          className
        )}
        role="article"
        aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
        tabIndex={0}
      >
        <div className="bento-content">
          <div className="bento-header">
            {icon && (
              <div className="bento-icon" aria-hidden="true">
                {icon}
              </div>
            )}
            <div className="bento-title-group">
              <h3 className="bento-title">{title}</h3>
              {subtitle && (
                <p className="bento-subtitle">{subtitle}</p>
              )}
            </div>
          </div>

          {children && (
            <div className="bento-body">
              {children}
            </div>
          )}

          {actionLabel && (
            <button
              onClick={onAction}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAction?.();
                }
              }}
              className="bento-button"
              aria-label={`${actionLabel} for ${title}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }
);

BentoCard.displayName = 'BentoCard';

BentoCard.displayName = 'BentoCard';
