# Recruiter-first portfolio: plan

**The change:** the recruiter page becomes the home page. The 3D desk becomes an optional experience that opens from a live mini preview in the hero section. The recruiter page also gets a proper visual upgrade and scroll animations.

## What the site does today (checked in the browser on localhost:5173, 10 Oct 2026)
- With no hash, `/` opens the **3D desk**. The recruiter page lives at `#plain`, and `localStorage.view` remembers which one the visitor last used.
- The 3D desk routes its sections by hash (`#projects`, `#experience`, …). The recruiter page uses the same ids (`about`, `experience`, `projects`, `skills`, `education`, `contact`) as section anchors, so the two routing schemes would clash once the recruiter page is the default.
- The recruiter page (`src/plain/PlainView.jsx`):
  - **Header:** a sticky bar with the section links and a **"Back to desk"** button plus the theme toggle.
  - **Body:** one column (`max-w-3xl`) with plain sections and no hero visual.
  - **Motion:** none apart from smooth scrolling.
  - **Projects:** AI Circuit Builder and Deskpulse still show placeholder images.
- The 3D desk shows a **"Recruiter mode"** button top-right, and P toggles plain view.
- To check: when the viewport was resized without a reload, the 3D canvas drew into only the top-left quarter of the screen. This may just be the preview pane's viewport emulation, but confirm the canvas handles window resizes and DPR changes correctly.

## Prompt for Claude

```
Read this whole brief, then work in the PHASES at the end. After each phase: run `npm run build`, check it in the browser at desktop (1440×900) and mobile (390×844) widths in light and dark mode, commit, summarise, and WAIT for my OK.

GOAL
The recruiter page becomes the home page. The 3D desk becomes an optional experience, opened from a live mini preview of the desk in the recruiter page's hero. Also redesign the recruiter page so it looks polished and alive, with tasteful scroll animations. All content still comes from src/data/* only. Don't invent facts or metrics, never show my phone number, and never mention App Store or Play Store.

────────────────────────────────
1. ROUTING AND DEFAULT VIEW
────────────────────────────────
- `/` with no hash = the recruiter page, ALWAYS. Stop remembering the 3D view as a default: remove the `localStorage.view` behaviour (and clear the old key on load).
- The 3D desk lives under its own hash namespace:
  - `#desk` is the desk overview
  - `#desk/projects`, `#desk/experience` (etc.) are open desk sections
  Update DeskView, usePlainMode (rename it, e.g. useViewMode) and any code that reads section ids from the hash, so the desk sections no longer clash with the recruiter page's section anchors.
- Recruiter page section links scroll with scrollIntoView. They must NOT write `#projects` etc. into the hash, because that would open the desk. Optionally update the URL with history.replaceState to `?s=projects`, or not at all.
- Keep `#plain` as an alias that redirects to `/`, so old links don't break.
- In the 3D desk, rename the "Recruiter mode" button to "← Back to portfolio". P and Esc (from the desk overview) also go back. Returning restores the recruiter page scrolled to the hero.
- The browser back button must work naturally: recruiter → desk → back = recruiter.

────────────────────────────────
2. NAVBAR (recruiter page)
────────────────────────────────
- REMOVE the "Back to desk" button from the navbar entirely. The only way into the desk is the hero preview (plus one small footer link, see section 5).
- New sticky navbar:
  - Left: a small monogram/wordmark "Saffron Dionysius T" (or "SDT"), which scrolls to the top when clicked.
  - Centre: the section links (About, Experience, Projects, Skills, Education, Contact), with a scroll-spy active indicator: a pill that slides smoothly to the active link.
  - Right: the theme toggle, plus a compact "Resume" button that downloads /assets/resume.pdf.
- It starts transparent and gains a blurred background, a hairline border and a slightly smaller height after ~24px of scroll.
- Add a thin scroll-progress bar along the very top of the page, in the accent colour.
- Mobile: wordmark + theme + menu button. The menu opens a full-width sheet with the links (focus-trapped, closes with Esc and on link click).

────────────────────────────────
3. HERO WITH THE MINI DESK
────────────────────────────────
Layout: two columns on desktop (text on the left, desk preview on the right); stacked on mobile, with the preview under the text.

