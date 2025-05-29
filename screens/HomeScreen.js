import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString();
      setCurrentTime(time);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Green Part */}
      <View style={styles.greenSection}>
        <Image source={require('../assets/quran.png')} style={styles.quranImage} />
        <Text style={styles.timeText}>{currentTime}</Text>
      </View>

      {/* Bottom White Part */}
      <View style={styles.whiteSection}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Surah')}>
          <Text style={styles.buttonText}>Surah List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greenSection: {
    flex: 1,
    backgroundColor: '#006400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quranImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    width: 200,
    padding: 15,
    backgroundColor: '#006400',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
