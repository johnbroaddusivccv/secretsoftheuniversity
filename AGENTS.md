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
Sibling system: this site and the Broaddus Commerce site (`New Website Arch/`) share one visual language — cool monochrome, Inter, square corners. Georgia is the University's voice and is what sets this site apart.
- Colors (dark, default): bg #0a0d12, bg2 #11151c, ink #eef1f5, muted #8b94a3, accent (`--gold`) #f5f7fa, steel (`--violet`) #7d8da3
- Colors (light, `html.light`): bg #f7f8fa, bg2 #eceff3, ink #0e1116, muted #5b6472, accent (`--gold`) #0e1116, steel (`--violet`) #4a5a70
- `--gold` and `--violet` keep their old names for compatibility; they now hold the monochrome accent and steel blue-gray. Do not reintroduce gold or violet hues.
- Text on an accent-filled button uses `color: var(--bg)` so it flips with the theme.
- Semantic colors stay: #5fd08a (up / normal), #e2708a (down / flag). Use them only for meaning, never decoration.
- Type: Inter (`--font-sans`) for UI, labels, buttons, forms, and body copy. Georgia (`--font-voice`) for the wordmark, headlines, scripture, fragments, and quotes.
- Shape: square corners (radius 0) on cards, buttons, inputs; 50% only for true circles. 1px rules instead of glows.
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
