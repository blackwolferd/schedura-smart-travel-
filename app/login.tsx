import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Image, Dimensions, ScrollView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { image: require('@/assets/images/travel1.png'), title: 'Explore India by Train', sub: 'Discover scenic routes across the country' },
  { image: require('@/assets/images/travel2.png'), title: 'Luxury Hotel Stays', sub: 'Book premium rooms at the best prices' },
  { image: require('@/assets/images/travel3.png'), title: 'Iconic Destinations', sub: 'Plan unforgettable trips with AI assistance' },
];

type Step = 'email' | 'otp' | 'name';

export default function LoginScreen() {
  const c = useColors();
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const generateOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  };

  const handleSendOtp = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate sending OTP
    const code = generateOtp();
    setGeneratedOtp(code);

    // In production, send this OTP via email API (SendGrid, Resend, etc.)
    // For demo, we show it in an alert
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(60);

      if (Platform.OS === 'web') {
        window.alert(`Your OTP is: ${code}\n\n(In production, this would be sent to ${email.trim()})`);
      } else {
        Alert.alert(
          'OTP Sent! 📧',
          `Your verification code is: ${code}\n\n(In production, this would be sent to ${email.trim()})`,
          [{ text: 'OK' }]
        );
      }
    }, 1200);
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }
    if (otp.trim() !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }

    // Check if user exists
    const existingAuth = await AsyncStorage.getItem('schedura_accounts');
    let accounts: Record<string, any> = {};
    if (existingAuth) {
      try { accounts = JSON.parse(existingAuth); } catch {}
    }

    if (accounts[email.trim()]) {
      // Existing user — log in directly
      const userData = accounts[email.trim()];
      await AsyncStorage.setItem('schedura_auth', JSON.stringify({
        ...userData,
        loggedIn: true,
      }));
      await AsyncStorage.setItem('schedura_user', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: '',
        homeCity: 'Delhi',
      }));
      router.replace('/(tabs)');
    } else {
      // New user — ask for name
      setStep('name');
    }
  };

  const handleCreateAccount = async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        email: email.trim(),
        name: name.trim(),
        loggedIn: true,
        loginMethod: 'email-otp',
        createdAt: new Date().toISOString(),
      };

      // Save to accounts registry
      const existingAuth = await AsyncStorage.getItem('schedura_accounts');
      let accounts: Record<string, any> = {};
      if (existingAuth) {
        try { accounts = JSON.parse(existingAuth); } catch {}
      }
      accounts[email.trim()] = userData;
      await AsyncStorage.setItem('schedura_accounts', JSON.stringify(accounts));

      // Save current auth
      await AsyncStorage.setItem('schedura_auth', JSON.stringify(userData));
      await AsyncStorage.setItem('schedura_user', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: '',
        homeCity: 'Delhi',
      }));
      router.replace('/(tabs)');
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    const userData = {
      email: '',
      name: 'Traveller',
      loggedIn: true,
      loginMethod: 'guest',
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem('schedura_auth', JSON.stringify(userData));
    router.replace('/(tabs)');
  };

  const s = styles(c);
  const slide = SLIDES[currentSlide];

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Image Slideshow */}
      <View style={s.imageContainer}>
        <Image source={slide.image} style={s.bgImage} />
        <View style={s.imageOverlay} />
        
        {/* Slide dots */}
        <View style={s.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[s.dot, i === currentSlide && s.dotActive]} />
          ))}
        </View>

        {/* Image caption */}
        <View style={s.captionWrap}>
          <Text style={s.captionTitle}>{slide.title}</Text>
          <Text style={s.captionSub}>{slide.sub}</Text>
        </View>
      </View>

      {/* Login Form */}
      <ScrollView 
        style={s.formScroll} 
        contentContainerStyle={s.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BlurView intensity={c.blurTint === 'dark' ? 40 : 80} tint={c.blurTint} style={[s.formCard, { borderColor: c.border }]}>
          {/* App Logo & Title */}
          <View style={s.logoRow}>
            <Image source={require('@/assets/images/icon.png')} style={s.logoIcon} />
            <View>
              <Text style={[s.appName, { color: c.text }]}>Schedura</Text>
              <Text style={[s.appSub, { color: c.mutedForeground }]}>Your AI travel companion</Text>
            </View>
          </View>

          {/* ─── Step: Email ─── */}
          {step === 'email' && (
            <>
              <Text style={[s.stepTitle, { color: c.text }]}>Sign in with your email</Text>
              <Text style={[s.stepSub, { color: c.mutedForeground }]}>
                We'll send a 6-digit verification code
              </Text>

              <View style={[s.inputWrap, { backgroundColor: c.muted, borderColor: c.border }]}>
                <Feather name="mail" size={18} color={c.mutedForeground} />
                <TextInput
                  style={[s.input, { color: c.text }]}
                  placeholder="your@email.com"
                  placeholderTextColor={c.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                />
                {email.trim() ? (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Feather name="x-circle" size={18} color={c.mutedForeground} />
                  </TouchableOpacity>
                ) : null}
              </View>

              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.primaryBtn, { backgroundColor: c.primary, opacity: loading ? 0.6 : 1 }]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <Text style={s.primaryBtnText}>Sending...</Text>
                ) : (
                  <>
                    <Feather name="send" size={18} color="#fff" />
                    <Text style={s.primaryBtnText}>Send OTP</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* ─── Step: OTP ─── */}
          {step === 'otp' && (
            <>
              <Text style={[s.stepTitle, { color: c.text }]}>Enter verification code</Text>
              <Text style={[s.stepSub, { color: c.mutedForeground }]}>
                Sent to <Text style={{ color: c.primary, fontWeight: '600' }}>{email}</Text>
              </Text>

              <View style={[s.inputWrap, s.otpInputWrap, { backgroundColor: c.muted, borderColor: c.border }]}>
                <Feather name="shield" size={18} color={c.mutedForeground} />
                <TextInput
                  style={[s.input, s.otpInput, { color: c.text }]}
                  placeholder="000000"
                  placeholderTextColor={c.mutedForeground}
                  value={otp}
                  onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, '').slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>

              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.primaryBtn, { backgroundColor: c.primary, opacity: otp.length < 6 ? 0.6 : 1 }]}
                onPress={handleVerifyOtp}
                disabled={otp.length < 6}
                activeOpacity={0.85}
              >
                <Feather name="check-circle" size={18} color="#fff" />
                <Text style={s.primaryBtnText}>Verify & Continue</Text>
              </TouchableOpacity>

              {/* Resend */}
              <View style={s.resendRow}>
                {countdown > 0 ? (
                  <Text style={[s.resendText, { color: c.mutedForeground }]}>
                    Resend in {countdown}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleSendOtp}>
                    <Text style={[s.resendText, { color: c.primary, fontWeight: '700' }]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Back */}
              <TouchableOpacity onPress={() => { setStep('email'); setOtp(''); setError(''); }} style={s.backBtn}>
                <Feather name="arrow-left" size={14} color={c.mutedForeground} />
                <Text style={[s.backText, { color: c.mutedForeground }]}>Change email</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ─── Step: Name (new user) ─── */}
          {step === 'name' && (
            <>
              <Text style={[s.stepTitle, { color: c.text }]}>Welcome! What's your name?</Text>
              <Text style={[s.stepSub, { color: c.mutedForeground }]}>
                Let's set up your profile
              </Text>

              <View style={[s.inputWrap, { backgroundColor: c.muted, borderColor: c.border }]}>
                <Feather name="user" size={18} color={c.mutedForeground} />
                <TextInput
                  style={[s.input, { color: c.text }]}
                  placeholder="Your full name"
                  placeholderTextColor={c.mutedForeground}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoFocus
                />
              </View>

              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.primaryBtn, { backgroundColor: c.primary, opacity: loading ? 0.6 : 1 }]}
                onPress={handleCreateAccount}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Feather name="log-in" size={18} color="#fff" />
                <Text style={s.primaryBtnText}>{loading ? 'Creating...' : 'Get Started'}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Divider */}
          {step === 'email' && (
            <>
              <View style={s.dividerRow}>
                <View style={[s.dividerLine, { backgroundColor: c.border }]} />
                <Text style={[s.dividerText, { color: c.mutedForeground }]}>or</Text>
                <View style={[s.dividerLine, { backgroundColor: c.border }]} />
              </View>

              {/* Skip */}
              <TouchableOpacity onPress={handleSkip} style={s.skipBtn}>
                <Text style={[s.skipText, { color: c.mutedForeground }]}>Continue as Guest</Text>
                <Feather name="arrow-right" size={14} color={c.mutedForeground} />
              </TouchableOpacity>
            </>
          )}
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: { flex: 1 },
    imageContainer: {
      height: height * 0.38,
      width: '100%',
      position: 'relative',
    },
    bgImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    dotsRow: {
      position: 'absolute',
      bottom: 60,
      flexDirection: 'row',
      alignSelf: 'center',
      gap: 8,
    },
    dot: {
      width: 8, height: 8, borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
      backgroundColor: '#fff',
      width: 24,
    },
    captionWrap: {
      position: 'absolute',
      bottom: 16,
      left: 20,
      right: 20,
    },
    captionTitle: {
      fontSize: 22, fontWeight: '800', color: '#fff',
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    captionSub: {
      fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4,
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
    formScroll: { flex: 1, marginTop: -20 },
    formContent: { paddingBottom: 40 },
    formCard: {
      marginHorizontal: 16,
      borderRadius: borderRadius + 4,
      borderWidth: 1,
      padding: 24,
      overflow: 'hidden',
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
    },
    logoIcon: { width: 48, height: 48, borderRadius: 14 },
    appName: { fontSize: 22, fontWeight: '900' },
    appSub: { fontSize: 12, marginTop: 2 },
    stepTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    stepSub: { fontSize: 13, marginBottom: 16 },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: borderRadius,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'web' ? 12 : 0,
      height: Platform.OS === 'web' ? undefined : 50,
      marginBottom: 12,
    },
    otpInputWrap: {},
    input: { flex: 1, fontSize: 15 },
    otpInput: { fontSize: 22, fontWeight: '700', letterSpacing: 8, textAlign: 'center' },
    error: { color: '#EF5350', fontSize: 13, marginBottom: 8, marginLeft: 4 },
    primaryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 50,
      borderRadius: borderRadius,
      marginBottom: 16,
    },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    resendRow: { alignItems: 'center', marginBottom: 8 },
    resendText: { fontSize: 14 },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 4,
    },
    backText: { fontSize: 13 },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { fontSize: 12 },
    skipBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    skipText: { fontSize: 14, fontWeight: '600' },
  });
