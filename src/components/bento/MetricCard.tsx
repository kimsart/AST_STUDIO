import React from 'react';
import { BentoCard } from './BentoCard';
import type { BentoCardProps } from './types';

export const MetricCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (props, ref) => <BentoCard ref={ref} {...props} />
);

MetricCard.displayName = 'MetricCard';
