# Chemical data for the shop

`shop/assets/js/chemdata.js` (the "Chemical data" panel on each chemical's product page) and the
structure drawings in `shop/assets/img/structures/` are generated here.

- `batch1-4.json` — identifiers copied from each compound's public record (mostly English Wikipedia
  infoboxes, one PubChemLite entry), with the source URL and notes on salts and gaps.
- `verify.py` — checks and builds the site data with RDKit (`pip install rdkit`):
  - **verified**: the SMILES reproduces the published InChIKey; formula and weight are computed from it
    and SMILES/InChIKey are shown.
  - **verified (skeleton)**: matches except the stereo layer; the published InChIKey is shown, SMILES isn't.
  - **formula-checked structure**: the page had no SMILES; a structure was written in `GAPFILL` and kept only
    because it reproduces the page's formula and weight. Drawing shown, SMILES/InChIKey not.
  - otherwise only the page's identifiers, formula and weight are shown, with no drawing.
  - `FIXES` corrects transcription problems found on the source pages.
- Products sold as a salt show identity data for the parent compound and hide its physical properties.

Run: `python3 tools/chem-data/verify.py tools/chem-data .`
No public record (left without the panel): GB-115, ATX-304, ACD856 (structure undisclosed), ART27.13,
Lemairamin, Tetramethoxyluteolin, NA-Selank, NA-Semax, Vilon, SkQ1, MEPB, ORG-43902, 3HP, PP30, Alpha Mannans.
