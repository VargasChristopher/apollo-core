// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../constants/theme';

export default function TabsLayout() {
  const colors = useThemeColors();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderSubtle,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="core"
        options={{
          title: 'Core',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="lighting"
        options={{
          title: 'Lighting',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
