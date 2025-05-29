import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const {
    darkMode,
    setDarkMode,
    showUrdu,
    setShowUrdu,
    showEnglish,
    setShowEnglish,
    showTafsir,
    setShowTafsir,
  } = useSettings();

  const backgroundColor = darkMode ? '#222' : '#f5f5dc'; // dark or beige background
  const textColor = darkMode ? '#fff' : '#000';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>

      <View style={styles.option}>
        <Text style={[styles.text, { color: textColor }]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.option}>
        <Text style={[styles.text, { color: textColor }]}>Urdu Translation</Text>
        <Switch value={showUrdu} onValueChange={setShowUrdu} />
      </View>

      <View style={styles.option}>
        <Text style={[styles.text, { color: textColor }]}>English Translation</Text>
        <Switch value={showEnglish} onValueChange={setShowEnglish} />
      </View>

      <View style={styles.option}>
        <Text style={[styles.text, { color: textColor }]}>Tafsir</Text>
        <Switch value={showTafsir} onValueChange={setShowTafsir} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
  },
});
