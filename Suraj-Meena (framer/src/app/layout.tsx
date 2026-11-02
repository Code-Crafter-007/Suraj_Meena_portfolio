import type { Metadata } from 'next';
import { Inter, Archivo, Bebas_Neue } from 'next/font/google';
import { clashGrotesk } from '@/lib/fonts';
import { CustomCursor } from '@/components/ui/CustomCursor';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: ['400'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://suraj-meena.vercel.app'
  ),
  title: 'Suraj Meena | Visual Editor & Motion Designer',
  description:
    'Portfolio of Suraj Meena. Video editor and motion designer turning raw footage into work that holds attention.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/assets/icons/favicon-suraj.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/assets/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Suraj Meena | Visual Editor',
    description: 'Video editor and motion designer with 2+ years of experience.',
    images: ['/assets/images/hero/opengraph-hero.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${bebasNeue.variable} ${clashGrotesk.variable}`}
    >
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
