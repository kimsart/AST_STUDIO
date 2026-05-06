import React from 'react';
import { BentoCard } from './BentoCard';
import type { BentoCardProps } from './types';

export const ListCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (props, ref) => <BentoCard ref={ref} {...props} />
);

ListCard.displayName = 'ListCard';
