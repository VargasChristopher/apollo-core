// app/(tabs)/lighting.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  getLightStatus,
  setLightMode,
  LightMode,
  getLightBrightness,
  setLightBrightness,
  setIndividualLight,
  getAllLightStates,
} from '../../lib/homeAssistantApi';
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
  const { width } = useWindowDimensions();
  const styles = createStyles(colors);

  const [activeMode, setActiveMode] = useState<LightMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutatingMode, setMutatingMode] = useState<LightMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [loadingBrightness, setLoadingBrightness] = useState(false);
  const [mutatingBrightness, setMutatingBrightness] = useState<boolean>(false);
  const [bulbStates, setBulbStates] = useState<boolean[]>([true, true, true, true]);


  async function refresh() {
  try {
    setError(null);
    setLoading(true);
      const [currentBrightness, states] = await Promise.all([
        getLightBrightness().catch(() => null),
        getAllLightStates().catch(() => [true, true, true, true]),
      ]);

      if (typeof currentBrightness === 'number') {
        setBrightness(currentBrightness);
      }
      setBulbStates(states);

      // Determine mode based on bulb states
      const allOn = states.every((state) => state);
      const allOff = states.every((state) => !state);

      if (allOn) {
        setActiveMode('on');
      } else if (allOff) {
        setActiveMode('off');
      } else {
        setActiveMode(null); // Mixed state
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
    
    // Update bulb states to match the mode
    if (mode === 'off') {
      setBulbStates([false, false, false, false]);
    } else if (mode === 'on') {
      setBulbStates([true, true, true, true]);
    }
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

  async function toggleBulb(index: number) {
    const newState = !bulbStates[index];
    
    try {
      setError(null);
      // Optimistically update UI
      const newStates = [...bulbStates];
      newStates[index] = newState;
      setBulbStates(newStates);

      // Call the API to toggle the individual light
      await setIndividualLight(index, newState);

      // Check if all bulbs are on or all are off to update mode
      const allOn = newStates.every((state) => state);
      const allOff = newStates.every((state) => !state);

      if (allOn) {
        setActiveMode('on');
      } else if (allOff) {
        setActiveMode('off');
      } else {
        // Mixed state - don't set a specific mode
        setActiveMode(null);
      }
    } catch (err: any) {
      setError(err.message ?? `Failed to toggle light ${index + 1}.`);
      // Revert the optimistic update on error
      await refresh();
    }
  }

  const allBulbsOff = bulbStates.every((state) => !state);

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
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
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
                  : 'Mixed'}
              </Text>
            )}
            {width >= 768 && (
              <Text style={styles.cardSubtitle}>
                Modes are applied centrally by Apollo Core.
              </Text>
            )}
          </View>
          
          <View style={styles.bulbCheckboxes}>
            {[1, 2, 3, 4].map((bulbNum, index) => {
              const isChecked = bulbStates[index];
              const isPortrait = width < 768;
              return (
                <Pressable
                  key={bulbNum}
                  style={styles.checkboxRow}
                  onPress={() => toggleBulb(index)}
                >
                  <View style={[
                    isPortrait ? styles.bulbContainerMobile : styles.bulbContainerDesktop,
                    !isChecked && styles.bulbContainerOff,
                  ]}>
                    <View style={[
                      isPortrait ? styles.bulbGlassMobile : styles.bulbGlassDesktop,
                      isChecked && styles.bulbGlassOn,
                    ]}>
                      {isChecked && (
                        <View style={isPortrait ? styles.bulbGlowMobile : styles.bulbGlowDesktop} />
                      )}
                    </View>
                    <View style={isPortrait ? styles.bulbBaseMobile : styles.bulbBaseDesktop} />
                  </View>
                  <Text style={isPortrait ? styles.checkboxLabelMobile : styles.checkboxLabelDesktop}>
                    {isPortrait ? `B${bulbNum}` : `Light ${bulbNum}`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        
        {width < 768 && (
          <Text style={styles.cardSubtitle}>
            Modes are applied centrally by Apollo Core.
          </Text>
        )}
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

      <View style={[styles.sliderCard, allBulbsOff && styles.sliderCardDisabled]}>
        <Text style={styles.cardTitle}>Brightness</Text>

        <View style={styles.sliderRow}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor={allBulbsOff ? colors.textMuted : colors.accentSoft}
            maximumTrackTintColor={colors.borderSubtle}
            thumbTintColor={allBulbsOff ? colors.textMuted : colors.accentSoft}
            value={brightness}
            onValueChange={(v: number) => setBrightness(Math.round(v))}
            onSlidingComplete={onCompleteBrightness}
            disabled={mutatingBrightness || allBulbsOff}
          />

          <View style={styles.sliderValueWrap}>
            {mutatingBrightness ? (
              <ActivityIndicator size="small" color={colors.accentSoft} />
            ) : (
              <Text style={[styles.sliderValue, allBulbsOff && styles.sliderValueDisabled]}>{brightness}%</Text>
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
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cardHeaderMobile: {
      flexDirection: 'column',
      gap: spacing.md,
    },
    cardHeaderLeft: {
      flex: 1,
    },
    bulbCheckboxes: {
      flexDirection: 'row',
      gap: Platform.OS === 'web' ? spacing.xl : spacing.md,
      marginLeft: Platform.OS === 'web' ? spacing.lg : 0,
    },
    checkboxRow: {
      alignItems: 'center',
      gap: Platform.OS === 'web' ? spacing.sm : spacing.xs,
    },
    bulbContainerMobile: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bulbContainerDesktop: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bulbContainerOff: {
      opacity: 0.4,
    },
    bulbGlassMobile: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.borderSubtle,
      borderWidth: 1,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
    },
    bulbGlassDesktop: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.borderSubtle,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    bulbGlassOn: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accentSoft,
      shadowColor: colors.accentSoft,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    },
    bulbGlowMobile: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.background,
      opacity: 0.9,
    },
    bulbGlowDesktop: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      opacity: 0.9,
    },
    bulbBaseMobile: {
      width: 10,
      height: 4,
      backgroundColor: colors.textMuted,
      borderRadius: 1,
    },
    bulbBaseDesktop: {
      width: 20,
      height: 8,
      backgroundColor: colors.textMuted,
      borderRadius: 2,
    },
    checkboxMobile: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.accentSoft,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxDesktop: {
      width: 48,
      height: 48,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.accentSoft,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxUncheckedMobile: {
      backgroundColor: 'transparent',
      borderColor: colors.borderSubtle,
    },
    checkboxUncheckedDesktop: {
      backgroundColor: 'transparent',
      borderColor: colors.borderSubtle,
    },
    checkboxCheckMobile: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '700',
    },
    checkboxCheckDesktop: {
      color: colors.background,
      fontSize: 24,
      fontWeight: '700',
    },
    checkboxLabelMobile: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },
    checkboxLabelDesktop: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
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
      sliderCardDisabled: {
        opacity: 0.5,
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
      sliderValueDisabled: {
        color: colors.textMuted,
      },
  });
