# Agent Instructions — Secrets of the University

Working rules for AI agents on this codebase. Read README.md first for project overview.

## Architecture rules
- Single-file pages: all CSS and JS stay inline in each .html file. No build step, no frameworks, no npm.
- No localStorage/sessionStorage. External scripts from CDN only (currently: TradingView embed on finance.html, CodeMirror 5 on careers.html).
- Pages link relatively — keep all .html files in the root directory.
- Every page must include the canvas starfield and the shared CSS variables (copy the `:root` block and starfield script from index.html).

## Voice rules (strict)
- Register: minimal, cryptic, wisdom-literature cadence. Short declarative lines. No exclamation points, no marketing hype words ("amazing", "unlock your potential").
- Scripture allusions are woven in, never preachy: they must read as pure copy to someone who doesn't know the source. Only ONE visible citation exists on the site (Proverbs 25:2 in the manifesto) — do not add chapter-and-verse citations elsewhere.
- CTAs are one word where possible ("Knock", "Seek", "Enter").
- The brand persona is "The Registrar". The site never explains itself directly.

## Design tokens
Sibling system: this site, the Broaddus Commerce site (`shop/`, at /shop) and Shortage Watch (`shortage/`, at /shortage) share one visual language — powder blue, Inter, square corners, neumorphic surfaces. Georgia is the University's voice and is what sets this site apart.
- Shared palette (Oct 2026): the homepage, `shop/` and `shortage/` use one look. Light is the default.
- Colors (light, default, `html.light`): bg #dbe7f2, bg2 #d1e0ee, ink #14263a, muted #46607a, accent (`--gold`) #1d4e6e, steel (`--violet`) #46607a
- Colors (dark, cookie theme=dark): bg #1f262d, bg2 #252e37, ink #e3eaf0, muted #9aa9b6, accent (`--gold`) #8fbbd9, steel (`--violet`) #7f9bb5
- Neumorphism: panels are raised with `--sd`/`--sl` shadows (7px 7px 16px / -7px -7px 16px), fields are pressed in (inset shadows). No borders on panels.
- `--gold` and `--violet` keep their old names for compatibility.
- Text on an accent-filled button uses `color: var(--bg)` so it flips with the theme.
- Semantic colors stay: #5fd08a (up / normal), #e2708a (down / flag). Use them only for meaning, never decoration.
- Type: Inter (`--font-sans`) for UI, labels, buttons, forms, and body copy. Georgia (`--font-voice`) for the wordmark, headlines, scripture, fragments, and quotes.
- Shape: square corners (radius 0) on cards, buttons, inputs; 50% only for true circles. Soft neumorphic shadows instead of 1px rules.
- Motifs: ✦ glyph, ink redaction bars (hover to reveal), solid ink buttons with reversed hover

## Do not
- Do not add TikTok links (brand decision).
- Do not make the signup forms claim to work — they are front-end only until a form service is wired. Keep the code comment saying so.
- Do not add financial advice claims; keep the disclaimer on finance.html.

## Skydell Medical compliance rails (strict — override style rules)
- The site owner is an independent sales partner of Skydell Medical (skydellmedical.com). This must be disclosed plainly on health.html.
- The "Declared Interest" section on health.html must use plainly factual language — regulatory-sensitive content must not be mysterious.
- Required disclosure line: "I am an independent sales partner of Skydell Medical and may be compensated for referrals."
- Required audience gate: "Product information is intended for licensed healthcare professionals."
- NO treatment or cure claims for any condition. NO pricing on the public site. NO patient testimonials.
- Do not reference or include any internal documents (price lists, sales guides, trackers, projections, COAs).
- Regenerative products (stem cells, exosomes) are practitioner-administered; note they are not FDA-approved to treat specific diseases.
- Keep the health disclaimer in the footer; it must cover both peptides and regenerative biologics.

## Current priorities (in order)
1. Wire signup forms to an email service
2. ~~Build systems.html~~ ✓ Built with network-node animation, light/dark toggle, anatomy tiles, six lesson cards, Hacker News feed, nine curated gates, Palantir-style footer
3. Real social links in footers
4. ~~Resume Lab page~~ ✓ Built into careers.html (CodeMirror 5 stex mode + Overleaf `encoded_snip` POST handoff)
5. ~~health.html~~ ✓ Built with vital signs, lab ranges, peptide protocols, Skydell partnership, and curated links
