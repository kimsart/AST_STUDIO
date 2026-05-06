import React from 'react';
import { BaseBentoCard } from './BaseBentoCard';
import { MetricCardProps } from './types';

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'neutral' }> = ({ trend }) => {
  if (trend === 'up') {
    return <span className="text-emerald-400">↑</span>;
  }
  if (trend === 'down') {
    return <span className="text-rose-400">↓</span>;
  }
  return <span className="text-slate-400">→</span>;
};

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'blue',
      value,
      change,
      unit,
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
        size="small"
        actionLabel={actionLabel}
        onAction={onAction}
        className={className}
      >
        <div className="flex flex-col items-start justify-center h-full">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {value}
            </span>
            {unit && <span className="text-sm text-white/60">{unit}</span>}
          </div>
          {change && (
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm">
              <TrendIcon trend={change.trend} />
              <span
                className={
                  change.trend === 'up'
                    ? 'text-emerald-400'
                    : change.trend === 'down'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                }
              >
                {Math.abs(change.value)}% this month
              </span>
            </div>
          )}
        </div>
      </BaseBentoCard>
    );
  }
);

MetricCard.displayName = 'MetricCard';
