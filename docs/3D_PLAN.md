# 3D Desk Portfolio: build plan (replaces the old Phases 3–5)

You are continuing my portfolio rebuild. Phases 1–2 are done: the data files in `src/data/`, the plain/recruiter view in `src/plain/`, the 2D SVG scene in `src/scene/`, and the hooks in `src/hooks/` (useHashRoute, usePlainMode, useReducedMotion, useTheme, useWindowSize). There is also `src/lib/chennaiTime.js`. Reuse all of these.

The new direction: replace the 2D scene as the main experience with an **interactive 3D model of my real desk**, built entirely in code with React Three Fiber. **Keep the 2D SVG scene as the fallback** (no WebGL, very low-end devices, and as the loading placeholder).

**Reference photos of my real desk:** `docs/reference/desk-front.jpg`, `docs/reference/desk-behind-chair.jpg`, `docs/reference/desk-side.jpg`. Look at all three before you model anything, and compare your renders against them at each phase. These photos are private: they are gitignored, so never commit, copy into `public/` or import them.

## Ground rules
- **Step 0, before any change:** commit the current working tree with the message `Phases 1–2: data, plain view, 2D scene`. Then commit at the end of every phase.
- Work in the phases at the bottom. After each phase, run `npm run build`, take screenshots if Playwright is available (otherwise tell me exactly what to check), summarise the changes, and **wait for my OK** before starting the next phase.
- **New dependencies allowed** (versions compatible with React 18): `three`, `@react-three/fiber@^8`, `@react-three/drei@^9`, `framer-motion`, `maath`. Nothing else without asking.
- **No brand logos** on any model (no Zebronics, HP, Kreo, Intel or NVIDIA marks). Don't reproduce what is on my real screens.
- The style is **stylised low-poly, but recognisably my desk**: rounded boxes, clean materials, soft shadows, warm window light. It should be cozy, not photoreal.

## Architecture
- `src/three/` holds everything 3D:
  - `Experience.jsx`: the Canvas, camera, lights and environment.
  - `objects/*.jsx`: one component per object.
  - `focus.js`: the camera pose for each object.
  - `useChennaiWeather.js` and `useSky.js`.
- **Every object component accepts the same props** (`name`, `onSelect`, `hovered`, `active`) and owns its own geometry. Later I may swap any object for a Blender `.glb` with the same `name`, so keep all interaction logic outside the geometry.
- **Load the 3D bundle lazily** (`React.lazy` + `Suspense`). Show the existing 2D SVG scene while it loads, then crossfade to 3D.
- **Units:** 1 unit = 1 metre. The floor is y = 0 and the desktop surface is y = 0.75. The desk is centred on x = 0. Its back edge is at z = −0.30, against the window wall, and its front edge is at z = +0.30.
- **Use instancing** for repeated geometry: keycaps, window grille bars, rain.

