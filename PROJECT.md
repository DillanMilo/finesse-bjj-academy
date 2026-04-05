# PROJECT.md — Finesse BJJ Academy · Build Plan & Roadmap

**Repo:** `finesse-bjj`
**Developer:** Dillan — Creative Currents LLC
**Last Updated:** April 2, 2026

---

## 1. Tech Stack Decision

**Framework: Next.js 14 (App Router)**

Why Next.js over Vite/React SPA:

- **SEO is critical** — BJJ gyms live and die by local search. "BJJ gym Spring TX" needs to rank. Next.js gives us server-side rendering (SSR) and static generation (SSG) out of the box, which Vite/React SPA cannot do without extra tooling.
- **Image optimization** — `next/image` handles responsive images, lazy loading, and WebP conversion automatically. Trainer photos (the heaviest assets on the page) will load fast without manual optimization.
- **Metadata API** — App Router's built-in `generateMetadata` makes Open Graph tags, structured data, and local business schema trivial. This matters for Google Maps pack ranking.
- **Performance** — automatic code splitting, font optimization (`next/font`), and partial prerendering mean the cinematic parallax experience loads fast even on mobile.
- **Deployment** — zero-config deploys, instant preview URLs for client review, analytics built in.
- **Future-proofing** — when the CRM integration comes, API routes in Next.js handle server-side form submissions and webhooks without standing up a separate backend.

