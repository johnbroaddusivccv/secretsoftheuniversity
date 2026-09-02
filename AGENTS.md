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
- Colors: bg #070713, bg2 #0d0d24, ink #e8e6f5, muted #9b97b8, gold #f0c96c, violet #8b7cf7
- Type: Georgia serif for prose; Helvetica for labels/UI (uppercase, letter-spaced)
- Motifs: ✦ glyph, gold redaction bars (hover to reveal), 100px-radius pill buttons

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
