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

def label(name, strength, form):
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
    y = 470 - (len(lines) * lh) / 2
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

os.makedirs(outdir, exist_ok=True)
jobs = []
for c in cat['chemicals']:
    form = {'Spray Solution': 'Spray solution', 'Gel Dispenser': 'Topical gel', 'Aliquot Solution': 'Aliquot solution'}.get(c['form'], c['form'])
    nm = re.sub(r'\s*\(.*?\)\s*', ' ', c['name']).strip() if len(c['name']) > 22 else c['name']
    jobs.append((c['id'], nm, c['size'], form))
for p in cat['peptides']:
    for z in p['sizes']:
        form = 'Sterile solution' if p['id'] == 'bac-water' else 'Kit' if p['cat'] == 'supplies' else 'Solution' if p['form'] == 'Solution' else 'Lyophilized powder'
        jobs.append((p['id'] + '--' + slug(z['label']), p['name'], z['label'], form))
if only: jobs = [j for j in jobs if re.search(only, j[0])]
for fid, nm, st, fm in jobs:
    render(nm, st, fm, os.path.join(outdir, fid + '.webp'))
print('rendered', len(jobs))
