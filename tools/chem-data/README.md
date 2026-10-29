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

## Peptides (`peptides/`)
Run after `verify.py`: `python3 tools/chem-data/peptides/pep_verify.py tools/chem-data/peptides . tools/chem-data`
It merges peptide records into the same `chemdata.js` (keyed by peptide id).
- **verified**: SMILES reproduces the published InChIKey (small and short molecules; drawing if ≤60 heavy atoms).
- **sequence-checked**: the sequence, built residue by residue with RDKit plus common end-modifications
  (amide, acetyl, disulfides, lactam, pyroglutamate), reproduces the published formula. The page's sequence is tried
  first, then the catalog's (this caught a transcription error on Thymosin α1).
- **record**: lipidated, very large or non-standard-residue molecules; shown as published and labelled so.
- Held back: TB-500 (catalog = full thymosin β4; public record = Ac-LKKTETQ fragment) and PEG-MGF (record is
  non-PEGylated MGF). No public record: Kisspeptin-10, Thymalin, Follistatin 344, the blends, Cerebrolysin.
- Catalog corrections made from this check: Ara-290 sequence, SNAP-8 and Larazotide formulas, IGF-1 DES CAS
  (old number failed the CAS check digit), Pinealon subtitle.
