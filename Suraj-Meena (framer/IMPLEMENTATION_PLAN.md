# Implementation Plan — Architecture & Execution Roadmap

## 1. Recommended Technical Architecture

The architecture adheres precisely to the user's preferred development stack while incorporating industry-leading frontend performance and creative development standards:

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 14+ (App Router)             │
│            TypeScript + Strict Type Checking           │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼───────────────────┐
       ▼                    ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Motion (React)│   │  GSAP Core +  │   │  Vanilla CSS  │
│  Declarative  │   │ ScrollTrigger │   │  Design Tokens│
│  UI Motion    │   │ Complex Scrub │   │  CSS Modules  │
└───────────────┘   └───────────────┘   └───────────────┘
```

### Core Technologies
- **Framework**: **Next.js 14+ (App Router)**
  - Server-Side Rendering (SSR) for blazing SEO indexing, zero hydration layout shift, and instant initial paint.
  - Route Handlers / Server Actions for contact form submissions without external dependencies.
- **Language**: **TypeScript** (Strict mode) for clean, safe props and state definitions.
- **Styling**: **Vanilla CSS / CSS Modules**
  - Custom Design System with CSS Custom Properties (`:root` tokens for colors, typography scale, surface blurs, and elevations).
  - No bloated CSS frameworks like Tailwind unless requested later.
- **Motion & Creative Engineering**:
  - **Motion for React (`framer-motion` / `motion`)**: Staggered text entrances, magnetic button physics, interactive hover states, dialog exits.
  - **GSAP + ScrollTrigger**: Smooth scrubbed multi-phase scroll timelines (specifically the 3D Avatar Card flip and perspective parallax).
- **Deployment & Hosting**: **Vercel** with automatic preview deployments and edge CDN caching.

---

## 2. Directory & Component Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout with fonts, meta, noise overlay, custom cursor
│   ├── page.tsx               # Orchestration of all portfolio sections
│   ├── globals.css            # CSS tokens, reset, typography, aurora keyframes
│   ├── api/
│   │   └── contact/route.ts   # Serverless form handler
│   └── sitemap.ts             # Dynamic SEO sitemap
├── components/
│   ├── ui/
│   │   ├── CustomCursor.tsx   # Smooth interpolated cursor + click sparks
│   │   ├── MagneticButton.tsx # Magnetic spring mouse follower
│   │   ├── NoiseOverlay.tsx   # SVG fractal noise canvas/overlay
│   │   ├── AuroraBg.tsx       # Ambient rotating chromatic gradient mesh
│   │   └── TiltCard.tsx       # 3D perspective mouse hover card
│   ├── layout/
│   │   ├── Navbar.tsx         # Responsive blur navbar + mobile drawer
│   │   └── Footer.tsx         # Global footer with quick links
│   └── sections/
│       ├── Hero.tsx           # Kinetic typography, hologram, CTA group
│       ├── Bio.tsx            # Sticky avatar 3D flip + skill bars + counters
│       ├── Manifesto.tsx      # Editorial quote banner
│       ├── Services.tsx       # 4-card service grid + pricing note
│       ├── Work.tsx           # YouTube showreel + 4 MP4 video preview cards
│       ├── Testimonials.tsx   # Perspective review cards
│       ├── Articles.tsx       # Creative editorial thought posts
│       └── Contact.tsx        # Direct contact info + interactive form
├── data/
│   ├── projects.ts            # Typed metadata and MP4 CDN URLs for work
│   ├── services.ts            # Offerings and capability tags
│   └── testimonials.ts        # Client endorsements and company avatars
└── types/
    └── index.ts               # Project, Service, and Contact payload types
```

---

## 3. Phase-by-Phase Execution Plan

### Phase 1: Project Scaffolding & Design Foundation
- Initialize Next.js project with App Router and TypeScript.
- Setup `globals.css` with exact color palette tokens, dark mode noir scale, and font declarations (Clash Grotesk, Archivo, Bebas Neue, Inter).
- Implement global procedural SVG grain noise layer and ambient aurora gradient canvas.
- Implement desktop smooth magnetic cursor and particle spark reaction.

### Phase 2: Navigation & Hero Experience
- Build responsive sticky navigation bar with glassmorphic backdrop filter and mobile menu toggle.
- Construct the Hero section with staggered kinetic typography (`SURAJ MEENA`), glitch ghost text effects, floating 3D holographic badges, and animated scroll indicator.
- Build the `MagneticButton` component with spring physics for primary actions.

### Phase 3: Bio, Sticky 3D Avatar & Services
- Implement the Bio section with animated metric counters (`useInView`).
- Construct the signature **Sticky 3D Avatar Card**:
  - Implement smooth scroll-triggered 180° rotation between front portrait and reverse silhouette.
- Build the animated skill progress bars and tag cloud.
- Build the Manifesto quote banner.
- Build the 4-card Services grid with hover accent lines and responsive collapse.

### Phase 4: Work Showcase with Auto-Playing Video Previews
- Embed the official YouTube Showreel with responsive 16:9 container.
- Implement the 4 project cards featuring auto-playing, looping MP4 teaser previews (`Tum Aaye Ho`, `M & M Cafe`, `Mazuri`, `Nav Nirmaan`).
- Incorporate 3D perspective tilt on mouse enter (`perspective: 800px`).

### Phase 5: Testimonials, Editorial Articles & Contact Portal
- Construct the Testimonials grid with perspective styling.
- Build the Articles / Thoughts cards with editorial image thumbnails.
- Build the Contact section with split-screen layout:
  - Direct social and email channels.
  - Interactive validation contact form with animated loading and success feedback states.
- Assemble global Footer.

### Phase 6: Polish, Performance & Verification
- Perform lighthouse performance optimizations (sub-second LCP, zero layout shift).
- Cross-browser and responsive testing across mobile, tablet, and ultra-wide displays.
- Full motion and reduced-motion accessibility verification (`prefers-reduced-motion`).
- Prepare GitHub repository structure ready for one-click Vercel deployment.
