import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { formatEuros } from '@bookeeper/types';
import { searchKeepers, type KeeperCard } from '../../src/api/keepers';

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'competition', label: 'Compét.' },
  { id: 'loisir', label: 'Loisir' },
  { id: 'training', label: 'Entraîne.' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export default function KeepersList() {
  const router = useRouter();
  const [keepers, setKeepers] = useState<KeeperCard[] | null>(null);
  const [filter, setFilter] = useState<FilterId>('all');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const list = await searchKeepers(filter === 'all' ? {} : { context: filter });
      setKeepers(list);
    } catch {
      setKeepers([]);
    }
  }

  useEffect(() => {
    void load();
  }, [filter]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>← Retour</Text>
        </Pressable>
        <Text style={styles.eyebrow}>§02 · LIVE</Text>
      </View>

      <Text style={styles.title}>Gardiens dispo</Text>
      <Text style={styles.subtitle}>près de toi, notés, assurés</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
          >
            <Text style={[styles.filterLabel, filter === f.id && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {keepers === null ? (
        <ActivityIndicator color={colors.volt} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={keepers}
          keyExtractor={(k) => k.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.volt} />
          }
          renderItem={({ item, index }) => (
            <KeeperRow keeper={item} number={index + 1} onPress={() => router.push(`/keepers/${item.id}`)} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Aucun gardien.</Text>
              <Text style={styles.emptySub}>Change de filtre ou agrandis ta zone.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const JERSEY_PALETTE = [
  { bg: '#164A2C', number: 'rgba(212,255,0,0.9)', name: colors.volt },
  { bg: '#DB5D2A', number: 'rgba(20,20,20,0.85)', name: colors.ink },
  { bg: '#1A1A1A', number: 'rgba(212,255,0,0.95)', name: colors.volt },
  { bg: '#E5DBC0', number: 'rgba(14,43,26,0.75)', name: colors.pitch },
  { bg: '#D4FF00', number: 'rgba(14,43,26,0.7)', name: colors.pitch },
  { bg: '#1F3A5F', number: 'rgba(244,239,224,0.85)', name: colors.cream },
];

function surnameFor(keeper: KeeperCard): string {
  const parts = keeper.displayName.split(' ');
  return (parts[parts.length - 1] ?? keeper.displayName).toUpperCase();
}

function KeeperRow({
  keeper,
  number,
  onPress,
}: {
  keeper: KeeperCard;
  number: number;
  onPress: () => void;
}) {
  const palette = JERSEY_PALETTE[(number - 1) % JERSEY_PALETTE.length]!;
  const jerseyNumber = String(number).padStart(2, '0');
  const rating = keeper.ratingAvg !== null ? keeper.ratingAvg.toFixed(1) : '—';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.jersey, { backgroundColor: palette.bg }]}>
        <Text style={[styles.jerseyName, { color: palette.name }]}>{surnameFor(keeper)}</Text>
        <Text style={[styles.jerseyNumber, { color: palette.number }]}>{jerseyNumber}</Text>
        {keeper.verified ? (
          <View style={styles.verifiedTag}>
            <View style={styles.verifiedDot} />
            <Text style={styles.verifiedText}>VÉRIFIÉ</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.name}>{keeper.displayName}</Text>
          <Text style={styles.rating}>★ {rating}</Text>
        </View>
        {keeper.zoneLabel ? (
          <Text style={styles.meta}>
            📍 {keeper.zoneLabel} · {keeper.travelRadiusKm} km
          </Text>
        ) : null}
        <View style={styles.tags}>
          {keeper.levels.slice(0, 3).map((l) => (
            <View key={l} style={styles.tag}>
              <Text style={styles.tagText}>{l.toUpperCase()}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footRow}>
          <Text style={styles.price}>
            {formatEuros(keeper.hourlyRateCents)}
            <Text style={styles.priceSmall}> /h</Text>
          </Text>
          <View style={styles.bookBtn}>
            <Text style={styles.bookText}>Voir profil →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  back: { color: colors.cream, fontSize: fontSizes.sm, opacity: 0.7 },
  eyebrow: { color: colors.volt, fontSize: fontSizes.xs, letterSpacing: 2, fontWeight: '700' },

  title: {
    color: colors.cream,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.5,
    lineHeight: 50,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.cream,
    opacity: 0.5,
    fontSize: fontSizes.md,
    paddingHorizontal: spacing.lg,
    marginTop: 2,
  },

  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.25)',
  },
  filterChipActive: { backgroundColor: colors.volt, borderColor: colors.volt },
  filterLabel: { color: colors.cream, fontSize: fontSizes.sm, fontWeight: '600' },
  filterLabelActive: { color: colors.ink, fontWeight: '700' },

  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing['2xl'] },

  card: {
    backgroundColor: colors.cream,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
  jersey: {
    height: 140,
    padding: spacing.md,
    position: 'relative',
  },
  jerseyName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    maxWidth: '60%',
  },
  jerseyNumber: {
    position: 'absolute',
    right: 14,
    bottom: -14,
    fontSize: 120,
    fontWeight: '800',
    letterSpacing: -4,
  },
  verifiedTag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5EFF8A' },
  verifiedText: { color: colors.cream, fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },

  body: { padding: spacing.md },
  bodyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { color: colors.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  rating: { color: colors.clay, fontSize: fontSizes.sm, fontWeight: '700' },
  meta: { color: colors.ink, opacity: 0.6, fontSize: 12, marginTop: 4 },
  tags: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.pitch,
    borderRadius: 999,
  },
  tagText: { color: colors.volt, fontSize: 9, letterSpacing: 1, fontWeight: '700' },

  footRow: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { color: colors.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  priceSmall: { fontSize: 12, fontWeight: '500', opacity: 0.55 },
  bookBtn: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bookText: { color: colors.volt, fontSize: 12, fontWeight: '700' },

  empty: {
    borderWidth: 1,
    borderColor: 'rgba(236,228,208,0.14)',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: { color: colors.cream, fontSize: fontSizes.md, fontWeight: '700' },
  emptySub: { color: colors.cream, opacity: 0.55, fontSize: fontSizes.sm, marginTop: 6 },
});
