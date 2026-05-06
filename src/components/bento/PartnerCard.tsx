import React from 'react';
import { BentoCard } from './BentoCard';
import type { BentoCardProps } from './types';

export const PartnerCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (props, ref) => <BentoCard ref={ref} {...props} />
);

PartnerCard.displayName = 'PartnerCard';
