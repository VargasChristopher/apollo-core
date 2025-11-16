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

import {
  getLightStatus,
  setLightMode,
  LightMode,
} from '../../lib/homeAssistantApi';
import { getLightBrightness, setLightBrightness } from '../../lib/homeAssistantApi';
import Slider from '@react-native-community/slider';


import {
  useThemeColors,
  ThemeColors,
  spacing,
  radii,
  shadows,
} from '../../constants/theme';

type ModeConfig = {
  id: LightMode;
  label: string;
  description: string;
};

const LIGHT_MODES: ModeConfig[] = [
  { id: 'on',     label: 'On',     description: 'All bulbs on.' },
  { id: 'off',    label: 'Off',    description: 'All bulbs off.' },
];

export default function LightingScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [activeMode, setActiveMode] = useState<LightMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutatingMode, setMutatingMode] = useState<LightMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [loadingBrightness, setLoadingBrightness] = useState(false);
  const [mutatingBrightness, setMutatingBrightness] = useState<boolean>(false);


  async function refresh() {
  try {
    setError(null);
    setLoading(true);
      const [current, currentBrightness] = await Promise.all([
        getLightStatus(),
        getLightBrightness().catch(() => null),
      ]);

      setActiveMode(current);
      if (typeof currentBrightness === 'number') {
        setBrightness(currentBrightness);
      }
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
    const resulting = await setLightMode(mode);
    setActiveMode(resulting);
  } catch (err: any) {
    setError(err.message ?? 'Failed to update light mode.');
  } finally {
    setMutatingMode(null);
  }
}

  async function onCompleteBrightness(value: number) {
    try {
      setMutatingBrightness(true);
      setError(null);
      const resulting = await setLightBrightness(value);
      setBrightness(resulting);
    } catch (err: any) {
      setError(err.message ?? 'Failed to update brightness.');
    } finally {
      setMutatingBrightness(false);
    }
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Lighting Modes</Text>
      <Text style={styles.subheading}>
        Send lighting scenes to your smart bulbs through Apollo Core.
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

            {isMutating ? (
              <ActivityIndicator size="small" color={colors.accentSoft} />
            ) : (
              <View
                style={[
                  styles.modeDot,
                  isActive ? styles.modeDotActive : styles.modeDotIdle,
                ]}
              >
                {isActive && (
                  <Text style={styles.modeDotCheck}>✓</Text>
                )}
              </View>
            )}
          </Pressable>
        );
      })}

      <View style={styles.sliderCard}>
        <Text style={styles.cardTitle}>Brightness</Text>
        <Text style={styles.cardSubtitle}>Adjust overall bulb brightness (0–100%).</Text>

        <View style={styles.sliderRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor={colors.accentSoft}
            maximumTrackTintColor={colors.borderSubtle}
            thumbTintColor={colors.accentSoft}
            value={brightness}
            onValueChange={(v: number) => setBrightness(Math.round(v))}
            onSlidingComplete={onCompleteBrightness}
            disabled={mutatingBrightness}
          />

          <View style={styles.sliderValueWrap}>
            {mutatingBrightness ? (
              <ActivityIndicator size="small" color={colors.accentSoft} />
            ) : (
              <Text style={styles.sliderValue}>{brightness}%</Text>
            )}
          </View>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
      opacity: 0.7,
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
      width: 22,
      height: 22,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modeDotIdle: {
      borderWidth: 1,
      borderColor: colors.textMuted,
    },
    modeDotActive: {
      backgroundColor: colors.accentSoft,
    },
    modeDotCheck: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '700',
    },
    errorText: {
      marginTop: spacing.lg,
      color: colors.danger,
      fontSize: 13,
    },
      sliderCard: {
        borderRadius: radii.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        backgroundColor: colors.surfaceCard,
        marginBottom: spacing.xl,
        ...shadows.soft,
      },
      sliderRow: {
        marginTop: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      },
      slider: {
        flex: 1,
        height: 40,
      },
      sliderValueWrap: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
      },
      sliderValue: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '700',
      },
  });
