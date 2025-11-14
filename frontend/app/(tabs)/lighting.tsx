// app/(tabs)/lighting.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { apolloApi, ApolloStatus, LightMode } from '../../lib/apolloCoreApi';
import { colors, spacing, radii, shadows } from '../../constants/theme';

type ModeConfig = {
  id: LightMode;
  label: string;
  description: string;
};

const LIGHT_MODES: ModeConfig[] = [
  {
    id: 'off',
    label: 'Off',
    description: 'All C by GE bulbs off.',
  },
  {
    id: 'focus',
    label: 'Focus',
    description: 'Cooler temperature, bright. Great for work and study.',
  },
  {
    id: 'relax',
    label: 'Relax',
    description: 'Warm, softer light for evenings or winding down.',
  },
  {
    id: 'night',
    label: 'Night',
    description: 'Very low, warm light for late hours and navigation.',
  },
  {
    id: 'energy',
    label: 'Energy',
    description: 'Bright, balanced light for daytime and guests.',
  },
];

export default function LightingScreen() {
  const [status, setStatus] = useState<ApolloStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutatingMode, setMutatingMode] = useState<LightMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      setLoading(true);
      const s = await apolloApi.getApolloStatus();
      setStatus(s);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load lighting status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onSelectMode(mode: LightMode) {
    try {
      setMutatingMode(mode);
      setError(null);
      const updated = await apolloApi.setLightMode(mode);
      setStatus(updated);
    } catch (err: any) {
      setError(err.message ?? 'Failed to update light mode.');
    } finally {
      setMutatingMode(null);
    }
  }

  const activeMode = status?.lightMode ?? null;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Lighting Modes</Text>
      <Text style={styles.subheading}>
        Send lighting scenes to your C by GE smart bulbs through Apollo Core.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current mode</Text>
        {loading ? (
          <View style={styles.centerRow}>
            <ActivityIndicator color={colors.accentSoft} />
            <Text style={styles.loadingText}>Querying lights…</Text>
          </View>
        ) : (
          <Text style={styles.currentModeText}>
            {activeMode
              ? LIGHT_MODES.find((m) => m.id === activeMode)?.label ??
                activeMode.toUpperCase()
              : 'Unknown'}
          </Text>
        )}
        <Text style={styles.cardSubtitle}>
          Modes are applied centrally by Apollo Core, so web and mobile stay in
          sync.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Pick a mode</Text>

      {LIGHT_MODES.map((mode) => {
        const isActive = mode.id === activeMode;
        const isMutating = mutatingMode === mode.id;

        return (
          <Pressable
            key={mode.id}
            style={[
              styles.modeRow,
              isActive && styles.modeRowActive,
              isMutating && styles.modeRowMutating,
            ]}
            onPress={() => onSelectMode(mode.id)}
            disabled={isMutating}
          >
            <View style={styles.modeTextGroup}>
              <Text
                style={[
                  styles.modeLabel,
                  isActive && styles.modeLabelActive,
                ]}
              >
                {mode.label}
              </Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
            </View>
            <View
              style={[
                styles.modeDot,
                isActive ? styles.modeDotActive : styles.modeDotIdle,
              ]}
            />
          </Pressable>
        );
      })}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xl,
  },
  card: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceCard,
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  currentModeText: {
    color: colors.accentSoft,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  modeRow: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeRowActive: {
    borderColor: colors.accentSoft,
    backgroundColor: colors.accentMuted,
  },
  modeRowMutating: {
    opacity: 0.6,
  },
  modeTextGroup: {
    flex: 1,
    paddingRight: spacing.md,
  },
  modeLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  modeLabelActive: {
    color: colors.accentSoft,
  },
  modeDescription: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  modeDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  modeDotIdle: {
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  modeDotActive: {
    backgroundColor: colors.accentSoft,
  },
  errorText: {
    marginTop: spacing.lg,
    color: colors.danger,
    fontSize: 13,
  },
});
