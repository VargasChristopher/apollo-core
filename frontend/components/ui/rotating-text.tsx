import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useThemeColors, typography } from '@/constants/theme';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  style?: TextStyle;
  loop?: boolean;
}

export function RotatingText({ 
  texts, 
  interval = 3000,
  style,
  loop = true,
}: RotatingTextProps) {
  const colors = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      opacity.value = withSequence(
        withTiming(0, { 
          duration: 300, 
          easing: Easing.inOut(Easing.ease) 
        }),
        withTiming(1, { 
          duration: 300, 
          easing: Easing.inOut(Easing.ease) 
        })
      );

      translateY.value = withSequence(
        withTiming(-20, { duration: 300 }),
        withTiming(20, { duration: 0 }),
        withTiming(0, { 
          duration: 300,
          easing: Easing.out(Easing.ease),
        })
      );

      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= texts.length) {
            return loop ? 0 : prev;
          }
          return nextIndex;
        });
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval, loop]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={[
          styles.text,
          { 
            color: colors.accent,
            fontSize: typography.displayM.fontSize,
            lineHeight: typography.displayM.lineHeight,
            fontWeight: '700',
          },
          style,
        ]}
      >
        {texts[currentIndex]}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
