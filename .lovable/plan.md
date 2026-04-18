

## The Stack — Floating Wave of Brand Logos

Replace the current grid (Section 7) with a single horizontal wave of circular logo bubbles, like the reference image. Light background, very subtle motion, gently reacts to the cursor.

### Visual concept
- One horizontal row of 8 circular pills, vertically offset along a soft sine wave.
- Each circle: white/very-light bg, soft shadow, 1px border, real brand logo centered.
- Continuous gentle bobbing animation (sine wave), each circle phase-shifted so the whole row breathes like a wave.
- **Cursor repel**: circles within ~140px of the cursor smoothly drift away from it (eased), then return. Very tenue, no jumps.
- LIVE = subtle green dot top-right of the circle. Pending = amber dot.
- Hover a circle → small elegant tooltip above it: name · role · status.

### Section frame
- Switch from dark to **light bg** (`#FAFAFB`) to match reference image aesthetic.
- Eyebrow: "The Stack · Live" · headline: "8 services. 1 unified pipeline." · subtext one line.
- Below the wave: thin caption row "n8n · Claude · BC · Dropbox · M365 · Doppler · Power BI · Notion".

### Logos (SVG, no extra deps)
Use official brand SVGs saved locally to `public/logos/`:
- n8n, claude (Anthropic), microsoft (M365), dynamics-bc, dropbox, doppler, power-bi, notion

Each rendered as `<img src="/logos/{slug}.svg">` inside the circle. Monochrome dark fallback if a logo fails.

### Technical implementation

**New file**: `src/components/hub/StackWave.tsx`
- Component holds an array of 8 stack items (pulled from `src/data/program.ts` `stack`, mapped to logo slug).
- Uses a single `requestAnimationFrame` loop driving:
  - `baseY = amplitude * sin(time * speed + i * phase)` per item (idle wave)
  - `mouse repel`: `dx = cx - mouseX`, `dy = cy - mouseY`, `dist`. If `dist < radius (140)`, push along the vector with strength `(1 - dist/radius) * 28px`, eased.
  - Lerp current offset toward target each frame for smoothness (factor 0.12).
- Items are absolutely positioned within a relative container of fixed height (~220px desktop, ~360px mobile stacked into 2 rows).
- `pointermove` listener on the container; on `pointerleave` targets reset to 0.
- Respect `prefers-reduced-motion`: disable RAF, render static positions.

**Tooltip**:
- On hover, render an absolute-positioned card above the circle with name, role, LIVE/Pending chip. Framer Motion fade+lift (`y: 4 → 0`, 180ms).

**Responsive**:
- `<md`: switch to 2 rows of 4 with smaller amplitude (still wave-animated).
- Touch devices: skip cursor repel, keep idle wave only.

**Edit `src/pages/Hub.tsx`**:
- Replace Section 7 block (lines ~408–end of stack grid) with `<StackWave />`.
- Remove unused `STACK` constant + related lucide imports if no longer referenced.

**Logo assets**:
- Add 8 SVGs in `public/logos/`. If any official mark is unavailable, use a clean monogram (e.g., "n8n" wordmark for n8n already free; "BC" for Business Central, etc.).

### Out of scope
- No new libs (pure CSS + RAF + existing framer-motion for tooltip).
- No backend changes.
- Other sections untouched.

