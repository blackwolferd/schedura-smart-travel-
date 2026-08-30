import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList,
  StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { generateTrains, generateHotels, Train, Hotel, BUDGET_OPTIONS } from '@/data/mockData';
import { TrainCard } from '@/components/TrainCard';
import { HotelCard } from '@/components/HotelCard';
import { CityPicker } from '@/components/CityPicker';
import { DatePicker } from '@/components/DatePicker';
import { BlurView } from 'expo-blur';


type SearchMode = 'trains' | 'hotels';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function SearchScreen() {
  const c = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string; to?: string }>();
  const { recentSearches, addRecentSearch } = useApp();

  const [mode, setMode] = useState<SearchMode>('trains');
  const [from, setFrom] = useState(params.from ?? '');
  const [to, setTo] = useState(params.to ?? '');
  const [date, setDate] = useState(todayStr());
  const [budgetKey, setBudgetKey] = useState<string>('');
  const [trainResults, setTrainResults] = useState<Train[] | null>(null);
  const [hotelResults, setHotelResults] = useState<Hotel[] | null>(null);
  const [searched, setSearched] = useState(false);

  // Auto-search if params provided
  useEffect(() => {
    if (params.from && params.to) {
      setFrom(params.from);
      setTo(params.to);
    }
  }, [params.from, params.to]);

  const handleSwap = useCallback(() => {
    setFrom(to);
    setTo(from);
    setTrainResults(null);
  }, [from, to]);

  const handleTrainSearch = useCallback(() => {
    if (!from || !to) return;
    const results = generateTrains(from, to);
    setTrainResults(results);
    setSearched(true);
    addRecentSearch(`${from} → ${to}`);
  }, [from, to, addRecentSearch]);

  const handleHotelSearch = useCallback(() => {
    if (!from) return;
    const maxPrice = BUDGET_OPTIONS.find(b => b.key === budgetKey)?.maxPrice;
    const results = generateHotels(from, maxPrice === Infinity ? undefined : maxPrice);
    setHotelResults(results);
    setSearched(true);
    addRecentSearch(`Hotels in ${from}`);
  }, [from, budgetKey, addRecentSearch]);

  const handleBookTrain = useCallback((train: Train) => {
    router.push({
      pathname: '/booking',
      params: { type: 'train', data: JSON.stringify(train), from, to, date },
    });
  }, [router, from, to, date]);

  const handleBookHotel = useCallback((hotel: Hotel) => {
    router.push({
      pathname: '/booking',
      params: { type: 'hotel', data: JSON.stringify(hotel), date },
    });
  }, [router, date]);

  const s = styles(c);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={c.background} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Search</Text>
          <Text style={[s.subtitle, { color: c.mutedForeground }]}>Find trains & hotels across India</Text>
        </View>

        <View>
          {/* Mode Toggle */}
          <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.toggleWrap, { borderColor: c.border }]}>
            {(['trains', 'hotels'] as SearchMode[]).map(m => (
              <TouchableOpacity
                key={m}
                style={[s.toggleBtn, mode === m && { backgroundColor: c.primary, borderColor: c.primary }]}
                onPress={() => { setMode(m); setSearched(false); }}
                activeOpacity={0.85}
              >
                <Feather
                  name={m === 'trains' ? 'navigation' : 'home'}
                  size={15}
                  color={mode === m ? c.primaryForeground : c.text}
                />
                <Text style={[s.toggleText, { color: mode === m ? c.primaryForeground : c.text }]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>

        <View style={s.form}>
          <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.formBlur, { borderColor: c.border }]}>
          {/* Train Form */}
          {mode === 'trains' && (
            <>
              <View style={s.cityRow}>
                <View style={s.cityCol}>
                  <CityPicker label="From" value={from} placeholder="Departure city" onSelect={setFrom} />
                </View>
                <TouchableOpacity
                  style={[s.swapBtn, { backgroundColor: c.secondary, borderColor: c.border }]}
                  onPress={handleSwap}
                >
                  <Feather name="repeat" size={16} color={c.primary} />
                </TouchableOpacity>
                <View style={s.cityCol}>
                  <CityPicker label="To" value={to} placeholder="Destination" onSelect={setTo} />
                </View>
              </View>

              <View style={s.formGroup}>
                <Text style={[s.label, { color: c.mutedForeground }]}>Travel Date</Text>
                <DatePicker selectedDate={date} onSelect={setDate} />
              </View>

              <TouchableOpacity
                style={[s.searchBtn, { backgroundColor: (!from || !to) ? c.muted : c.primary }]}
                onPress={handleTrainSearch}
                disabled={!from || !to}
                activeOpacity={0.85}
              >
                <Feather name="search" size={17} color={(!from || !to) ? c.mutedForeground : '#fff'} />
                <Text style={[s.searchBtnText, { color: (!from || !to) ? c.mutedForeground : '#fff' }]}>
                  Search Trains
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Hotel Form */}
          {mode === 'hotels' && (
            <>
              <CityPicker label="City" value={from} placeholder="Which city?" onSelect={setFrom} />

              <View style={s.formGroup}>
                <Text style={[s.label, { color: c.mutedForeground }]}>Budget</Text>
                <View style={s.budgetRow}>
                  {BUDGET_OPTIONS.map(b => (
                    <TouchableOpacity
                      key={b.key}
                      style={[
                        s.budgetPill,
                        { borderColor: budgetKey === b.key ? c.primary : c.border },
                        budgetKey === b.key && { backgroundColor: c.primary },
                      ]}
                      onPress={() => setBudgetKey(budgetKey === b.key ? '' : b.key)}
                    >
                      <Text style={[s.budgetText, { color: budgetKey === b.key ? '#fff' : c.text }]}>
                        {b.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[s.searchBtn, { backgroundColor: !from ? c.muted : c.primary }]}
                onPress={handleHotelSearch}
                disabled={!from}
                activeOpacity={0.85}
              >
                <Feather name="search" size={17} color={!from ? c.mutedForeground : '#fff'} />
                <Text style={[s.searchBtnText, { color: !from ? c.mutedForeground : '#fff' }]}>
                  Search Hotels
                </Text>
              </TouchableOpacity>
            </>
          )}
          </BlurView>
        </View>

        {/* Recent Searches (before results) */}
        {!searched && recentSearches.length > 0 && (
          <View style={s.recentSection}>
            <Text style={[s.recentTitle, { color: c.mutedForeground }]}>Recent searches</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.recentRow}>
              {recentSearches.map(rs => (
                <TouchableOpacity key={rs} style={[s.recentChip, { backgroundColor: c.secondary, borderColor: c.border }]}>
                  <Feather name="clock" size={12} color={c.mutedForeground} />
                  <Text style={[s.recentChipText, { color: c.secondaryForeground }]}>{rs}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Train Results */}
        {mode === 'trains' && trainResults !== null && (
          <View style={s.results}>
            <Text style={[s.resultsHeader, { color: c.text }]}>
              {trainResults.length} trains · {from} → {to}
            </Text>
            {trainResults.map(t => (
              <TrainCard key={t.id} train={t} onBook={() => handleBookTrain(t)} />
            ))}
          </View>
        )}

        {/* Hotel Results */}
        {mode === 'hotels' && hotelResults !== null && (
          <View style={s.results}>
            <Text style={[s.resultsHeader, { color: c.text }]}>
              {hotelResults.length} hotels in {from}
            </Text>
            {hotelResults.map(h => (
              <HotelCard key={h.id} hotel={h} onBook={() => handleBookHotel(h)} />
            ))}
            {hotelResults.length === 0 && (
              <View style={s.emptyResults}>
                <Text style={{ fontSize: 36 }}>🏨</Text>
                <Text style={[s.emptyText, { color: c.mutedForeground }]}>No hotels match your budget filter</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    scroll: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '900', color: c.text },
    subtitle: { fontSize: 14, marginTop: 2 },
    toggleWrap: {
      flexDirection: 'row',
      marginHorizontal: 20,
      borderRadius: borderRadius + 4,
      borderWidth: 1,
      padding: 4,
      marginBottom: 20,
      overflow: 'hidden',
    },
    toggleBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingVertical: 10,
      borderRadius: borderRadius,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    toggleText: { fontSize: 14, fontWeight: '700' },
    form: { paddingHorizontal: 20, marginBottom: 20 },
    formBlur: { padding: 16, borderRadius: borderRadius + 4, borderWidth: 1, overflow: 'hidden', gap: 16 },
    cityRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
    cityCol: { flex: 1 },
    swapBtn: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 12,
      marginBottom: 2,
    },
    formGroup: { gap: 8 },
    label: { fontSize: 12, fontWeight: '600', marginLeft: 2 },
    budgetRow: { flexDirection: 'row', gap: 10 },
    budgetPill: {
      borderRadius: 100,
      borderWidth: 1.5,
      paddingHorizontal: 16,
      paddingVertical: 9,
    },
    budgetText: { fontSize: 13, fontWeight: '600' },
    searchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: borderRadius,
      paddingVertical: 15,
    },
    searchBtnText: { fontSize: 16, fontWeight: '700' },
    recentSection: { paddingHorizontal: 20, marginBottom: 16 },
    recentTitle: { fontSize: 12, fontWeight: '600', marginBottom: 10 },
    recentRow: { gap: 8 },
    recentChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderRadius: 100,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    recentChipText: { fontSize: 12, fontWeight: '500' },
    results: { paddingHorizontal: 20 },
    resultsHeader: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
    emptyResults: { alignItems: 'center', paddingVertical: 40, gap: 12 },
    emptyText: { fontSize: 15, textAlign: 'center' },
  });
