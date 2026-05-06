import type { TextStyle } from 'react-native';

// Classic cream palette — see design system tokens.
export const colors = {
  // Surfaces
  bg: '#F5EFE0',
  surface: '#FAF7F2',
  surfaceAlt: '#EFE7D5',
  border: '#E8DFD0',

  // Ink
  ink: '#1A1410',
  inkSoft: '#5A4F44',
  inkMuted: '#9A8E7E',

  // Brand
  primary: '#BF5A3D',
  primaryDeep: '#8B2E1A',
  primarySoft: '#E5A892',
  gold: '#C9A84C',
  sage: '#7A8C6E',
  success: '#7A8C6E',

  overlay: 'rgba(26, 20, 16, 0.45)',
  errorRed: '#c0392b',

  // Legacy aliases (kept for any leftover references)
  terracotta: '#BF5A3D',
  misoRed: '#8B2E1A',
  cream: '#F5EFE0',
  warmWhite: '#FAF7F2',
  inkBlack: '#1A1410',
  dustyGold: '#C9A84C',
  sageGreen: '#7A8C6E',
  mutedStone: '#9A8E7E',
  cardBorder: '#E8DFD0',
} as const;

export const typography = {
  serif: 'PlayfairDisplay_700Bold',
  serifRegular: 'PlayfairDisplay_400Regular',
  serifItalic: 'PlayfairDisplay_700Bold_Italic',
  serifRegularItalic: 'PlayfairDisplay_400Regular_Italic',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

// Tabular sans numerals — serif numerals look awkward in stat blocks.
export const numStyle = (size: number, color: string = colors.ink): TextStyle => ({
  fontFamily: typography.bodySemiBold,
  fontVariant: ['tabular-nums'],
  letterSpacing: -0.5,
  fontSize: size,
  color,
  lineHeight: size * 1.05,
});
