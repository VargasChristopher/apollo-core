// app/(tabs)/core.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apolloApi, ApolloStatus } from '../../lib/apolloCoreApi';
import {
  useThemeColors,
  ThemeColors,
  spacing,
  radii,
  shadows,
} from '../../constants/theme';

export default function CoreScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [status, setStatus] = useState<ApolloStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      setLoading(true);
      const s = await apolloApi.getApolloStatus();
      setStatus(s);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onToggleMute() {
    if (!status) return;
    try {
      setMutating(true);
      setError(null);
      const updated = await apolloApi.setMuted(!status.muted);
      setStatus(updated);
    } catch (err: any) {
      setError(err.message ?? 'Failed to update mute state.');
    } finally {
      setMutating(false);
    }
  }

  const muted = status?.muted ?? false;

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Apollo Core</Text>
      <Text style={styles.subheading}>
        Jetson Nano voice assistant, powered by local Meta Llama.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Voice Capture</Text>
        <Text style={styles.cardSubtitle}>
          Toggle whether Apollo Core is listening for the wake word.
        </Text>

        {loading ? (
          <View style={styles.centerRow}>
            <ActivityIndicator color={colors.accentSoft} />
            <Text style={styles.loadingText}>Connecting…</Text>
          </View>
        ) : (
          <>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusPill,
                  muted ? styles.statusMuted : styles.statusActive,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    muted ? styles.dotMuted : styles.dotActive,
                  ]}
                />
                <Text style={styles.statusText}>
                  {muted ? 'Muted' : 'Listening'}
                </Text>
              </View>
              <Text style={styles.statusHint}>
                {muted
                  ? 'Wake word and mic are disabled.'
                  : 'Wake word and microphone are active.'}
              </Text>
            </View>

            <Pressable
              style={[
                styles.toggleButton,
                muted ? styles.toggleButtonMuted : styles.toggleButtonActive,
              ]}
              onPress={onToggleMute}
              disabled={mutating}
            >
              <Ionicons
                name={muted ? 'mic-off-outline' : 'mic-outline'}
                size={28}
                color={muted ? colors.textPrimary : colors.background}
              />
              <Text
                style={[
                  styles.toggleButtonText,
                  muted && { color: colors.textPrimary },
                ]}
              >
                {muted ? 'Unmute Apollo Core' : 'Mute Apollo Core'}
              </Text>
            </Pressable>

            {mutating && (
              <Text style={styles.mutatingText}>Updating core state…</Text>
            )}
          </>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
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
      ...shadows.soft,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    cardSubtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: spacing.lg,
    },
    centerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: spacing.sm,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginLeft: spacing.sm,
    },
    statusRow: {
      marginBottom: spacing.lg,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: radii.pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    statusMuted: {
      backgroundColor: 'rgba(248,113,113,0.12)',
    },
    statusActive: {
      backgroundColor: colors.accentMuted,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      marginRight: spacing.sm,
    },
    dotMuted: {
      backgroundColor: colors.danger,
    },
    dotActive: {
      backgroundColor: colors.accentSoft,
    },
    statusText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    statusHint: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    toggleButtonActive: {
      backgroundColor: colors.accent,
    },
    toggleButtonMuted: {
      borderWidth: 1,
      borderColor: colors.danger,
      backgroundColor: 'transparent',
    },
    toggleButtonText: {
      marginLeft: spacing.sm,
      fontSize: 16,
      fontWeight: '600',
      color: colors.background,
    },
    mutatingText: {
      marginTop: spacing.sm,
      color: colors.textMuted,
      fontSize: 12,
    },
    errorText: {
      marginTop: spacing.lg,
      color: colors.danger,
      fontSize: 13,
    },
  });
