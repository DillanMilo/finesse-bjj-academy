```markdown
# Design System Strategy: The Apex Combatant

## 1. Overview & Creative North Star
**The Creative North Star: "Cinematic Aggression"**

This design system is not a utility; it is a broadcast. It rejects the polite, rounded "SaaS" aesthetic in favor of high-impact, editorial storytelling. We are blending the raw intensity of a UFC championship broadcast with the refined sophistication of a premium lifestyle brand. 

The layout breaks the "template" look through **intentional asymmetry and sharp, angular geometry**. We do not use soft corners; we use blades. We do not use white space; we use "void space." By utilizing heavy typographic scales, film grain textures, and overlapping layers, we create a digital environment that feels as physical and high-stakes as the mats of the academy.

---

## 2. Colors & Tonal Depth
The palette is a lethal combination of deep crimson and absolute blacks. We avoid "flat" UI by using tonal shifts to create a sense of light being swallowed by the shadows.

### The Color Tokens
- **Background (Surface-Dim):** `#0A0A0A` – The base void.
- **Section Depth (Surface-Container):** `#1A1014` – A blood-tinted dark grey for subtle differentiation.
- **Primary Accent (Primary-Container):** `#CC1122` – Deep Crimson. Use for high-impact CTAs.
- **Secondary Accent:** `#8B1A1A` – The "dried blood" red. Use for hover states and secondary depth.

### The Rules of Surface
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Use the shift from `#0A0A0A` to `#1A1014` to define the start of a new content block. 
- **The "Glow" Protocol:** Instead of standard shadows, use **Red Neon Glows**. Apply a `drop-shadow` with the `primary` token at 15-20% opacity and a 20px-40px blur to mimic the lighting of a darkened arena.
- **Signature Textures:** Every primary surface must have a 3% opacity **Film Grain Overlay**. This removes the "digital" sterility and adds a cinematic, grit-heavy feel.

---

## 3. Typography: The Editorial Voice
Typography is the primary driver of the "Aggressive" mood. We lean into extreme contrast between massive, industrial headlines and elegant, literary quotes.

- **Display & Headlines (Bebas Neue):** All-caps. Tracking: `-0.05em`. Leading: `0.9`. 
  - *Usage:* These should be "massive." Don't be afraid to let a headline bleed off the edge of a container or overlap a background image.
- **Quotes & Philosophies (Cormorant Garamond Italic):** 
  - *Usage:* For testimonials or the "Academy Creed." This provides a "Zen" contrast to the aggression of the headlines, representing the "Finesse" in the brand name.
- **Body Text (DM Sans):** 
  - *Usage:* Keep this clean and highly legible. Use `on_surface_variant` (`#E6BDB9`) to reduce eye strain against the pure black background.

---

## 4. Elevation & Depth: Tonal Layering
We do not use elevation to denote "friendliness." We use it to denote "Intensity."

- **The Layering Principle:** Depth is achieved by stacking `surface_container_lowest` (#0E0E0E) behind `surface_container` (#201F1F). 
- **The "Ghost Border" Fallback:** If a border is required for input fields, use the `outline_variant` at 15% opacity. It should barely be felt, only sensed.
- **Angular Geometry:** All containers must feature a **Clipped Top-Right Corner**. Use a CSS `clip-path: polygon(0 0, 90% 0, 100% 10%, 100% 100%, 0 100%);` to create a signature "technical" look.
- **Glassmorphism:** For navigation bars or floating mobile menus, use a `backdrop-blur` of 12px with a 60% transparent `surface_container_lowest`.

---

## 5. Components

### Parallelogram CTAs (Buttons)
- **Shape:** Do not use rectangles. Use a `skewX(-12deg)` transform on the button container and a reverse `skewX(12deg)` on the text to keep the text upright.
- **Primary:** `primary_container` background with `on_primary_fixed` text.
- **State:** On hover, the button should "pulse" with a red neon outer glow.

### Cards (The "Fighter Profile" Style)
- **Construction:** No dividers. Use a vertical spacing of `8` (2.75rem) between content blocks.
- **Visuals:** Top-right corner clipped. Background is `surface_container_high`. 
- **Divider Exception:** If a line is needed to separate stats, use a **Gradient Line**: `linear-gradient(90deg, transparent, #CC1122, transparent)`.

### Input Fields
- **Style:** Underline only. No four-sided boxes.
- **Active State:** The underline transitions from `outline_variant` to a glowing `primary` crimson.

### Signature Component: The "Match Overlay" Chip
- **Context:** Used for class levels (e.g., "Advanced," "No-Gi").
- **Style:** Small, all-caps Bebas Neue text inside a red-tinted, semi-transparent angular box.

---

## 6. Do’s and Don’ts

### Do:
- **Use Massive Scale:** Headlines should feel like they are shouting.
- **Embrace Asymmetry:** Offset images to the right; let text breathe on the left.
- **Use High-Contrast Imagery:** Only use photography with deep shadows (Chiaroscuro style) and high-action focal points.

### Don’t:
- **NO Blue or Purple:** Even in the smallest icon or link. If it’s not Red, Black, or White, it doesn't belong.
- **No Rounding:** The `border-radius` token is strictly `0px`. Roundness is a sign of weakness in this visual language.
- **No Standard Grids:** Avoid the "3-column card row" whenever possible. Try a staggered masonry layout or a horizontal scrolling "filmstrip" to maintain the cinematic feel.
- **No 1px Borders:** Never use a solid border to separate a header from a body. Use a background color shift or a wide gutter.

---

## 7. Motion & Interaction
- **Transitional Feel:** All page transitions should mimic a camera shutter or a "glitch" effect.
- **Hover States:** Elements shouldn't just change color; they should "light up" like a dashboard. Use `brightness(1.2)` and increase the red drop-shadow intensity.
- **Scroll Parallax:** Background images (with film grain) should move slower than the foreground text to create a 3D "arena" effect.```