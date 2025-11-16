// app/+not-found.tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Route not found.</Text>
      <Link href="/" style={styles.link}>
        Go back home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { marginTop: 8, marginBottom: 16 },
  link: { color: '#06d6e6', fontWeight: '600' }
});
