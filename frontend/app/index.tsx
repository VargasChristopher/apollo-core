// app/index.tsx
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  useThemeColors,
  ThemeColors,
  spacing,
  radii,
  typography,
} from '../constants/theme';
import { AnimatedGradient } from '../components/ui/animated-gradient';
import { PulsingCard } from '../components/ui/pulsing-card';
import { RotatingText } from '../components/ui/rotating-text';
import { HapticButton } from '../components/ui/haptic-button';
import { FloatingElements } from '../components/ui/floating-elements';
import { ShimmerText } from '../components/ui/shimmer-text';
import { FeatureIcon } from '../components/ui/feature-icon';
import { router } from 'expo-router';

export default function LandingScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <AnimatedGradient>
      <FloatingElements count={8} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.kicker}>Apollo Hub</Text>
            <Text style={styles.title}>Unified Smart Systems.</Text>
            
            <RotatingText
              texts={[
                'Voice Control',
                'Smart Lighting',
                'AI Assistant',
                'Home Automation'
              ]}
              interval={2500}
              style={styles.rotatingText}
            />
            
            <Text style={styles.subtitle}>
              Control your Apollo voice assistant and smart lighting
              from a single app, on web or mobile.
            </Text>

            <HapticButton
              onPress={() => router.push('/(tabs)/core')}
              variant="primary"
              style={styles.primaryButton}
            >
              Open Controls
            </HapticButton>
          </View>

          {/* Feature Cards */}
          <View style={styles.featuresSection}>
            <ShimmerText style={styles.sectionTitle}>
              Features
            </ShimmerText>

            <PulsingCard
              style={styles.featureCard}
              intensity={1.03}
            >
              <View style={styles.featureHeader}>
                <FeatureIcon type="voice" size={28} />
                <Text style={styles.featureTitle}>Voice Assistant</Text>
              </View>
              <Text style={styles.featureText}>
                Powered by Apollo AI running on Jetson Nano
              </Text>
            </PulsingCard>

            <PulsingCard
              style={styles.featureCard}
              intensity={1.03}
            >
              <View style={styles.featureHeader}>
                <FeatureIcon type="bulb" size={28} />
                <Text style={styles.featureTitle}>Smart Lighting</Text>
              </View>
              <Text style={styles.featureText}>
                Control brightness, color, and effects
              </Text>
            </PulsingCard>

            <PulsingCard
              style={styles.featureCard}
              intensity={1.03}
            >
              <View style={styles.featureHeader}>
                <FeatureIcon type="globe" size={28} />
                <Text style={styles.featureTitle}>Cross Platform</Text>
              </View>
              <Text style={styles.featureText}>
                Works seamlessly on iOS, Android, and Web
              </Text>
            </PulsingCard>
          </View>
        </View>
      </ScrollView>
    </AnimatedGradient>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    root: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
    },
    heroSection: {
      marginBottom: spacing.xxl,
      alignItems: 'center',
    },
    kicker: {
      color: colors.accentSoft,
      fontSize: typography.bodyS.fontSize,
      fontWeight: '600',
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.displayL.fontSize,
      lineHeight: typography.displayL.lineHeight,
      fontWeight: '700',
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    rotatingText: {
      marginBottom: spacing.md,
      fontSize: typography.displayM.fontSize,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.bodyBase.fontSize,
      lineHeight: typography.bodyBase.lineHeight,
      marginBottom: spacing.xl,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
    },
    primaryButton: {
      alignSelf: 'center',
      minWidth: 200,
    },
    featuresSection: {
      marginBottom: spacing.xxl,
    },
    sectionTitle: {
      fontSize: typography.displayM.fontSize,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    featureCard: {
      marginBottom: spacing.md,
    },
    featureHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    featureTitle: {
      color: colors.textPrimary,
      fontSize: typography.bodyL.fontSize,
      fontWeight: '600',
    },
    featureText: {
      color: colors.textSecondary,
      fontSize: typography.bodyBase.fontSize,
      lineHeight: typography.bodyBase.lineHeight,
    },
  });
