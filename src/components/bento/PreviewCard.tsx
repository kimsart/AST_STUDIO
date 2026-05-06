import React from 'react';
import { BentoCard } from './BentoCard';
import type { BentoCardProps } from './types';

export const PreviewCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (props, ref) => <BentoCard ref={ref} {...props} />
);

PreviewCard.displayName = 'PreviewCard';
