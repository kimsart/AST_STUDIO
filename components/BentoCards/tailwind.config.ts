/**
 * Tailwind CSS Configuration for Bento Cards System
 *
 * Add this to your tailwind.config.ts or tailwind.config.js:
 *
 * import { bentoCardTheme } from '@/components/BentoCards/tailwind.config';
 *
 * export default {
 *   theme: {
 *     extend: bentoCardTheme,
 *   },
 * };
 */

export const bentoCardTheme = {
  // Glow effects for different colors
  boxShadow: {
    // Glow shadows for different color variants
    'glow-amber': '0 0 30px rgba(217, 119, 6, 0.25)',
    'glow-amber-lg': '0 0 40px rgba(217, 119, 6, 0.35)',
    'glow-blue': '0 0 30px rgba(59, 130, 246, 0.25)',
    'glow-blue-lg': '0 0 40px rgba(59, 130, 246, 0.35)',
    'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.25)',
    'glow-emerald-lg': '0 0 40px rgba(16, 185, 129, 0.35)',
    'glow-purple': '0 0 30px rgba(147, 51, 234, 0.25)',
    'glow-purple-lg': '0 0 40px rgba(147, 51, 234, 0.35)',
    'glow-rose': '0 0 30px rgba(244, 63, 94, 0.25)',
    'glow-rose-lg': '0 0 40px rgba(244, 63, 94, 0.35)',
    'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.25)',
    'glow-cyan-lg': '0 0 40px rgba(34, 211, 238, 0.35)',
    'glow-slate': '0 0 30px rgba(71, 85, 105, 0.25)',
    'glow-slate-lg': '0 0 40px rgba(71, 85, 105, 0.35)',
  },

  // Backdrop blur effects
  backdropBlur: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },

  // Animation for hover effects
  animation: {
    'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  keyframes: {
    'glow-pulse': {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '.8' },
    },
  },
};

/**
 * CSS Classes for Bento Cards
 *
 * Size Mappings:
 * - small: col-span-1 row-span-1
 * - medium: col-span-2 row-span-1
 * - large: col-span-2 row-span-2
 * - wide: col-span-full row-span-1
 * - tall: col-span-1 row-span-2
 *
 * Glow Color Options:
 * - amber
 * - blue
 * - emerald
 * - purple
 * - rose
 * - cyan
 * - slate
 *
 * Grid Variants:
 * - default: gap-4 sm:gap-6
 * - compact: gap-2 sm:gap-3
 * - spacious: gap-6 sm:gap-8
 */

/**
 * Glassmorphism Token System
 *
 * Background Layers:
 * - Base: bg-white/5 (or bg-gradient-to-br from-white/5 to-white/0)
 * - Border: border-white/10
 * - Hover: hover:bg-white/10 (for interactive elements)
 * - Disabled: bg-white/2 border-white/5 text-white/40
 *
 * Text Hierarchy:
 * - Primary (titles): text-white/95
 * - Secondary (subtitles): text-white/60
 * - Tertiary (meta): text-white/40
 * - Interactive: text-white/85 hover:text-white
 *
 * Focus States:
 * - focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50
 *
 * Transitions:
 * - transition-all duration-200 (for interactions)
 * - transition-all duration-300 (for hover effects)
 */
