// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  // This Stack controls headers / transitions for all routes in app/
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#020617' },
        headerTintColor: '#e5e7eb',
        headerTitleStyle: { fontWeight: '600' }
      }}
    />
  );
}