Left column:
- A small status chip with a pulsing green dot: "Open to freelance & full-time roles" (wording taken from the existing contact copy).
- The name in large display type, revealed word by word on load.
- "Software Engineer", the bio from profile.js, and "Chennai, Tamil Nadu, India".
- CTAs: "Email me" (primary), "Download resume" (secondary), and a row of social icons (LinkedIn, GitHub, X, Instagram).
- A quick-facts strip, derived from the data files only (count them in code, don't hardcode): "3 years experience" (from the bio), "{experience.length} roles", "{projects.length} projects".

Right column, the "mini desk" card:
- A rounded card about 4:3, with a soft shadow and a subtle "window" frame. Its header strip reads "My desk · live from Chennai" next to the existing WeatherCaption (live Chennai time + weather).
- **Instant poster:** show a static poster image of the desk straight away: `/assets/desk-poster-light.webp` and `/assets/desk-poster-dark.webp`. Capture these from the default 3D camera view with Playwright, each ≤ 120 KB, picked to match the theme. This keeps the home page fast.
- **Progressive live preview:** once the page is idle (requestIdleCallback, falling back to a 1.5 s timeout), and only if WebGL is available, the device isn't low-end (deviceMemory ≥ 4 when known), the card is on screen and prefers-reduced-motion is off:
  - lazy-load the existing 3D Experience in a "preview" mode inside the card
  - dpr capped at 1, no interactions, no hover labels, no panels
  - the camera slowly orbits ±12° around the default view
  - pause rendering when the card is off screen (IntersectionObserver) or the tab is hidden
  - crossfade from the poster to the live canvas
  - the three.js chunk must NOT be part of the initial recruiter bundle
- The whole card is one big button, with aria-label "Explore my desk in 3D", and a visible CTA inside it: "Step inside →". On hover (desktop), the card lifts slightly and the CTA slides. Show a tiny hint: "Interactive 3D · best on desktop".
- **Prefetch:** start loading the 3D chunk on hover or focus of the card if it isn't loaded yet.
- **Opening transition:** clicking the card expands it to fill the screen (a FLIP/shared-element animation of about 600 ms, with the page behind fading out). Then the full DeskView takes over at `#desk`, with the camera starting at the preview pose and gliding to the default view. Returning plays the reverse (the desk shrinks back into the card).
- With reduced motion, use a quick crossfade instead of the expand/shrink.
- On mobile, the poster is shown (a live preview only on capable devices). Tapping it opens the existing mobile desk experience (dock + sheets).
- If WebGL is unavailable, the card shows the poster with "3D needs a WebGL-capable browser". The card stays visible but doesn't open the desk; it can open the existing 2D SVG scene instead.

────────────────────────────────
4. RECRUITER PAGE REDESIGN
────────────────────────────────
Keep the current palette (cream / sage / night), Inter, and the neon-sign display font for accents. Widen the layout to max-w-6xl, with a comfortable reading width for text blocks. It should look calm and premium, not flashy.

- Background: a very subtle grain/noise texture plus one or two soft, slowly drifting gradient blobs behind the hero (static under reduced motion).
- Section headers: a small eyebrow label (e.g. "02 · Experience") plus a large heading with a short underline accent that draws in when it comes into view.
- **Experience:** a vertical timeline. The line fills/draws progressively as you scroll through the section (scroll-linked). Each role is a card that slides and fades in; the date sits on the left on desktop and on top on mobile. The current role gets a "Now" badge.
- **Projects:** a bento grid.
  - Svik is the featured large tile (it's in development, so keep the "In development" badge).
  - The other four are smaller tiles.
  - Each tile shows the image (hover: slight zoom and lift, with the shadow growing), the title, the description, the stack chips and the link buttons.
  - Keep the existing styled placeholder for missing images, but make it look intentional: a gradient tile with the project's initial and stack.
  - Tiles reveal with a stagger.
- **Skills:** each group is a card, and the skills are rendered as small keycap-style chips (a nod to the 3D keyboard). The chips pop in with a stagger when the card enters view, and press down slightly on hover.
- **Education:** two cards with the graduation photo (educationMedia) on the degree card.
- **Contact:** a large closing panel:
  - "Let's build something."
  - the existing availability line
  - the email address with a copy-to-clipboard button and a "Copied!" toast
  - social buttons and a resume button
- **Footer:** © year + name, "Built with React & Three.js", and one small text link: "Step into my desk in 3D →" (to #desk).

Animations (all of them):
- Build a tiny `useReveal` hook (IntersectionObserver) plus CSS classes: fade + 16px rise, ~500 ms, ease-out, with a stagger via a CSS variable. Each element animates only once.
- Prefer CSS and IntersectionObserver. If something genuinely needs it (e.g. the FLIP expand), framer-motion is allowed, but only via LazyMotion + domAnimation so it stays small.
- Content must be visible without JS animation. Add the hidden-before-reveal state only after JS sets a `.js-motion` class on <html>, and never hide content for print or for prefers-reduced-motion users.
- No layout shift (CLS ≈ 0), no scroll-jacking, and no animation longer than ~700 ms.
- Respect prefers-reduced-motion everywhere: no reveals, no blobs, no timeline drawing, no word-by-word name.

Also add a print stylesheet for the recruiter page: hide the navbar, the desk card and the animations, and use black-on-white text.

────────────────────────────────
5. ACCESSIBILITY, PERFORMANCE, SEO
────────────────────────────────
- Keep the skip link, the landmarks and one h1 (the name). Visible focus rings on everything. The scroll-spy must not steal focus.
- Lighthouse on the recruiter page (desktop): Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100. On mobile, Performance ≥ 85.
- Check the build output: the initial JS for `/` must not include three, @react-three/* or maath. Report the chunk sizes.
- Update the meta description and the OG image so the OG image is the recruiter hero with the desk poster (regenerate public/og-image.png at 1200×630).
- Check the 3D canvas handles window resizes and DPR changes. When the viewport was resized without a reload, it once rendered into only the top-left quarter. Fix it if it reproduces.

────────────────────────────────
PHASES
────────────────────────────────
Phase A. Routing: recruiter page as the default, the #desk namespace, the "Back to portfolio" button in the desk, navbar "Back to desk" removed, #plain alias, localStorage cleanup, back-button behaviour.
Phase B. The new navbar, hero layout, quick facts, the desk card with posters (capture them), and the progressive live preview + prefetch + expand/shrink transition.
Phase C. Redesign the rest of the sections, plus the reveal/scroll animations, the contact panel, the footer and the print styles.
Phase D. QA: reduced motion, keyboard-only walkthrough, mobile, no-WebGL fallback, Lighthouse scores, bundle check, the OG image, and the resize bug. Then list anything I still need to provide (the AI Circuit Builder and Deskpulse images, and the Deskpulse tech stack).
```
