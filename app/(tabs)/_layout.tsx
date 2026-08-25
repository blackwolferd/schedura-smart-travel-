import { Tabs } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom > 0 ? insets.bottom : 20,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          overflow: 'hidden', // To clip the BlurView
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.15)',
        },
        tabBarBackground: () => (
          <BlurView
            tint={c.blurTint}
            intensity={80}
            style={StyleSheet.absoluteFill}
          >
            <View style={[StyleSheet.absoluteFill, { backgroundColor: c.tabBar }]} />
          </BlurView>
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <Feather name="check-square" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, size }) => <Ionicons name="trail-sign" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
