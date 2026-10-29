"""Verify peptide identity data and merge it into shop/assets/js/chemdata.js.

Checks, strongest first:
  verified          SMILES reproduces the published InChIKey (small molecules and short peptides)
  sequence-checked  the published sequence, built residue by residue with RDKit and with any common
                    end-modifications applied, reproduces the published molecular formula
  record            identifiers as published, not independently checkable (non-standard residues,
                    lipidated or very large molecules); labelled as such on the page"""
import json, glob, os, re, sys, itertools
from collections import Counter
from rdkit import Chem, RDLogger
from rdkit.Chem import Descriptors, rdMolDescriptors
from rdkit.Chem.Draw import rdMolDraw2D
RDLogger.DisableLog('rdApp.*')
src, repo, chemsrc = sys.argv[1], sys.argv[2], sys.argv[3]
rows = [r for f in sorted(glob.glob(os.path.join(src, 'batch*.json'))) for r in json.load(open(f))]
# reuse peptides already looked up during the chemicals pass
prev = {r['key']: r for f in sorted(glob.glob(os.path.join(chemsrc, 'batch*.json'))) for r in json.load(open(f))}
rows = [r for r in rows if r['key'] != 'peg-mgf']   # record is plain MGF, not the PEGylated product
for k in ('semax', 'selank', 'epithalon', 'pinealon'):
    if k in prev: rows.append(prev[k])
THREE = {'Ala': 'A', 'Arg': 'R', 'Asn': 'N', 'Asp': 'D', 'Cys': 'C', 'Gln': 'Q', 'Glu': 'E', 'Gly': 'G', 'His': 'H', 'Ile': 'I',
         'Leu': 'L', 'Lys': 'K', 'Met': 'M', 'Phe': 'F', 'Pro': 'P', 'Ser': 'S', 'Thr': 'T', 'Trp': 'W', 'Tyr': 'Y', 'Val': 'V'}
ONE = {v: k for k, v in THREE.items()}
clean = lambda v: re.sub(r'\s+', ' ', str(v or '')).strip()

def parse_formula(f):
    f = re.sub(r'[·\s]', '', f or '')
    c = Counter()
    for el, n in re.findall(r'([A-Z][a-z]?)(\d*)', f): c[el] += int(n or 1)
    return c
def fmt(c):
    order = ['C', 'H'] + sorted(k for k in c if k not in ('C', 'H'))
    return ''.join(k + (str(c[k]) if c[k] != 1 else '') for k in order if c[k])

def parse_seq(seq):
    """-> (letters for building the formula, standard_only) or (None, False).
    Accepts H-/Ac-/-OH/-NH2 ends, cyclo(...), pGlu, D-residues, Nle (built as its isomer Leu for the
    formula check only) and position numbers like Gln8. Anything else (D-2-Nal, Pal, gamma links...) -> None."""
    s = clean(seq)
    if not s: return None, False
    s = s.replace('–', '-').replace('—', '-')
    s = re.sub(r'\bD-(?=[A-Z][a-z]{2})', 'D_', s)          # keep D-residues in one token
    s = re.sub(r'^(H-|NH2-|H2N-|Ac-)', '', s); s = re.sub(r'(-OH|-NH2|-COOH)$', '', s)
    s = re.sub(r'cyclo\s*[\(\[]\s*-?', '', s, flags=re.I).replace(')', '').replace(']', '').replace('(', '').replace('[', '')
    if re.fullmatch(r'[ACDEFGHIKLMNPQRSTVWY]+', s.replace(' ', '')): return s.replace(' ', ''), True
    std = True; out = []
    for t in [x for x in re.split(r'[-\s]+', s) if x]:
        t = re.sub(r'\d+$', '', t)
        if t.startswith('D_') and t[2:] in THREE: std = False; t = t[2:]
        if t == 'pGlu': t = 'Gln'
        if t == 'Nle': std = False; t = 'Leu'
        if t not in THREE: return None, False
        out.append(THREE[t])
    return ''.join(out), std

MODS = {'amide': Counter({'N': 1, 'H': 1, 'O': -1}), 'acetyl': Counter({'C': 2, 'H': 2, 'O': 1}),
        'disulfide': Counter({'H': -2}), 'lactam': Counter({'H': -2, 'O': -1}), 'pyroglu': Counter({'N': -1, 'H': -3})}
