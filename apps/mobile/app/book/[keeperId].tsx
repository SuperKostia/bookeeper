import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { formatEuros, splitBookingAmounts, type BookingContext, type Level } from '@bookeeper/types';
import { getKeeper, type KeeperDetail } from '../../src/api/keepers';
import { createBooking } from '../../src/api/bookings';
import { ApiError } from '../../src/api/client';

const CONTEXTS: { id: BookingContext; label: string }[] = [
  { id: 'competition', label: 'Compét.' },
  { id: 'loisir', label: 'Loisir' },
  { id: 'training', label: 'Entraîne.' },
  { id: 'tournament', label: 'Tournoi' },
];

const DURATIONS = [60, 90, 120, 150] as const;

export default function BookScreen() {
  const { keeperId } = useLocalSearchParams<{ keeperId: string }>();
  const router = useRouter();

  const [keeper, setKeeper] = useState<KeeperDetail | null>(null);
  const [context, setContext] = useState<BookingContext>('competition');
  const [duration, setDuration] = useState<number>(120);
  const [locationText, setLocationText] = useState<string>('Paris 11e · Stade Léo Lagrange');
  const [whenOffsetDays, setWhenOffsetDays] = useState<number>(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keeperId) return;
    getKeeper(keeperId)
      .then(setKeeper)
      .catch(() => setError('Impossible de charger le gardien.'));
  }, [keeperId]);

  if (!keeper && !error) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.volt} />
      </SafeAreaView>
    );
  }
  if (error || !keeper) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <Text style={styles.errorBig}>{error}</Text>
      </SafeAreaView>
    );
  }

  const split = splitBookingAmounts(keeper.hourlyRateCents, duration);

  async function onSubmit() {
    if (!keeper) return;
    setSubmitting(true);
    setError(null);
    try {
      const startsAt = new Date();
      startsAt.setDate(startsAt.getDate() + whenOffsetDays);
      startsAt.setHours(18, 30, 0, 0);

      const booking = await createBooking({
        keeperId: keeper.id,
        startsAt: startsAt.toISOString(),
        durationMinutes: duration,
        context,
        level: 'regional' as Level,
        location: {
          point: { lat: 48.8606, lng: 2.3755 },
          text: locationText,
        },
      });
      router.replace(`/book/success?bookingId=${booking.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Erreur lors de la création.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.navBack}>←</Text>
        </Pressable>
        <Text style={styles.navEyebrow}>RÉSERVATION</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Réserver</Text>
          <Text style={styles.keeperLine}>
            avec <Text style={styles.keeperName}>{keeper.displayName}</Text>
          </Text>

          <Text style={styles.section}>QUAND</Text>
          <View style={styles.row}>
            {[1, 2, 3, 7].map((d) => (
              <Pressable
                key={d}
                onPress={() => setWhenOffsetDays(d)}
                style={[styles.pill, whenOffsetDays === d && styles.pillActive]}
              >
                <Text style={[styles.pillText, whenOffsetDays === d && styles.pillTextActive]}>
                  {d === 1 ? 'Demain' : d === 7 ? 'Dans 7j' : `+${d}j`}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>DURÉE</Text>
          <View style={styles.row}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDuration(d)}
                style={[styles.pill, duration === d && styles.pillActive]}
              >
                <Text style={[styles.pillText, duration === d && styles.pillTextActive]}>
                  {d / 60}h{d % 60 === 30 ? '30' : ''}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>CONTEXTE</Text>
          <View style={styles.row}>
            {CONTEXTS.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setContext(c.id)}
                style={[styles.pill, context === c.id && styles.pillActive]}
              >
                <Text style={[styles.pillText, context === c.id && styles.pillTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>LIEU</Text>
          <TextInput
            value={locationText}
            onChangeText={setLocationText}
            placeholder="Stade, ville"
            placeholderTextColor="rgba(236,228,208,0.4)"
            style={styles.input}
          />

          <View style={styles.breakdown}>
            <Row
              label={`${formatEuros(keeper.hourlyRateCents)} × ${duration / 60}h`}
              value={formatEuros(split.baseCents)}
            />
            <Row label="Frais de service" value={formatEuros(split.serviceFeeCents)} />
            <Row label="Assurance" value="Incluse" muted />
            <View style={styles.divider} />
            <Row label="TOTAL" value={formatEuros(split.clientTotalCents)} big />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.cta, submitting && styles.ctaDisabled]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <Text style={styles.ctaText}>
                Envoyer la demande · {formatEuros(split.clientTotalCents)}
              </Text>
            )}
          </Pressable>
          <Text style={styles.legal}>
            Le keeper a 2 h pour accepter. Paiement bloqué, capturé au match.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  big,
  muted,
}: {
  label: string;
  value: string;
  big?: boolean;
  muted?: boolean;
}) {
  return (
    <View style={styles.breakdownRow}>
      <Text
        style={[
          styles.breakdownLabel,
          big && styles.breakdownLabelBig,
          muted && { opacity: 0.5 },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.breakdownValue,
          big && styles.breakdownValueBig,
          muted && { opacity: 0.5 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  center: { alignItems: 'center', justifyContent: 'center' },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  navBack: { color: colors.cream, fontSize: 24, fontWeight: '600' },
  navEyebrow: { color: colors.volt, fontSize: fontSizes.xs, letterSpacing: 2, fontWeight: '700' },

  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },
  title: {
    color: colors.cream,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.5,
    marginTop: spacing.sm,
  },
  keeperLine: { color: colors.cream, opacity: 0.7, fontSize: fontSizes.md, marginTop: 6 },
  keeperName: { color: colors.volt, fontWeight: '700' },

  section: {
    color: colors.volt,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.25)',
  },
  pillActive: { backgroundColor: colors.volt, borderColor: colors.volt },
  pillText: { color: colors.cream, fontSize: fontSizes.sm, fontWeight: '600' },
  pillTextActive: { color: colors.ink, fontWeight: '700' },

  input: {
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.25)',
    borderRadius: 12,
    padding: spacing.md,
    color: colors.cream,
    fontSize: fontSizes.md,
  },

  breakdown: {
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.12)',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  breakdownLabel: { color: colors.cream, opacity: 0.8, fontSize: 14 },
  breakdownLabelBig: { fontSize: 16, fontWeight: '800', opacity: 1, letterSpacing: 1 },
  breakdownValue: { color: colors.cream, fontSize: 14, fontWeight: '600' },
  breakdownValueBig: { fontSize: 24, fontWeight: '800', color: colors.volt },
  divider: {
    height: 1,
    backgroundColor: 'rgba(236,228,208,0.2)',
    marginVertical: spacing.sm,
  },

  error: { color: colors.clay, marginTop: spacing.md, fontSize: fontSizes.sm },
  errorBig: { color: colors.clay, fontSize: fontSizes.md },

  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.volt,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: colors.ink, fontSize: fontSizes.md, fontWeight: '800', letterSpacing: 0.3 },
  legal: {
    color: colors.cream,
    opacity: 0.4,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
