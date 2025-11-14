// app/index.tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, spacing, radii, shadows } from '../constants/theme';

export default function LandingScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Apollo Core</Text>
        <Text style={styles.title}>Unified Smart Systems.</Text>
        <Text style={styles.subtitle}>
          Control your Jetson-powered voice assistant and C by GE lighting
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

const styles = StyleSheet.create({
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
    color: '#0b1120',
    fontSize: 16,
    fontWeight: '600',
  },
});
