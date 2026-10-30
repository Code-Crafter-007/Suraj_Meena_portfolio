# Tech Stack Architecture — Suraj Meena Portfolio

This document outlines the selected technology stack, libraries, and design choices powering the rebuild of Suraj Meena's creative developer portfolio.

---

## 1. Core Framework & Language

| Technology | Version | Rationale |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `16.x` | Industry standard React framework providing hybrid Static Site Generation (SSG), React Server Components (RSC), optimized font pipeline, sub-second LCP, and built-in edge routes for contact actions. |
| **TypeScript** | `5.x` | Strict type checking for static project metadata, service capabilities, video CDN endpoints, and component props. |
| **React** | `19.x` | Concurrent rendering, compiler optimization, and seamless hydration. |

---

## 2. Styling & Design Tokens

| Technology | Implementation | Rationale |
| :--- | :--- | :--- |
| **Vanilla CSS & Tokens** | `src/styles/tokens.css` | Centralized design token system declaring colors, fluid typography clamps, spacing units, border radii, and easing curves. Eliminates utility lock-in. |
| **CSS Modules** | `*.module.css` | Scoped styling per component to prevent stylesheet collisions while maintaining native CSS cascading power. |
| **Google Fonts Integration** | `next/font/google` | Zero-layout-shift font delivery for **Archivo** (Display), **Bebas Neue** (Kinetic Branding), and **Inter** (Hyper-legible UI). |

---

## 3. Motion & Animation Libraries

| Library | Role in Architecture |
| :--- | :--- |
| **`motion/react`** (`motion`) | Primary declarative animation engine for React. Powers page load reveals, button magnetic spring tracking, modal dialogues, and component micro-interactions. |
| **`gsap`** | Advanced animation engine utilized specifically for complex scrubbed scroll timelines (such as the 3D Avatar Card flip and parallax viewport pinning). |

---

## 4. Icons & Visual Assets

| Technology | Role |
| :--- | :--- |
| **`lucide-react`** | High-precision, tree-shakeable SVG icon set matching the minimalist brutalist design language. |
| **Procedural SVG Grain Canvas** | Continuous film grain texture (`0.035` opacity) providing a physical celluloid quality. |
| **Ambient Aurora Canvas** | Multi-orbital radial gradients generating continuous ambient lighting in the background. |

---

## 5. Tooling, Quality & Deployment

- **Package Manager**: `npm`
- **Linter**: `eslint` with `eslint-config-next`
- **Compiler**: Next.js Turbopack
- **Version Control**: Git (local repository with clean semantic commits)
- **Deployment Platform**: Vercel (Edge network, auto preview branches)
