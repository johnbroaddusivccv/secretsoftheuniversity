import json, re, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageChops
repo, photo, outdir, only = sys.argv[1], sys.argv[2], sys.argv[3], (sys.argv[4] if len(sys.argv) > 4 else None)
F = '/usr/share/fonts/opentype/inter/'
font = lambda w, n: ImageFont.truetype(F + {'b': 'Inter-Bold.otf', 's': 'Inter-SemiBold.otf', 'm': 'Inter-Medium.otf', 'r': 'Inter-Regular.otf', 'x': 'Inter-ExtraBold.otf'}[w], n)
cat = json.loads(subprocess.check_output(['node', '-e', "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.CATALOG))", repo + '/shop/assets/js/catalog.js']))
BASE = Image.open(photo).convert('RGB')
L, T, R, B = 778, 1157, 1780, 2104           # the blank label on the 2576px photo
W, H = R - L, B - T
INK = (24, 25, 28)
slug = lambda s: re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def fit(draw, text, weight, size, maxw, minsize=40):
    while size > minsize:
        f = font(weight, size)
        if draw.textlength(text, font=f) <= maxw: return f
        size -= 4
    return font(weight, minsize)

def wrap_name(draw, name, maxw):
    """One line if it fits at a good size, otherwise two balanced lines."""
    f = fit(draw, name, 's', 150, maxw, 96)
    if draw.textlength(name, font=f) <= maxw: return [name], f
    words = name.split(' ')
    if len(words) == 1:
        return [name], fit(draw, name, 's', 150, maxw, 52)
    best = min(range(1, len(words)), key=lambda i: abs(len(' '.join(words[:i])) - len(' '.join(words[i:]))))
    lines = [' '.join(words[:best]), ' '.join(words[best:])]
    size = 132
    while size > 52:
        f = font('s', size)
        if all(draw.textlength(l, font=f) <= maxw for l in lines): break
        size -= 4
    return lines, font('s', size)

def spaced(draw, xy, text, f, track, anchor_center=True):
    widths = [draw.textlength(c, font=f) for c in text]
    total = sum(widths) + track * (len(text) - 1)
    x = xy[0] - total / 2 if anchor_center else xy[0]
    for c, w in zip(text, widths):
        draw.text((x, xy[1]), c, font=f, fill=INK); x += w + track
    return total

def label(name, strength, form, H=H):
    layer = Image.new('RGB', (W, H), (255, 255, 255))
    d = ImageDraw.Draw(layer)
    cx, maxw = W / 2, W * 0.78
    # wordmark box
    fw = font('x', 46); tw = spaced(ImageDraw.Draw(Image.new('RGB', (1, 1))), (0, 0), 'BROADDUS', fw, 12)
    bx0, by0 = cx - tw / 2 - 26, 70
    d.rectangle([bx0, by0, cx + tw / 2 + 26, by0 + 78], outline=INK, width=5)
    spaced(d, (cx, by0 + 12), 'BROADDUS', fw, 12)
    spaced(d, (cx, by0 + 98), 'SCIENTIFIC GROUP', font('s', 22), 9)
    d.line([cx - 330, 238, cx + 330, 238], fill=(150, 152, 158), width=2)
    # name
    lines, fn = wrap_name(d, name.upper(), maxw)
    lh = fn.size * 1.12
    y = H * 0.5 - (len(lines) * lh) / 2
    for ln in lines:
        d.text((cx, y), ln, font=fn, fill=INK, anchor='mt'); y += lh
    # strength and form
    fs = fit(d, strength, 'm', 78, maxw, 40)
    d.text((cx, y + 26), strength, font=fs, fill=(52, 54, 58), anchor='mt')
    spaced(d, (cx, y + 26 + fs.size + 30), form.upper(), font('s', 26), 6)
    # foot
    d.line([cx - 330, H - 118, cx + 330, H - 118], fill=(150, 152, 158), width=2)
    spaced(d, (cx, H - 92), 'FOR LABORATORY RESEARCH USE ONLY', font('m', 21), 4)
    spaced(d, (cx, H - 58), 'NOT FOR HUMAN CONSUMPTION', font('m', 21), 4)
    return layer

