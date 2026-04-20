import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { sendOtp } from '../../src/api/auth';
import { ApiError } from '../../src/api/client';

/** Converts "06 12 34 56 78" → "+33612345678". */
function toE164(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('33') && digits.length === 11) return `+${digits}`;
  if (digits.startsWith('0') && digits.length === 10) return `+33${digits.slice(1)}`;
  return null;
}

export default function PhoneScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const phone = toE164(input);
  const canSubmit = phone !== null && !loading;

  async function onSubmit() {
    if (!phone) return;
    setError(null);
    setLoading(true);
    try {
      await sendOtp(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Impossible d\'envoyer le code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.kb}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.eyebrow}>BOOKEEPER · ÉTAPE 1 / 2</Text>
          <Text style={styles.title}>Ton numéro.</Text>
          <Text style={styles.sub}>On t'envoie un code par SMS — pas de mot de passe.</Text>

          <View style={styles.inputWrap}>
            <Text style={styles.flag}>🇫🇷</Text>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="06 12 34 56 78"
              placeholderTextColor="rgba(236,228,208,0.4)"
              keyboardType="phone-pad"
              autoComplete="tel"
              autoFocus
              style={styles.input}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.cta, !canSubmit && styles.ctaDisabled]}
            onPress={onSubmit}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <Text style={styles.ctaText}>Recevoir le code  →</Text>
            )}
          </Pressable>

          <Text style={styles.legal}>
            En continuant, tu acceptes les CGU et la politique de confidentialité.
          </Text>
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
  inputWrap: {
    marginTop: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1.5,
    borderColor: colors.volt,
    paddingVertical: spacing.sm,
  },
  flag: { fontSize: 24 },
  input: {
    flex: 1,
    fontSize: 24,
    color: colors.cream,
    fontWeight: '600',
    letterSpacing: 1,
  },
  error: { color: colors.clay, marginTop: spacing.md, fontSize: fontSizes.sm },
  cta: {
    marginTop: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.volt,
    borderRadius: 999,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: colors.ink, fontSize: fontSizes.md, fontWeight: '700', letterSpacing: 0.2 },
  legal: {
    color: colors.cream,
    opacity: 0.4,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
