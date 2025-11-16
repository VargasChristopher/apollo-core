// constants/theme.ts
import { useColorScheme } from 'react-native';

// Dark theme (what you already had)
export const darkColors = {
  background: '#1A1A1A', // hsl(0 0% 10%) - Darker Black
  surface: '#2F2F2F', // hsl(0 0% 18.4%) - Jet
  surfaceCard: '#2F2F2F',
  borderSubtle: '#404040', // hsl(227.5 10.9% 25%) - subtle border
  accent: '#06d6e6', // hsl(184 95% 43%) - Apollo Blue
  accentSoft: '#1de0ef', // lighter variant
  accentMuted: 'rgba(6,214,230,0.15)',
  textPrimary: '#FAFAFF', // hsl(60 30% 96.1%) - Ghost White
  textSecondary: '#7A8194', // hsl(227.5 10.9% 52.9%) - Desaturated Purple-Blue
  textMuted: '#5A5F6F',
  danger: '#06d6e6', // Using Apollo Blue for consistency
  success: '#22c55e', // hsl(142.1 76.2% 36.3%)
  warning: '#fbbf24', // hsl(39 100% 65%)
};

// Light theme variant that still feels “Apollo”
export const lightColors = {
  background: '#FAFAFF', // Ghost White
  surface: '#ffffff',
  surfaceCard: '#ffffff',
  borderSubtle: '#e5e7eb',
  accent: '#06d6e6', // Apollo Blue
  accentSoft: '#1de0ef',
  accentMuted: 'rgba(6,214,230,0.10)',
  textPrimary: '#1A1A1A',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  danger: '#06d6e6',
  success: '#16a34a',
  warning: '#fbbf24',
};

export type ThemeColors = typeof darkColors;

// Hook that picks the right theme based on OS preference
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme(); // 'light' | 'dark' | null

  if (scheme === 'light') {
    return lightColors;
  }
  return darkColors;
}

// Keep a default export for non-react places if needed (dark)
export const colors = darkColors;

// Export Colors object for compatibility with useThemeColor hook
export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// spacing etc stay the same
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  } as const,
};

export const Fonts = {
  body: 'System', // Equivalent to Inter on web
  headline: 'System', // Equivalent to Sora on web (would need custom font)
  mono: 'Courier', // Equivalent to JetBrains Mono
};

// Typography scale matching apollo-technologies-site
export const typography = {
  displayXl: { fontSize: 56, lineHeight: 61.6, letterSpacing: -2.8 }, // display-xl
  displayL: { fontSize: 40, lineHeight: 48, letterSpacing: -1 }, // display-l
  displayM: { fontSize: 28, lineHeight: 35, letterSpacing: 0 }, // display-m
  bodyL: { fontSize: 20, lineHeight: 30, letterSpacing: 0 }, // body-l
  bodyBase: { fontSize: 16, lineHeight: 25.6, letterSpacing: 0 }, // body-base
  bodyS: { fontSize: 14, lineHeight: 21, letterSpacing: 0 }, // body-s
  button: { fontSize: 16, lineHeight: 24, letterSpacing: 0.8 }, // button text
  meta: { fontSize: 12, lineHeight: 18, letterSpacing: 0.25 }, // metadata text
};
