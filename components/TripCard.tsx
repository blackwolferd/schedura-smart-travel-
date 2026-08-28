import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { Trip, TripStatus } from '@/data/mockData';
import { BlurView } from 'expo-blur';

interface Props {
  trip: Trip;
  onDelete: () => void;
  index?: number;
}

const STATUS_CONFIG: Record<TripStatus, { label: string; bgKey: 'infoLight' | 'successLight' | 'muted' | 'warningLight'; colorKey: 'info' | 'success' | 'mutedForeground' | 'warning' }> = {
  upcoming: { label: 'Upcoming', bgKey: 'infoLight', colorKey: 'info' },
  ongoing: { label: 'Ongoing', bgKey: 'successLight', colorKey: 'success' },
  completed: { label: 'Completed', bgKey: 'muted', colorKey: 'mutedForeground' },
};

export function TripCard({ trip, onDelete, index = 0 }: Props) {
  const c = useColors();
  const statusCfg = STATUS_CONFIG[trip.status];

  const formatDate = (d?: string) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.cardWrap}>
      <BlurView intensity={c.blurTint === 'dark' ? 30 : 70} tint={c.blurTint} style={[styles.card, { borderColor: c.border }]}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{trip.title}</Text>
          <View style={styles.topRight}>
            <View style={[styles.statusBadge, { backgroundColor: c[statusCfg.bgKey] }]}>
              <Text style={[styles.statusText, { color: c[statusCfg.colorKey] }]}>{statusCfg.label}</Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="trash-2" size={16} color={c.destructive} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date */}
        <View style={styles.infoRow}>
          <Feather name="calendar" size={13} color={c.mutedForeground} />
          <Text style={[styles.infoText, { color: c.mutedForeground }]}>
            {formatDate(trip.departureDate)}
            {trip.returnDate ? ` → ${formatDate(trip.returnDate)}` : ''}
          </Text>
        </View>

        {/* Train Info */}
        {trip.train && (
          <View style={[styles.detailBox, { backgroundColor: c.secondary }]}>
            <View style={styles.detailRow}>
              <Feather name="navigation" size={13} color={c.primary} />
              <Text style={[styles.detailText, { color: c.text }]}>
                <Text style={{ fontWeight: '700' }}>{trip.train.name}</Text>  #{trip.train.number}
              </Text>
            </View>
            <Text style={[styles.detailSub, { color: c.mutedForeground }]}>
              {trip.train.departure} → {trip.train.arrival} · {trip.train.duration}
            </Text>
          </View>
        )}

        {/* Hotel Info */}
        {trip.hotel && (
          <View style={[styles.detailBox, { backgroundColor: c.secondary }]}>
            <View style={styles.detailRow}>
              <Feather name="home" size={13} color={c.accent} />
              <Text style={[styles.detailText, { color: c.text }]}>
                <Text style={{ fontWeight: '700' }}>{trip.hotel.name}</Text>
              </Text>
            </View>
            {trip.checkinDate && (
              <Text style={[styles.detailSub, { color: c.mutedForeground }]}>
                Check-in: {formatDate(trip.checkinDate)}
                {trip.checkoutDate ? ` → Check-out: ${formatDate(trip.checkoutDate)}` : ''}
              </Text>
            )}
          </View>
        )}

        {/* Notes */}
        {!!trip.notes && (
          <Text style={[styles.notes, { color: c.mutedForeground }]} numberOfLines={2}>
            {trip.notes}
          </Text>
        )}
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
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  title: { fontSize: 16, fontWeight: '700', flex: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  deleteBtn: { padding: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  infoText: { fontSize: 13 },
  detailBox: { borderRadius: 10, padding: 10, marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  detailText: { fontSize: 13, flex: 1 },
  detailSub: { fontSize: 11, marginLeft: 19 },
  notes: { fontSize: 12, marginTop: 4, lineHeight: 17 },
});
