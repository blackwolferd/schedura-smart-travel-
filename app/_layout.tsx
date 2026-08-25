import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await AsyncStorage.getItem('schedura_auth');
        if (auth) {
          const parsed = JSON.parse(auth);
          setIsLoggedIn(parsed.loggedIn === true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        SplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoggedIn === null) return; // still loading

    const inTabs = segments[0] === '(tabs)';
    const inLogin = segments[0] === 'login';

    if (!isLoggedIn && !inLogin) {
      router.replace('/login');
    } else if (isLoggedIn && inLogin) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  if (isLoggedIn === null) return null; // loading

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="booking"
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
