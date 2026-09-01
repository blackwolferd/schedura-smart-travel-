import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Switch, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { useApp, clearAllData } from '@/context/AppContext';
import { CityPicker } from '@/components/CityPicker';
import { BlurView } from 'expo-blur';


export default function ProfileScreen() {
  const c = useColors();
  const { user, updateUser, trips } = useApp();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [homeCity, setHomeCity] = useState(user.homeCity);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [saving, setSaving] = useState(false);

  const initials = (name || 'T').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const stats = {
    total: trips.length,
    upcoming: trips.filter(t => t.status === 'upcoming').length,
    completed: trips.filter(t => t.status === 'completed').length,
  };

  const handleSave = () => {
    setSaving(true);
    updateUser({ name, email, phone, homeCity });
    setTimeout(() => setSaving(false), 600);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your trips, profile, and search history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            updateUser({ name: 'Traveller', email: '', phone: '', homeCity: 'Delhi' });
            setName('Traveller'); setEmail(''); setPhone(''); setHomeCity('Delhi');
            Alert.alert('Done', 'All data cleared.');
          },
        },
      ]
    );
  };

  const s = styles(c);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={c.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

          {/* Header */}
          <Text style={s.pageTitle}>Profile</Text>

          {/* Avatar */}
          <View style={s.avatarSection}>
            <View style={[s.avatar, { backgroundColor: c.primary }]}>
              <Text style={s.avatarInitials}>{initials}</Text>
            </View>
            <Text style={[s.avatarName, { color: c.text }]}>{user.name}</Text>
            <Text style={[s.avatarCity, { color: c.mutedForeground }]}>
              <Feather name="map-pin" size={12} color={c.mutedForeground} /> {user.homeCity}
            </Text>
          </View>

          {/* Stats Row */}
          <View style={s.statsRowWrap}>
            <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.statsRow, { borderColor: c.border }]}>
              {[
                { label: 'Total Trips', value: stats.total },
                { label: 'Upcoming', value: stats.upcoming },
                { label: 'Completed', value: stats.completed },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <View style={s.statItem}>
                    <Text style={[s.statValue, { color: c.text }]}>{stat.value}</Text>
                    <Text style={[s.statLabel, { color: c.mutedForeground }]}>{stat.label}</Text>
                  </View>
                  {i < 2 && <View style={[s.statDivider, { backgroundColor: c.border }]} />}
                </React.Fragment>
              ))}
            </BlurView>
          </View>

          {/* Edit Profile */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Personal Details</Text>

            <View style={s.fieldWrap}>
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.fieldInner, { borderColor: c.border }]}>
                <Text style={[s.fieldLabel, { color: c.mutedForeground }]}>Name</Text>
                <TextInput
                  style={[s.fieldInput, { color: c.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={c.mutedForeground}
                />
              </BlurView>
            </View>

            <View style={s.fieldWrap}>
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.fieldInner, { borderColor: c.border }]}>
                <Text style={[s.fieldLabel, { color: c.mutedForeground }]}>Email</Text>
                <TextInput
                  style={[s.fieldInput, { color: c.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={c.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </BlurView>
            </View>

            <View style={s.fieldWrap}>
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.fieldInner, { borderColor: c.border }]}>
                <Text style={[s.fieldLabel, { color: c.mutedForeground }]}>Phone</Text>
                <TextInput
                  style={[s.fieldInput, { color: c.text }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={c.mutedForeground}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </BlurView>
            </View>

            <View style={s.fieldWrap}>
              <CityPicker label="Home City" value={homeCity} onSelect={setHomeCity} />
            </View>

            <TouchableOpacity
              style={s.saveBtnWrap}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <BlurView intensity={c.blurTint === 'dark' ? 60 : 100} tint={c.blurTint} style={[s.saveBtn, { backgroundColor: saving ? c.success : c.primary }]}>
                <Feather name={saving ? 'check' : 'save'} size={16} color="#fff" />
                <Text style={s.saveBtnText}>{saving ? 'Saved!' : 'Save Changes'}</Text>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Settings */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: c.text }]}>Settings</Text>

            <View style={s.settingRowWrap}>
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.settingRow, { borderColor: c.border }]}>
                <View style={s.settingLeft}>
                  <Feather name="bell" size={18} color={c.text} />
                  <Text style={[s.settingText, { color: c.text }]}>Notifications</Text>
                </View>
                <Switch
                  value={notificationsOn}
                  onValueChange={setNotificationsOn}
                  trackColor={{ false: c.border, true: c.primary }}
                  thumbColor="#fff"
                />
              </BlurView>
            </View>

            <View style={s.settingRowWrap}>
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.settingRow, { borderColor: c.border }]}>
                <View style={s.settingLeft}>
                  <Feather name="info" size={18} color={c.text} />
                  <View>
                    <Text style={[s.settingText, { color: c.text }]}>About Schedura</Text>
                    <Text style={[s.settingSubText, { color: c.mutedForeground }]}>v1.0.0 · Built with ❤️ in India</Text>
                  </View>
                </View>
              </BlurView>
            </View>

            <TouchableOpacity
              style={s.settingRowWrap}
              onPress={handleClearData}
              activeOpacity={0.8}
            >
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.settingRow, { borderColor: c.border }]}>
                <View style={s.settingLeft}>
                  <Feather name="trash-2" size={18} color={c.destructive} />
                  <Text style={[s.settingText, { color: c.destructive }]}>Clear All Data</Text>
                </View>
                <Feather name="chevron-right" size={16} color={c.mutedForeground} />
              </BlurView>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity
              style={s.settingRowWrap}
              onPress={async () => {
                await AsyncStorage.removeItem('schedura_auth');
                router.replace('/login');
              }}
              activeOpacity={0.8}
            >
              <BlurView intensity={c.blurTint === 'dark' ? 20 : 50} tint={c.blurTint} style={[s.settingRow, { borderColor: c.border }]}>
                <View style={s.settingLeft}>
                  <Feather name="log-out" size={18} color={c.destructive} />
                  <Text style={[s.settingText, { color: c.destructive }]}>Sign Out</Text>
                </View>
                <Feather name="chevron-right" size={16} color={c.mutedForeground} />
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    scroll: { flex: 1 },
    content: { paddingBottom: 24 },
    pageTitle: { fontSize: 26, fontWeight: '900', color: c.text, paddingHorizontal: 20, paddingTop: 16, marginBottom: 20 },
    avatarSection: { alignItems: 'center', marginBottom: 24 },
    avatar: {
      width: 80, height: 80, borderRadius: 40,
      alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    avatarInitials: { color: '#fff', fontSize: 28, fontWeight: '900' },
    avatarName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
    avatarCity: { fontSize: 14 },
    statsRowWrap: {
      marginHorizontal: 20,
      marginBottom: 24,
      borderRadius: borderRadius,
      overflow: 'hidden',
    },
    statsRow: {
      flexDirection: 'row',
      borderWidth: 1,
      paddingVertical: 16,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: '900' },
    statLabel: { fontSize: 12, marginTop: 2 },
    statDivider: { width: 1, height: '70%', alignSelf: 'center' },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
    fieldWrap: { marginBottom: 14, borderRadius: borderRadius, overflow: 'hidden' },
    fieldInner: {
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    fieldLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2, marginLeft: 2 },
    fieldInput: {
      fontSize: 15,
      paddingVertical: 6,
    },
    saveBtnWrap: {
      marginTop: 4,
      borderRadius: borderRadius,
      overflow: 'hidden',
    },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    settingRowWrap: {
      marginBottom: 10,
      borderRadius: borderRadius,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingText: { fontSize: 15, fontWeight: '600' },
    settingSubText: { fontSize: 12, marginTop: 1 },
  });
