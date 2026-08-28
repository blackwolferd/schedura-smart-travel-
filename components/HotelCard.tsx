import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { Hotel } from '@/data/mockData';
import { BlurView } from 'expo-blur';

interface Props {
  hotel: Hotel;
  onBook: () => void;
  index?: number;
}

function StarRow({ stars }: { stars: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <Text key={i} style={{ fontSize: 12, color: i < stars ? '#F5A623' : '#5C6B82' }}>★</Text>
      ))}
    </View>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  budget: '#4CAF50',
  mid: '#42A5F5',
  luxury: '#8A2BE2',
};

export function HotelCard({ hotel, onBook, index = 0 }: Props) {
  const c = useColors();
  const catColor = CATEGORY_COLORS[hotel.category] ?? c.primary;

  return (
    <View style={styles.cardWrap}>
      <BlurView intensity={c.blurTint === 'dark' ? 30 : 70} tint={c.blurTint} style={[styles.card, { borderColor: c.border }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: c.text }]} numberOfLines={2}>{hotel.name}</Text>
            <View style={[styles.catBadge, { backgroundColor: catColor + '1A', borderColor: catColor }]}>
              <Text style={[styles.catText, { color: catColor }]}>
                {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
              </Text>
            </View>
          </View>
          <StarRow stars={hotel.stars} />
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={c.mutedForeground} />
          <Text style={[styles.location, { color: c.mutedForeground }]}>{hotel.location}</Text>
          <Text style={[styles.distance, { color: c.mutedForeground }]}>• {hotel.distanceFromStation} from station</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <View style={[styles.ratingBadge, { backgroundColor: c.success }]}>
            <Text style={styles.ratingText}>{hotel.rating.toFixed(1)} ★</Text>
          </View>
          <Text style={[styles.reviews, { color: c.mutedForeground }]}>{hotel.reviews} reviews</Text>
        </View>

        {/* Amenities */}
        <View style={styles.amenityRow}>
          {hotel.amenities.slice(0, 5).map(a => (
            <View key={a} style={[styles.amenityChip, { backgroundColor: c.secondary }]}>
              <Text style={[styles.amenityText, { color: c.secondaryForeground }]}>{a}</Text>
            </View>
          ))}
          {hotel.amenities.length > 5 && (
            <Text style={[styles.moreAmenities, { color: c.mutedForeground }]}>+{hotel.amenities.length - 5} more</Text>
          )}
        </View>

        {/* Price + Book */}
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: c.primary }]}>₹{hotel.pricePerNight}</Text>
            <Text style={[styles.perNight, { color: c.mutedForeground }]}>per night</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: c.primary }]}
            onPress={onBook}
            activeOpacity={0.85}
          >
            <Text style={[styles.bookBtnText, { color: c.primaryForeground }]}>Book Now</Text>
            <Feather name="arrow-right" size={14} color={c.primaryForeground} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: borderRadius,
    marginBottom: 12,
    overflow: 'hidden',
  },
  card: {
    borderWidth: 1,
    padding: 16,
  },
  header: { marginBottom: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', flex: 1, lineHeight: 22 },
  catBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 },
  catText: { fontSize: 10, fontWeight: '700' },
  starRow: { flexDirection: 'row', gap: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  location: { fontSize: 12 },
  distance: { fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  ratingBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  ratingText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  reviews: { fontSize: 12 },
  amenityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  amenityChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  amenityText: { fontSize: 11, fontWeight: '600' },
  moreAmenities: { fontSize: 11, alignSelf: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 22, fontWeight: '800' },
  perNight: { fontSize: 11 },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 6,
  },
  bookBtnText: { fontSize: 14, fontWeight: '700' },
});
