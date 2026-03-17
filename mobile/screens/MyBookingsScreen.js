import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { bookingService } from '../services/dataService';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return styles.statusConfirmed;
      case 'Pending': return styles.statusPending;
      case 'Cancelled': return styles.statusCancelled;
      default: return styles.statusDefault;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return '#22c55e';
      case 'Pending': return '#f59e0b';
      case 'Cancelled': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <View style={styles.hotelInfo}>
          <Text style={styles.hotelName}>{item.hotel?.name || 'Grand Hotel'}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={12} color="#94a3b8" />
            <Text style={styles.locationText}>{item.hotel?.location || 'Location Not Available'}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.bookingStatus)]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.bookingStatus) }]}>{item.bookingStatus}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bookingDetails}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#f59e0b" />
          <View>
            <Text style={styles.detailLabel}>Check-in</Text>
            <Text style={styles.detailValue}>{new Date(item.checkInDate).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#f59e0b" />
          <View>
            <Text style={styles.detailLabel}>Check-out</Text>
            <Text style={styles.detailValue}>{new Date(item.checkOutDate).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>Total Price</Text>
        <Text style={styles.totalPrice}>₹{item.totalPrice.toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptySubtitle}>Your travel history will appear here once you make a reservation.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusConfirmed: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusDefault: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySubtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  }
});

export default MyBookingsScreen;
