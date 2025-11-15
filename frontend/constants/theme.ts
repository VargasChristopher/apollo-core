// constants/theme.ts
import { useColorScheme } from 'react-native';

// Dark theme (what you already had)
export const darkColors = {
  background: '#020617',
  surface: '#020617',
  surfaceCard: '#020617',
  borderSubtle: '#111827',
  accent: '#38bdf8',
  accentSoft: '#0ea5e9',
  accentMuted: 'rgba(56,189,248,0.15)',
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  danger: '#f97373',
  success: '#4ade80',
};

// Light theme variant that still feels “Apollo”
export const lightColors = {
  background: '#f9fafb',
  surface: '#ffffff',
  surfaceCard: '#ffffff',
  borderSubtle: '#e5e7eb',
  accent: '#0ea5e9',
  accentSoft: '#0284c7',
  accentMuted: 'rgba(14,165,233,0.10)',
  textPrimary: '#020617',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  danger: '#b91c1c',
  success: '#16a34a',
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
  rounded: 'System',
  mono: 'monospace',
};
