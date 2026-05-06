import React from 'react';
import { BaseBentoCardProps } from './types';

const glowColorMap: Record<string, string> = {
  amber: 'from-amber-500/20 to-amber-600/10',
  blue: 'from-blue-500/20 to-blue-600/10',
  emerald: 'from-emerald-500/20 to-emerald-600/10',
  purple: 'from-purple-500/20 to-purple-600/10',
  rose: 'from-rose-500/20 to-rose-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/10',
  slate: 'from-slate-500/20 to-slate-600/10',
};

const glowBoxShadowMap: Record<string, string> = {
  amber: 'shadow-[0_0_30px_rgba(217,119,6,0.25)]',
  blue: 'shadow-[0_0_30px_rgba(59,130,246,0.25)]',
  emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  purple: 'shadow-[0_0_30px_rgba(147,51,234,0.25)]',
  rose: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
  cyan: 'shadow-[0_0_30px_rgba(34,211,238,0.25)]',
  slate: 'shadow-[0_0_30px_rgba(71,85,105,0.25)]',
};

const sizeMap: Record<string, string> = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-1 md:col-span-2',
  large: 'col-span-2 row-span-2 md:col-span-2',
  wide: 'col-span-1 md:col-span-full row-span-1',
  tall: 'col-span-1 row-span-2 md:col-span-1',
};

export const BaseBentoCard = React.forwardRef<
  HTMLDivElement,
  BaseBentoCardProps
>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'slate',
      size = 'medium',
      actionLabel,
      onAction,
      children,
      className = '',
    },
    ref
  ) => {
    const glowGradient = glowColorMap[glowColor] || glowColorMap.slate;
    const glowShadow = glowBoxShadowMap[glowColor] || glowBoxShadowMap.slate;
    const sizeClasses = sizeMap[size] || sizeMap.medium;

    return (
      <div
        ref={ref}
        className={`${sizeClasses} ${glowShadow} transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.35)] ${className}`}
        role="article"
        aria-label={`${title}${subtitle ? ` - ${subtitle}` : ''}`}
      >
        {/* Glassmorphic container */}
        <div className="w-full h-full relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-gradient-to-br from-white/5 to-white/0">
          {/* Glow background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${glowGradient} pointer-events-none`}
          />

          {/* Content */}
          <div className="relative z-10 w-full h-full p-4 sm:p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              {icon && (
                <div
                  className="flex-shrink-0 text-white/80"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-white/95 truncate">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-white/60 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 text-white/80 text-sm">{children}</div>

            {/* Action button */}
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAction();
                  }
                }}
                className="mt-4 self-start px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
                aria-label={`${actionLabel} for ${title}`}
              >
                {actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

BaseBentoCard.displayName = 'BaseBentoCard';
