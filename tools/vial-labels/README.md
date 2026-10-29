# Vial labels for the shop

Every product photo in `shop/assets/img/vials/` is the same stock vial with the product's
name, strength and form printed onto its blank label.

Photo: "Injection bottle glass vial with blank white label" by rawpixel.com on Magnific
(free license, attribution required; the credit is in the shop footer). The original photo is
not stored in this repo because the license doesn't allow redistributing it. Download the JPG
from https://www.magnific.com/free-photo/injection-bottle-glass-vial-with-blank-white-label_26678775.htm

## Regenerate after adding or renaming products

    python3 tools/vial-labels/make_vials.py . path/to/vial.jpg shop/assets/img/vials

Add a regex as a fourth argument to render only matching files, e.g. `'^bpc-157'`.
Needs Python 3 with Pillow, Node (to read `catalog.js`) and the Inter font.
File names: chemicals are `<id>.webp`; peptides are `<id>--<size-slug>.webp`.
