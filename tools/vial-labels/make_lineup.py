"""Store lineup photo for the homepage (assets/img/store-lineup*.webp), built from the same source photos and labels as the shop images.
Usage: python3 make_lineup.py <repo> <dir with the source photos> <out.png>  (source photos are not committed)."""
import sys, os, re, numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageChops
from scipy import ndimage
repo, srcdir, out = sys.argv[1], sys.argv[2], sys.argv[3]
# reuse the label artwork and source photos from the shop generator (functions only, not its batch run)
code = open(os.path.join(repo, 'tools/vial-labels/make_vials.py')).read()
code = code[:code.index("os.makedirs(outdir, exist_ok=True)\njobs = []")]
g = {}
sys.argv = ['x', repo, os.path.join(srcdir, 'vial.jpg'), '/tmp/unused']
exec(compile(code, 'make_vials', 'exec'), g)
label, W0, ImageChops = g['label'], g['W'], g['ImageChops']

def labelled(img, box, name, strength, form, shade=None):
    lx0, ly0, lx1, ly1 = box; lw, lh = lx1 - lx0, ly1 - ly0
    art = label(name, strength, form, H=round(W0 * lh / lw)).resize((lw, lh), Image.LANCZOS)
    region = img.crop(box).convert('RGB')
    if shade == 'paper':      # opaque paper with wrap shading (jar, dropper)
        sh = Image.new('L', (lw, 1))
        for x in range(lw):
            t = (x - lw * 0.46) / (lw / 2); sh.putpixel((x, 0), max(150, min(255, round(250 - 78 * t * t))))
        paper = ImageChops.multiply(art, Image.merge('RGB', (sh.resize((lw, lh)),) * 3))
    else:                     # printed onto a light surface: keep its shading
        paper = ImageChops.multiply(region, art)
    if img.mode == 'RGBA': paper = paper.convert('RGBA'); paper.putalpha(img.crop(box).getchannel('A'))
    img.paste(paper, (lx0, ly0))
    return img

def dropper(name, strength):
    k = 3.2; b = g['DROPPER']; bot = b.resize((round(b.width * k), round(b.height * k)), Image.LANCZOS)
    bot = labelled(bot, tuple(round(v * k) for v in (199, 368, 313, 505)), name, strength, 'Solution', 'paper')
    return bot.crop(bot.getchannel('A').getbbox())

def gel(name, strength):
    k = 3; b = g['GEL']; bot = b.resize((b.width * k, b.height * k), Image.LANCZOS)
    bot = labelled(bot, (12 * k, 470 * k, 292 * k, 940 * k), name, strength, 'Topical gel')
    return bot.crop(bot.getchannel('A').getbbox())

def spray(name, strength):
    img = g['SPRAY'].copy(); k = img.width / 1400; P = lambda *v: tuple(round(x * k) for x in v)
    img = labelled(img, P(892, 560, 1169, 850), name, strength, 'Spray solution')
    region = img.crop(P(800, 115, 1215, 1058))                       # right bottle only, above its floor shadow
    a = np.asarray(region.convert('L')) < 251
    split = round((878 - 800) * k)                                   # nozzle stem | bottle body: filled separately so the
    left = ndimage.binary_fill_holes(ndimage.binary_closing(a[:, :split], iterations=2))   # white gap between them stays open
    right = ndimage.binary_fill_holes(ndimage.binary_closing(a[:, split:], iterations=4))
    a = np.concatenate([left, right], axis=1)
    lab, n = ndimage.label(a); sizes = ndimage.sum(a, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z > 0.004 * sizes.max()])   # bottle and nozzle, not specks
    mask = Image.fromarray((keep * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))
    region = region.convert('RGBA'); region.putalpha(mask)
    return region.crop(mask.getbbox())

