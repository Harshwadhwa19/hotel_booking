import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronLeft, SlidersHorizontal, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import api from '../services/api';
import HotelCard from '../components/HotelCard';

const SearchScreen = ({ navigation, route }) => {
  const [query, setQuery] = useState(route.params?.query || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/hotels/search?q=${text}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.textMain} size={24} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search color={COLORS.textMuted} size={20} />
          <TextInput
            placeholder="Search city, hotel name..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            autoFocus={!route.params?.query}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal color={COLORS.primary} size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <HotelCard 
              hotel={item} 
              onPress={() => navigation.navigate('HotelDetails', { hotelId: item.id })} 
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            query.length >= 2 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hotels found for "{query}"</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MapPin color={COLORS.textMuted} size={40} />
                <Text style={styles.emptyText}>Start searching for your next stay</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg, 
    marginTop: 20, 
    paddingBottom: SPACING.lg 
  },
  backBtn: { marginRight: SPACING.md },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  searchInput: { flex: 1, color: COLORS.textMain, marginLeft: SPACING.sm, fontSize: 16 },
  filterBtn: { 
    backgroundColor: COLORS.accent, 
    width: 50, 
    height: 50, 
    borderRadius: RADIUS.md, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: SPACING.md
  },
  listContent: { padding: SPACING.lg },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textMuted, fontSize: 16, marginTop: SPACING.md },
});

export default SearchScreen;
