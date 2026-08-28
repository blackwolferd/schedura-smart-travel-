import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  TextInput, StyleSheet, SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { CITIES } from '@/data/mockData';

interface Props {
  value: string;
  placeholder?: string;
  onSelect: (city: string) => void;
  label?: string;
}

export function CityPicker({ value, placeholder = 'Select city', onSelect, label }: Props) {
  const c = useColors();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = CITIES.filter(city =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {label && <Text style={[styles.label, { color: c.mutedForeground }]}>{label}</Text>}
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: c.card, borderColor: c.border }]}
        onPress={() => { setVisible(true); setQuery(''); }}
        activeOpacity={0.8}
      >
        <Feather name="map-pin" size={16} color={value ? c.primary : c.mutedForeground} />
        <Text style={[styles.triggerText, { color: value ? c.text : c.mutedForeground }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color={c.mutedForeground} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: c.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: c.border }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>Select City</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Feather name="x" size={22} color={c.text} />
            </TouchableOpacity>
          </View>
          <View style={[styles.searchWrap, { backgroundColor: c.muted, borderColor: c.border }]}>
            <Feather name="search" size={16} color={c.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: c.text }]}
              placeholder="Search cities..."
              placeholderTextColor={c.mutedForeground}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cityItem,
                  { borderBottomColor: c.border },
                  value === item && { backgroundColor: c.secondary },
                ]}
                onPress={() => { onSelect(item); setVisible(false); }}
                activeOpacity={0.7}
              >
                <Feather name="map-pin" size={14} color={value === item ? c.primary : c.mutedForeground} />
                <Text style={[styles.cityName, { color: value === item ? c.primary : c.text }]}>{item}</Text>
                {value === item && <Feather name="check" size={16} color={c.primary} />}
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginLeft: 2 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: borderRadius,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  triggerText: { flex: 1, fontSize: 15, fontWeight: '500' },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 12,
    borderRadius: borderRadius,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  cityName: { flex: 1, fontSize: 15, fontWeight: '500' },
});
