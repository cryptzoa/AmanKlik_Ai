# 30 — Pre-Demo Checklist

## 24–48 hours before
- [ ] feature freeze
- [ ] no major upgrades
- [ ] main deployed
- [ ] full unit
- [ ] P0 E2E
- [ ] build
- [ ] Lighthouse recorded
- [ ] mobile QA
- [ ] original guidebook rechecked
- [ ] presentation links correct

## Same day
- [ ] Railway healthy
- [ ] Postgres healthy
- [ ] Gemini key valid
- [ ] free-tier quota available
- [ ] `AI_MODE=live`
- [ ] synthetic screenshot
- [ ] demo text
- [ ] demo URL
- [ ] optional live cache prewarmed
- [ ] browser extensions controlled
- [ ] zoom/projector tested
- [ ] backup network if team has one
- [ ] Railway fallback domain bookmarked

## Five-minute smoke
1. `/api/health`
2. landing
3. text
4. screenshot
5. URL
6. history
7. simulator
8. console

## Browser safety
Keep: landing, health, optional GitHub/test proof.

Do not display:
- AI Studio secret key;
- Railway Variables;
- DB credentials;
- private chat.

## Recovery

Landing animation glitch → refresh; product remains usable.  
AI failure → text/URL degraded; screenshot switches to text if needed.  
Custom domain issue → Railway fallback.  
DB failure → fix; do not pretend persistence.

## After smoke
Do not deploy cosmetic changes unless fixing a real demo blocker.
