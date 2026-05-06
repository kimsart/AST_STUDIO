import React from 'react';
import { BaseBentoCard } from './BaseBentoCard';
import { GuideCardProps } from './types';

const DifficultyBadge: React.FC<{ difficulty?: string }> = ({ difficulty }) => {
  if (!difficulty) return null;
  const colors = {
    beginner: 'bg-emerald-500/20 text-emerald-300',
    intermediate: 'bg-amber-500/20 text-amber-300',
    advanced: 'bg-rose-500/20 text-rose-300',
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${colors[difficulty] || ''}`}
    >
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
};

export const GuideCard = React.forwardRef<HTMLDivElement, GuideCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      glowColor = 'emerald',
      size = 'tall',
      steps,
      difficulty,
      actionLabel = 'Start Guide',
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
        <div className="flex flex-col gap-3 h-full">
          {difficulty && (
            <div>
              <DifficultyBadge difficulty={difficulty} />
            </div>
          )}

          {steps && steps.length > 0 && (
            <div className="flex-1">
              <p className="text-xs text-white/60 uppercase tracking-wide mb-2">
                {steps.length} Steps
              </p>
              <ol className="space-y-1 text-xs">
                {steps.slice(0, 4).map((step, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-white/70"
                  >
                    <span className="text-white/50 font-semibold">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
                {steps.length > 4 && (
                  <li className="text-white/50 italic pt-1">
                    +{steps.length - 4} more steps
                  </li>
                )}
              </ol>
            </div>
          )}

          {children && (
            <div className="text-xs text-white/65">{children}</div>
          )}
        </div>
      </BaseBentoCard>
    );
  }
);

GuideCard.displayName = 'GuideCard';
