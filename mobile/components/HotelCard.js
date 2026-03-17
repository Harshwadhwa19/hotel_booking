import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOW } from '../utils/theme';

const HotelCard = ({ hotel, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' }} 
          style={styles.image} 
        />
        <View style={styles.ratingBadge}>
          <Star size={12} color={COLORS.accent} fill={COLORS.accent} />
          <Text style={styles.ratingText}>{hotel.rating || '4.5'}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{hotel.category || 'Hotel'}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>{hotel.name}</Text>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={COLORS.textMuted} />
          <Text style={styles.location} numberOfLines={1}>{hotel.location}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>₹{hotel.pricePerNight?.toLocaleString()}</Text>
            <Text style={styles.priceLabel}>Per Night</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onPress}>
            <Text style={styles.bookBtnText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
    ...SHADOW,
  },
  imageContainer: { position: 'relative', width: '100%', height: 180 },
  image: { width: '100%', height: '100%' },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  ratingText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  categoryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  categoryText: { color: COLORS.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  details: { padding: SPACING.md },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.textMain, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 4 },
  location: { color: COLORS.textMuted, fontSize: 13 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 20, fontWeight: '800', color: COLORS.accent },
  priceLabel: { fontSize: 11, color: COLORS.textMuted },
  bookBtn: { backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.accent },
  bookBtnText: { color: COLORS.accent, fontWeight: '700', fontSize: 13 },
});

export default HotelCard;
