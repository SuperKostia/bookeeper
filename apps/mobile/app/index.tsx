import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSizes, spacing } from '@bookeeper/ui-tokens';

export default function Home() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>BOOKEEPER · V0</Text>
        <Text style={styles.title}>Trouve ton N°1.</Text>
        <Text style={styles.sub}>Le marketplace des gardiens de but, à l'heure.</Text>

        <Pressable style={styles.cta} onPress={() => {}}>
          <Text style={styles.ctaText}>Commencer</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.pitch },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.volt,
    fontSize: fontSizes.xs,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.cream,
    fontSize: fontSizes.display,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 82,
  },
  sub: {
    color: colors.cream,
    opacity: 0.7,
    fontSize: fontSizes.lg,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  cta: {
    marginTop: spacing['2xl'],
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.volt,
    borderRadius: 999,
  },
  ctaText: {
    color: colors.ink,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
