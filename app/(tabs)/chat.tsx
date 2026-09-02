import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { getAIResponse } from '@/utils/aiEngine';
import { LoadingDots } from '@/components/LoadingDots';
import { BlurView } from 'expo-blur';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  quickReplies?: string[];
}

// Render bold text wrapped in **...**
function FormattedText({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text key={i} style={{ fontWeight: '800', color }}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return <Text key={i} style={{ color, lineHeight: 22 }}>{part}</Text>;
      })}
    </Text>
  );
}

export default function ChatScreen() {
  const c = useColors();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Initial greeting
  useEffect(() => {
    const resp = getAIResponse('hello');
    setMessages([{
      id: 'welcome',
      role: 'ai',
      text: resp.text,
      quickReplies: resp.quickReplies,
    }]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const resp = getAIResponse(text.trim());
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: resp.text,
        quickReplies: resp.quickReplies,
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 200 + Math.random() * 600);
  }, [loading]);

  const s = styles(c);

  const renderItem = useCallback(({ item }: { item: Message }) => {
    if (item.role === 'user') {
      return (
        <View style={s.userBubbleWrap}>
          <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.userBubble, { borderColor: c.border }]}>
            <Text style={[s.userText, { color: c.text }]}>{item.text}</Text>
          </BlurView>
        </View>
      );
    }
    return (
      <View style={s.aiBubbleWrap}>
        <View style={s.aiBotIcon}>
          <Ionicons name="trail-sign-outline" size={16} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.aiCard, { borderColor: c.border }]}>
            <FormattedText text={item.text} color={c.text} />
          </BlurView>
          {item.quickReplies && item.quickReplies.length > 0 && (
            <View style={s.quickRow}>
              {item.quickReplies.map(qr => (
                <TouchableOpacity
                  key={qr}
                  style={[s.quickChip, { backgroundColor: c.secondary, borderColor: c.border }]}
                  onPress={() => sendMessage(qr)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.quickChipText, { color: c.secondaryForeground }]} numberOfLines={1}>{qr}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }, [c, sendMessage]);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: c.background }]} edges={['top']}>
      <StatusBar barStyle={c.blurTint === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={c.background} />

      {/* Header */}
      <View style={[s.header, { borderBottomColor: c.border }]}>
        <View style={s.botAvatar}>
          <Ionicons name="trail-sign" size={22} color="#fff" />
        </View>
        <View>
          <Text style={[s.headerTitle, { color: c.text }]}>Schedura AI</Text>
          <Text style={[s.headerSub, { color: c.success }]}>● Online — Indian travel expert</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={s.aiBubbleWrap}>
                <View style={s.aiBotIcon}>
                  <Ionicons name="trail-sign-outline" size={16} color="#fff" />
                </View>
                <BlurView intensity={c.blurTint === 'dark' ? 30 : 60} tint={c.blurTint} style={[s.aiCard, { borderColor: c.border }]}>
                  <LoadingDots />
                </BlurView>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <BlurView intensity={c.blurTint === 'dark' ? 40 : 80} tint={c.blurTint} style={[s.inputBar, { borderTopColor: c.border }]}>
          <TextInput
            style={[s.input, { backgroundColor: c.muted, color: c.text, borderColor: c.border }]}
            placeholder="Ask me about Indian travel..."
            placeholderTextColor={c.mutedForeground}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            style={[s.sendBtn, { backgroundColor: input.trim() ? c.primary : c.muted }]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            activeOpacity={0.85}
          >
            <Feather name="send" size={18} color={input.trim() ? '#fff' : c.mutedForeground} />
          </TouchableOpacity>
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    safe: { flex: 1, paddingBottom: 90 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },
    botAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    headerSub: { fontSize: 12, marginTop: 1 },
    list: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
    userBubbleWrap: { alignItems: 'flex-end' },
    userBubble: { maxWidth: '78%', borderRadius: borderRadius, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, overflow: 'hidden' },
    userText: { fontSize: 15, lineHeight: 22 },
    aiBubbleWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    aiBotIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    aiCard: {
      flex: 1,
      borderRadius: borderRadius,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      overflow: 'hidden',
    },
    quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    quickChip: {
      borderRadius: 100,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
      maxWidth: 180,
    },
    quickChipText: { fontSize: 12, fontWeight: '600' },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 16,
      borderTopWidth: 1,
    },
    input: {
      flex: 1,
      borderRadius: borderRadius,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      maxHeight: 100,
    },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  });
