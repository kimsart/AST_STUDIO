import React from 'react';

export type BentoSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';
export type GlowColor = 'pink' | 'blue' | 'turquoise' | 'none';

export interface BentoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glowColor?: GlowColor;
  size?: BentoSize;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export interface WorkspaceBentoGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
  columns?: 2 | 3 | 4;
}
