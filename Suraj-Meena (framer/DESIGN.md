# DESIGN.md — Suraj Meena Portfolio
## Visual reconstruction specification (source of truth: supplied screen recording)

> **Objective:** Rebuild the original portfolio so it looks and behaves like the supplied recording of `https://suraj-meena.framer.website/`. This is a faithful reproduction task, not a redesign.
>
> **Reference priority:** The supplied screen recording is the primary visual reference. Use it together with the live Framer site and original local assets. Do not use an earlier implementation, assumptions, or a generic portfolio template as the design authority.
>
> **Fidelity rule:** Match the reference at the same viewport, scroll position, and interaction state. Do not claim “100% exact” based only on a successful build or a written audit. Compare screenshots and correct visible differences.

---

## 1. Design intent

The site is a minimal, editorial, motion/visual-creator portfolio. Its personality comes from:
- Warm, very light cream/off-white canvas.
- Strong black typography and compact editorial labels.
- Large, bold, tightly set hero typography.
- Small, playful graphic accents (a dark four-point star and a purple/black lightning-like shape).
- A small portrait integrated into the hero.
- A compact black floating pill navigation.
- Spacious sections with restrained decoration.
- Project imagery doing most of the visual storytelling.
- A black footer with cream typography and a very large low-contrast `SURAJ` wordmark.

**Do not reinterpret this as:** a dark developer portfolio, neon/futuristic interface, glassmorphism dashboard, colorful SaaS landing page, generic agency template, or a new UI concept.

## 2. Global visual system

### 2.1 Color
Use the sampled/previously verified colors as starting tokens, then verify against the recording:
- Main page background: warm cream, approximately `#FAF7F3`.
- Main text: near-black, approximately `#111111`.
- Footer background: near-black, approximately `#111111`.
- Footer/body light text: warm off-white matching the page background.
- Card surfaces in the testimonial section: near-black.
- Small accent color: restrained violet/purple, visible in the hero lightning graphic.
- Muted text: neutral grey/low-opacity black.

Do not introduce additional accent colors unless they are present in the supplied assets/reference.

### 2.2 Typography
- Use the recovered local font files. The reference uses a bold, modern grotesk/editorial display style for large headings and clean sans-serif body copy.
- Preserve the exact local font mapping already recovered in the project; do not substitute fonts casually.
- Hero title is extremely large, heavy, uppercase, tightly line-spaced, and centered.
- Section headings are smaller than the hero but still bold and clear.
- Body copy is compact, readable, and dark.
- Labels and metadata are small, quiet, and often muted.
- Preserve the reference's line breaks and text wrapping at matching viewport widths. Text wrapping is part of the layout.

### 2.3 Shape language
- Mostly simple rectangles and pills.
- Navigation is a black rounded pill.
- Menu dropdown is a compact black rounded panel.
- Testimonial cards are dark rounded rectangles.
- Project/article media have the corner radius visible in the reference; do not apply one universal radius if the original varies.
- Avoid unnecessary borders, shadows, gradients, and decorative containers.

### 2.4 Spacing and composition
- Keep generous open cream space between major sections.
- Do not compress the page into a dense landing page.
- Preserve the reference's asymmetrical editorial alignments and deliberate whitespace.
- Do not center every section merely for consistency. Match each section's own alignment.
- Match content widths, grid gaps, card proportions, and section heights from screenshots at the same viewport.

---

## 3. Global navigation

### Default state
- A small black pill floats near the top center of the viewport.
- The left side displays the site/owner label `Suraj`.
- A small light icon/control sits on the right side of the pill.
- The pill remains visually compact; it must not become a full-width header bar.
- It overlays the page rather than consuming a conventional tall navbar row.

### Open menu state
- Activating the right-side control opens a black rounded dropdown panel directly below/attached to the pill.
- Menu entries are stacked vertically as compact light/white text.
- The menu is narrow and visually subordinate to the hero.
- The supplied recording visibly shows the dropdown opening and closing. Reproduce the actual interaction and state rather than inventing a different mobile drawer.
- Menu navigation should lead to the corresponding original page sections/routes.

### Interaction
- Match the original open/close behavior, positioning, menu dimensions, typography, and animation timing.
- Keep keyboard accessibility and close behavior, without changing the visible design.
- At mobile widths, inspect the live reference and recording rather than assuming a conventional hamburger navigation.

---

## 4. Home page — section-by-section specification

The order below follows the supplied recording.

### 4.1 Hero

**Composition**
- Full-width warm cream background.
- Main title centered in the upper-middle portion of the hero:
  - `VISUAL`
  - `EDITOR`
- Both words are uppercase, very large, heavy black, and tightly stacked.
- The title occupies the visual center and is the dominant element.
- A small portrait image is centered directly beneath/overlapping the lower title area, as shown in the reference.
- A dark four-point star/spark graphic floats to the upper-left of the title.
- A small lightning/bolt graphic with purple accent floats to the right of the title.
- Small copyright text `©2026` is anchored near the lower-left of the hero.
- A small creation-year/creator label appears near the lower-right edge in the recording; reproduce its exact text and alignment from the reference asset/site.
- Keep the hero sparse. Do not add extra taglines, buttons, social icons, gradients, blobs, or other decoration that is not visible in the reference.

**Scale and placement**
- Match title width, font size, line height, and position from the same desktop viewport.
- Keep the star and lightning graphic at their reference positions and sizes.
- Preserve the portrait's exact crop, size, and placement.
- Hero height must match the original scroll transition into the `Hey!` section.

**Motion**
- Reproduce the original title, portrait, and floating graphic entrance/scroll behavior from the reference.
- Do not add arbitrary bounce, spring, parallax, or fade effects.
- If the original motion cannot be established from the recording, inspect the live site and document the observed behavior before implementing it.

### 4.2 Bio / About (`Hey!`)

**Composition**
- The section begins with a large/simple `Hey!` heading toward the left side.
- Below/around it, the layout is an editorial multi-column composition:
  - A short personal introduction in a narrow text column on the left.
  - A prominent portrait with a strong red background near the middle.
  - A longer descriptive biography in a text column on the right.
- The portrait is a major visual anchor; preserve its source image, crop, aspect ratio, and placement.
- Do not replace this composition with a generic centered profile card or a two-column SaaS-style About section.

**Content**
- Preserve the exact wording shown in the original site/recording. Do not invent new claims, client names, experience, or credentials.
- If the live reference contains copy that differs from local project data, the live reference is authoritative unless the owner explicitly approves a content change.

**Responsive behavior**
- Reflow the columns in the same order as the reference.
- Preserve the portrait's prominence and the relationship between the two text blocks.
- Avoid horizontal overflow and avoid shrinking the body text to unreadable sizes.

### 4.3 Manifesto / statement

**Composition**
- A large area of open cream space separates the Bio from the statement.
- The statement is a compact, centered paragraph in the middle of the viewport, with a restrained width and multiple short lines.
- It reads:
  `From raw footage to final cut. Motion and edits built to hold attention, move with intent, and feel considered from music videos to content series to full brand motion.`
- The text is visually quiet at first and resolves to strong dark text as the scroll-linked reveal progresses, as visible in the recording.
- Do not turn this into a large boxed quote, oversized left-aligned headline, or decorative quote mark treatment.

**Motion**
- Preserve the word-by-word scroll-linked color/opacity reveal.
- Match scroll progress, word spacing, line breaks, and final text color.
- No unrelated entrance animation or spring effect.

### 4.4 Services

**Composition**
- `Services` heading aligned toward the left.
- Four service rows arranged vertically with substantial separation.
- Each row has a clear service title on the left and a smaller, muted list of capabilities aligned toward the right.
- The four service titles visible in the recording:
  1. Motion Graphics
  2. Video Editing
  3. Social Media Reels
  4. Motion Design & VFX
- Preserve the simple editorial list treatment. It is not a set of colorful cards.
- Use thin separators only if they are present in the live reference; do not add decorative rules by default.

**Responsive behavior**
- Keep service title and capability text legible.
- At narrow widths, stack or wrap the row content in the same visual order as the original.
- Do not create horizontally scrolling service rows.

### 4.5 Featured Projects

**Composition**
- Section heading: `Featured Projects`, aligned left and broken into two lines at the desktop width shown in the recording.
- A small `View All`-style link/action appears toward the right side of the heading row.
- Project cards are image-led, arranged in a three-column desktop grid.
- Cards are tall portrait-oriented media panels; project images/video thumbnails fill the card area.
- Project titles and short descriptions sit directly below the media, not inside a dashboard-like information panel.
- The recording shows project imagery including warm cinematic footage, a night/interior scene, and food/restaurant imagery. Use the exact original project assets and order from the reference, not substitutes.
- Preserve each media crop and card ratio independently where the source does so.

**Interaction**
- Match the original hover treatment and click-through behavior.
- Project cards must navigate to their actual project detail pages/routes.
- Do not add autoplay sound. For video previews, use muted, inline playback only if that matches the original behavior.

### 4.6 Testimonials

**Important: the supplied recording visibly shows a `Testimonials` section.**
- Do not replace this section with `Selected Collaborations` unless the owner explicitly requests that content change.
- The heading reads `Testimonials`.
- Four dark/black cards appear in one horizontal row at the desktop viewport.
- Cards have rounded corners and compact white text.
- Each card includes a short testimonial paragraph and a small identity row at the bottom with a circular/small portrait and name/role text.
- Preserve the original text, names, portraits, card dimensions, internal padding, spacing, and alignment from the original site.
- Never fabricate or rewrite testimonial quotes. If any source testimonial is unverified, keep it only if the owner confirms it is authentic; otherwise ask for approved replacement content while retaining the original visual card design.

### 4.7 Thoughts

**Composition**
- Heading: `Thoughts`.
- A three-column desktop editorial article layout is visible.
- Article cards are large media-led rectangles with image/cover art at the top and title/category/summary text below or integrated according to the original card.
- The recording shows:
  - A dark architectural/abstract cover with title `Building Trust Through Clear Design`.
  - A monochrome/architectural cover with title `The Role of Art Direction in Branding`.
  - A dark text-led card inviting visitors to explore the blog, with a `View All`-style action.
- Preserve the original card order, images, copy, text hierarchy, and image aspect ratios.
- Do not replace these with newly invented essays or different article topics unless the owner explicitly approves a content rewrite.

### 4.8 Contact

**Composition**
- Heading: `Let's talk.` on the left.
- A short supporting line sits below the heading.
- A small row of social icon links appears below/near the text.
- A dark form panel is positioned to the right.
- The form contains the original fields and labels, including name, email, and project/message input as shown in the reference.
- The submit control is a light/cream button within or at the bottom of the dark form panel, as visible in the recording.
- Preserve the form panel's width, corner radius, internal spacing, input styling, and button position.
- Do not redesign this as a centered full-width form or a white card.

**Functionality**
- Validate required fields and email format.
- Use the actual original form integration if available.
- If the implementation only uses a `mailto:` fallback, label/document that honestly. A generated mailto link is not equivalent to server-side message delivery.
- Preserve social link destinations from the original site.

### 4.9 Footer

**Composition**
- Full-width solid near-black section.
- Left column contains the stacked heading:
  `Helping`
  `Brands`
  `Stand Out.`
- Middle column contains `Quick links` and compact light pill-like link controls.
- Right column contains `/Contact` and the email address.
- A very large `SURAJ` wordmark spans the lower portion of the footer, dark grey/low opacity against the black background.
- The recording visibly confirms the watermark wordmark is part of the footer design. Keep it.
- Preserve footer height, column positions, type scale, and watermark crop/placement.
- Bottom metadata/copyright/location should match the original reference exactly; do not add or remove details based on assumptions.

---

## 5. Additional pages and project detail

The supplied recording continues beyond the home page and shows navigation into the project archive and a project detail page. These are part of the reference experience and must not be ignored if the rebuild is intended to reproduce the complete portfolio.

### 5.1 Projects archive
- Page heading: `Projects`.
- Cream background and same floating black pill navigation.
- Editorial project grid with large portrait media cards.
- The recording shows projects including `Tum Aaye Ho`, `M & M Restro and cafe`, and `Mazuri`, with further projects below.
- Preserve the original order, images, card ratios, titles, descriptions, and spacing.
- Match the archive's number of columns and responsive behavior from the live reference.

### 5.2 Project detail — Tum Aaye Ho
- Project title `Tum Aaye Ho` appears as the page heading.
- A compact metadata row follows (the recording shows category/year/tools-style metadata).
- Section heading `About the Project`.
- A paragraph description follows.
- A gallery of project images/media appears below.
- A `Creative Process` section appears further down, followed by process imagery/timeline-like visual material.
- A `More Projects` section appears near the bottom, showing other project thumbnails.
- Preserve the exact detail-page content, media sequence, gallery layout, metadata labels, and transitions from the original.
- Do not invent project process steps or replace the original gallery with generic mockups.

### 5.3 Other project detail pages
- Inspect each project link in the original site and reproduce the corresponding detail page structure.
- Keep shared project page components consistent only where the original is consistent.
- Do not assume all projects use identical galleries or content blocks.

---

## 6. Motion and interaction fidelity

The visual design includes subtle interactions; motion must be observed rather than guessed.

Audit and reproduce:
- Floating navigation open/close state.
- Hero entrance and graphic/portrait motion.
- Scroll transition between sections.
- Manifesto word-by-word scroll reveal.
- Project card hover and click behavior.
- Testimonial/article card hover behavior if present.
- Contact form validation, submit, and confirmation state.
- Project archive and project detail navigation.
- Any image/video hover behavior visible in the original.

For every animation, record:
- Trigger (load, scroll position, hover, click, intersection).
- Start and end state.
- Duration.
- Easing curve.
- Delay/stagger.
- Transform/opacity/color changes.
- Whether it is scroll-linked or time-based.

**Do not add motion merely to make the site feel more animated.** If a motion detail is not visible or measurable, inspect the live reference. If it remains unknown, document it as unknown and choose the least intrusive implementation.

Respect `prefers-reduced-motion` without changing the default-motion experience.

---

## 7. Responsive requirements

The supplied recording is primarily a desktop browser capture. It does not, by itself, prove the exact mobile layout.

Therefore:
- Use the live Framer site at desktop, tablet, and mobile widths as the authority for responsive behavior.
- Do not invent mobile navigation, card stacking, typography scale, or section order.
- Preserve the same hierarchy and visual identity at every breakpoint.
- No horizontal overflow.
- Keep touch targets usable without changing the original appearance more than necessary.
- Verify portrait crop and project media crop separately at each breakpoint.

At minimum, compare:
- Desktop: 1535 × 775 (recording viewport reference).
- Laptop: 1280 × 800.
- Tablet: 768 × 1024.
- Mobile: 390 × 844 and 360 × 740.

---

## 8. Asset rules

- Prefer the recovered original local assets in `public/assets/`.
- Do not use stock imagery, AI-generated replacements, emoji, or generic placeholder photos.
- Do not replace the original hero graphics, portrait, project media, testimonial portraits, or article covers with approximations.
- Preserve aspect ratio, crop, object position, and image quality.
- Use local video files when they are the original media and the reference supports video playback.
- Lazy-load below-the-fold media while preserving the original visible behavior.
- Never show broken image placeholders in the final page.

---

## 9. Content integrity

- The supplied recording shows the original site's visible content and section names. Treat that content as the source of truth.
- Do not silently replace `Testimonials` with `Selected Collaborations`.
- Do not silently replace the visible Thoughts articles with newly authored topics.
- Do not silently rewrite the About copy, project names, descriptions, or footer copy.
- Do not invent client endorsements, customer names, credentials, years of experience, project outcomes, or contact details.
- If a piece of original content is illegible or unavailable, mark it as requiring owner confirmation instead of guessing.
- Any content change must be separated from the visual-copy task and explicitly approved.

---

## 10. Implementation constraints

- Keep the existing Next.js App Router + TypeScript implementation.
- Use plain CSS/CSS Modules as already established; do not introduce Tailwind.
- Use the recovered local fonts and assets.
- Reuse components where it does not alter the original design.
- Avoid unnecessary dependencies.
- Preserve semantic HTML, keyboard operation, visible focus states, and reduced-motion support.
- Do not push to GitHub or deploy to Vercel without explicit approval.

---

## 11. Required comparison and acceptance process

A build passing is not visual approval.

For each section and page:
1. Open the original Framer page and local rebuild at the same viewport dimensions.
2. Match the same scroll position and interaction state.
3. Capture screenshots.
4. Compare side-by-side or with an overlay.
5. Fix the largest visible mismatch first.
6. Repeat until no meaningful difference remains.
7. Record any unavoidable differences (for example, unavailable original interaction logic).

### Required deliverables
- `DESIGN.md` — this specification.
- `VISUAL_COMPARISON.md` — original vs local screenshots, viewport, section, mismatch, correction.
- `ANIMATION_SPEC.md` — observed trigger/timing/easing/state for each interaction.
- `CONTENT_SOURCE_MAP.md` — each section's exact copy and asset source.
- A final QA note listing anything not verified.

### Acceptance criteria
- Same section order and visible section names as the reference.
- Same typography hierarchy, line breaks, colors, whitespace, alignment, image crops, card proportions, and page composition.
- Same navigation and interaction states.
- Same observed animations, without invented effects.
- Same original content unless a change is explicitly approved.
- All project/archive/detail routes that exist in the original are reproduced.
- Desktop/tablet/mobile behavior checked against the original.
- No broken links, missing assets, or horizontal overflow.
- Owner reviews and approves screenshot comparisons before deployment.

---

## 12. Critical instruction for the implementation agent

**Do not redesign, modernize, simplify, reinterpret, or personalize the reference. Copy it.**

The current rebuilt website is not the source of truth if it differs from the supplied recording. The original Framer portfolio and this recording are the source of truth.

Before changing code:
1. Inspect the entire recording.
2. Inspect the original live site and all linked pages.
3. Inventory the exact assets used in each section.
4. Identify every mismatch between the current rebuild and the original.
5. Propose a short correction list.
6. Implement only those corrections.
7. Capture new side-by-side screenshots and request owner approval.

If an exact detail cannot be confirmed, do not fabricate certainty. Mark it for inspection or owner confirmation.
