# Competition hub local concept

This concept uses illustrative events, dates, results, and existing academy photos. The user approved publishing the reviewed version on October 1, 2026. Nothing is submitted by the trial or support controls; their on-page preview notices remain visible.

## Preview routes

- `/competitions`: upcoming events, results/recaps tab, first-competition guide, and team-support invitation.
- `/competitions/houston-open` and `/competitions/fall-grappling-championship`: sample upcoming event pages.
- `/competitions/summer-team-open`: sample results and gallery page.
- `/about#free-trial` and `/schedule#free-trial`: beginner-only kids' trial selector.
- `/`: brand-red competition banner.

## Keeping it simple

The hub and event pages are statically generated at build time. Edit `src/lib/competitions.ts` to add or update an event, and rebuild. There is no database, authentication, CMS, or upload service. A shared event template keeps page count flexible: 3 events and 30 events use the same template.

## Before publishing

Replace the sample events with confirmed dates, venues, organizer links, registration deadlines, divisions, and spectator/meetup information. Supply approved event-specific images and verified results. Add actual recap text. Extend the data model with per-event result rows and gallery images as real content becomes available.

The trial selector offers the three 5:30 PM kids' classes identified in the supplied screenshots (Monday Gi, Wednesday NoGi, Friday Gi). Confirm any adult or younger-kids trial options before adding them. A live booking flow needs either an external scheduling link or an integration that checks availability and confirms requests. The current selector only demonstrates selection and feedback. Team-support buttons likewise demonstrate the intended invitation without storing or sending anything.

A CMS, member RSVP tracking, or photo uploads can be added later if the academy needs to manage content without code changes; those are separate from this static concept.

## Motion and brand styling

The hero uses CSS for a rising Step Up title, a delayed Team Up fade, and staggered copy/buttons, without waiting for client hydration. Its image remains prioritized. Lower hub sections and event cards reveal once as they enter the viewport. Reduced-motion preferences disable these entrances. The competition experience uses the academy’s red, with lighter red text accents for readability.

## September 30 photo and promotion review

Houston Open uses a local optimized rendition of [IMG_4646.JPG](https://drive.google.com/file/d/1OZMXig9e22MdPeS4C4AD-WzpYpXzHuUo/view), a competition match photo from Updated Photos. It illustrates the sample event; it is not represented as a photo taken at Houston Open. The hero and November event image remain unchanged. Other reviewed options: [IMG_4644.JPG walkout](https://drive.google.com/file/d/1J_oyW56no4QO0OOLe-8KFNCbBW1LW85e/view) and [IMG_4651.JPG victory portrait](https://drive.google.com/file/d/1Zql6TTs3Q6jLRdkNOK1aJM-S0dWhNl7u/view). Originals remain in Drive.

The nav now says Competition Hub, and the homepage banner sits directly after Programs, before Trainers and Testimonials. Luis’s screenshot confirms the Friday kids’ 5:30 start, so its old start-time uncertainty note has been corrected; class end times remain unconfirmed.

The sample Summer Team Open recap now uses an optimized local rendition of IMG_4651.JPG, showing Coach Luis looking down with his hand raised. Its top-focused crop preserves his face and raised hand in wide layouts. All hub hero, event card, event detail, and gallery thumbnail photos use the shared gentle scroll parallax with overscan and reduced-motion support. Enlarged gallery photos stay still for viewing.

## October 1 trial flow

The Kids BJJ page now says Schedule Your Free Trial and opens a beginner-only trial modal. Its selector is shared with the About and Schedule trial boxes (Monday/Wednesday/Friday at 5:30 PM, ages 8–14). The timed modal uses the trial flow on the Kids BJJ page. General and adult consultation controls retain their original flow. Selection feedback is preview-only and sends no booking.

## October 1 merchandise section

Homepage #store sits after Schedule and before Latest News, with Store links in the menu and footer. The merch flyer is a local branded edit of the supplied BSN artwork, stays uncropped, and has a local branded fallback on failure. The shop CTA retains all supplied UTM parameters and opens a new tab. Deadline callouts have been removed at the user’s request; the shop URL and access code are in src/lib/store.ts. No checkout or payment flow is hosted locally.

## October 1 media refinement

Merch artwork: public/photos/finesse-merch-branded.webp, edited with imagegen from the supplied flyer. Black/charcoal background, red frame, original product selection and names, access code JqdVqXsC9J. No deadline badge, order dates, QR code, or payment/contact footer.

Competition homepage banner video: public/videos/finesse-team-rolling-10s.mp4. Source supplied by the user: https://youtube.com/shorts/GCLCjZnTiYo. Four 2.5-second rolling excerpts from 12.5–15, 16–18.5, 23–25.5, and 29–31.5 seconds, cropped to landscape, desaturated, and exported at 960×540 / 24 fps / H.264 without audio. Duration is exactly 10 seconds. A separate poster remains visible if video cannot play. Red tint is a CSS layer over the monochrome video. Playback loads only near the viewport, pauses outside it, and stays still for reduced-motion users. The visible pause button was removed at the user’s request. Source videos and imagegen originals are not included in the site assets.
