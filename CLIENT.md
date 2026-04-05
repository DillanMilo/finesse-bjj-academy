# CLIENT.md — Finesse BJJ Academy Website Redesign

> **Project:** Finesse BJJ Academy — Full Website Redesign  
> **Client:** Luis Diaz (Owner) · Patty (Operations & Asset Coordination)  
> **Developer:** Dillan — Creative Currents LLC  
> **Type:** Pro Bono  
> **Status:** Design Approved → Moving to MVP Build  

---

## 1. Business Overview

**Finesse BJJ Academy** is a Brazilian Jiu-Jitsu and wrestling gym located at **17711 Kuykendahl Rd, Unit A, Spring, TX 77379**. The gym is owned and operated by Luis Diaz, with Patty handling operations and communications.

**Phone:** (346) 418-2999  
**Email:** info@finessebjj.com  
**Current Site:** [https://finessebjj.com](https://finessebjj.com)  
**Social Channels:** Instagram, Facebook, YouTube, TikTok (links TBD from client)

---

## 2. Project Scope & Goals

### Primary Objective
Replace the current template-style website with a **cinematic, high-converting landing page** that reflects Finesse BJJ's premium brand identity and drives new studen.

### Primary Conversion Goal
**Free trial class signup** — every design and copy decision funnels toward getting visitors to claim their first free class.

### Secondary Conversion Points
- Phone call: (346) 418-2999
- Lead capture popup (triggers via CTA clicks + auto-fires at 12s scroll delay)
- Schedule viewing → class signup

### Success Metrics
- Increase in free trial class signups
- Reduced bounce rate (current site feels generic/template-y)
- Higher time-on-site from cinematic scroll experience
- Mobile-first engagement (majority of BJJ gym traffic is mobile)

---

## 3. Brand Identity

### Logo
- **Elements:** Snake + triangle + "FINESSE BJJ" wordmark
- **Symbolism:** Snake = technique, precision, patience (core BJJ philosophy). Triangle = guard position, submission geometry, hierarchy.
- **Colors in logo:** Pink/magenta (#E8196A original), black, silver
- **File:** Luis's red logo (transparent background) has been provided and is embedded in design tiles
- **Request to client:** SVG or high-PNG with transparent background for production use

### Brand Personality
"Cinematic dark luxury meets combat sport" — think Bellator/ONE Championship branding sophistication vs. UFC raw aggression. The name "Finesse" demands elegance and technical precision, not brute force.

---

## 4. Design Direction — APPROVED ✅

### ⚠️ CRITICAL: Follow These Design Sources

The final website build **MUST** follow the approved design direction from two key reference files:

1. **Design Tiles (v1 — Red Version)** — `finesse-bjj-design-tiles-red.html` / `finesse-bjj-design-tiles-red.pdf`
   - This is the client-approved visual system: color palette, typography, UI components, effects, layout patterns, belt system, and voice/tone
   - Luis specifically requested the shift from pink to red, and approved this version

2. **Google Stitch Design Palette** — If a Stitch export exists, use it as a visual scaffolding reference to validate layout and component placement against the approved tiles

3. **Wireframe Mse-bjj-wireframe.html`
   - Full interactive prototype showing the 6-section page structure, parallax effects, trainer scenes, schedule, popup lead capture, and conversion architecture
   - Use this as the structural blueprint for section ordering and interaction patterns

> **The design tiles are the source of truth for visual styling. The wireframe is the source of truth for layout and interaction. The Stitch palette (if used) bridges the two.**

---

## 5. Color Palette (Approved — Red Version)

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Deep Navy | `#080415` | 8, 4, 21 | Background base |
| Indigo | `#1A0A3B` | 26, 10, 59 | Section depth / card backgrounds |
| Violet | `#7B2FBE` | 123, 47, 190 | Mid accent / borders / secondary UI |
| Electric Blue | `#4F7FFF` | 79, 127, 255 | Tertiary accent |
| **Finesse Red** | **`#CC1122`** | **204, 17, 34** | **Primary CTA · Brand accent** |
| Soft White | `#F5F0FF` | 245, 240, 255 | Body text |
| Gray | `#9A8FB0` | 154, 143, 176 | Secondary text abels |

### Key Gradients
- **Primary:** `linear-gradient(135deg, #CC1122, #7B2FBE)` — red to violet
- **Cool:** `linear-gradient(135deg, #7B2FBE, #4F7FFF)` — violet to blue
- **Red Glow:** `radial-gradient(ellipse at center, rgba(204,17,34,0.5), transparent)` on `#080415`
- **Violet Glow:** `radial-gradient(ellipse at center, rgba(123,47,190,0.6), transparent)` on `#080415`

### Hover State
- Red hover: `#E8222E` (brighter red)

### Belt System Accent Colors
| Belt | Color | Level |
|------|-------|-------|
| White | `#E8E8E8` | Beginner |
| Blue | `#2980B9` | Intermediate |
| Brown | `#6B3A2A` | Advanced |
| Black | `#1A1A1A` | Expert |
| Black + Red | `#1A1A1A` / `#CC1122` | Finesse Signature |

---

## 6. Typography

| Font | Weight | Role | Usage |
|------|--------|------|-------|
| **Bebas Neue** | Regular | Display / Headings | Section titles, hero text, nav logo text fallback, all-caps display |
| **Cormorant Garamond** | Italic 400/600 | Editorial / Quotes | Trainer quotes, subheadings, italicent copy |
| **DM Sans** | 300/400/500/600 | Body / UI | Paragraphs, buttons, nav links, form inputs, labels |

### Type Scale (Desktop)
- Hero title: `clamp(4rem, 8vw, 7rem)` — Bebas Neue
- Section titles: Bebas Neue, uppercase, tracked `0.08em`
- Body: DM Sans, `0.85rem–1rem`
- Eyebrow labels: DM Sans `0.55rem–0.65rem`, uppercase, tracked `0.15em–0.28em`

### Responsive Type
- Uses `clamp()` for fluid scaling
- Three breakpoints: tablet (≤1024px), mobile (≤768px), small mobile (≤480px)

---

## 7. Page Structure — 6 Sections

### Section 1: Hero (Parallax + Trainer Photo)
- Full-viewport cinematic hero with layered parallax
- Background layer at `0.3x` scroll speed, triangle decoration at `0.15x`, trainer foreground at `-0.08x`
- Film grain noise texture + subtle grid overlay
- Primary CTA: "Claim Your Free Class" (clipped parallelogram button)
- Secondary CTA: Phone call link
- Stats bar immediately below hero for instant social proof (Years Open, Active Students, 5-Star Reviews, Programs: Programs / Classes
- Card grid showcasing program offerings
- Each card has atmospheric background, hover reveals description + CTA
- Badge shows age/level targeting
- **Programs:** Adult BJJ, Kids BJJ (Ages 5+), Wrestling, Open Mat, Private Lessons

### Section 3: Meet the Trainers (Cinematic Scroll)
- Full-viewport scroll scenes — one per trainer
- Photo left/right alternates per trainer
- Background + subject move at different scroll speeds for parallax depth
- Trainer name, rank badge, belt indicator, and quote overlay

### Section 4: Testimonials / Social Proof
- Student testimonial cards with star ratings
- Cinematic quote styling (italic Cormorant Garamond, red left-border)

### Section 5: Schedule / Today's Classes
- Live class schedule with day/time/instructor/class name
- "Spots left" urgency indicators (e.g., "3 spots left" in red)
- "View Full Schedule" CTA

### Section 6: Final CTA (Full-Width Conversion Push)
- Atmospheric glow backgrounds (red + violet radials)
- Bold headline: "READY TO ND YOUR FINESSE?"
- Repeat primary CTA + phone call CTA
- Copy: "Your first class is on us — no excuses, no pressure, just jiu jitsu."

### Footer
- 4-column layout: Brand, Programs, Academy links, Contact details
- Social links: Instagram, Facebook, YouTube, TikTok
- Address, phone, email
- "Designed by Creative Currents LLC" badge

### Lead Capture Popup
- Triggers from CTA clicks + auto-fires at 12-second scroll delay
- Clipped container with neon corner accents
- Fields: Name, Email/Phone
- CTA: "Claim My Free Class"

---

## 8. Visual Effects & Motion

| Effect | Where Used | Implementation |
|--------|-----------|----------------|
| Layered parallax | Hero, trainer scenes | JS scroll listeners, transform translateY at different rates |
| Film grain noise | Hero background | SVG `<feTurbulence>` filter overlay |
| Subtle grid overlay | Hero, cover | CSS `background-image` with thin grid lines |
| Radial gradient glows | Section backgrounds, popup | CSS `radial-gradient` with brand colors |
| Neon glolines | Popup corners, card borders | CSS `box-shadow` with brand color glow |
| Clip-path geometry | CTA buttons, popup container, decorative triangles | CSS `clip-path: polygon(...)` |
| Scroll reveal | Cards, swatches, tiles | `IntersectionObserver` → opacity + translateY transition |
| Custom cursor | Desktop only | Pink dot + ring, scales on hover over interactive elements |
| Backdrop blur | Nav on scroll | `backdrop-filter: blur(12px)` |

### Animation Notes for Production
- All scroll animations must use `IntersectionObserver` (no scroll event listeners for performance)
- Framer Motion is the planned animation library for the Next.js build
- Parallax should be disabled or simplified on mobile for performance
- Custom cursor should be hidden on touch devices

---

## 9. Trainers (Known)

| Name | Role | Belt/Rank | Quote (Placeholder) |
|------|------|-----------|---------------------|
| **Luis Diaz** | Owner / Head Instructor | — | "Finesse isn't a technique — it's a way of moving through ever." |
| **Nathan Bates** | Black Belt Instructor | Black Belt | "The mat doesn't care about your ego — it only rewards honesty." |
| **Eric Synatschk** | Brown Belt Instructor | Brown Belt | "Every roll is a problem to solve — stay calm, stay technical." |
| **Carlos Diaz** | Wrestling Instructor | — | "Control where the fight happens — that's where wrestling wins." |

> **⚠️ NOTE:** All quotes above are **placeholders from the wireframe**. Real trainer bios, ranks, specialties, competition background, and updated quotes need to come from Patty/Luis.

---

## 10. Content Assets — Status Tracker

| Asset | Status | Priority | Notes |
|-------|--------|----------|-------|
| Trainer photos (headshots) | 🟡 Requested from Patty | **HIGH** | Need clean, well-lit photos. Can use remove.bg for cutouts |
| Trainer photos (action shots) | 🟡 Requested from Patty | **HIGH** | For parallax hero and trainer scenes |
| Trainer bios (rank, experience, specialties) | 🟡 Requested from Patty | **HIGH** |cker |
| Class schedule (days/times/class types) | 🟡 Requested from Patty | MEDIUM | Drives highest-intent page on any BJJ site |
| Student testimonials | 🟡 Requested from Patty | MEDIUM | Social proof for conversions |
| Logo file (PNG/SVG, transparent bg) | 🟡 Requested from Patty | MEDIUM | Have Luis's red logo, but need high-res production file |
| Social media links (IG, FB, YT, TT) | 🔴 Not yet requested | LOW | For footer + social proof |
| CTA offer confirmation | 🔴 Needs client confirmation | MEDIUM | "Free Class" is current hook — could be "First Month Free" or "Free Open Mat" |

---

## 11. Tech Stack (Planned Build)

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| Animations | **Framer Motion** |
| UI Components | Custom (styled per design tiles) |
| Fonts | Google Fonts: Bebas Neue, Cormorant Garamond, DM Sans |
| Deployment | **Vercel** |
| CMS/Backend | TBD (likely static forse if dynamic scheduling needed) |

### Build Approach
1. Use the approved design tiles + Stitch palette as visual reference
2. Scaffold with Next.js 14 + Tailwind + App Router
3. Build section-by-section following the wireframe structure
4. Implement Framer Motion animations (parallax, scroll reveals, popup)
5. Mobile-first responsive: 3 breakpoints (1024px, 768px, 480px) with clamp() type scaling and single-column stacking
6. Deploy MVP to Vercel for client review

### Key Technical Considerations
- Stitch exports should be treated as **reference/visual validation only**, not production source code
- WeasyPrint cannot handle advanced CSS (clip-path, backdrop-filter, radial gradients, SVG noise) — Playwright/Chromium is the reliable PDF rendering path
- When updating color values, **all** rgba values, CSS variables, gradient stops, and descriptive copy must be updated together to avoid inconsistencies
- Scroll animation JS must be removed/disabled before any PDF rendering so all elements are visible

---

## 12. Responsive Design Spec

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| Desktop | > 1024px | Full layout: multi-column grids, parallax active, custom cursor |
| Tablet | ≤ 1024px | 2-3 column grids, reduced parallax, no custom cursor |
| Mobile | ≤ 768px | Single column stacking, simplified animations, full-width CTAs |
| Small Mobile | ≤ 480px | Compact spacing, smaller type floor, thumb-friendly tap targets |

---

## 13. Voice & Tone

### Copy Direction
- **Confident but not aggressive** — "Finesse" is about precision, not brute force
- **Warm and inviting** — lower the barrier to entry for beginners
- **Technical credibility** — belt ranks, instructor experience, and BJJ culture references build trust
- **Urgency without pressure** — "Your first class is on us" not "SIGN UP NOW OR MISS OUT"

### Sample CTA Copy (from wireframe)
- "Claim Your Free Class"
- "Your journey starts with one step onto the mat."
- "Join hundreds of students in Spring, TX who chose to inlves."
- "Where every roll makes you better — on the mat and in life."

---

## 14. Contact & Location

**Finesse BJJ Academy**  
17711 Kuykendahl Rd, Unit A  
Spring, TX 77379  

**Phone:** (346) 418-2999  
**Email:** info@finessebjj.com  

---

## 15. Design History & Versions

| Version | What Changed | Status |
|---------|-------------|--------|
| v1.0 — Original Tiles | Deep navy + violet + hot pink (`#E8196A`) palette, 7 design tile sections | Sent to Luis |
| v1.0 — Red Version | `#E8196A` → `#CC1122` (deep crimson red) across 77+ references. Swatch renamed "Finesse Red", belt signature → "Black + Red" | ✅ **Approved by Luis** |
| v1.0 — Wireframe | Full 6-section interactive HTML prototype with parallax, popup, schedule, trainer scenes | Reference for build |

---

## 16. Open Questions for Client

1. **CTA Offer:** Is "Free Class" the final offer, or do you want "First Month Free" / "Free Open Mat" instead?
2. **Trainer Info:** Awaiting bios, ranks, specialties, and photos from Patty
nks:** What are the official Instagram, Facebook, YouTube, and TikTok URLs?
4. **Class Schedule:** Is the schedule in the wireframe accurate, or does Patty have an updated version?
5. **Logo Format:** Can you provide the logo as SVG or high-res PNG with transparent background?
6. **Domain/Hosting:** Staying on finessebjj.com? Any DNS or hosting changes needed?

---

*Last updated: April 2, 2026*  
*Prepared by: Creative Currents LLC*
