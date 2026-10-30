# Animation Audit Specification (`ANIMATION_AUDIT.md`)

This document reverse-engineers and specifies all observable animations and interaction behaviors from the live Framer reference website ([https://suraj-meena.framer.website/](https://suraj-meena.framer.website/)).

---

## 1. Floating Pill Navigation Bar (`Navbar.tsx`)

| Property | Value |
| :--- | :--- |
| **Element** | Floating black pill navigation container (`Navbar.tsx`) |
| **Trigger** | User click on the right hamburger / 3-line menu button |
| **Initial State** | Compact black pill (`width: 320px`, `height: 48px`, `border-radius: 20px`, background `#111111`). Displays "Suraj" brand text (left) and 3 rounded bars (right). |
| **Final State** | Expanded vertical card (`width: 320px`, auto height), revealing stacked navigation link rows (`Home`, `About Me`, `Services`, `Works`, `Contact`). |
| **Duration** | `0.35s` |
| **Easing** | Spring / cubic-bezier `(0.16, 1, 0.3, 1)` |
| **Transform** | Height smoothly animates from `0` to `auto` with opacity fading in from `0` to `1`. Menu icon lines morph with rotational cross offset. |

---

## 2. Floating 3D Holographic Ornaments (`Hero.tsx`)

| Property | Value |
| :--- | :--- |
| **Element** | Holographic Ribbon (Top-Left) and Holographic Prism Triangle (Bottom-Right) |
| **Trigger** | Page load entrance + continuous harmonic floating loop |
| **Entrance State** | `opacity: 0`, `translateY: 15px` |
| **Floating Loop** | Subtle harmonic oscillation: `y: [-4px, 4px, -4px]`, `rotate: [-2deg, 2deg, -2deg]` |
| **Duration** | Loop cycle: `6s` (Ribbon) and `7s` (Triangle) to prevent harmonic synchronization. |
| **Easing** | `easeInOut` (sine curve) |
| **Interactivity** | Free-floating depth; does not obstruct clicks. |

---

## 3. Hero Typography Entrance Reveal

| Property | Value |
| :--- | :--- |
| **Element** | Display Headline (`VISUAL` on line 1, `EDITOR` on line 2) |
| **Trigger** | Page load |
| **Initial State** | `opacity: 0.001`, `translateY: 18px`, `filter: blur(4px)` |
| **Final State** | `opacity: 1`, `translateY: 0px`, `filter: blur(0px)` |
| **Stagger Timing** | Word 1 (`VISUAL`): delay `0.1s`. Word 2 (`EDITOR`): delay `0.25s`. |
| **Duration** | `0.8s` |
| **Easing** | `cubic-bezier(0.16, 1, 0.3, 1)` |

---

## 4. Creator Portrait Avatar & 3D Scroll-Triggered Flip

| Property | Value |
| :--- | :--- |
| **Element** | Creator Portrait Container (`creator-portrait-front.png`) |
| **Trigger** | Initial entrance on page load + scroll progress into the bio section |
| **Entrance State** | `opacity: 0`, `translateY: 20px` → `opacity: 1`, `translateY: 0px` (duration `1.0s`, delay `0.3s`) |
| **Scroll Linked State** | Container pins / sticks in viewport as user scrolls into the bio section, performing a 3D perspective flip (`perspective: 1200px`, `rotateY(180deg)`, `scale(0.5)`), revealing the red silhouette back view. |
| **Scroll Range** | Triggered between scroll progress `0%` and `30%` of page height. |

---

## 5. Bottom Metadata Row (`©2026` & `/CREATING SINCE 2024`)

| Property | Value |
| :--- | :--- |
| **Element** | Copyright and creator timeline labels at viewport bottom |
| **Trigger** | Page load |
| **Initial State** | `opacity: 0` |
| **Final State** | `opacity: 1` |
| **Duration** | `0.8s` (delay `0.5s`) |
| **Easing** | Ease-out linear |
