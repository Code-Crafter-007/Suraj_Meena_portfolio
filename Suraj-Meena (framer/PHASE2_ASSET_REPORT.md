# Phase 2 — Asset Recovery & Organization Report

This report documents all recovered, downloaded, verified, and mapped original visual assets from Suraj Meena's Framer portfolio into the local production codebase.

---

## 1. Directory Structure in `public/assets`

```
public/assets/
├── fonts/
│   ├── archivo/
│   │   ├── Archivo-Regular.woff2
│   │   ├── Archivo-Medium.woff2
│   │   ├── Archivo-SemiBold.woff2
│   │   └── Archivo-Bold.woff2
│   └── clash-grotesk/
│       ├── ClashGrotesk-Regular.woff2
│       └── ClashGrotesk-Semibold.woff2
├── icons/
│   ├── apple-touch-icon.png
│   └── favicon-suraj.png
├── images/
│   ├── about/
│   │   └── creator-portrait-front.png
│   ├── articles/
│   │   ├── art-direction-post.png
│   │   ├── brand-systems-post.png
│   │   └── clear-design-post.png
│   ├── hero/
│   │   ├── holo-ribbon-3d.png
│   │   ├── holo-triangle-3d.png
│   │   └── opengraph-hero.png
│   └── testimonials/
│       ├── client-logo-1.png
│       ├── client-logo-2.png
│       ├── client-logo-3.png
│       ├── client-logo-4.png
│       ├── daniel-k.jpg
│       ├── mark-m.jpg
│       ├── omar-h.jpg
│       └── yakoub-kashmiri.jpg
└── videos/
    └── projects/
        ├── mm-cafe-preview.mp4
        ├── mazuri-preview.mp4
        ├── nav-nirmaan-preview.mp4
        └── tum-aaye-ho-preview.mp4
```

---

## 2. Project-Specific Video & Media Mapping

The 4 flagship portfolio projects are directly mapped to their recovered local MP4 videos:

| Project Title | Local Video Asset | File Size | Format & Codec | Intended Interaction |
| :--- | :--- | :--- | :--- | :--- |
| **Tum Aaye Ho** | `/assets/videos/projects/tum-aaye-ho-preview.mp4` | 8.30 MB | MP4 / H.264 High | Auto-looping muted teaser preview inside project card |
| **M & M Restro and Cafe** | `/assets/videos/projects/mm-cafe-preview.mp4` | 13.13 MB | MP4 / H.264 High | Auto-looping muted teaser preview inside project card |
| **Mazuri** | `/assets/videos/projects/mazuri-preview.mp4` | 22.34 MB | MP4 / H.264 High | Auto-looping muted teaser preview inside project card |
| **Nav Nirmaan** | `/assets/videos/projects/nav-nirmaan-preview.mp4` | 26.56 MB | MP4 / H.264 High | Auto-looping muted teaser preview inside project card |
| **Official Showreel** | Embedded YouTube Stream: `https://www.youtube.com/embed/QgXMgYHXRsQ` | N/A | Full HD 1080p | Interactive modal / 16:9 main video player |

---

## 3. High-Resolution Photographic & 3D Assets

| Asset Name | Local File Path | Resolution / Size | Role & Usage |
| :--- | :--- | :--- | :--- |
| **Avatar Front View** | `/assets/images/about/creator-portrait-front.png` | 1448x1086 (315 KB) | Sticky 3D Avatar Card (Hero → Bio scroll flip) |
| **3D Holographic Element** | `/assets/images/hero/holo-triangle-3d.png` | 2550x2550 (240 KB) | Floating 3D holographic badge in Hero section |
| **3D Holographic Ribbon** | `/assets/images/hero/holo-ribbon-3d.png` | 2550x2550 (208 KB) | Secondary geometric decorative element |
| **OpenGraph Banner** | `/assets/images/hero/opengraph-hero.png` | 1.85 MB | Social media share card |
| **Favicon & App Icon** | `/assets/icons/favicon-suraj.png`, `apple-touch-icon.png` | 13 KB / 93 KB | Browser tab icons & PWA icons |

---

## 4. Testimonial Avatars & Company Emblems

| Endorser | Avatar Path | Company Logo Path |
| :--- | :--- | :--- |
| **Yakoub Kashmiri** (Marketing Director) | `/assets/images/testimonials/yakoub-kashmiri.jpg` | `/assets/images/testimonials/client-logo-1.png` |
| **Daniel K.** (Indie Maker) | `/assets/images/testimonials/daniel-k.jpg` | `/assets/images/testimonials/client-logo-2.png` |
| **Mark M.** (Startup Founder) | `/assets/images/testimonials/mark-m.jpg` | `/assets/images/testimonials/client-logo-3.png` |
| **Omar H.** (Creative Technologist) | `/assets/images/testimonials/omar-h.jpg` | `/assets/images/testimonials/client-logo-4.png` |

---

## 5. Recovered Web Fonts (WOFF2)
Recovered from Fontshare / Framer CDN and configured via Next.js `localFont`:
- **Clash Grotesk**:
  - Regular (`400`): `/assets/fonts/clash-grotesk/ClashGrotesk-Regular.woff2` (19.2 KB)
  - SemiBold (`600`): `/assets/fonts/clash-grotesk/ClashGrotesk-Semibold.woff2` (19.2 KB)
- **Archivo**:
  - Regular (`400`), Medium (`500`), SemiBold (`600`), Bold (`700`): `/assets/fonts/archivo/*.woff2` (~32 KB each)

---

## 6. Video Performance & Playback Strategy
For smooth performance during user navigation:
1. **Viewport-Aware Playback**: Videos are configured with `muted loop playsInline` and will use Intersection Observer to play only when visible in the viewport.
2. **Lazy Preload**: `<video preload="none">` to avoid bandwidth choking on initial page load.
3. **No External CDN Dependency**: All video previews are served locally and self-contained from `/assets/videos/projects/`.
