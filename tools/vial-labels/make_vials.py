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

os.makedirs(outdir, exist_ok=True)
jobs = []
for c in cat['chemicals']:
    form = {'Spray Solution': 'Spray solution', 'Gel Dispenser': 'Topical gel', 'Aliquot Solution': 'Aliquot solution'}.get(c['form'], c['form'])
    nm = re.sub(r'\s*\(.*?\)\s*', ' ', c['name']).strip() if len(c['name']) > 22 else c['name']
    jobs.append((c['id'], nm, c['size'], form, c['form'] == 'Solution'))
for p in cat['peptides']:
    for z in p['sizes']:
        form = 'Sterile solution' if p['id'] == 'bac-water' else 'Kit' if p['cat'] == 'supplies' else 'Solution' if p['form'] == 'Solution' else 'Lyophilized powder'
        jobs.append((p['id'] + '--' + slug(z['label']), p['name'], z['label'], form, p['form'] == 'Solution'))
if only: jobs = [j for j in jobs if re.search(only, j[0])]
for fid, nm, st, fm, drop in jobs:
    (render_dropper if (drop and DROPPER) else render)(nm, st, fm, os.path.join(outdir, fid + '.webp'))
print('droppers', sum(1 for j in jobs if j[4] and DROPPER))
print('rendered', len(jobs))
