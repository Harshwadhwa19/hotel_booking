import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { Search, MapPin, Calendar, Users, Star, LogOut, Bookmark } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { hotelService } from '../services/dataService';
import HotelCard from '../components/HotelCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await hotelService.getAll();
      setHotels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = (name, count) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
      <Text style={styles.categoryTitle}>{name}</Text>
      <Text style={styles.categoryCount}>{count} Properties</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80' }} 
          style={styles.hero}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.welcomeText}>Hello, {user?.name?.split(' ')[0] || 'Guest'}</Text>
                <Text style={styles.headerSubtitle}>Discover your next stay</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('MyBookings')} style={styles.headerIcon}>
                <Bookmark color={COLORS.accent} size={22} />
              </TouchableOpacity>
            </View>

            <Text style={styles.heroTitle}>
              Discover Your <Text style={{ color: COLORS.accent }}>Dream</Text> Stay
            </Text>
            <Text style={styles.heroSubtitle}>Explore the world's most luxurious hotels and book your next adventure.</Text>

            {/* Glass Search Bar */}
            <View style={styles.glassSearch}>
              <View style={styles.searchRow}>
                <MapPin color={COLORS.accent} size={18} />
                <TextInput 
                  placeholder="Where are you going?" 
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity 
                style={styles.searchBtn}
                onPress={() => navigation.navigate('Search', { query: searchQuery })}
              >
                <Search color={COLORS.primary} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by <Text style={{ color: COLORS.accent }}>Category</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {renderCategory('Villas', hotels.filter(h => h.category === 'Villa').length)}
            {renderCategory('Hotels', hotels.filter(h => h.category === 'Hotel').length)}
            {renderCategory('Apartments', hotels.filter(h => h.category === 'Apartment').length)}
          </ScrollView>
        </View>

        {/* Recommended Hotels */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended <Text style={{ color: COLORS.accent }}>Hotels</Text></Text>
          </View>
          {loading ? (
            <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 40 }} />
          ) : (
            hotels.slice(0, 4).map(hotel => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                onPress={() => navigation.navigate('HotelDetails', { hotelId: hotel.id })} 
              />
            ))
          )}
        </View>

        {/* Best Deals Section */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Best <Text style={{ color: COLORS.accent }}>Deals</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsScroll}>
            {hotels.filter(h => h.pricePerNight < 15000).map(hotel => (
              <TouchableOpacity 
                key={hotel.id} 
                style={styles.dealCard}
                onPress={() => navigation.navigate('HotelDetails', { hotelId: hotel.id })}
              >
                <ImageBackground source={{ uri: hotel.images?.[0] }} style={styles.dealImage} imageStyle={{ borderRadius: RADIUS.md }}>
                  <View style={styles.dealOverlay}>
                    <Text style={styles.dealPrice}>₹{hotel.pricePerNight}</Text>
                    <Text style={styles.dealName}>{hotel.name}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  hero: { width: '100%', height: 450 },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(15, 16, 33, 0.6)', padding: SPACING.lg, paddingBottom: 40, justifyContent: 'flex-end' },
  headerRow: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  headerSubtitle: { color: COLORS.textMuted, fontSize: 13 },
  headerIcon: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 50 },
  heroTitle: { fontSize: 36, fontWeight: '900', color: COLORS.white, marginBottom: 12 },
  heroSubtitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: 30, lineHeight: 22 },
  glassSearch: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.lg,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 15, marginLeft: 10 },
  searchBtn: { backgroundColor: COLORS.accent, padding: 12, borderRadius: RADIUS.md },
  section: { padding: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, marginBottom: SPACING.lg },
  categoryScroll: { gap: 12 },
  categoryCard: {
    backgroundColor: COLORS.bgCard,
    padding: 20,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    minWidth: 120,
    alignItems: 'center',
  },
  categoryTitle: { color: COLORS.accent, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  categoryCount: { color: COLORS.textMuted, fontSize: 12 },
  dealsScroll: { gap: 16 },
  dealCard: { width: 220, height: 150 },
  dealImage: { width: '100%', height: '100%' },
  dealOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, justifyContent: 'flex-end', borderRadius: RADIUS.md },
  dealPrice: { color: COLORS.accent, fontSize: 18, fontWeight: '800' },
  dealName: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
});

export default HomeScreen;
