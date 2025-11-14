// constants/theme.ts
// Apollo-style dark theme with cyan accents.

export const colors = {
  background: '#020617', // near-black navy
  surface: '#020617',
  surfaceCard: '#020617',
  borderSubtle: '#111827',
  accent: '#38bdf8', // cyan accent
  accentSoft: '#0ea5e9',
  accentMuted: 'rgba(56,189,248,0.15)',
  textPrimary: '#e5e7eb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  danger: '#f97373',
  success: '#4ade80',
};

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
