# 08 — Design System

## Art direction

**Digital Trust × Editorial × Cyber Intelligence**

Avoid:
- Matrix green;
- hacker clichés;
- terminal spam;
- generic glassmorphism;
- default shadcn/SaaS styling.

Feel: calm, intelligent, premium, protective.

## Palette

```css
:root {
  --canvas: #f3f1ea;
  --surface: #fffdf7;
  --ink: #111111;
  --muted: #6f6c65;
  --line: rgba(17,17,17,.14);
  --risk: #ff4038;
  --warning: #ffb224;
  --safe: #19a974;
  --ai: #635bff;
  --risk-soft: #ffe4e1;
  --warning-soft: #fff0ca;
  --safe-soft: #dff6ea;
  --ai-soft: #ebe9ff;
}
```

## Typography

Recommended:
- Display/body: Manrope.
- Technical labels: IBM Plex Mono or comparable open-source mono.

Use `next/font`.

Fluid:
- hero: `clamp(3.5rem, 10vw, 9rem)`;
- page title: `clamp(2.25rem, 5vw, 5rem)`;
- body: 1–1.125rem;
- important small text not <14px.

## Grid
Desktop:
- conceptual 12-col;
- max ~1440;
- utility ~1180;
- result reading ~900–1100.

Mobile:
- 16–20px padding;
- stack cards.

## Shapes
- primary panels 20–28px;
- controls 10–14px;
- badges pill;
- avoid making every section a rounded floating card.

## Shadows
Sparse. Prefer lines/tones.

## Buttons
Primary high contrast, min 44px.  
Secondary clear outline.  
Visible hover/focus.

## Inputs
Visible labels, focus rings, adjacent errors. Placeholder is not label.

## Risk language
Never color only:
- Low: green + text/icon;
- Medium: amber + text/icon;
- High: red/orange + text/icon;
- Very High: red + text/icon.

LOW is not called "Safe".

## AI language
Purple accent for AI source, but deterministic evidence gets equal visual authority.

## Evidence card order
1. source/severity;
2. title;
3. evidence;
4. explanation;
5. optional technical detail.

## URL anatomy
Segments:
- protocol muted;
- subdomain muted;
- registrable domain emphasized;
- path muted.

Text explicitly states actual domain.

## Loading
Event-driven stages, not fake result skeleton/percentage.

## Icons
Lucide for utilities only. Hero uses custom type/CSS composition.

## Texture
Optional subtle grain, very low opacity.

## Voice
Indonesian:
- direct;
- calm;
- educational;
- non-judgmental;
- no fearmongering.

Good: `Pesan ini menggunakan tekanan waktu.`  
Bad: `BAHAYA! ANDA HAMPIR DITIPU!!!`
