import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { Train, CLASS_OPTIONS } from '@/data/mockData';
import { BlurView } from 'expo-blur';

interface Props {
  train: Train;
  onBook: () => void;
  index?: number;
}

const TYPE_BADGE_COLORS: Record<string, string> = {
  rajdhani: '#E53935',
  shatabdi: '#1565C0',
  duronto: '#6A1B9A',
  express: '#2E7D32',
  mail: '#E65100',
};

function SeatBadge({ count, c }: { count: number; c: ReturnType<typeof useColors> }) {
  const bg = count === 0 ? c.destructive : count <= 20 ? c.warningLight : c.successLight;
  const text = count === 0 ? c.destructiveForeground : count <= 20 ? c.warning : c.success;
  return (
    <View style={[styles.seatBadge, { backgroundColor: bg }]}>
      <Text style={[styles.seatBadgeText, { color: text }]}>
        {count === 0 ? 'NA' : count}
      </Text>
    </View>
  );
}

export function TrainCard({ train, onBook, index = 0 }: Props) {
  const c = useColors();
  const badgeColor = TYPE_BADGE_COLORS[train.type] ?? c.primary;

  return (
    <View style={styles.cardWrap}>
      <BlurView intensity={c.blurTint === 'dark' ? 30 : 70} tint={c.blurTint} style={[styles.card, { borderColor: c.border }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{train.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: badgeColor + '1A', borderColor: badgeColor }]}>
              <Text style={[styles.typeBadgeText, { color: badgeColor }]}>
                {train.type.charAt(0).toUpperCase() + train.type.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={[styles.number, { color: c.mutedForeground }]}>#{train.number}</Text>
        </View>

        {/* Timing Row */}
        <View style={styles.timingRow}>
          <View style={styles.timingBlock}>
            <Text style={[styles.time, { color: c.primary }]}>{train.departure}</Text>
            <Text style={[styles.city, { color: c.text }]}>{train.from}</Text>
          </View>
          <View style={styles.timingCenter}>
            <Text style={[styles.duration, { color: c.mutedForeground }]}>{train.duration}</Text>
            <View style={styles.lineWrap}>
              <View style={[styles.dot, { backgroundColor: c.primary }]} />
              <View style={[styles.line, { backgroundColor: c.border }]} />
              <Feather name="arrow-right" size={14} color={c.primary} />
            </View>
            <Text style={[styles.distance, { color: c.mutedForeground }]}>{train.distance} km</Text>
          </View>
          <View style={[styles.timingBlock, styles.timingRight]}>
            <Text style={[styles.time, { color: c.primary }]}>{train.arrival}</Text>
            <Text style={[styles.city, { color: c.text }]}>{train.to}</Text>
          </View>
        </View>

        {/* Days */}
        <Text style={[styles.days, { color: c.mutedForeground }]}>
          Runs: {train.daysRun.join(' · ')}
        </Text>

        {/* Price Grid */}
        <View style={[styles.priceGrid, { borderColor: c.border }]}>
          {CLASS_OPTIONS.map(cls => {
            const price = train.price[cls.key as keyof typeof train.price];
            const seats = train.seats[cls.key as keyof typeof train.seats];
            return (
              <View key={cls.key} style={styles.priceCell}>
                <Text style={[styles.classLabel, { color: c.mutedForeground }]}>{cls.shortLabel}</Text>
                <Text style={[styles.classPrice, { color: c.text }]}>₹{price}</Text>
                <SeatBadge count={seats} c={c} />
              </View>
            );
          })}
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: c.primary }]}
          onPress={onBook}
          activeOpacity={0.85}
        >
          <Text style={[styles.bookBtnText, { color: c.primaryForeground }]}>Book Now</Text>
          <Feather name="arrow-right" size={16} color={c.primaryForeground} />
        </TouchableOpacity>
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
  header: { marginBottom: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { fontSize: 16, fontWeight: '700', flex: 1 },
  number: { fontSize: 12, marginTop: 2 },
  typeBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  timingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timingBlock: { flex: 1 },
  timingRight: { alignItems: 'flex-end' },
  timingCenter: { flex: 1.4, alignItems: 'center' },
  time: { fontSize: 20, fontWeight: '800' },
  city: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  duration: { fontSize: 11, marginBottom: 4 },
  distance: { fontSize: 11, marginTop: 4 },
  lineWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  line: { height: 1.5, flex: 1 },
  days: { fontSize: 11, marginBottom: 12 },
  priceGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 12,
  },
  priceCell: { flex: 1, alignItems: 'center', gap: 4 },
  classLabel: { fontSize: 10, fontWeight: '600' },
  classPrice: { fontSize: 13, fontWeight: '700' },
  seatBadge: { borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  seatBadgeText: { fontSize: 9, fontWeight: '700' },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius,
    paddingVertical: 12,
    gap: 6,
  },
  bookBtnText: { fontSize: 15, fontWeight: '700' },
});
