import React from 'react';
import { BentoCard } from './BentoCard';
import type { BentoCardProps } from './types';

export const GuideCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ glowColor = 'blue', ...props }, ref) => (
    <BentoCard ref={ref} glowColor={glowColor} {...props} />
  )
);

GuideCard.displayName = 'GuideCard';
