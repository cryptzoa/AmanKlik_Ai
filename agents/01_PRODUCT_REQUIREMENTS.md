# 01 — Product Requirements

## Product
**Name:** AmanKlik AI  
**Tagline:** Pahami risikonya sebelum percaya pesannya.  
**Category:** Digital safety / anti-scam education / explainable AI.

## Problem

People receive suspicious messages, screenshots, and links but often cannot identify manipulation/security cues. AmanKlik focuses on understanding risk **before** unsafe action.

## Objective

Within one short interaction help a user answer:
1. How risky does this content look?
2. What evidence caused the assessment?
3. What manipulation/security patterns are present?
4. What should I safely do next?
5. How uncertain is the assessment?

## Personas

### Student / young adult
Needs fast plain-language explanation of messages claiming to be bank, campus, marketplace, family, courier, etc.

### Family helper
Checks a screenshot received by a relative. Needs upload and an explanation that is easy to relay.

### Competition judge
Needs visible proof of hybrid rules + AI, typed engineering, privacy, tests, deployment, and polished UI.

## Jobs to be done

- Inspect a message before clicking/transferring.
- Inspect a screenshot without retyping it.
- Understand the real registrable domain of a link.
- Receive prioritized safe actions.
- Practice identifying warning signs.

## Differentiators

AmanKlik must be more than an LLM wrapper:
- deterministic URL decomposition;
- deterministic signals;
- Gemini multimodal semantic analysis;
- final score controlled by application code;
- explainable evidence;
- curated guidance;
- no arbitrary execution/fetching of suspicious links.

## User journeys

Text: Landing → Scan → Paste → Analyze → Result → Evidence → Actions → History.  
Screenshot: Landing → Scan → Upload → Validate/preprocess → Analyze → Result.  
URL: Landing → Scan → Paste URL → Static inspection → Result → Domain anatomy.  
Training: Simulator → Branching choices → Score → Feedback.

## Product principles

- Explain, do not merely classify.
- Communicate uncertainty.
- No login gate.
- Progressive disclosure.
- Teach reusable warning signs.
- Minimize retained data.
- Keep demo path short.

## Competition-demo success

Functional:
- text/screenshot/URL scans work;
- result is understandable;
- simulator/history work;
- errors degrade gracefully.

UX:
- first-time user starts scan without instruction;
- result meaning clear at a glance;
- mobile works.

Engineering:
- build/tests pass;
- keys server-side;
- no raw screenshot storage;
- URL scanner does not fetch target.

Presentation:
- landing creates impact;
- result reveal is main wow moment;
- architecture explained in <1 minute.

## Non-goals

No:
- direct police/bank reporting;
- bank-account freezing;
- guaranteed URL safety;
- suspicious-site browsing;
- deepfake diagnosis;
- criminal identification;
- device/background monitoring.
