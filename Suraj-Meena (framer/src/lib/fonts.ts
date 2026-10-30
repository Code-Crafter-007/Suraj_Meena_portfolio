import localFont from 'next/font/local';

export const clashGrotesk = localFont({
  src: [
    {
      path: '../../public/assets/fonts/clash-grotesk/ClashGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/clash-grotesk/ClashGrotesk-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-clash',
  display: 'swap',
});

export const archivoLocal = localFont({
  src: [
    {
      path: '../../public/assets/fonts/archivo/Archivo-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/archivo/Archivo-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/archivo/Archivo-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/archivo/Archivo-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-archivo-local',
  display: 'swap',
});
