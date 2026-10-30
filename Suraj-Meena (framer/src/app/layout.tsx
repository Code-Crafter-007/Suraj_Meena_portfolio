import type { Metadata } from 'next';
import { Inter, Archivo, Bebas_Neue } from 'next/font/google';
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
  weight: ['400', '600', '700', '800', '900'],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Suraj Meena | Frame Flicks — Visual Editor & Creative Developer',
  description:
    'Portfolio of Suraj Meena (Frame Flicks). Video editor, motion designer, and creative developer crafting high-retention cinematic edits and modern web experiences.',
  icons: {
    icon: 'https://framerusercontent.com/images/ue9IClg37SpZ5YcBTAPeavvDUNo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${bebasNeue.variable}`}>
      <body>
        <div className="ambient-bg" aria-hidden="true">
          <div className="aurora-glow aurora-glow-1" />
          <div className="aurora-glow aurora-glow-2" />
        </div>
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
