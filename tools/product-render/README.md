# Product photo renderer

Renders the 3D product photos in `New Website Arch/assets/img/products/<SKU>.webp`
(glass vials, amber droppers, nasal sprays, capsule bottles, powder jars) with three.js.

## Re-render or add products
1. `cd tools/product-render && npm install` (three.js + Inter font)
2. Build `specs.json` — one entry per product size:
   `{"sku":"BPC-10","form":"vial","lines":["BPC-157"],"strength":"10MG","accent":"#3f8f6a"}`
   Forms: `vial`, `dropper`, `nasal`, `caps`, `powder`. The site's `artForm`, `artStrength`,
   `artNameLines` and `CAT_ACCENT` in `assets/js/app.js` produce these values.
3. `python3 -m http.server 8790 &` then `python3 batch.py` (needs Playwright + Pillow).
   Existing files in `out/` are skipped; delete one to re-render it.
4. Copy `out/*.webp` into `New Website Arch/assets/img/products/` and add the SKUs to
   `window.PRODUCT_PHOTOS` at the end of `assets/js/data.js`.

Sizes without a photo fall back to the drawn SVG art automatically.