def seq_check(one, page_formula, text):
    base = parse_formula(rdMolDescriptors.CalcMolFormula(Chem.MolFromSequence(one)))
    target = parse_formula(page_formula)
    hint = (text or '').lower()
    for amide, acetyl, ss, lactam, pg in itertools.product((0, 1), (0, 1), range(0, 4), (0, 1), (0, 1)):
        if ss and one.count('C') < 2 * ss: continue
        if pg and not one.startswith('Q') and not one.startswith('E'): continue
        c = Counter(base)
        for name, n in (('amide', amide), ('acetyl', acetyl), ('disulfide', ss), ('lactam', lactam), ('pyroglu', pg)):
            for _ in range(n): c.update(MODS[name])
        c = Counter({k: v for k, v in c.items() if v})
        if c == target:
            mods = [m for m, n in (('C-terminal amide', amide), ('N-terminal acetyl', acetyl), (f'{ss} disulfide bridge' + ('s' if ss > 1 else ''), ss),
                                   ('cyclic lactam', lactam), ('N-terminal pyroglutamate', pg)) if n]
            return True, mods
    return False, []

def draw(mol, key):
    d = rdMolDraw2D.MolDraw2DSVG(520, 360)
    o = d.drawOptions(); o.clearBackground = False; o.bondLineWidth = 2; o.useBWAtomPalette(); o.padding = 0.08
    rdMolDraw2D.PrepareMolForDrawing(mol); d.DrawMolecule(mol); d.FinishDrawing()
    open(os.path.join(repo, 'shop/assets/img/structures', key + '.svg'), 'w').write(d.GetDrawingText().replace("<?xml version='1.0' encoding='iso-8859-1'?>\n", ''))

def molar(x):
    m = re.search(r'([0-9][0-9,]*\.[0-9]+)', x or ''); return float(m.group(1).replace(',', '')) if m else None

import subprocess
_cat = json.loads(subprocess.check_output(['node', '-e', 'global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.CATALOG.peptides))', os.path.join(repo, 'shop/assets/js/catalog.js')]))
CAT_SEQ = {p['id']: p.get('sequence', '') for p in _cat}
NEUTRALISE = {'nad-plus'}
HOLD = {'tb-500'}   # catalog = full thymosin beta-4, public record = Ac-LKKTETQ fragment: owner to confirm
rows = [r for r in rows if r['key'] not in HOLD]
existing = open(os.path.join(repo, 'shop/assets/js/chemdata.js')).read()
data = json.loads(existing[existing.index('window.CHEMDATA = ') + 18:].rstrip().rstrip(';'))
report = []
for r in rows:
    key = r['key']
    rec = {k: clean(r.get(k)) for k in ('iupac', 'cas', 'pubchem_cid', 'chemspider', 'unii', 'drugbank', 'appearance', 'source_url')}
    page_formula = clean(r.get('formula')).replace(' ', '')
    smi, pub = clean(r.get('smiles')).replace(' ', ''), clean(r.get('inchikey')).upper().replace('INCHIKEY=', '')
    status = 'record'
    mol = Chem.MolFromSmiles(smi) if smi else None
    if mol is not None and key in NEUTRALISE:
        from rdkit.Chem.MolStandardize import rdMolStandardize
        mol = rdMolStandardize.Uncharger().uncharge(mol)
    if mol is not None and pub and Chem.MolToInchiKey(mol)[:14] == pub[:14]:
        status = 'verified'
        rec['formula'] = rdMolDescriptors.CalcMolFormula(mol); rec['mw'] = f"{Descriptors.MolWt(mol):.2f} g/mol"; rec['inchikey'] = pub
        if Chem.MolToInchiKey(mol) == pub: rec['smiles'] = Chem.MolToSmiles(mol)
        if mol.GetNumHeavyAtoms() <= 60: draw(mol, key); rec['structure'] = True
    page_seq = clean(r.get('sequence'))
    # Try the page's sequence, then the catalog's; keep whichever reproduces the published formula.
    seq_src = page_seq or CAT_SEQ.get(key, '')
    one, std = parse_seq(seq_src)
    ok, mods = False, []
    if status != 'verified' and page_formula:
        for cand in [c for c in (page_seq, CAT_SEQ.get(key, '')) if c]:
            o, sd = parse_seq(cand)
            if not o: continue
            ok, mods = seq_check(o, page_formula, r.get('modifications'))
            if ok:
                seq_src, one, std = cand, o, sd
                if cand != page_seq and page_seq: rec['seq_note'] = 'page sequence did not match its formula; catalog sequence does'
                break
        if ok:
            status = 'sequence-checked'
            rec['formula'] = fmt(parse_formula(page_formula)); w = molar(r.get('molar_mass'))
            if w: rec['mw'] = f"{w:.2f} g/mol"
            if mods and std: rec['modifications'] = '; '.join(mods)
    looks_like_seq = bool(seq_src) and not re.search(r'[a-z]{4,}\s+[a-z(]', seq_src) and ('-' in seq_src or '–' in seq_src or re.fullmatch(r'[A-Z]{2,}', seq_src))
    if looks_like_seq and (page_seq or status in ('sequence-checked', 'verified')):
        rec['sequence3'] = seq_src if (not std or not one) else '-'.join(ONE[c] for c in one)
        if one and std: rec['sequence1'] = one
        if one: rec['length'] = len(one)
    if status == 'record':
        if page_formula and re.fullmatch(r'[A-Za-z0-9()+\-·.]+', page_formula): rec['formula'] = page_formula
        w = molar(r.get('molar_mass'))
        if w: rec['mw'] = f"{w:.2f} g/mol"
    if status != 'sequence-checked' and clean(r.get('modifications')): rec['modifications'] = clean(r.get('modifications'))[:240]
    rec['check'] = status
    rec['verified'] = status == 'verified'
    rec = {k: v for k, v in rec.items() if v not in ('', None)}
    if any(rec.get(k) for k in ('cas', 'formula', 'sequence3', 'pubchem_cid')):
        merged = dict(data.get(key, {})); merged.update(rec); data[key] = merged
    report.append((key, status, rec.get('sequence1', '')[:30], r.get('source_url', '')))
