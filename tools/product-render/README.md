# Product photo renderer

Produces the product photos in `shop/assets/img/products/<SKU>.webp`:
path-traced Blender (Cycles) renders of glass vials, amber droppers, nasal sprays,
capsule bottles and powder jars, with the Broaddus Scientific Group label wrapped on each container (boxed BROADDUS
wordmark, tracked SCIENTIFIC GROUP beneath, product name, strength, form line and
research-use notice — layout modelled on EveryChem's understated labels),
in a synthetic studio (HDRI softboxes + strip lights, 100mm macro at f/2.8, film grain,
vignette, slight chromatic aberration).

## Pipeline
1. `pip install bpy==4.2.0 OpenEXR playwright pillow` and `npm install` (three.js + Inter font,
   used only to draw the label artwork).
2. Build `specs.json` — one entry per product size:
   `{"sku":"BPC-10","form":"vial","lines":["BPC-157"],"strength":"10MG","accent":"#3f8f6a"}`
   Forms: `vial`, `dropper`, `nasal`, `caps`, `powder`. The site's `artForm`, `artStrength`,
   `artNameLines` and `CAT_ACCENT` in `assets/js/app.js` produce these values.
3. Label artwork: `python3 -m http.server 8790 &` then `python3 labels.py specs.json`
   → `labels/<SKU>.png`.
4. Studio environment (once): `python3 make_hdri.py $PWD/studio.exr`.
5. Render: `./run_batch.sh` (runs `blender_render.py specs.json bout 48`, ~80 s per image on
   2 CPU cores; resumable — existing files in `bout/` are skipped, delete one to re-render it).
6. Convert `bout/*.png` to WebP (quality 84) into `shop/assets/img/products/` and
   add any new SKUs to `window.PRODUCT_PHOTOS` at the end of `assets/js/data.js`.

Sizes without a photo fall back to the drawn SVG art automatically.
`render.html`/`batch.py` are the older real-time three.js renderer, kept for reference.

## Re-rendering a few SKUs
Dust specks and fingerprints are placed from seeds, so occasionally one lands on the
wordmark. Put the affected entries in `fix.json` and re-render with different seeds:
`DUST_SEED=11 JITTER_SEED=5 python3 blender_render.py fix.json fix 64`, then convert
only those PNGs.