### Full Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR/SSG for SEO, image optimization, API routes |
| Language | TypeScript | Type safety, better DX, fewer runtime bugs |
| Styling | Tailwind CSS | Matches our utility-first design system, fast iteration |
| Animations | Framer Motion | Declarative parallax, scroll reveals, page transitions |
| Fonts | next/font + Google Fonts | Bebas Neue, Cormorant Garamond, DM Sans — zero layout shift |
| Deployment | Vercel | Auto-deploys, preview URLs, edge network |
| CRM | TBD (client's existing tool) | Form submissions, lead capture, class signups |
| Analytics | Vercel Analytics + Google Analytics 4 | Traffic, conversions, scroll depth |
| Backend (if needed) | Supabase | Only if we need dynamic scheduling or user accounts |

---

## 2. Project Structure

```
finesse-bjj/
├── public/
│   ├── trainers/          # Trainer photos (headshots + action)
│   │   ├── logo.svg           # Production logo
│   │   └── og-image.jpg       # Open Graph preview image
│   └── fonts/                 # Self-hosted font files (if needed)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (fonts, metadata, nav, footer)
│   │   ├── page.tsx           # Homepage (6-section landing page)
│   │   ├── globals.css        # Tailwind base + custom CSS vars
│   │   └── api/
│   │       └── lead/
│   │           └── route.ts   # Form submission → CRM integration
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Programs.tsx
│   │   │   ├── Trainers.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Schedule.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── LeadPopup.tsx
│   │   │   └── ClassCard.tsx
│   │   └── motion/
│   │       ├── ParallaxLayer.tsx
│   │       ├── ScrollReveal.tsx
│   │       └── GrainOverlay.tsx
│   ├── lib/
│   │   ├── crm.ts             # CRM API client (TBD)
│   │   └── constants.ts       # Colors, trainer data, schedule data
│   └── types/
│       └── index.ts           # Shared TypeScript interfaces
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── CLIENT.md                  # Client brief & design specs
├── PROJECT.md                 # This file — roadmap & build plan
└── DESIGN.md                  # (Optional) Generated from design tiles for Claude Code
```

---

## 3. Roadmap — Phased Delivery

### Phase 1: Foundation & Static MVP 🏗️

**Target:** 1–2 weeks after content assets received

| Task | Status | Details |
|------|--------|---------|
| Scaffold Next.js 14 project | 🔲 | `npx create-next-app@latest` with App Router, TypeScript, Tailwind |
| Configure Tailwind theme | 🔲 | Map approved color palette, typography scale, spacing |
| Build Navbar component | 🔲 | Fixed nav, scroll state, mobile hamburger, logo, CTA button |
| Build Hero section | 🔲 | Parallax layers, noise texture, hero copy, dual CTAs, stats bar |
| Build Programs section | 🔲 | Card grid with hover reveals, program descriptions, badges |
| Build Trainers section | 🔲 | Cinematic scroll scenes, alternating layout, quote overlay |
| Build Testimonials section | 🔲 | Student cards with star ratings, quote styling |
| Build Schedule section | 🔲 | Class list with times, instructors, spot availability indicators |
| Build Final CTA section | 🔲 | Atmospheric glow, bold headline, dual CTAs |
| Build Footer | 🔲 | 4-column layout, social links, contact info |
| Build Popup Lead Capture | 🔲 | Modal with form, CTA click + 12s auto-trigger |
| Responsive pass | 🔲 | Three breakpoints: 1024px, 768px, 480px |
| Deploy to Vercel | 🔲 | Connect repo, auto-deploy, grab preview URL for client |

**Deliverable:** Live preview URL → send to Luis & Patty for review

---

### Phase 2: Content Integration & Polish ✨

**Target:** 1 week after Phase 1 review

| Task | Status | Details |
|------|--------|---------|
| Swap placeholder content | 🔲 | Real trainer bios, quotes, schedule |
| Trainer photo processing | 🔲 | Background removal (remove.bg), optimization, responsive variants |
| Real testimonials | 🔲 | Replace placeholder cards with actual student reviews |
| Confirm class schedule | 🔲 | Lock real days/times/instructors with Patty |
| OG image + social meta | 🔲 | Open Graph preview image, Twitter card, local business schema |
| Performance audit | 🔲 | Lighthouse 90+ on mobile, Core Web Vitals green |
| Accessibility pass | 🔲 | ARIA labels, focus states, reduced-motion media query |
| Cross-browser testing | 🔲 | Chrome, Safari, Firefox, mobile Safari, Chrome Android |
| Client review round | 🔲 | Walk through with Luis, capture feedback, iterate |

**Deliverable:** Content-complete site ready for final sign-off

---

### Phase 3: CRM Integration & Lead Funnel 🔗

**Target:** 1–2 weeks after Phase 2 sign-off

| Task | Status | Details |
|------|--------|---------|
| Identify client's CRM tool | 🔲 | Get CRM name, API docs, auth credentials from Luis/Patty |
| Build API route for form submissions | 🔲 | `app/api/lead/route.ts` — validate, sanitize, forward to CRM |
| Connect popup form → CRM | 🔲 | Form submission → CRM lead entry + confirmation UI |
| Connect hero CTA → CRM | 🔲 | "Claim Your Free Class" flow → CRM lead + confirmation |
| Set up email confirmation | 🔲 | Auto-reply to new signups (if CRM supports, or via SendGrid/Resend) |
| UTM tracking | 🔲 | Capture `utm_source`, `utm_medium`, `utm_campaign` on form submissions |
| Conversion event tracking | 🔲 | GA4 custom events: `free_class_signup`, `phone_call_click`, `schedule_view` |
| Test full funnel end-to-end | 🔲 | Submit → CRM entry → email confirmation → analytics event |

**Deliverable:** Fully integrated lead capture funnel, tested and live

> ⚠️ **CRM NOTE:** Luis and Patty have an existing CRM tool they use for the gym. The specific tool hasn't been identified yet — we'll scope the integration once they share the platform name and any API access details. Common BJJ gym CRMs include Mindbody, Zen Planner, Kicksite, PushPress, or Gymdesk. The integration approach will adapt based on what they're running.

---

### Phase 4: SEO, Launch & Go-Live 🚀

**Target:** 1 week after Phase 3

| Task | Status | Details |
|------|--------|---------|
| Local SEO setup | 🔲 | Google Business Profile optimization |
| Structured data (JSON-LD) | 🔲 | LocalBusiness, SportsActivityLocation, Course schema |
| Sitemap + robots.txt | 🔲 | Auto-generated via Next.js |
| Meta tags audit | 🔲 | Title tags, meta descriptions, OG tags for all pages |
| Page speed optimization | 🔲 | Image compression, font subsetting, lazy loading |
| DNS cutover to Vercel | 🔲 | Point finessebjj.com to Vercel (or configure custom domain) |
| SSL verification | 🔲 | HTTPS enforced |
| 301 redirects | 🔲 | Map any old URLs from current site to prevent 404s |
| Analytics verification | 🔲 | GA4 + Vercel Analytics both firing correctly |
| Launch announcement | 🔲 | Help draft social media posts announcing the new site |
| Post-launch monitoring | 🔲 | 72-hour watch for bugs, broken links, CRM sync issues |

**Deliverable:** Live site on finessebjj.com, fully indexed, leads flowing into CRM

---

### Phase 5: Post-Launch Optimization (Ongoing) 📈

**Target:** Ongoing after launch

| Task | Status | Details |
|------|--------|---------|
| Conversion rate monitoring | 🔲 | Track free class signup rate weekly |
| A/B test CTA copy | 🔲 | "Free Class" vs "Free Week" vs "Free Open Mat" |
| Heatmap analysis | 🔲 | Where users drop off |
| Blog/content section | 🔲 | Optional: technique articles for long-tail SEO |
| Google Ads landing page | 🔲 | Optional: dedicated paid traffic page with stripped-down conversion focus |
| Competition calendar page | 🔲 | Optional: upcoming tournaments, results |
| Review collection automation | 🔲 | Post-class email/SMS → Google Review request |

---

## 4. Design References

The build must follow these approved design sources:

| Reference | File | Role |
|-----------|------|------|
| Design Tiles (Red Version) | `finesse-bjj-design-tiles-red.html` | Visual system: colors, typography, components, effects, voice/tone |
| Design Tiles PDF | `finesse-bjj-design-tiles-red.pdf` | Client-facing version of above |
| Wireframe Mockup | `finesse-bjj-wireframe.html` | Structural blueprint: section order, interactions, parallax behavior |
| Stitch Palette | TBD (if exported) | Visual scaffolding bridge between tiles and production code |
| CLIENT.md | `CLIENT.md` | Full client brief with all specs, asset tracker, and open questions |

> **Rule of thumb:** If the design tiles say one thing and the wireframe says another, the design tiles win for visual style; wireframe wins for layout/interaction patterns.

---

## 5. Environment & Dev Setup

```bash
# Clone and install
git clone <repo-url>
cd finesse-bjj
npm install

# Dev server
npm run dev          # http://localhost:3000

# Build & preview
npm run build
npm run start

# Deploy
git push origin main  # Auto-deploys to Vercel
```

### Required Environment Variables

```env
# CRM Integration (Phase 3 — values TBD)
CRM_API_KEY=
CRM_API_URL=
CRM_LOCATION_ID=

# Analytics (Phase 4)
NEXT_PUBLIC_GA_ID=

# Optional: Email service for confirmations
RESEND_API_KEY=
```

---

## 6. Key Decisions Log

| Decision | Chosen | Rationale | Date |
|----------|--------|-----------|------|
| Framework | Next.js 14 | SSR for local SEO, image optimization, API routes for CRM | Apr 2026 |
| Styling | Tailwind CSS | Matches utility-first approach, fast prototyping | Apr 2026 |
| Animation | Framer Motion | Declarative, React-native, handles parallax + scroll reveals cleanly | Apr 2026 |
| Primary color shift | #E8196A → #CC1122 | Client (Luis) requested red over pink — approved | Mar 2026 |
| PDF rendering | Playwright/Chromium | WeasyPrint can't handle clip-path, backdrop-filter, noise | Mar 2026 |
| Deployment | Vercel | Zero-config Next.js deploys, preview URLs, edge CDN | Apr 2026 |
| CRM | TBD | Client has existing tool — will integrate once identified | Pending |

---

## 7. Risks & Blockers

| Risk | Impact | Mitigation |
|------|--------|------------|
| Trainer photos not received | HIGH — can't finish trainer sections or hero | Follow up with Patty weekly, use high-quality stock as temporary placeholders |
| CRM tool has no API | MEDIUM — can't automate lead capture | Fallback: email-based form submission (Resend/SendGrid → notification email to Luis) |
| Client feedback delays | MEDIUM — stalls progress between phases | Set clear review windows (48-hour turnaround ask), ship incrementally |
| Parallax performance on low-end mobile | LOW — janky scroll | Reduce/disable parallax on mobile, use `prefers-reduced-motion` media query |
| DNS cutover complications | LOW — brief downtime during switch | Schedule during off-hours, pre-configure Vercel custom domain |

---

## 8. Success Criteria

| Metric | Target | How We Measure |
|--------|--------|----------------|
| Lighthouse Performance (Mobile) | 90+ | Chrome DevTools Lighthouse |
| Free class signups/month | 2x current count vs. baseline | CRM dashboard |
| Bounce rate | < 40% | GA4 |
| Average time on page | > 2 minutes | GA4 (cinematic experience should hold attention) |
| Google "BJJ Spring TX" ranking | Top 5 | Google Search Console |
| Core Web Vitals | All green | Vercel Analytics / PageSpeed Insights |

---

*This is a living document. Updated as decisions are made and phases complete.*
