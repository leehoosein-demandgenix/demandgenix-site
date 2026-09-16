---
target: the home page
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:/Users/leehoosein/demandgenix-site-new/src/pages/index.astro"
target_fingerprint: "sha256:e9959df73714e47fb4ef997caab2284ead840f4c6034f35f49678b1479edf3fe"
target_path: /Users/leehoosein/demandgenix-site-new/src/pages/index.astro
timestamp: 2026-09-16T09-22-31Z
slug: src-pages-index-astro
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Third-party script (static.claydar.com/init.v1.js) fails CORS on every page load |
| 2 | Match System / Real World | 3 | "Select your biggest challenge to see the recommended path" promises filtering that doesn't happen |
| 3 | User Control and Freedom | 2 | Mobile menu isn't fixed/scroll-locked; content bleeds through when opened after scrolling |
| 4 | Consistency and Standards | 2 | Skipped heading level (h2->h4) in Testimonials; nested cards in Services; uneven bullet counts |
| 5 | Error Prevention | 1 | CTA color fails WCAG AA contrast (3.6:1) on all 4 repeats; duplicated-punctuation rendering bug |
| 6 | Recognition Rather Than Recall | 4 | Identical CTA repeated at Hero, SafetyNet, Contact |
| 7 | Flexibility and Efficiency | n/a | Single linear conversion path correct for Persuade mode |
| 8 | Aesthetic and Minimalist Design | 3 | Clean overall; nested cards and unused decorative CSS |
| 9 | Error Recovery | 2 | No form to test; unnoticed copy bug and silent CORS failure |
| 10 | Help and Documentation | n/a | Appropriately absent for Persuade mode |
| **Total** | | **20/32** | **Acceptable (62.5%)** |

## Design Specificity Verdict

Self-diagnosing solution cards staged by company maturity, named logos, UK company/VAT number: real authorship. But Testimonials shows LinkedIn praise for "Lee" personally, not company outcomes, directly under "Client case studies coming Q2 2026..." - unproven personal-brand content standing in for company proof at the highest-stakes trust moment.

Detector: 1 CLI finding (overused-font), 10 browser-overlay anti-patterns (4x low-contrast on CTA orange, 2x ai-color-palette likely mislabeled as cyan when actually green/orange, 1x radial-spotlight-glow, 3x nested-cards in Services, skipped-heading-level in Testimonials).

## Priority Issues

**[P1] Primary CTA fails WCAG AA contrast, everywhere it appears** - white-on-#ea580c measures 3.6:1 (need 4.5:1), repeated 4x (Header, Hero, SafetyNet, Contact). Fix: darken orange or adjust treatment, verify 4.5:1+.

**[P1] About-section text is invisible under system dark mode** - #about has no explicit background while text uses text-gray-900; no dark-mode CSS anywhere on site. Fix: add explicit bg-white or meta color-scheme light.

**[P1] Testimonials undercut the exact claim they exist to support** - LinkedIn praise for "Lee" personally sits under "Client case studies coming Q2 2026...". Fix: hold section until real case studies exist, or reframe heading.

**[P1] Mobile menu doesn't behave like an overlay when scrolled** - not position:fixed, no body scroll lock; Contact/Footer content visible underneath when opened after scrolling. Fix: make panel fixed inset-0, lock body scroll.

**[P2] Duplicated-punctuation bug in reassurance copy** - SafetyNet renders "...call. ." confirmed on desktop and mobile. Fix: use CMS string's own trailing punctuation instead of hardcoding one after split/join.

## Persona Red Flags

**Jordan (First-Timer)**: cookie-consent blur competes for attention immediately; lozenge selector promises filtering that doesn't happen; reads praise for "Lee" before the page introduces who he is.

**Riley (Stress-Tester)**: flags "coming Q2 2026" as a credibility gap under testimonials; notices SafetyNet double-period as evidence of low attention to detail; hits About-section black-on-black failure in dark mode.

**Casey (Distracted Mobile User)**: Hero CTA in first viewport (good); Pipeline Diagnostic card's 5 bullets vs siblings' 2/4 makes the section run long; mobile menu content bleeds through when opened after scrolling.

## Minor Observations

- global.css forces `* { font-weight: 300 !important; }` site-wide, fragile.
- Skipped heading level in Testimonials breaks screen-reader outline.
- Unused decorative CSS (.section-noise, .corner-accent, .accent-border) not referenced by any home-page component.
- Third-party script fails CORS every load, unconditional outside consent gate in Layout.astro:196.
- Hero image alt text is unedited AI-description filler.
- Nested "BEST FOR:" boxes inside each Services card add a visual layer without information.
- Footer illustration credit carries equal weight to copyright line.
- prefers-reduced-motion correctly respected for animated gradients - preserve when touching Hero/SafetyNet.

## Questions to Consider

- Is the "111% pipeline value increase in 90 days" claim verifiable today, and if so should the trust layer be rebuilt around it?
- Was real filtering for the lozenge selector cut for time, or was highlighting always the intent?
- Has anyone viewed this page with system dark mode on?
