import { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { sendOtp, verifyOtp } from '../../src/api/auth';
import { ApiError } from '../../src/api/client';
import { setAuthed } from '../../src/stores/auth-store';

const LEN = 6;

export default function OtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [digits, setDigits] = useState<string[]>(Array.from({ length: LEN }, () => ''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  function onChange(i: number, v: string) {
    const clean = v.replace(/\D/g, '').slice(0, LEN);
    if (!clean) {
      const next = [...digits];
      next[i] = '';
      setDigits(next);
      return;
    }

    // Handle paste of full code.
    if (clean.length === LEN) {
      const split = clean.split('').slice(0, LEN);
      setDigits(split);
      inputs.current[LEN - 1]?.blur();
      void submit(split.join(''));
      return;
    }

    const next = [...digits];
    next[i] = clean[0] ?? '';
    setDigits(next);
    if (clean && i < LEN - 1) inputs.current[i + 1]?.focus();

    if (next.every((d) => d !== '')) void submit(next.join(''));
  }

  function onKeyPress(i: number, key: string) {
    if (key === 'Backspace' && digits[i] === '' && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  async function submit(code: string) {
    if (!phone) return;
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(phone, code);
      await setAuthed(res.user, res.token);
      router.replace('/');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Code invalide.');
      setDigits(Array.from({ length: LEN }, () => ''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!phone || resending) return;
    setResending(true);
    setError(null);
    try {
      await sendOtp(phone);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Impossible de renvoyer.');
    } finally {
      setResending(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.kb}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.eyebrow}>BOOKEEPER · ÉTAPE 2 / 2</Text>
          <Text style={styles.title}>Le code.</Text>
          <Text style={styles.sub}>On l'a envoyé au {phone}.</Text>

          <View style={styles.boxes}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                value={d}
                onChangeText={(v) => onChange(i, v)}
                onKeyPress={(e) => onKeyPress(i, e.nativeEvent.key)}
                keyboardType="number-pad"
                autoFocus={i === 0}
                maxLength={LEN}
                textContentType="oneTimeCode"
                style={[styles.box, d ? styles.boxFilled : null]}
              />
            ))}
          </View>

          {loading ? <ActivityIndicator color={colors.volt} style={{ marginTop: spacing.md }} /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.footer}>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.linkMuted}>Changer de numéro</Text>
            </Pressable>
            <Pressable onPress={resend} disabled={resending}>
              <Text style={styles.link}>{resending ? '…' : 'Renvoyer le code'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  kb: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  eyebrow: {
    color: colors.volt,
    fontSize: fontSizes.xs,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.cream,
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 58,
  },
  sub: { color: colors.cream, opacity: 0.65, fontSize: fontSizes.md, marginTop: spacing.sm },
  boxes: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    height: 64,
    borderWidth: 1.5,
    borderColor: 'rgba(212,255,0,0.35)',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: colors.cream,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  boxFilled: { borderColor: colors.volt, backgroundColor: 'rgba(212,255,0,0.08)' },
  error: { color: colors.clay, marginTop: spacing.md, fontSize: fontSizes.sm },
  footer: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: { color: colors.volt, fontSize: fontSizes.sm, fontWeight: '600' },
  linkMuted: { color: colors.cream, opacity: 0.5, fontSize: fontSizes.sm },
});
