# 09 — GSAP Motion Specification

## Principle

Motion communicates hierarchy, causality, state. It never delays interaction.

Use `@gsap/react` `useGSAP()` for scoped lifecycle-safe animation.

## Global
- honor `prefers-reduced-motion`;
- reduced motion removes scrub/large transforms;
- kill ScrollTriggers on unmount;
- scoped selectors;
- transform/opacity over layout properties.

## Landing hero

Sequence:
1. nav/wordmark;
2. SplitText headline line masks;
3. support copy;
4. CTA;
5. ambient fictional message field.

Target total ~1.2–1.8s; CTA clickable when visible.

Message fragments drift slowly. Scroll emphasizes OTP/TRANSFER/NOMOR BARU/SEKARANG.

## Scroll story
May:
- reveal;
- pin max one major section at once;
- scrub visuals while text readable.

Do not:
- hijack wheel/touch;
- nested scroll;
- pin entire page for long;
- require precision.

## Scanner
Restrained:
- tab indicator;
- dropzone transitions;
- submit states;
- real stage reveal.

## Analysis stages
Driven by actual state:
- validating
- preprocessing
- checking_rules
- ai_analysis
- finalizing

Never fake 0–100 progress.

## Result reveal
1. risk label;
2. count score to final ~0.7s;
3. meter/ring;
4. summary;
5. evidence stagger;
6. actions.

Reduced motion: immediate.

## URL anatomy
Animate emphasis toward registrable domain, then leave meaning visible.

## Cursor/magnetic — P2
- desktop fine pointer only;
- disabled touch/reduced motion;
- never form fields;
- subtle displacement.

## Route transitions
No complex transition framework. Prefer page-local entry animation.

## Performance checklist
- no permanent `will-change` across many nodes;
- cleanup;
- transforms/opacity;
- no per-frame React state;
- no giant SplitText target.

## QA
Test navigation, back/forward, reduced motion, mobile, keyboard, slow analysis. No duplicate ScrollTriggers.
