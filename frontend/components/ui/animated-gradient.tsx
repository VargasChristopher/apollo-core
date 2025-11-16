import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '@/constants/theme';

interface AnimatedGradientProps {
  children?: React.ReactNode;
  style?: any;
  duration?: number;
}

export function AnimatedGradient({ 
  children, 
  style,
  duration = 4000 
}: AnimatedGradientProps) {
  const colors = useThemeColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => {
    // Pulse between background (#1A1A1A) and a slightly lighter dark grey (#202020)
    // This keeps it dark like lighting.tsx but adds subtle animation
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ['#1A1A1A', '#202020', '#1A1A1A']
    );

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
