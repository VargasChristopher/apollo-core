// app/index.tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apollo Frontend</Text>
      <Text style={styles.subtitle}>
        One React Native codebase. Runs on iOS, Android, and Web.
      </Text>

      <Link href="/(tabs)/home" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Open app tabs</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#38bdf8'
  },
  buttonText: {
    color: '#e0f2fe',
    fontWeight: '600'
  }
});
