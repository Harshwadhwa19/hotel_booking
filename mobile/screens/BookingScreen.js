import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { bookingService } from '../services/dataService';
import { Calendar, Users, Briefcase, ChevronRight, Check } from 'lucide-react-native';

const BookingScreen = ({ route, navigation }) => {
  const { hotelId, hotelName, price } = route.params;
  
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState('Standard');
  
  const [showInPicker, setShowInPicker] = useState(false);
  const [showOutPicker, setShowOutPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return (days > 0 ? days : 1) * price;
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        hotelId,
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
        guestsCount: guests,
        roomType,
        totalPrice: calculateTotal(),
        serviceFee: 0,
        cleaningFee: 0
      };
      await bookingService.create(bookingData);
      alert('Booking successful!');
      navigation.navigate('MyBookings');
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.summaryCard}>
        <Text style={styles.hotelLabel}>Reserving at</Text>
        <Text style={styles.hotelName}>{hotelName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Dates</Text>
        
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowInPicker(true)}>
          <View style={styles.pickerLabel}>
            <Calendar size={18} color="#f59e0b" />
            <Text style={styles.pickerLabelText}>Check-in</Text>
          </View>
          <Text style={styles.pickerValue}>{checkIn.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowOutPicker(true)}>
          <View style={styles.pickerLabel}>
            <Calendar size={18} color="#f59e0b" />
            <Text style={styles.pickerLabelText}>Check-out</Text>
          </View>
          <Text style={styles.pickerValue}>{checkOut.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showInPicker && (
          <DateTimePicker
            value={checkIn}
            mode="date"
            minimumDate={new Date()}
            onChange={(e, date) => {
              setShowInPicker(false);
              if (date) setCheckIn(date);
            }}
          />
        )}

        {showOutPicker && (
          <DateTimePicker
            value={checkOut}
            mode="date"
            minimumDate={new Date(checkIn.getTime() + 86400000)}
            onChange={(e, date) => {
              setShowOutPicker(false);
              if (date) setCheckOut(date);
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guests & Room</Text>
        <View style={styles.counterContainer}>
          <View style={styles.pickerLabel}>
            <Users size={18} color="#f59e0b" />
            <Text style={styles.pickerLabelText}>Number of Guests</Text>
          </View>
          <View style={styles.counter}>
            <TouchableOpacity style={styles.countBtn} onPress={() => setGuests(Math.max(1, guests - 1))}>
              <Text style={styles.countBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{guests}</Text>
            <TouchableOpacity style={styles.countBtn} onPress={() => setGuests(guests + 1)}>
              <Text style={styles.countBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.roomSelect}>
          {['Standard', 'Deluxe', 'Suite'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={[styles.roomBtn, roomType === type && styles.roomBtnActive]}
              onPress={() => setRoomType(type)}
            >
              <Text style={[styles.roomBtnText, roomType === type && styles.roomBtnTextActive]}>{type}</Text>
              {roomType === type && <Check size={14} color="#0f172a" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>₹{calculateTotal().toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.confirmBtn}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#0f172a" /> : <Text style={styles.confirmBtnText}>Confirm Reservation</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  hotelLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  hotelName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  pickerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  pickerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerLabelText: {
    color: '#f8fafc',
    fontSize: 16,
  },
  pickerValue: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  countBtn: {
    backgroundColor: '#334155',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  roomSelect: {
    flexDirection: 'row',
    gap: 10,
  },
  roomBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roomBtnActive: {
    backgroundColor: '#f59e0b',
  },
  roomBtnText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  roomBtnTextActive: {
    color: '#0f172a',
  },
  totalCard: {
    marginTop: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    color: '#94a3b8',
    fontSize: 16,
  },
  totalValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
