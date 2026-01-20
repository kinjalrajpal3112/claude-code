import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'बेहतर ज़िंदगी - Kisan Ki Apni Dukaan',
  description: 'Best agricultural equipment and machinery for farmers. 4786+ products, 538 combo deals, free delivery.',
  keywords: 'agricultural equipment, farming machinery, tractor, milking machine, chaff cutter, sprayer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#059669" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