## The room (match the photos)
- **Back wall at z = −0.32**, colour pale lemon-cream (~#E9E6AE, matte).
  - **Left ~35% of the wall (x < −0.30):** plain, with a black cable running vertically down it and a small hook at about y = 1.55.
  - **Right ~65%: a large window.** It runs from x ≈ −0.28 to x ≈ +1.30, from y ≈ 0.80 to y ≈ 2.10.
    - **Frame:** dark brown wood (~#4A3424), with vertical mullions splitting it into three panes.
    - **Grille:** dark grey metal bars in a grid, about 9 columns × 8 rows across the full width.
    - Faint mosquito mesh. No glass reflections needed.
- **Left side wall at x = −0.85**, same cream colour. **Terracotta floor tiles** (~#B4553A), with a subtle grid.
- **Outside the window**, a backdrop about 3 m behind the glass:
  - a stylised tree: a brown trunk and branches, with clusters of green leaves made from low-poly icosahedrons that sway gently
  - a pink-red sunshade slab across the top outside the window
  - a sky gradient behind everything, driven by the Chennai time of day
- **Wall switchboard** at x ≈ −0.36, y ≈ 0.88 on the back wall, left of the window: a white plate with one rocker switch, a small red indicator LED and a round purple dial plate next to it. *This is the light/dark toggle.*

## The desk and objects
These are starting positions in metres. Adjust them against the photos and avoid overlaps.

| Object | Build | Approx. position |
|---|---|---|
| **Desk** | 1.20 × 0.60 top, 0.03 thick, dark mahogany (~#4B2420, roughness 0.45, slight sheen). Solid side panels plus a front apron/drawer face (0.12 tall) with a small handle. Cable grommet hole at the back left. | centre (0, 0.735, 0) |
| **Monitor** (~22") | Panel 0.50 × 0.30 × 0.025, matte black with thin bezels. Bottom edge 0.12 above the desk. Thin neck and a black three-legged/V stand. Idle screen: a procedural canvas texture of a moody grey sky, a dark sea with a white surf line and a black-sand beach, plus a thin dock bar at the bottom. | x −0.05, z −0.17 |
| **Laptop** (~15.6") | Silver aluminium (~#C9CCD1, metalness 0.6, roughness 0.35). Base 0.36 × 0.24 × 0.018 with a keyboard grid and touchpad. Sits on a silver laptop stand that tilts the base up ~15° at the back. Lid open ~105°. Idle screen: a dark code-editor texture. Rotated ~−12° about Y, towards the chair. A few black cables trail off its right side. | x +0.40, z −0.04 |
| **Keyboard** (75%) | Black case 0.32 × 0.135 × 0.03. About 84 keycaps in 6 rows: black letter keys, lavender/purple modifiers (~#8F84D6; Esc, Tab, Caps, Shift, Ctrl, Enter, Backspace, arrows, space-row mods), a round knob at the top right. **RGB underglow:** emissive light between the keys, slowly cycling cyan → blue → purple. Coiled black cable to the back. | x −0.12, z +0.15 |
| **Mouse** | Black, smooth rounded shape ~0.115 × 0.062 × 0.035, with a cable to the back. | x +0.19, z +0.17 |
| **Pen holder** | Clear acrylic cylinder (r 0.04, h 0.11) wrapped in a purple-pink paisley canvas texture. Holds 6–8 pens and pencils at slight angles, one yellow box cutter and one screwdriver. | x −0.50, z −0.10 |
| **Steel tin** | Brushed steel cylinder (r 0.045, h 0.12) with a slot on the lid. | x −0.52, z −0.23 |
| **Glasses case** | Navy blue (~#1F2A4A) zip capsule 0.17 × 0.065 × 0.05, in front of the monitor stand. | x −0.05, z −0.05 |
| **Earbuds case** | Small black rounded zip case with a metal carabiner loop. | x −0.47, z +0.13 |
| **Chair** | Black office chair: tall rounded backrest, seat, curved loop armrests, five-star base on castors. Seen from behind in the default view. | x 0, z +0.70 |

**Added objects** (not on my real desk; keep them small and natural):

| Object | Build | Approx. position |
|---|---|---|
| **Phone** | Black slab 0.075 × 0.16 × 0.008, lying flat, screen off. *Contact.* | x +0.13, z −0.02 |
| **Notebook** | A5, teal cloth cover with an elastic band, slightly rotated. The earbuds case can rest on its corner. *About.* | x −0.38, z +0.05 |
| **Deskpulse** | My small desk display: a wedge-shaped dark body ~0.11 × 0.08 with a ~3.5" screen. The screen is a live CanvasTexture (see below). | x −0.31, z −0.18 |
| **Framed certificate** | A thin wooden frame (0.30 × 0.22) hanging from the existing wall hook. *Education.* | left wall area, y ≈ 1.45 |
| **Printed resume** | One A4 sheet held by a binder clip and hanging from a small nail below the certificate. *Downloads `/assets/resume.pdf`* (the file already exists). | below the certificate |

## Camera and controls
- **Default view:** standing just behind and above the chair, like `desk-behind-chair.jpg`. Camera at about (0, 1.30, 1.45), looking at (0.05, 0.95, −0.20), FOV ~40.
- Use drei `CameraControls`, heavily limited:
  - horizontal orbit ±25°
  - vertical angle limited so the camera never goes under the desk or into the wall
  - no panning
  - light dolly only
  - smooth damping
- When idle for 5 s, add a very slow drift (disabled for reduced motion).
- **Each interactive object has a focus pose in `focus.js`.** Clicking an object flies the camera there with `setLookAt(…, true)`, taking about 1.2 s. "← Back to desk", Esc and the browser back button return to the default view.

## Object → content map
| Object | Opens | How |
|---|---|---|
| Monitor | **Projects** | Fly to the screen. The project gallery renders *on* the screen using drei `<Html transform occlude>` sized to the screen. If the text looks blurry or scrolling feels bad, fade in an HTML panel exactly over the zoomed screen instead. |
| Laptop | **Experience** | Same technique, in a code-editor look (the timeline types in line by line unless reduced motion is on). |
| Keyboard | **Skills** | Fly above the keyboard. The 3D keycaps light up in a ripple, and an HTML panel above the keyboard shows the skill groups as keycap chips. Typing a real key presses the matching 3D key. |
| Phone | **Contact** | The phone "wakes": its screen lights up with a chat UI (Material-style): a bubble "Hey! 👋 Want to work together?" plus quick-reply chips for Email, LinkedIn, GitHub, X, Instagram and Resume. |
| Notebook | **About** | The cover opens and the bio and buttons appear on the page. |
| Deskpulse | **Deskpulse project detail** | The screen always shows a live dashboard. Clicking flies in and shows the project card. |
| Certificate | **Education** | Fly to the wall. Both entries appear on the certificate. |
| Resume sheet | **Download** | Direct download, no fly-in. |
| Switchboard | **Light/dark** | The rocker switch flips with a click animation. **Light** = room lights on, warm and bright. **Dark** = room lights off, with the room lit only by the window, the screens and the keyboard RGB. This also toggles the Tailwind `dark` class used by the panels and plain view. Use the existing `useTheme`. |
| Window | **"Chennai now" card** | A small HTML card, e.g. "4:12 PM · 29°C · light rain", with the line "where I work". |

- **Hover:** a soft outline (drei `<Outlines>`, or a slight emissive lift), a pointer cursor and a small floating label (`<Html>`) such as "Projects".
- **First visit:** a gentle hint pill, "Click anything on the desk ✨", that disappears after the first click.
- The **Recruiter mode** toggle stays visible top-right on every view.

## Living details
- **Sky and light follow the current time in Chennai** (reuse `chennaiTime.js`):
  - dawn 5–7: peach
  - day 7–17: soft blue
  - sunset 17–19: orange-pink
  - night 19–5: deep navy with stars and a moon

  The **main light is a directional "sun" coming through the window towards the room**. Its colour and intensity follow the time of day, so the grille casts soft bar shadows onto the desk during the day. Recompute every minute.
- **Weather:** live from Open-Meteo, no API key: `https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current=temperature_2m,weather_code,is_day`. Cache the result in sessionStorage for 15 minutes (wrap in try/catch). Map the codes to these states:
  - clear
  - cloudy: drifting low-poly clouds, dimmer light
  - fog: scene fog outside
  - rain: instanced rain streaks outside the window, a few droplets running down the glass, a greyer sky
  - thunderstorm: rain plus an occasional lightning flash that briefly lights the room

  If the fetch fails, use clear silently.
- **Deskpulse screen:** a CanvasTexture redrawn every minute, showing the Chennai time (large), a weather icon and temperature, and "Now building: Svik".
- **Small touches:**
  - keyboard RGB cycle
  - tree leaves swaying
  - a faint dust-mote particle drift in the window light beam during the day
  - the monitor screen glow casting a little light on the keyboard at night
- **Reduced motion** (reuse `useReducedMotion`): instant camera cuts, no drift, no sway, no particles, static weather (show a rain tint but no animated streaks), no typing effect.

## Look and lighting
- **Shadows:** drei `AccumulativeShadows` + `RandomizedLight` positioned at the window, baked once at load and re-baked when the time-of-day phase changes. Add `ContactShadows` under small objects. **Avoid expensive real-time shadows.**
- **Environment:** drei `<Environment>` built only from `<Lightformer>`s (no HDR downloads). Tone mapping: ACES. Colour space: sRGB.
- **Materials:** use `MeshStandardMaterial`. Give the screens an emissive map so they glow in dark mode.

## Mobile, fallback and performance
- **Mobile (< 768px):** still 3D if WebGL is available, but with a **fixed camera** (no orbit, so it doesn't fight page scrolling), framed tighter on the desk. Tapping an object opens its section as a **full-screen sheet** styled like that object, not a camera flight. Add a sticky bottom dock with icons for Monitor, Laptop, Keyboard, Phone, Notebook, Certificate, Resume and Switch.
- **Fallback to the existing 2D SVG scene** when WebGL is unavailable, when `navigator.deviceMemory` is below 4 on mobile, or when the 3D chunk fails to load.
- **Device pixel ratio:** `dpr={[1, 1.75]}`; use `PerformanceMonitor` to drop it on slow devices. Pause rendering when the tab is hidden or when the plain view is open.
- **Budget:** the 3D chunk under ~350 KB gzipped, no textures larger than 1024 px, and procedural canvas textures wherever possible. Lighthouse performance ≥ 85 on desktop.
- **Accessibility:** canvas objects can't receive focus, so render a visually hidden (but focus-visible) list of buttons, one per object, in a sensible tab order. Focusing a button highlights its object; Enter opens it. Keyboard shortcuts:
  - 1–8 open the sections
  - Esc goes back
  - P toggles plain view
  - ? shows the shortcuts

  Move focus into an opened section, and return it to the object's button when the section closes.

## Content
Use the existing `src/data/*` files only. Don't invent new facts. Never show my phone number. Don't mention App Store or Play Store releases.

## Phases (stop and wait for my OK after each one)
- **Phase 3, blockout.** Install dependencies, set up `src/three/`, lazy loading and the 2D fallback. Build the room, window and desk, with simple grey boxes for every object at the correct scale and position, and the default camera. Compare against `desk-behind-chair.jpg` and `desk-front.jpg`, and fix proportions before moving on.
- **Phase 4, modelling and look.** Detail every object as specified, then add materials, lighting, baked shadows and the outside backdrop. Show both light and dark mode, in daytime and at night.
- **Phase 5, interactions.** Hover, labels, camera flights, on-screen content for each object, the switchboard theme toggle, hash routing, Esc and back, shortcuts, the accessible button list and focus management.
- **Phase 6, living details.** Chennai sky and sun, live weather and rain, lightning, the Deskpulse live screen, keyboard RGB, idle motion and the reduced-motion behaviour.
- **Phase 7, ship.** Mobile layout and sheets, fallback checks, the performance pass, an `og-image.png` (1200×630) captured from the default 3D view, and a final `npm run build`. Then list anything I still need to provide (the AI Circuit Builder and Deskpulse images, and the Deskpulse tech stack).
