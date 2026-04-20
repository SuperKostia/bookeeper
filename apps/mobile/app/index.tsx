import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';
import { signOut, useAuth } from '../src/stores/auth-store';

export default function Home() {
  const auth = useAuth();

  if (auth.status !== 'authenticated' || !auth.user.id) {
    return (
      <SafeAreaView style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.volt} />
      </SafeAreaView>
    );
  }

  const { user } = auth;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>BOOKEEPER · HOME</Text>
        <Text style={styles.title}>Salut,{'\n'}N°1.</Text>
        <Text style={styles.sub}>
          Connecté en tant que <Text style={styles.phone}>{user.phone}</Text>.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>PROCHAINE ÉTAPE</Text>
          <Text style={styles.cardTitle}>Trouver un gardien</Text>
          <Text style={styles.cardBody}>Écran recherche à venir.</Text>
        </View>

        <Pressable style={styles.signOut} onPress={signOut}>
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  eyebrow: {
    color: colors.volt,
    fontSize: fontSizes.xs,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.cream,
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 72,
  },
  sub: { color: colors.cream, opacity: 0.7, fontSize: fontSizes.md, marginTop: spacing.md },
  phone: { color: colors.volt, fontWeight: '700' },
  card: {
    marginTop: spacing['2xl'],
    backgroundColor: 'rgba(212,255,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,255,0,0.25)',
    borderRadius: 18,
    padding: spacing.lg,
  },
  cardLabel: {
    color: colors.volt,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  cardTitle: { color: colors.cream, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  cardBody: { color: colors.cream, opacity: 0.6, fontSize: fontSizes.sm, marginTop: 6 },
  signOut: {
    marginTop: 'auto',
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  signOutText: { color: colors.cream, opacity: 0.5, fontSize: fontSizes.sm },
});
