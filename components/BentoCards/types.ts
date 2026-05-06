import React from 'react';

export type BentoSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';

export interface BaseBentoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glowColor?: 'amber' | 'blue' | 'emerald' | 'purple' | 'rose' | 'cyan' | 'slate';
  size?: BentoSize;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export interface MetricCardProps extends Omit<BaseBentoCardProps, 'size'> {
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  unit?: string;
}

export interface PreviewCardProps extends BaseBentoCardProps {
  imageUrl?: string;
  imageAlt?: string;
}

export interface ActionCardProps extends BaseBentoCardProps {
  action: () => void;
}

export interface ListCardProps extends BaseBentoCardProps {
  items: Array<{
    id: string;
    label: string;
    value?: string;
  }>;
}

export interface PartnerCardProps extends BaseBentoCardProps {
  logo?: string;
  description?: string;
  link?: string;
}

export interface GuideCardProps extends BaseBentoCardProps {
  steps?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
