/**
 * ============================================
 * CONSTANTS: Design Tokens
 * ============================================
 *
 * Centralized design system tokens for colors, sizes, animations, etc.
 */

export const DESIGN_TOKENS = {
  COLORS: {
    PRIMARY: 'primary',
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  SIZES: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
  ANIMATIONS: {
    DURATION_FAST: 150,
    DURATION_NORMAL: 300,
    DURATION_SLOW: 500,
  },
} as const;

export const TRANSITIONS = {
  FADE: 'transition-opacity duration-300',
  SLIDE: 'transition-transform duration-300',
  ALL: 'transition-all duration-300',
} as const;

export type ColorVariant = (typeof DESIGN_TOKENS.COLORS)[keyof typeof DESIGN_TOKENS.COLORS];
export type SizeVariant = (typeof DESIGN_TOKENS.SIZES)[keyof typeof DESIGN_TOKENS.SIZES];
