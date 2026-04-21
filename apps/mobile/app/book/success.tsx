import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';

export default function BookSuccess() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <View style={styles.check}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.eyebrow}>DEMANDE ENVOYÉE</Text>
        <Text style={styles.title}>C'est parti.</Text>
        <Text style={styles.sub}>
          Le keeper a <Text style={styles.strong}>2 h</Text> pour accepter. Tu seras notifié dès
          qu'il répond.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>CE QUI SE PASSE MAINTENANT</Text>
          <Step n={1} text="Le keeper reçoit une notif avec ta demande." />
          <Step n={2} text="Il accepte ou refuse. Si refus, on te rembourse direct." />
          <Step n={3} text="Si accepté, le paiement est bloqué jusqu'au coup d'envoi." />
          <Step n={4} text="Tu joues, tu notes, tout le monde rentre heureux." />
        </View>

        <Pressable style={styles.cta} onPress={() => router.replace('/')}>
          <Text style={styles.ctaText}>Voir mes réservations →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  content: { flex: 1, padding: spacing.lg, justifyContent: 'center' },

  check: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  checkIcon: { color: colors.ink, fontSize: 40, fontWeight: '800' },

  eyebrow: { color: colors.volt, fontSize: fontSizes.xs, letterSpacing: 2, fontWeight: '700' },
  title: {
    color: colors.cream,
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
    marginTop: spacing.sm,
  },
  sub: { color: colors.cream, opacity: 0.7, fontSize: fontSizes.md, marginTop: spacing.md },
  strong: { color: colors.volt, fontWeight: '700' },

  card: {
    marginTop: spacing['2xl'],
    backgroundColor: 'rgba(212,255,0,0.06)',
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(212,255,0,0.2)',
    borderStyle: 'dashed',
  },
  cardLabel: {
    color: colors.volt,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  step: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'center' },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  stepText: { color: colors.cream, fontSize: 13, flex: 1 },

  cta: {
    marginTop: spacing.xl,
    paddingVertical: 18,
    borderRadius: 999,
    backgroundColor: colors.volt,
    alignItems: 'center',
  },
  ctaText: { color: colors.ink, fontSize: fontSizes.md, fontWeight: '800' },
});
