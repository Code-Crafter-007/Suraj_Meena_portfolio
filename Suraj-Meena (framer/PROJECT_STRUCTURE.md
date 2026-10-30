# Project Directory & Folder Architecture

This document documents the folder hierarchy and responsibilities across the application.

```
suraj-meena-portfolio/
├── .next/                         # Compiled Next.js production & dev cache
├── node_modules/                  # Project dependencies
├── public/                        # Static public assets
│   ├── fonts/                     # Recovered/local custom web fonts
│   ├── icons/                     # Brand marks & favicons
│   ├── images/                    # High-res static images & avatar photos
│   └── videos/                    # Local video backups/fallback assets
├── src/
│   ├── app/                       # Next.js App Router root
│   │   ├── favicon.ico            # Favicon
│   │   ├── globals.css            # Ambient layers & global style definitions
│   │   ├── layout.tsx             # Root document layout with fonts & background
│   │   ├── page.module.css        # Verification page scoped styles
│   │   └── page.tsx               # Entry verification page (orchestrates sections in Phase 2)
│   ├── components/                # Modular UI component system
│   │   ├── animations/            # Reusable motion wrappers (Reveal, Stagger, Magnetic)
│   │   ├── layout/                # Layout structures (Navbar, Footer, SectionWrappers)
│   │   ├── sections/              # Page sections (Hero, Bio, Services, Work, etc.)
│   │   └── ui/                    # Atomic primitives (Buttons, TechBadge, TiltCard)
│   ├── data/                      # Immutable typed data records
│   │   ├── projects.ts            # Flagship video projects & original CDN URLs
│   │   ├── services.ts            # Capabilities & offering categories
│   │   └── testimonials.ts        # Client endorsements & company logos
│   ├── hooks/                     # Custom React hooks (useScrollProgress, useCursor)
│   ├── lib/                       # Utility helpers (cn, math, gsap-config)
│   ├── styles/                    # Global styling assets
│   │   └── tokens.css             # Unified CSS custom properties & design tokens
│   └── types/                     # TypeScript domain model definitions
│       └── index.ts               # Project, Service, and Testimonial interfaces
├── .gitignore                     # Git ignore rules
├── AGENTS.md                      # AI pairing guidelines
├── ASSET_INVENTORY.md             # Phase 0 media inventory & CDN asset records
├── eslint.config.mjs              # ESLint configuration
├── IMPLEMENTATION_PLAN.md         # Phase-by-phase execution plan
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependency declarations & scripts
├── PROJECT_ANALYSIS.md            # Phase 0 design & animation audit
├── PROJECT_STRUCTURE.md           # This architecture guide
├── README.md                      # Setup and development manual
├── TECH_STACK.md                  # Technology choices rationale
├── tsconfig.json                  # TypeScript compiler settings
└── WEBSITE_STRUCTURE.md           # Phase 0 layout & section specifications
```