def render(name, strength, form, path):
    img = BASE.copy()
    region = img.crop((L, T, R, B))
    img.paste(ImageChops.multiply(region, label(name, strength, form)), (L, T))
    img = img.crop((208, 196, 2368, 2356)).resize((720, 720), Image.LANCZOS)
    img.save(path, 'WEBP', quality=82, method=6)

DROPPER = Image.open(os.path.join(os.path.dirname(photo), 'dropper.png')).convert('RGBA') if os.path.exists(os.path.join(os.path.dirname(photo), 'dropper.png')) else None
BG = (242, 242, 242)

def render_dropper(name, strength, form, path):
    """Amber dropper bottle (transparent PNG) on the vial photo's studio grey, with a printed label."""
    from PIL import ImageFilter
    k = 3.2                                            # work at 3.2x the source photo
    bot = DROPPER.resize((round(DROPPER.width * k), round(DROPPER.height * k)), Image.LANCZOS)
    # label sits on the bottle body, below the liquid line and above the base
    lx0, ly0, lx1, ly1 = [round(v * k) for v in (199, 368, 313, 505)]
    lw, lh = lx1 - lx0, ly1 - ly0
    art = label(name, strength, form, H=round(W * lh / lw)).resize((lw, lh), Image.LANCZOS)
    # paper with cylindrical shading: brighter in the middle, darker toward both edges
    shade = Image.new('L', (lw, 1))
    for x in range(lw):
        t = (x - lw * 0.42) / (lw / 2)
        shade.putpixel((x, 0), max(170, min(255, round(255 - 70 * t * t))))
    shade = shade.resize((lw, lh))
    paper = ImageChops.multiply(art, Image.merge('RGB', (shade, shade, shade)))
    body = bot.convert('RGB').crop((lx0, ly0, lx1, ly1))
    paper = Image.blend(paper, ImageChops.multiply(paper, body.point(lambda v: min(255, v + 150))), 0.12)
    bot.paste(paper, (lx0, ly0))
    # square studio canvas, bottle centred, soft contact shadow
    side = 2160
    canvas = Image.new('RGB', (side, side), BG)
    sh = Image.new('L', (side, side), 0)
    ImageDraw.Draw(sh).ellipse((side * 0.22, side * 0.885, side * 0.80, side * 0.93), fill=110)
    canvas.paste(Image.new('RGB', (side, side), (205, 205, 205)), (0, 0), sh.filter(ImageFilter.GaussianBlur(28)))
    x0, y0, x1, y1 = bot.getchannel('A').getbbox()     # trim the empty transparent margins
    bot = bot.crop((x0, y0, x1, y1))
    scale = (side * 0.80) / bot.height
    bot = bot.resize((round(bot.width * scale), round(bot.height * scale)), Image.LANCZOS)
    bx = round(side * 0.53 - (252 * k - x0) * scale)   # bottle body just right of centre; the dropper leans left
    by = round(side * 0.905 - bot.height)              # base sits on the contact shadow
    canvas.paste(bot, (bx, by), bot)
    canvas.resize((720, 720), Image.LANCZOS).save(path, 'WEBP', quality=82, method=6)

JARPATH = os.path.join(os.path.dirname(photo), 'jar.jpg')
JAR = Image.open(JARPATH).convert('RGB') if os.path.exists(JARPATH) else None
if JAR:   # lift the grey studio backdrop toward the vial photo's light grey; the black jar (dark pixels) is untouched
    _lut = [v if v < 120 else round(v + (243 - v) * min(1, (v - 120) / 60) * 0.7) for v in range(256)]
    JAR = JAR.point(_lut * 3)

