# 25 — Accessibility and Performance

## Accessibility target

Aim for WCAG 2.2 AA behavior where practical. Keyboard usability and reduced motion are mandatory.

## Semantics
- one logical H1;
- ordered headings;
- buttons are buttons;
- links are links;
- form labels;
- accessible tabs;
- errors associated with fields;
- loading/status live regions used sparingly.

## Focus
- visible ring;
- never remove outline without replacement;
- dialogs trap focus and close with Escape;
- drag/drop always has file-input alternative.

## Color
Risk always has color + text + icon/shape. Check muted/red/purple contrast.

## Motion
Respect `prefers-reduced-motion`.

Reduced:
- no scroll scrub/pin;
- no large transform;
- no required count-up;
- content immediate.

## Screen-reader result order
1. title
2. level + score
3. summary
4. uncertainty/disclaimer
5. evidence
6. URL anatomy
7. action plan
8. feedback

Animation does not change DOM reading order.

## Long content
- URL `overflow-wrap:anywhere`;
- evidence wraps;
- mobile no horizontal scroll;
- long textarea works.

## Performance

Avoid:
- WebGL;
- full-screen video;
- GIF backgrounds;
- second animation framework;
- global loading of every GSAP plugin.

Use:
- Server Components default;
- `next/image`;
- optimized demo screenshots;
- dynamic import heavy landing components when helpful;
- transform/opacity motion.

## Goals

Desktop:
- Performance >=90
- Accessibility >=95
- Best Practices >=95
- SEO >=90

Mobile:
- Performance >=80
- Accessibility >=95

Core `/scan` and `/result` matter more than animation density.

## Fonts
Use `next/font`, only needed weights.

## Images
Landing: dimensions/optimized.  
Upload preview: revoke object URL. Do not store base64 in client state.  
Server: Sharp once.

## JS
No React state updates every animation frame. GSAP owns scoped DOM transforms.

## Test
Cold Railway, throttled network, mobile emulation, provider latency. Scanner remains responsive during request.
