import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from 'react-native';
import useFetchSurahs from '../hooks/useFetchSurahs';

export default function SurahScreen({ navigation }) {
  const {
    filteredSurahs,
    loading,
    refreshing,
    handleRefresh,
    handleLoadMore,
    searchQuery,
    setSearchQuery,
  } = useFetchSurahs();

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search Surah by name"
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        onEndReached={handleLoadMore}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.2}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AyahScreen', { surahNumber: item.number })
            }
            style={styles.item}
          >
            <Text style={styles.surahName}>
              {item.englishName} ({item.name})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 45,
    borderWidth: 3,
    borderColor: '#006400',
    borderRadius: 9,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f5f5dc',
    color: '#333',
  },
  item: {
    padding: 16,
    backgroundColor: '#f5f5dc',
    borderwidth: 3,
    borderColor:'##006400',
    marginBottom: 8,
    borderRadius: 8,
  },
  surahName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2d3436',
  },
});