def jar(name, strength):
    img = g['JAR'].copy(); jx0, jx1 = 857, 1718
    lw = round((jx1 - jx0) * 0.68); lh = round(lw * 0.95); lx0 = round((jx0 + jx1) / 2 - lw / 2)
    img = labelled(img, (lx0, 862, lx0 + lw, 862 + lh), name, strength, 'Powder', 'paper')
    a = np.asarray(img.convert('L')).astype(int)
    m = a < 150                                                      # jar body incl. its lighter rim highlights
    m[862:862 + lh, lx0:lx0 + lw] = True
    m[1521:, :] = False                                              # stop at the jar's base: no floor shadow or reflection
    keep = np.zeros_like(m); keep[:745, 826:1752] = True; keep[745:, 853:1723] = True   # lid is wider than the body
    m &= keep                                                        # (the photo's cast shadow sits outside these)
    m = ndimage.binary_opening(m, iterations=3)                      # drop thin shadow wisps
    m = ndimage.binary_fill_holes(ndimage.binary_closing(m, iterations=2))
    lab, n = ndimage.label(m); big = np.argmax(ndimage.sum(m, lab, range(1, n + 1))) + 1
    mask = Image.fromarray(((lab == big) * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))
    img = img.convert('RGBA'); img.putalpha(mask)
    return img.crop(mask.getbbox())

def vial_tile(fname):
    """Clear glass can't be cut out cleanly, so keep the vial on its own grey with soft edges."""
    im = Image.open(os.path.join(repo, 'shop/assets/img/vials', fname)).convert('RGB')
    a = np.asarray(im).astype(int); bg = np.median(a[:16, :16].reshape(-1, 3), axis=0)
    im = Image.fromarray(np.clip(a + (np.array([242, 242, 242]) - bg), 0, 255).astype('uint8'))
    im = im.crop((95, 0, 625, 712))
    w, h = im.size; f = 60
    ramp = lambda n: np.clip(np.arange(n) / f, 0, 1)
    al = np.minimum(ramp(w), ramp(w)[::-1])[None, :] * np.minimum(ramp(h), np.ones(h))[:, None]
    im = im.convert('RGBA'); im.putalpha(Image.fromarray((al * 255).astype('uint8'))); return im

Wc, Hc, FLOOR = 2000, 820, 760
canvas = Image.new('RGB', (Wc, Hc), (242, 242, 242))
shadow = Image.new('L', (Wc, Hc), 0); sd = ImageDraw.Draw(shadow)
# (image, height on canvas, centre x, has its own floor shadow)
items = [
    (dropper('Noopept', '20mg/mL'), 450, 0.13, False),
    (vial_tile('bpc-157--10mg.webp'), 580, 0.315, True),
    (jar('Piracetam', '150g'), 370, 0.50, False),
    (spray('Semax', '2mg/mL'), 520, 0.68, False),
    (vial_tile('tirzepatide--10mg.webp'), 580, 0.865, True),
]
placed = []
for im, h, cxr, own in items:
    sc = h / im.height; im = im.resize((round(im.width * sc), h), Image.LANCZOS)
    x = round(Wc * cxr - im.width / 2); y = FLOOR - h if not own else FLOOR + 22 - h
    if not own: sd.ellipse((x + im.width * .08, FLOOR - 14, x + im.width * .92, FLOOR + 16), fill=120)
    placed.append((im, x, y))
canvas.paste(Image.new('RGB', (Wc, Hc), (198, 198, 200)), (0, 0), shadow.filter(ImageFilter.GaussianBlur(16)))
# glass vials (with their soft-edged backdrop) first, cut-out products on top so nothing gets faded
order = [i for i, it in enumerate(items) if it[3]] + [i for i, it in enumerate(items) if not it[3]]
for i in order:
    im, x, y = placed[i]; canvas.paste(im, (x, y), im)
canvas = canvas.crop((0, 150, Wc, Hc))                              # trim the empty sky above the lineup
canvas.save(out)
print(canvas.size)