def render_jar(name, strength, form, path):
    """Black powder jar with a white wrap label on the front of the body."""
    img = JAR.copy()
    jx0, jx1 = 857, 1718                               # jar body edges on the 2576x1717 photo
    lw = round((jx1 - jx0) * 0.68); lh = round(lw * 0.95)
    lx0 = round((jx0 + jx1) / 2 - lw / 2); ly0 = 862
    art = label(name, strength, form, H=round(W * lh / lw)).resize((lw, lh), Image.LANCZOS)
    # wrap shading: the label turns away from the light toward both edges, a little more on the right
    shade = Image.new('L', (lw, 1))
    for x in range(lw):
        t = (x - lw * 0.46) / (lw / 2)
        shade.putpixel((x, 0), max(150, min(255, round(250 - 78 * t * t))))
    shade = shade.resize((lw, lh))
    paper = ImageChops.multiply(art, Image.merge('RGB', (shade, shade, shade)))
    img.paste(paper, (lx0, ly0))
    # hairline shadow under the label's bottom edge so it reads as a sticker, not a cut-out
    d = ImageDraw.Draw(img)
    d.line([lx0, ly0 + lh, lx0 + lw, ly0 + lh], fill=(20, 20, 22), width=3)
    side = 1717; cx = (jx0 + jx1) / 2                 # full photo height: the jar fills about half the card, like the bottles
    img = img.crop((round(cx - side / 2), 0, round(cx + side / 2), side))
    img.resize((720, 720), Image.LANCZOS).save(path, 'WEBP', quality=82, method=6)

SPRAYPATH = os.path.join(os.path.dirname(photo), 'spray.jpg')
SPRAY = Image.open(SPRAYPATH).convert('RGB') if os.path.exists(SPRAYPATH) else None

def render_spray(name, strength, form, path):
    """White nasal-spray bottle (the unlabeled one on the right of the stock image) with a printed wrap label."""
    k = SPRAY.width / 1400                               # measurements below are on a 1400px-wide preview
    P = lambda *v: tuple(round(x * k) for x in v)
    img = SPRAY.copy()
    lx0, ly0, lx1, ly1 = P(892, 560, 1169, 850)          # straight part of the bottle body
    lw, lh = lx1 - lx0, ly1 - ly0
    art = label(name, strength, form, H=round(W * lh / lw)).resize((lw, lh), Image.LANCZOS)
    img.paste(ImageChops.multiply(img.crop((lx0, ly0, lx1, ly1)), art), (lx0, ly0))   # keeps the bottle's own shading
    d = ImageDraw.Draw(img)
    for y in (ly0, ly1):                                 # faint label edges
        d.line([lx0 + 4, y, lx1 - 4, y], fill=(214, 216, 220), width=max(2, round(k)))
    img = img.point([round(v * 0.951) for v in range(256)] * 3)   # white backdrop -> the studio grey of the other photos
    # right bottle only, centred on a square grey canvas
    region = img.crop(P(600, 60, 1400, 1150))
    cx = 1010 * k - 600 * k                              # bottle centre inside the region
    side = round(965 * k / 0.82)
    canvas = Image.new('RGB', (side, side), (243, 243, 243))
    canvas.paste(region, (round(side / 2 - cx), round(side * 0.5 - (605 - 60) * k)))
    canvas.resize((720, 720), Image.LANCZOS).save(path, 'WEBP', quality=82, method=6)

GELPATH = os.path.join(os.path.dirname(photo), 'gel_src.png')
GEL = None
if os.path.exists(GELPATH):
    # The source photo also holds a flower, a stone and a tube; keep only the pump bottle,
    # strip the warm colour cast and lift it to a clean neutral white.
    import numpy as np
    from scipy import ndimage
    _src = Image.open(GELPATH).convert('RGBA')
    _a = np.asarray(_src).astype(float)
    _lab, _ = ndimage.label(_a[..., 3] > 40)
    _keep = _lab == _lab[1100, 890]                          # the blob under the bottle body
    _y = 0.2126 * _a[..., 0] + 0.7152 * _a[..., 1] + 0.0722 * _a[..., 2]
    _lo, _hi = np.percentile(_y[_keep], 2), np.percentile(_y[_keep], 97)
    _n = np.clip((_y - _lo) / (_hi - _lo), 0, 1) ** 0.85      # levels + gentle gamma
    _v = 150 + _n * 102                                         # shading lives between 150 and 252
    _rgb = np.stack([_v, _v, _v * 1.004], -1)                   # neutral, a hair cool
    _alpha = np.where(_keep, _a[..., 3], 0)
    GEL = Image.fromarray(np.dstack([_rgb, _alpha]).clip(0, 255).astype('uint8'), 'RGBA').crop((741, 448, 1046, 1476))

