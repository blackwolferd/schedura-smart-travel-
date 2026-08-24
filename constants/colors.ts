export const colors = {
  light: {
    text: '#0F1B2D',
    tint: '#007AFF',
    background: '#F0F4F8',
    foreground: '#0F1B2D',
    card: 'rgba(255, 255, 255, 0.7)',
    cardForeground: '#0F1B2D',
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.5)',
    secondaryForeground: '#1E3A5F',
    muted: 'rgba(200, 210, 220, 0.4)',
    mutedForeground: '#6B7C93',
    accent: '#8A2BE2',
    accentForeground: '#FFFFFF',
    border: 'rgba(214, 221, 232, 0.5)',
    input: 'rgba(255, 255, 255, 0.6)',
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#F5A623',
    warningLight: '#FFF8E1',
    info: '#1565C0',
    infoLight: '#E3F2FD',
    destructive: '#E53935',
    destructiveForeground: '#FFFFFF',
    tabBar: 'rgba(255, 255, 255, 0.8)',
    blurTint: 'light' as const,
  },
  dark: {
    text: '#FFFFFF',
    tint: '#007AFF',
    background: '#070A15', // Deep Royal Blue
    foreground: '#FFFFFF',
    card: 'rgba(11, 19, 44, 0.6)', // Glassmorphism base
    cardForeground: '#FFFFFF',
    primary: '#007AFF', // Electric Blue
    primaryForeground: '#FFFFFF',
    secondary: 'rgba(30, 45, 68, 0.6)',
    secondaryForeground: '#A8C0E0',
    muted: 'rgba(30, 45, 68, 0.4)',
    mutedForeground: '#7E8FA6',
    accent: '#8A2BE2', // Soft Purple
    accentForeground: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.1)', // Subtle glass border
    input: 'rgba(11, 19, 44, 0.5)',
    success: '#4CAF50',
    successLight: 'rgba(76, 175, 80, 0.15)',
    warning: '#F5A623',
    warningLight: 'rgba(245, 166, 35, 0.15)',
    info: '#42A5F5',
    infoLight: 'rgba(66, 165, 245, 0.15)',
    destructive: '#EF5350',
    destructiveForeground: '#FFFFFF',
    tabBar: 'rgba(11, 19, 44, 0.75)',
    blurTint: 'dark' as const,
  },
};

export const borderRadius = 18;

export type ColorScheme = Omit<typeof colors.light, 'blurTint'> & { blurTint: 'light' | 'dark' | 'default' };
