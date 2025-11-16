import React, { useEffect } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '@/constants/theme';

interface ShimmerTextProps {
  children: string;
  style?: TextStyle;
  duration?: number;
}

export function ShimmerText({ 
  children, 
  style,
  duration = 2000,
}: ShimmerTextProps) {
  const colors = useThemeColors();
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerPosition.value,
      [0, 0.5, 1],
      [1, 0.7, 1]
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.Text
      style={[
        styles.text,
        {
          color: colors.accent,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
  },
});
