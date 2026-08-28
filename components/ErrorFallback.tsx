import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';

interface Props {
  error: Error;
  retry: () => void;
}

export function ErrorFallback({ error, retry }: Props) {
  const c = useColors();
  const isDev = __DEV__;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={[styles.title, { color: c.text }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: c.mutedForeground }]}>
        The app encountered an unexpected error. Please try again.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: c.primary }]}
        onPress={retry}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: c.primaryForeground }]}>Try Again</Text>
      </TouchableOpacity>

      {isDev && (
        <View style={[styles.devBox, { backgroundColor: c.card, borderColor: c.destructive }]}>
          <Text style={[styles.devTitle, { color: c.destructive }]}>Dev Error Details</Text>
          <ScrollView style={styles.devScroll} showsVerticalScrollIndicator>
            <Text style={[styles.devStack, { color: c.text }]}>{error.stack ?? error.message}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconWrap: { marginBottom: 16 },
  icon: { fontSize: 56 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius,
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
  devBox: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: borderRadius,
    padding: 12,
    width: '100%',
    maxHeight: 220,
  },
  devTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  devScroll: { maxHeight: 160 },
  devStack: { fontFamily: 'monospace', fontSize: 11, lineHeight: 16 },
});
