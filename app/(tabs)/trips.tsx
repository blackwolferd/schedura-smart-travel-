import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { TripCard } from '@/components/TripCard';
import { Trip, TripStatus } from '@/data/mockData';
import { BlurView } from 'expo-blur';


type FilterTab = 'all' | TripStatus;

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
];

export default function TripsScreen() {
  const c = useColors();
  const router = useRouter();
  const { trips, removeTrip } = useApp();
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  const handleDelete = (trip: Trip) => {
    Alert.alert(
      'Delete Trip',
      `Remove "${trip.title}" from your trips?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeTrip(trip.id) },
      ]
    );
  };

  const s = styles(c);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={c.background} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>My Trips</Text>
          <Text style={[s.subtitle, { color: c.mutedForeground }]}>
            {trips.length} trip{trips.length !== 1 ? 's' : ''} booked
          </Text>
        </View>
        {trips.length > 0 && (
          <View style={[s.badge, { backgroundColor: c.primary }]}>
            <Text style={s.badgeText}>{trips.length}</Text>
          </View>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={s.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={s.filterTabWrap}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}
          >
            <BlurView intensity={filter === f.key ? (c.blurTint === 'dark' ? 60 : 80) : (c.blurTint === 'dark' ? 20 : 40)} tint={c.blurTint} style={[
              s.filterTab,
              { borderColor: filter === f.key ? c.primary : c.border },
              filter === f.key && { backgroundColor: c.primary + '30' }
            ]}>
              <Text style={[s.filterText, { color: filter === f.key ? c.primary : c.mutedForeground }]}>
                {f.label}
              </Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {filtered.length === 0 ? (
        <View style={s.emptyWrap}>
          <Text style={s.emptyIcon}>🧳</Text>
          <Text style={[s.emptyTitle, { color: c.text }]}>No trips yet</Text>
          <Text style={[s.emptyBody, { color: c.mutedForeground }]}>
            {filter === 'all'
              ? "Book your first train or hotel to get started!"
              : `No ${filter} trips found.`}
          </Text>
          {filter === 'all' && (
            <TouchableOpacity
              style={s.bookBtnWrap}
              onPress={() => router.push('/(tabs)/search')}
              activeOpacity={0.85}
            >
              <BlurView intensity={c.blurTint === 'dark' ? 60 : 100} tint={c.blurTint} style={[s.bookBtn, { backgroundColor: c.primary }]}>
                <Feather name="search" size={16} color="#fff" />
                <Text style={s.bookBtnText}>Search & Book</Text>
              </BlurView>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item: Trip) => item.id}
          renderItem={({ item }: { item: Trip }) => (
            <TripCard trip={item} onDelete={() => handleDelete(item)} />
          )}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      marginBottom: 16,
    },
    title: { fontSize: 26, fontWeight: '900', color: c.text },
    subtitle: { fontSize: 14, marginTop: 2 },
    badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
    badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    filterRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 8,
      marginBottom: 16,
    },
    filterTabWrap: {
      borderRadius: 100,
      overflow: 'hidden',
    },
    filterTab: {
      borderWidth: 1.5,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    filterText: { fontSize: 12, fontWeight: '700' },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
    emptyIcon: { fontSize: 64 },
    emptyTitle: { fontSize: 22, fontWeight: '800' },
    emptyBody: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    bookBtnWrap: {
      borderRadius: borderRadius,
      overflow: 'hidden',
      marginTop: 8,
    },
    bookBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 24,
      paddingVertical: 13,
    },
    bookBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    list: { paddingHorizontal: 20, paddingBottom: 40 },
  });
