import { colors } from '@bookeeper/ui-tokens';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.pitch,
        color: colors.cream,
        padding: '80px 40px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <p style={{ color: colors.volt, fontSize: 11, letterSpacing: 2, marginBottom: 24 }}>
        BOOKEEPER · WEB · WIP
      </p>
      <h1 style={{ fontSize: 72, lineHeight: 0.9, fontWeight: 800, letterSpacing: -2, margin: 0 }}>
        Trouve ton N°1.
      </h1>
      <p style={{ marginTop: 24, fontSize: 18, opacity: 0.7, maxWidth: 560 }}>
        Le marketing site officiel est en construction. En attendant, le proto HTML complet est
        accessible à la racine du repo (et servi via GitHub Pages).
      </p>
      <a
        href="https://superkostia.github.io/bookeeper/"
        style={{
          display: 'inline-block',
          marginTop: 40,
          padding: '16px 28px',
          background: colors.volt,
          color: colors.ink,
          borderRadius: 999,
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Voir le proto →
      </a>
    </main>
  );
}
