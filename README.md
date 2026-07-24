# Secrets of the University

Static website for secretsoftheuniversity.com — an education/insight brand: "the curriculum school skipped," with a mysterious, scripture-inflected voice (all-inclusive tone with subtle Christian influence).

## Brand voice
- Motto: "The heavens declare what the university withheld." (Psalm 19:1 allusion)
- Register: minimal, cryptic, wisdom-literature cadence (Proverbs, Ecclesiastes, Matthew's "ask/seek/knock")
- Visual: cosmic dark theme — navy/ink (#070713), gold (#f0c96c), violet (#8b7cf7), Georgia serif, animated canvas starfield
- One-word CTAs: "Knock", "Seek"

## Files
- `index.html` — homepage. Hero + email signup, Four Departments (Finance/Health/Careers/Systems), "Recovered Fragments" with hover-reveal redactions, manifesto (Proverbs 25:2), footer (Matthew 10:8). Single file, no dependencies.
- `finance.html` — Department of Finance. TradingView ticker tape + hotlist widget (top gainers/losers/active), custom vertical crypto ticker (CoinGecko API, 60s refresh), full-viewport angel numbers ambient layer (45 numbers, multi-directional drift, ghostly opacity), live Hacker News feed (Top/New/Best/Ask/Show tabs, top 7, free API), nine curated investor gates, six lesson-teaser cards, Palantir-style footer, disclaimer.
- `health.html` — Department of Health. Animated vital signs strip (HR, BP, glucose, SpO₂), six health lesson cards, Skydell Medical partnership section (Declared Interest — factual disclosure, timeline, compliance rails, mailto CTA), interactive lab reference ranges (Metabolic/Lipids/Thyroid tabs), peptide overview + three featured compounds (Retatrutide, BPC-157, NAD+), full product catalog (3-column), interactive price comparison tool, Who We Serve cards, responsible use callout, contact/about section with payment methods, Calendly embed (placeholder), nine curated health links. Includes sales partner disclosure and FDA compliance language throughout. Palantir-style footer.
- `careers.html` — Department of Careers. Six career-lesson cards, embedded Resume Lab (CodeMirror 5 LaTeX editor with Overleaf `encoded_snip` handoff via POST form), Palantir-style footer.

## Known TODOs
- Email signup is front-end only — needs a form service (Mailchimp/Buttondown) wired to the forms
- Social links in footers are placeholder `#`
- Department pages for Systems not yet built (Finance, Health, Careers are live)
- Hosting: static — Netlify / Cloudflare Pages / GitHub Pages all work as-is

## Conventions
- Single-file pages: all CSS/JS inline, no build step
- No localStorage; CDN scripts only (TradingView on finance.html, CodeMirror 5 on careers.html)
- Keep all files in the same directory (relative links between them)
- Resume Lab pattern: CodeMirror 5 (stex mode) from cdnjs, Overleaf handoff via POST to `https://www.overleaf.com/docs` with `encoded_snip` (URL-encoded LaTeX), opens in new tab
