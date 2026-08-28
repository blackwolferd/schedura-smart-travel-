import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';

interface Props {
  selectedDate: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
  daysCount?: number;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DatePicker({ selectedDate, onSelect, daysCount = 60 }: Props) {
  const c = useColors();
  const today = new Date();

  const days = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map(d => {
        const str = dateStr(d);
        const selected = str === selectedDate;
        return (
          <TouchableOpacity
            key={str}
            style={[
              styles.dayCell,
              { backgroundColor: selected ? c.primary : c.card, borderColor: selected ? c.primary : c.border },
            ]}
            onPress={() => onSelect(str)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dayName, { color: selected ? c.primaryForeground : c.mutedForeground }]}>
              {DAY_NAMES[d.getDay()]}
            </Text>
            <Text style={[styles.dayNum, { color: selected ? c.primaryForeground : c.text }]}>
              {d.getDate()}
            </Text>
            <Text style={[styles.monthName, { color: selected ? c.primaryForeground : c.mutedForeground }]}>
              {MONTH_NAMES[d.getMonth()]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 4, gap: 8, paddingVertical: 4 },
  dayCell: {
    width: 56,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius,
    borderWidth: 1,
  },
  dayName: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  dayNum: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  monthName: { fontSize: 10 },
});
