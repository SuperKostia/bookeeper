/**
 * BooKeeper design tokens.
 * Single source of truth for colors, typography, spacing, radii.
 * Mirrors the HTML marketing proto at the repo root.
 */

export const colors = {
  cream: '#ECE4D0',
  creamSoft: '#F3ECD9',
  creamDark: '#D7CCAC',
  paper: '#F6F1E0',
  pitch: '#0E2B1A',
  pitchDeep: '#061810',
  pitchMid: '#164A2C',
  volt: '#D4FF00',
  voltSoft: '#E5FF6A',
  clay: '#DB5D2A',
  clayDeep: '#B34418',
  ink: '#0A0A0A',
} as const;
export type ColorToken = keyof typeof colors;

export const fonts = {
  display: 'Anton',
  serif: 'Instrument Serif',
  body: 'Onest',
  mono: 'JetBrains Mono',
} as const;
export type FontToken = keyof typeof fonts;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;
export type SpacingToken = keyof typeof spacing;

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  h3: 28,
  h2: 40,
  h1: 56,
  display: 88,
} as const;

export const tokens = {
  colors,
  fonts,
  spacing,
  radii,
  fontSizes,
} as const;

export type Tokens = typeof tokens;
