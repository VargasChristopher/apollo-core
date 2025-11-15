// app/index.tsx
import { Platform } from 'react-native';
import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import {
  useThemeColors,
  ThemeColors,
  spacing,
  radii,
  shadows,
} from '../constants/theme';

export default function LandingScreen() {
  // On web, immediately send people to /core
  if (Platform.OS === 'web') {
    return <Redirect href="/core" />;
  }

  const colors = useThemeColors();
  const scheme = useColorScheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.root}>
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Apollo Hub</Text>
        <Text style={styles.title}>Unified Smart Systems.</Text>
        <Text style={styles.subtitle}>
          Control your Apollo voice assistant and smart lighting
          from a single app, on web or mobile.
        </Text>

        <Link href="/(tabs)/core" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Open Controls</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.xl,
      justifyContent: 'center',
    },
    heroCard: {
      borderRadius: radii.lg,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.borderSubtle,
      backgroundColor: colors.surfaceCard,
      ...shadows.soft,
    },
    logoWrap: {
      width: 72,
      height: 72,
      borderRadius: radii.lg,
      marginBottom: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 64,
      height: 64,
    },
    kicker: {
      color: colors.accentSoft,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 28,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 15,
      marginBottom: spacing.lg,
    },
    primaryButton: {
      borderRadius: radii.pill,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.accent,
      alignSelf: 'flex-start',
    },
    primaryButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '600',
    },
  });
