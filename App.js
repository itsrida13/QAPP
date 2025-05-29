import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SurahScreen from './screens/SurahScreen';
import AyahScreen from './screens/AyahScreen';
import SettingsScreen from './screens/SettingsScreen';

import { SettingsProvider } from './context/SettingsContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Quran App' }} />
          <Stack.Screen name="Surah" component={SurahScreen} options={{ title: 'Surahs' }} />
          <Stack.Screen name="AyahScreen" component={AyahScreen} options={{ title: 'Ayahs' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}
