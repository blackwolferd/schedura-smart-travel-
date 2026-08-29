import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { generateCalendarDays } from '@/data/availabilityData';
import { QUICK_BUBBLES, POPULAR_ROUTES } from '@/data/mockData';
import { BlurView } from 'expo-blur';


function GreetingText({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return `${greeting}, ${name}!`;
}

export default function HomeScreen() {
  const c = useColors();
  const router = useRouter();
  const { user } = useApp();

  const calendarDays = generateCalendarDays(new Date(), 30);

  const handleRoute = useCallback((from: string, to: string) => {
    router.push({ pathname: '/(tabs)/search', params: { from, to } });
  }, [router]);

  const s = styles(c);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle={c.blurTint === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={c.background} />
      
      {/* Background Gradient / Shape for Glassmorphism effect */}
      <View style={[s.bgGlow, { backgroundColor: c.primary, top: -100, left: -100 }]} />
      <View style={[s.bgGlow, { backgroundColor: c.accent, bottom: 100, right: -100 }]} />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: c.text }]}>{GreetingText({ name: user.name })}</Text>
            <Text style={[s.greetingSub, { color: c.mutedForeground }]}>Ready to conquer your schedule?</Text>
          </View>
          <TouchableOpacity style={s.profileBtn}>
            <BlurView intensity={c.blurTint === 'dark' ? 40 : 80} tint={c.blurTint} style={s.profileBlur}>
              <Feather name="bell" size={20} color={c.text} />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* AI Assistant Shortcut */}
        <View>
          <TouchableOpacity 
            style={s.aiCardWrap}
            onPress={() => router.push('/(tabs)/chat')}
            activeOpacity={0.85}
          >
            <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.aiBlur, { borderColor: c.border }]}>
              <View style={s.aiIconImage}>
                <Ionicons name="trail-sign" size={26} color="#fff" />
              </View>
              <View style={s.aiTextWrap}>
                <Text style={[s.aiTitle, { color: c.text }]}>Ask Schedura AI</Text>
                <Text style={[s.aiSub, { color: c.mutedForeground }]}>Plan trips, check schedules, or find cheap hotels instantly.</Text>
              </View>
              <Feather name="chevron-right" size={20} color={c.mutedForeground} />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Interactive Travel Calendar */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Travel Availability Overview</Text>
            <Text style={[s.sectionSub, { color: c.primary }]}>View Calendar</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.heatmapRow}>
            {calendarDays.map(day => {
              const d = new Date(day.date + 'T00:00:00');
              const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
              const dotColor = day.status === 'green' ? c.success : day.status === 'yellow' ? c.warning : c.destructive;
              
              return (
                <TouchableOpacity 
                  key={day.date} 
                  style={s.heatCardWrap}
                  onPress={() => router.push({ pathname: '/(tabs)/search', params: { date: day.date } })}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={c.blurTint === 'dark' ? 40 : 80} tint={c.blurTint} style={[s.heatBlur, { borderColor: c.border }]}>
                    <Text style={[s.heatDay, { color: c.mutedForeground }]}>{dayNames[d.getDay()]}</Text>
                    <Text style={[s.heatDate, { color: c.text }]}>{d.getDate()}</Text>
                    <View style={[s.heatDot, { backgroundColor: dotColor }]} />
                  </BlurView>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Upcoming Tasks / Trips */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: c.text, marginBottom: 16 }]}>Upcoming Tasks & Routes</Text>
          <View style={s.routeGrid}>
            {POPULAR_ROUTES.map((r, i) => (
              <TouchableOpacity
                key={`${r.from}-${r.to}`}
                style={s.routeCardWrap}
                onPress={() => handleRoute(r.from, r.to)}
                activeOpacity={0.8}
              >
                <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.routeBlur, { borderColor: c.border }]}>
                  <Text style={[s.routeFrom, { color: c.text }]}>{r.from}</Text>
                  <Feather name="arrow-right" size={14} color={c.primary} />
                  <Text style={[s.routeTo, { color: c.text }]}>{r.to}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    bgGlow: {
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: 150,
      opacity: 0.15,
      transform: [{ scale: 1.5 }],
      filter: 'blur(50px)',
    },
    scroll: { flex: 1 },
    content: { paddingBottom: 24, paddingHorizontal: 20 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 16,
      marginBottom: 28,
    },
    greeting: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    greetingSub: { fontSize: 14, marginTop: 4 },
    profileBtn: { borderRadius: 20, overflow: 'hidden' },
    profileBlur: { padding: 12 },
    aiCardWrap: { borderRadius: 24, overflow: 'hidden', marginBottom: 32 },
    aiBlur: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderWidth: 1,
      gap: 16,
    },
    aiIconImage: {
      width: 50, height: 50, borderRadius: 25,
      backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center',
    },
    aiTextWrap: { flex: 1 },
    aiTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    aiSub: { fontSize: 13, lineHeight: 18 },
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },
    sectionSub: { fontSize: 13, fontWeight: '600' },
    heatmapRow: { paddingRight: 8, gap: 12 },
    heatCardWrap: { borderRadius: 20, overflow: 'hidden' },
    heatBlur: {
      width: 65,
      alignItems: 'center',
      paddingVertical: 16,
      borderWidth: 1,
      gap: 6,
    },
    heatDay: { fontSize: 12, fontWeight: '600' },
    heatDate: { fontSize: 20, fontWeight: '800' },
    heatDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
    routeGrid: { gap: 12 },
    routeCardWrap: { borderRadius: 16, overflow: 'hidden' },
    routeBlur: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 18,
      gap: 12,
    },
    routeFrom: { fontSize: 15, fontWeight: '700', flex: 1 },
    routeTo: { fontSize: 15, fontWeight: '700', flex: 1, textAlign: 'right' },
  });
