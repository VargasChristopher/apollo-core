// app/(tabs)/home.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function TabHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tab Home (web + mobile)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617'
  },
  text: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '500'
  }
});
