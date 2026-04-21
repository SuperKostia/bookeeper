import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { formatEuros } from '@bookeeper/types';
import { getKeeper, type KeeperDetail } from '../../src/api/keepers';

export default function KeeperProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [keeper, setKeeper] = useState<KeeperDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getKeeper(id)
      .then(setKeeper)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }
  if (!keeper) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.volt} />
      </SafeAreaView>
    );
  }

  const number = String((keeper.displayName.length % 98) + 1).padStart(2, '0');

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.navBack}>←</Text>
          </Pressable>
          <Text style={styles.navEyebrow}>§03 · PROFIL</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.jersey}>
          {keeper.verified ? (
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>VÉRIFIÉ · FFF</Text>
            </View>
          ) : null}
          <Text style={styles.number}>{number}</Text>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={styles.name}>{keeper.displayName}</Text>
            {keeper.bio ? <Text style={styles.tagline}>« {keeper.bio.slice(0, 80)}… »</Text> : null}
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat
            value={keeper.ratingAvg !== null ? keeper.ratingAvg.toFixed(2) : '—'}
            label="Note"
          />
          <Stat value={String(keeper.reviewsCount)} label="Avis" />
          <Stat value={`${keeper.travelRadiusKm}km`} label="Rayon" />
          <Stat value={keeper.levels.length > 0 ? keeper.levels[0]!.slice(0, 3).toUpperCase() : '—'} label="Niveau" />
        </View>

        {keeper.bio ? (
          <View style={styles.bioBlock}>
            <Text style={styles.bio}>« {keeper.bio} »</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Avis récents</Text>
        {keeper.reviews.length === 0 ? (
          <Text style={styles.noReviews}>Pas encore d'avis.</Text>
        ) : (
          keeper.reviews.map((r) => (
            <View key={r.id} style={styles.review}>
              <View style={styles.reviewHead}>
                <Text style={styles.reviewAuthor}>{r.authorName ?? 'Anonyme'}</Text>
                <Text style={styles.reviewStars}>★ {r.rating.toFixed(1)}</Text>
              </View>
              {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
              <Text style={styles.reviewMeta}>
                {r.context.toUpperCase()} · {r.level.toUpperCase()} · {r.durationMinutes / 60}h
              </Text>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bookBar}>
        <View style={styles.bookBarInner}>
          <View>
            <Text style={styles.bookBarPrice}>
              {formatEuros(keeper.hourlyRateCents)}
              <Text style={styles.bookBarPriceSmall}> /h</Text>
            </Text>
            <Text style={styles.bookBarSub}>Assurance + paiement sécurisé</Text>
          </View>
          <Pressable
            style={styles.bookBtn}
            onPress={() => router.push(`/book/${keeper.id}`)}
          >
            <Text style={styles.bookBtnText}>Réserver →</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  center: { alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.clay, padding: spacing.lg },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  navBack: { color: colors.cream, fontSize: 24, fontWeight: '600' },
  navEyebrow: { color: colors.volt, fontSize: fontSizes.xs, letterSpacing: 2, fontWeight: '700' },

  scroll: { paddingBottom: 100 },

  jersey: {
    margin: spacing.lg,
    minHeight: 240,
    padding: spacing.lg,
    borderRadius: 22,
    backgroundColor: colors.pitchMid,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.volt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.ink },
  badgeText: { color: colors.ink, fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  number: {
    position: 'absolute',
    right: spacing.md,
    bottom: -16,
    fontSize: 180,
    color: colors.volt,
    fontWeight: '800',
    letterSpacing: -8,
    opacity: 0.85,
  },
  name: {
    color: colors.cream,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 46,
    maxWidth: '70%',
  },
  tagline: { color: colors.voltSoft, fontSize: fontSizes.md, fontStyle: 'italic', marginTop: 8 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statValue: { color: colors.cream, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: {
    color: colors.cream,
    opacity: 0.55,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 2,
    fontWeight: '600',
  },

  bioBlock: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(212,255,0,0.06)',
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.volt,
  },
  bio: { color: colors.cream, fontSize: fontSizes.md, fontStyle: 'italic', lineHeight: 22 },

  sectionTitle: {
    color: colors.cream,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  noReviews: {
    color: colors.cream,
    opacity: 0.5,
    fontSize: fontSizes.sm,
    paddingHorizontal: spacing.lg,
  },
  review: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.1)',
  },
  reviewHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewAuthor: { color: colors.cream, fontSize: fontSizes.sm, fontWeight: '700' },
  reviewStars: { color: colors.clay, fontSize: fontSizes.sm, fontWeight: '700' },
  reviewComment: { color: colors.cream, opacity: 0.8, fontSize: 13, marginTop: 6, lineHeight: 18 },
  reviewMeta: {
    color: colors.cream,
    opacity: 0.4,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 8,
    fontWeight: '600',
  },

  bookBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.pitchDeep,
    borderTopWidth: 1,
    borderTopColor: 'rgba(236,228,208,0.12)',
  },
  bookBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bookBarPrice: { color: colors.volt, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  bookBarPriceSmall: { fontSize: 14, opacity: 0.6 },
  bookBarSub: { color: colors.cream, opacity: 0.5, fontSize: 10, letterSpacing: 1 },
  bookBtn: {
    backgroundColor: colors.volt,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 999,
  },
  bookBtnText: { color: colors.ink, fontSize: fontSizes.md, fontWeight: '800' },
});
