import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { formatEuros } from '@bookeeper/types';
import { signOut, useAuth } from '../src/stores/auth-store';
import { listMyBookings, type Booking } from '../src/api/bookings';

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const list = await listMyBookings();
      setBookings(list);
    } catch {
      setBookings([]);
    }
  }

  useEffect(() => {
    if (auth.status === 'authenticated' && auth.user.id) void load();
  }, [auth.status, auth.status === 'authenticated' ? auth.user.id : null]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (auth.status !== 'authenticated' || !auth.user.id) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.volt} />
      </SafeAreaView>
    );
  }

  const { user } = auth;
  const firstName = user.firstName ?? 'N°1';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.volt} />}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>BOOKEEPER</Text>
          <Pressable onPress={signOut} hitSlop={12}>
            <Text style={styles.signOut}>Déconnexion</Text>
          </Pressable>
        </View>

        <Text style={styles.hello}>Salut {firstName}.</Text>
        <Text style={styles.prompt}>Besoin d'un gardien ?</Text>

        <Pressable style={styles.ctaPrimary} onPress={() => router.push('/keepers')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaLabel}>TROUVER UN GARDIEN</Text>
            <Text style={styles.ctaSub}>Dispo dans ta zone · noté · assuré</Text>
          </View>
          <View style={styles.ctaArrow}>
            <Text style={styles.ctaArrowText}>→</Text>
          </View>
        </Pressable>

        <View style={styles.ctaSecondaryRow}>
          <Pressable style={[styles.ctaSecondary, styles.ctaSecondaryLeft]} onPress={() => {}}>
            <Text style={styles.ctaSecondaryEyebrow}>CÔTÉ KEEPER</Text>
            <Text style={styles.ctaSecondaryLabel}>Devenir gardien</Text>
            <Text style={styles.ctaSecondarySub}>→</Text>
          </Pressable>
          <Pressable style={styles.ctaSecondary} onPress={() => {}}>
            <Text style={styles.ctaSecondaryEyebrow}>ENTRAÎNEMENT</Text>
            <Text style={styles.ctaSecondaryLabel}>Séance perso</Text>
            <Text style={styles.ctaSecondarySub}>→</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Tes réservations</Text>

        {bookings === null ? (
          <ActivityIndicator color={colors.volt} style={{ marginTop: spacing.lg }} />
        ) : bookings.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucune réservation.</Text>
            <Text style={styles.emptySub}>
              Lance une recherche ci-dessus, choisis ton keeper, ton match est assuré.
            </Text>
          </View>
        ) : (
          bookings.map((b) => <BookingRow key={b.id} booking={b} />)
        )}

        <Text style={styles.footer}>{user.phone}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const date = new Date(booking.startsAt);
  const df = date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' });
  const tf = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const name = booking.keeper.keeperProfile?.displayName ?? 'Gardien';
  return (
    <View style={styles.booking}>
      <View style={styles.bookingLeft}>
        <Text style={styles.bookingDate}>
          {df} · {tf}
        </Text>
        <Text style={styles.bookingKeeper}>{name}</Text>
        <Text style={styles.bookingMeta}>
          {booking.locationText} · {booking.durationMinutes / 60}h
        </Text>
      </View>
      <View style={styles.bookingRight}>
        <Text style={styles.bookingTotal}>{formatEuros(booking.totalCents)}</Text>
        <Text style={[styles.bookingStatus, statusStyles[booking.status] ?? null]}>
          {statusLabel(booking.status)}
        </Text>
      </View>
    </View>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'EN ATTENTE';
    case 'accepted':
      return 'CONFIRMÉ';
    case 'declined':
      return 'REFUSÉ';
    case 'completed':
      return 'JOUÉ';
    case 'cancelled_client':
    case 'cancelled_keeper':
      return 'ANNULÉ';
    default:
      return status.toUpperCase();
  }
}

const statusStyles: Record<string, { color: string }> = {
  pending: { color: colors.clay },
  accepted: { color: colors.volt },
  completed: { color: colors.voltSoft },
  declined: { color: colors.clayDeep },
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing['2xl'] },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  eyebrow: { color: colors.volt, fontSize: fontSizes.xs, letterSpacing: 2, fontWeight: '700' },
  signOut: { color: colors.cream, opacity: 0.5, fontSize: fontSizes.sm },

  hello: {
    color: colors.cream,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 42,
  },
  prompt: {
    color: colors.cream,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 42,
    opacity: 0.5,
    marginBottom: spacing.xl,
  },

  ctaPrimary: {
    backgroundColor: colors.volt,
    borderRadius: 22,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaLabel: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ctaSub: { color: colors.ink, opacity: 0.65, fontSize: fontSizes.sm, marginTop: 4 },
  ctaArrow: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrowText: { color: colors.volt, fontSize: 22, fontWeight: '700' },

  ctaSecondaryRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  ctaSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.2)',
    borderRadius: 16,
    padding: spacing.md,
  },
  ctaSecondaryLeft: { backgroundColor: 'rgba(212,255,0,0.06)' },
  ctaSecondaryEyebrow: {
    color: colors.volt,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  ctaSecondaryLabel: { color: colors.cream, fontSize: fontSizes.md, fontWeight: '700' },
  ctaSecondarySub: { color: colors.cream, opacity: 0.4, fontSize: 16, marginTop: 6 },

  sectionTitle: {
    color: colors.cream,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },

  empty: {
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.14)',
    borderRadius: 16,
    padding: spacing.lg,
    borderStyle: 'dashed',
  },
  emptyTitle: { color: colors.cream, fontSize: fontSizes.md, fontWeight: '700' },
  emptySub: { color: colors.cream, opacity: 0.55, fontSize: fontSizes.sm, marginTop: 6 },

  booking: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.14)',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingLeft: { flex: 1 },
  bookingDate: {
    color: colors.volt,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookingKeeper: { color: colors.cream, fontSize: fontSizes.md, fontWeight: '700' },
  bookingMeta: { color: colors.cream, opacity: 0.55, fontSize: 12, marginTop: 2 },
  bookingRight: { alignItems: 'flex-end' },
  bookingTotal: { color: colors.cream, fontSize: fontSizes.md, fontWeight: '800' },
  bookingStatus: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginTop: 4 },

  footer: {
    color: colors.cream,
    opacity: 0.25,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing['2xl'],
    letterSpacing: 1,
  },
});