# Presentation clean-up: strip lookup annotations, and write systematic names as residue sequences
TIDY = {
    'ghk-cu':     {'sequence3': 'Gly-His-Lys (copper(II) complex)'},
    'ghrp-6':     {'sequence3': 'His-D-Trp-Ala-Trp-D-Phe-Lys-NH2'},
    'ghrp-2':     {'sequence3': 'D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2'},
    'snap-8':     {'sequence3': 'Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2', 'modifications': 'N-terminal acetyl; C-terminal amide'},
    'tesamorelin': {'modifications': 'N-terminal trans-3-hexenoyl group on the 44-residue human GHRH sequence; C-terminal amide'},
    'humanin':    {'modifications': 'None (native 24-residue peptide)'},
    'll-37':      {'modifications': 'None (native 37-residue peptide)'},
    'kpv':        {'modifications': 'None (free C-terminal acid)'},
    'nad-plus':   {'appearance': 'White amorphous powder'},
    'semax':      {'cas': '80714-61-0'},
}
def tidy_mod(t):
    t = re.sub(r'^(Per article:|Inferred from page IUPAC/SMILES \(not stated in prose\):)\s*', '', t)
    t = re.sub(r"\s*\((?:per article|page wording|page: '[^']*'|per SMILES/InChI)\)", '', t)
    t = re.sub(r',?\s*per (?:IUPAC name|SMILES)', '', t)
    t = re.sub(r'\.?\s*Article nomenclature:.*$', '', t)
    return t.strip().rstrip(';,.')
for k, d in data.items():
    if d.get('modifications'):
        m = tidy_mod(d['modifications']); d['modifications'] = m[:1].upper() + m[1:]
    if d.get('appearance'): d['appearance'] = re.sub(r'\s*\((?:article|page)[^)]*\)', '', d['appearance'])
    d.update(TIDY.get(k, {}))
head = existing[:existing.index('window.CHEMDATA = ')]
open(os.path.join(repo, 'shop/assets/js/chemdata.js'), 'w').write(head + 'window.CHEMDATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
for k, st, sq, u in report: print(f"{k:18} {st:17} {sq:32} {u}")
print({s: sum(1 for x in report if x[1] == s) for s in ('verified', 'sequence-checked', 'record')})
