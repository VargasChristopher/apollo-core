// app/(tabs)/about.tsx
import { StyleSheet, Text, View } from 'react-native';
import {
  useThemeColors,
  ThemeColors,
  spacing,
} from '../../constants/theme';

export default function AboutScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>About Apollo Core</Text>
      <Text style={styles.body}>
        Apollo Core runs on an NVIDIA Jetson Nano and uses local Meta Llama
        models for low-latency, privacy-first voice interactions.
      </Text>
      <Text style={styles.body}>
        This app talks directly to Apollo Core over your local network for
        mute control and C by GE lighting scenes. Make sure your phone and
        Jetson are on the same Wi-Fi.
      </Text>
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
      marginBottom: spacing.lg,
    },
    body: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    caption: {
      marginTop: spacing.lg,
      color: colors.textMuted,
      fontSize: 12,
    },
  });
