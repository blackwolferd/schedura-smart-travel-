import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, UserProfile } from '@/data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppState {
  trips: Trip[];
  user: UserProfile;
  recentSearches: string[];
  addTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addRecentSearch: (search: string) => void;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  TRIPS: 'schedura_trips',
  USER: 'schedura_user',
  SEARCHES: 'schedura_searches',
} as const;

const DEFAULT_USER: UserProfile = {
  name: 'Traveller',
  email: '',
  phone: '',
  homeCity: 'Delhi',
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const [tripsJson, userJson, searchesJson] = await Promise.all([
          AsyncStorage.getItem(KEYS.TRIPS),
          AsyncStorage.getItem(KEYS.USER),
          AsyncStorage.getItem(KEYS.SEARCHES),
        ]);
        if (tripsJson) setTrips(JSON.parse(tripsJson));
        if (userJson) setUser(JSON.parse(userJson));
        if (searchesJson) setRecentSearches(JSON.parse(searchesJson));
      } catch (_) {
        // Silent fail — defaults will be used
      }
    })();
  }, []);

  // Persist trips
  useEffect(() => {
    AsyncStorage.setItem(KEYS.TRIPS, JSON.stringify(trips)).catch(() => {});
  }, [trips]);

  // Persist user
  useEffect(() => {
    AsyncStorage.setItem(KEYS.USER, JSON.stringify(user)).catch(() => {});
  }, [user]);

  // Persist searches
  useEffect(() => {
    AsyncStorage.setItem(KEYS.SEARCHES, JSON.stringify(recentSearches)).catch(() => {});
  }, [recentSearches]);

  const addTrip = useCallback((trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  }, []);

  const removeTrip = useCallback((id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTrip = useCallback((id: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const addRecentSearch = useCallback((search: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== search);
      return [search, ...filtered].slice(0, 10);
    });
  }, []);

  return (
    <AppContext.Provider value={{ trips, user, recentSearches, addTrip, removeTrip, updateTrip, updateUser, addRecentSearch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function clearAllData(): Promise<void[]> {
  return Promise.all([
    AsyncStorage.removeItem(KEYS.TRIPS),
    AsyncStorage.removeItem(KEYS.USER),
    AsyncStorage.removeItem(KEYS.SEARCHES)
  ]);
}

// Milestone optimization - Ref Issue #1

// Milestone optimization - Ref Issue #3

// Milestone optimization - Ref Issue #5
