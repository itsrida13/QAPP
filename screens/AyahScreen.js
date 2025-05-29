import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, findNodeHandle } from 'react-native';
import useFetchAyahs from '../hooks/useFetchAyahs';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../context/SettingsContext';

export default function AyahScreen({ route }) {
  const { surahNumber } = route.params;
  const {
    selectedSurah,
    englishTranslation,
    urduTranslation,
    tafsir,
    fetchAyahs,
    loading,
  } = useFetchAyahs();

  const { darkMode, showUrdu, showEnglish, showTafsir } = useSettings();

  const audioRef = useRef(null);
  const scrollViewRef = useRef(null);
  const ayahRefs = useRef([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchAyahs(surahNumber);
    return () => {
      stopAudio();
    };
  }, [surahNumber]);

  const stopAudio = async () => {
    setIsPlaying(false);
    setCurrentAyahIndex(-1);
    if (audioRef.current) {
      try {
        await audioRef.current.stopAsync();
        await audioRef.current.unloadAsync();
      } catch (error) {}
      audioRef.current = null;
    }
  };

  const playAyahs = async (index = 0) => {
    if (!selectedSurah || !selectedSurah.ayahs || index >= selectedSurah.ayahs.length || index < 0) {
      stopAudio();
      return;
    }

    setCurrentAyahIndex(index);
    setIsPlaying(true);

    setTimeout(() => {
      if (ayahRefs.current[index]) {
        ayahRefs.current[index].measureLayout(
          findNodeHandle(scrollViewRef.current),
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
          }
        );
      }
    }, 100);

    try {
      const ayahAudioUrl = selectedSurah.ayahs[index].audio;

      if (audioRef.current) {
        await audioRef.current.unloadAsync();
      } else {
        audioRef.current = new Audio.Sound();
      }

      await audioRef.current.loadAsync({ uri: ayahAudioUrl });
      await audioRef.current.playAsync();

      audioRef.current.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          if (index + 1 < selectedSurah.ayahs.length) {
            playAyahs(index + 1);
          } else {
            stopAudio();
          }
        }
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      stopAudio();
    }
  };

  const onPreviousPress = () => {
    if (currentAyahIndex > 0) {
      playAyahs(currentAyahIndex - 1);
    }
  };

  const onNextPress = () => {
    if (currentAyahIndex + 1 < selectedSurah.ayahs.length) {
      playAyahs(currentAyahIndex + 1);
    }
  };

  if (loading || !selectedSurah) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  const backgroundColor = darkMode ? '#000' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';
  const highlightColor = darkMode ? '#444400' : 'yellow';

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ padding: 16, backgroundColor }}
    >
      {/* Audio Controls */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12, alignItems: 'center' }}>
        <TouchableOpacity
          onPress={onPreviousPress}
          disabled={currentAyahIndex <= 0}
          style={{ marginRight: 12, opacity: currentAyahIndex <= 0 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-back-circle" size={32} color="green" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (isPlaying) {
              stopAudio();
            } else {
              playAyahs(currentAyahIndex >= 0 ? currentAyahIndex : 0);
            }
          }}
          style={{ marginRight: 12 }}
        >
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={36}
            color="green"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextPress}
          disabled={currentAyahIndex === -1 || currentAyahIndex + 1 >= selectedSurah.ayahs.length}
          style={{ opacity: currentAyahIndex === -1 || currentAyahIndex + 1 >= selectedSurah.ayahs.length ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-forward-circle" size={32} color="green" />
        </TouchableOpacity>
      </View>

      {/* Arabic Ayahs */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8, color: textColor }}>
          Arabic Ayahs
        </Text>
        {selectedSurah.ayahs.map((ayah, i) => (
          <TouchableOpacity
            key={ayah.number}
            onPress={() => playAyahs(i)}
            ref={(ref) => { ayahRefs.current[i] = ref; }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: 'right',
                marginBottom: 6,
                backgroundColor: currentAyahIndex === i ? highlightColor : 'transparent',
                padding: 4,
                borderRadius: 4,
                color: textColor,
              }}
            >
              {ayah.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Urdu Translation */}
      {showUrdu && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8, color: 'green' }}>
            Urdu Translation
          </Text>
          {urduTranslation.length > 0 ? (
            urduTranslation.map((text, idx) => (
              <Text key={idx} style={{ fontSize: 18, marginBottom: 6, color: textColor }}>
                {text}
              </Text>
            ))
          ) : (
            <Text style={{ color: textColor }}>Urdu translation not available.</Text>
          )}
        </View>
      )}

      {/* English Translation */}
      {showEnglish && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8, color: 'blue' }}>
            English Translation
          </Text>
          {englishTranslation.length > 0 ? (
            englishTranslation.map((text, idx) => (
              <Text key={idx} style={{ fontSize: 18, marginBottom: 6, color: textColor }}>
                {text}
              </Text>
            ))
          ) : (
            <Text style={{ color: textColor }}>English translation not available.</Text>
          )}
        </View>
      )}

      {/* Tafsir */}
      {showTafsir && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8, fontStyle: 'italic', color: textColor }}>
            Tafsir (English)
          </Text>
          {tafsir.length > 0 ? (
            tafsir.map((ayahTafsir, idx) => (
              <Text key={idx} style={{ fontSize: 16, marginBottom: 8, color: textColor }}>
                {ayahTafsir.text}
              </Text>
            ))
          ) : (
            <Text style={{ color: textColor }}>Tafsir not available.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
