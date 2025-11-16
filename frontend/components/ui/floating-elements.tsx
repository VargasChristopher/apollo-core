import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '@/constants/theme';

interface FloatingElement {
  id: number;
  size: number;
  delay: number;
  duration: number;
  x: number;
  y: number;
}

interface FloatingElementsProps {
  count?: number;
  style?: ViewStyle;
}

export function FloatingElements({ count = 5, style }: FloatingElementsProps) {
  const colors = useThemeColors();

  // Generate random floating elements
  const elements: FloatingElement[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    delay: Math.random() * 2000,
    duration: Math.random() * 3000 + 2000,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {elements.map((element) => (
        <FloatingElement
          key={element.id}
          element={element}
          color={colors.accentMuted}
        />
      ))}
    </View>
  );
}

function FloatingElement({ 
  element, 
  color 
}: { 
  element: FloatingElement; 
  color: string;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      element.delay,
      withRepeat(
        withSequence(
          withTiming(-30, { 
            duration: element.duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(30, { 
            duration: element.duration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      element.delay,
      withRepeat(
        withSequence(
          withTiming(20, { 
            duration: element.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-20, { 
            duration: element.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      element.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.element,
        {
          width: element.size,
          height: element.size,
          backgroundColor: color,
          left: `${element.x}%`,
          top: `${element.y}%`,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  element: {
    position: 'absolute',
    borderRadius: 999,
    shadowColor: '#06d6e6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
});
