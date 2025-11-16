import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '@/constants/theme';

interface VoiceWaveProps {
  isActive?: boolean;
  size?: number;
  style?: ViewStyle;
}

export function VoiceWave({ 
  isActive = false, 
  size = 120,
  style 
}: VoiceWaveProps) {
  const colors = useThemeColors();
  
  // Create 4 wave circles
  const waves = [
    { id: 1, delay: 0, scale: useSharedValue(1), opacity: useSharedValue(0.8) },
    { id: 2, delay: 400, scale: useSharedValue(1), opacity: useSharedValue(0.6) },
    { id: 3, delay: 800, scale: useSharedValue(1), opacity: useSharedValue(0.4) },
    { id: 4, delay: 1200, scale: useSharedValue(1), opacity: useSharedValue(0.2) },
  ];

  useEffect(() => {
    if (isActive) {
      waves.forEach((wave) => {
        // Scale animation
        wave.scale.value = withRepeat(
          withSequence(
            withTiming(1, { duration: wave.delay }),
            withTiming(1.8, {
              duration: 1600,
              easing: Easing.out(Easing.ease),
            })
          ),
          -1,
          false
        );

        // Opacity animation
        wave.opacity.value = withRepeat(
          withSequence(
            withTiming(0.8, { duration: wave.delay }),
            withTiming(0, {
              duration: 1600,
              easing: Easing.out(Easing.ease),
            })
          ),
          -1,
          false
        );
      });
    } else {
      waves.forEach((wave) => {
        wave.scale.value = withTiming(1, { duration: 300 });
        wave.opacity.value = withTiming(0, { duration: 300 });
      });
    }
  }, [isActive]);

  return (
    <View style={[styles.container, { width: size * 2, height: size * 2 }, style]}>
      {waves.map((wave) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: wave.scale.value }],
          opacity: wave.opacity.value,
        }));

        return (
          <Animated.View
            key={wave.id}
            style={[
              styles.wave,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.accent,
                borderColor: colors.accent,
              },
              animatedStyle,
            ]}
          />
        );
      })}
      
      {/* Center dot */}
      <View
        style={[
          styles.centerDot,
          {
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: size * 0.25,
            backgroundColor: isActive ? colors.accent : colors.surface,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    borderWidth: 2,
  },
  centerDot: {
    shadowColor: '#06d6e6',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
});