def render_gel(name, strength, form, path):
    """Airless pump bottle on studio grey with a printed label."""
    from PIL import ImageFilter
    k = 3
    bot = GEL.resize((GEL.width * k, GEL.height * k), Image.LANCZOS)
    lx0, ly0, lx1, ly1 = 12 * k, 470 * k, 292 * k, 940 * k   # straight body below the collar (crop coords)
    lw, lh = lx1 - lx0, ly1 - ly0
    art = label(name, strength, form, H=round(W * lh / lw)).resize((lw, lh), Image.LANCZOS)
    body = bot.crop((lx0, ly0, lx1, ly1))
    rgb = ImageChops.multiply(body.convert('RGB'), art)
    body.paste(rgb, (0, 0), body.getchannel('A'))
    bot.paste(body, (lx0, ly0))
    side = round(bot.height / 0.82)
    canvas = Image.new('RGB', (side, side), (243, 243, 243))
    sh = Image.new('L', (side, side), 0)
    bx, by = round(side / 2 - bot.width / 2), round(side * 0.91 - bot.height)
    ImageDraw.Draw(sh).ellipse((bx - bot.width * 0.15, by + bot.height - 40, bx + bot.width * 1.15, by + bot.height + 60), fill=120)
    canvas.paste(Image.new('RGB', (side, side), (200, 200, 202)), (0, 0), sh.filter(ImageFilter.GaussianBlur(40)))
    canvas.paste(bot, (bx, by), bot)
    canvas.resize((720, 720), Image.LANCZOS).save(path, 'WEBP', quality=82, method=6)

os.makedirs(outdir, exist_ok=True)
jobs = []
for c in cat['chemicals']:
    form = {'Spray Solution': 'Spray solution', 'Gel Dispenser': 'Topical gel', 'Aliquot Solution': 'Aliquot solution'}.get(c['form'], c['form'])
    nm = re.sub(r'\s*\(.*?\)\s*', ' ', c['name']).strip() if len(c['name']) > 22 else c['name']
    jobs.append((c['id'], nm, c['size'], form, 'drop' if c['form'] == 'Solution' else 'jar' if c['form'] in ('Powder', 'Capsules') else 'spray' if c['form'] == 'Spray Solution' else 'gel' if c['form'] == 'Gel Dispenser' else 'vial'))
for p in cat['peptides']:
    for z in p['sizes']:
        form = 'Sterile solution' if p['id'] == 'bac-water' else 'Kit' if p['cat'] == 'supplies' else 'Solution' if p['form'] == 'Solution' else 'Lyophilized powder'
        jobs.append((p['id'] + '--' + slug(z['label']), p['name'], z['label'], form, 'drop' if p['form'] == 'Solution' else 'vial'))
if only: jobs = [j for j in jobs if re.search(only, j[0])]
for fid, nm, st, fm, kind in jobs:
    fn = render_dropper if (kind == 'drop' and DROPPER) else render_jar if (kind == 'jar' and JAR) else render_spray if (kind == 'spray' and SPRAY) else render_gel if (kind == 'gel' and GEL is not None) else render
    fn(nm, st, fm, os.path.join(outdir, fid + '.webp'))
print('droppers', sum(1 for j in jobs if j[4] == 'drop' and DROPPER), '| jars', sum(1 for j in jobs if j[4] == 'jar' and JAR), '| sprays', sum(1 for j in jobs if j[4] == 'spray' and SPRAY), '| gels', sum(1 for j in jobs if j[4] == 'gel' and GEL is not None))
print('rendered', len(jobs))
