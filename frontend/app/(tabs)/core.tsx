// app/(tabs)/core.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apolloApi, ApolloStatus } from '../../lib/apolloCoreApi';
import {
  useThemeColors,
  ThemeColors,
  spacing,
  radii,
  typography,
} from '../../constants/theme';
import { PulsingCard } from '../../components/ui/pulsing-card';
import { HapticButton } from '../../components/ui/haptic-button';
import { ShimmerText } from '../../components/ui/shimmer-text';
import { AnimatedGradient } from '../../components/ui/animated-gradient';
import { VoiceWave } from '../../components/ui/voice-wave';

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
    <AnimatedGradient>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          <ShimmerText style={styles.heading}>Apollo Core</ShimmerText>
          <Text style={styles.subheading}>
            Jetson Nano voice assistant, powered by local Apollo AI.
          </Text>

          {/* Voice Wave Visualization */}
          <View style={styles.waveContainer}>
            <VoiceWave isActive={!loading && !muted} size={100} />
          </View>

          <PulsingCard 
            style={styles.card}
            pulseOnMount={!loading && !muted}
            intensity={1.02}
          >
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

                <HapticButton
                  onPress={onToggleMute}
                  variant={muted ? 'secondary' : 'primary'}
                  disabled={mutating}
                  style={styles.toggleButton}
                  hapticStyle="medium"
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name={muted ? 'mic-off-outline' : 'mic-outline'}
                      size={24}
                      color={muted ? colors.accent : colors.background}
                      style={styles.buttonIcon}
                    />
                    <Text
                      style={[
                        styles.toggleButtonText,
                        { color: muted ? colors.accent : colors.background },
                      ]}
                    >
                      {muted ? 'Unmute' : 'Mute'}
                    </Text>
                  </View>
                </HapticButton>

                {mutating && (
                  <Text style={styles.mutatingText}>Updating core state…</Text>
                )}
              </>
            )}
          </PulsingCard>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </ScrollView>
    </AnimatedGradient>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    root: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    heading: {
      fontSize: typography.displayM.fontSize,
      fontWeight: '700',
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    subheading: {
      color: colors.textSecondary,
      fontSize: typography.bodyBase.fontSize,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    waveContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
      paddingVertical: spacing.lg,
    },
    card: {
      marginBottom: spacing.lg,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: typography.bodyL.fontSize,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    cardSubtitle: {
      color: colors.textSecondary,
      fontSize: typography.bodyS.fontSize,
      marginBottom: spacing.lg,
    },
    centerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      columnGap: spacing.sm,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: typography.bodyBase.fontSize,
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
      fontSize: typography.bodyS.fontSize,
      fontWeight: '600',
    },
    statusHint: {
      color: colors.textSecondary,
      fontSize: typography.meta.fontSize,
    },
    toggleButton: {
      width: '100%',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonIcon: {
      marginRight: spacing.sm,
    },
    toggleButtonText: {
      fontSize: typography.button.fontSize,
      fontWeight: '600',
    },
    mutatingText: {
      color: colors.textSecondary,
      fontSize: typography.bodyS.fontSize,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    errorText: {
      color: colors.danger,
      fontSize: typography.bodyBase.fontSize,
      marginTop: spacing.lg,
      textAlign: 'center',
    },
  });
