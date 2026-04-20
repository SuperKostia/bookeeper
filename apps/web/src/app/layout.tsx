import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BooKeeper — Trouve ton N°1',
  description: "Le marketplace des gardiens de but à l'heure. Loisir, compétition, entraînement.",
  openGraph: {
    title: 'BooKeeper',
    description: "Le marketplace des gardiens de but à l'heure.",
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
