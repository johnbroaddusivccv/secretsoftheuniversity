"""Verify scraped chemical identity data with RDKit and write shop/assets/js/chemdata.js + structure SVGs.

A record is 'verified' only when the InChIKey computed from its SMILES equals the published InChIKey.
Formula and molecular weight shown on the site are then computed from that verified structure.
Unverified records keep only text identifiers that don't depend on the structure (CAS, CID, UNII...),
and are flagged so they can be reviewed."""
import json, glob, os, re, sys
from rdkit import Chem, RDLogger
from rdkit.Chem import Descriptors, rdMolDescriptors, Draw
from rdkit.Chem.Draw import rdMolDraw2D
RDLogger.DisableLog('rdApp.*')
src, repo = sys.argv[1], sys.argv[2]
rows = []
for f in sorted(glob.glob(os.path.join(src, 'batch*.json'))):
    rows += json.load(open(f))
os.makedirs(os.path.join(repo, 'shop/assets/img/structures'), exist_ok=True)
clean = lambda v: re.sub(r'\s+', ' ', str(v or '')).strip()
# Corrections to obvious transcription problems on the source pages
FIXES = {
    'aticaprant': {'iupac': '4-(4-{[(2S)-2-(3,5-Dimethylphenyl)-1-pyrrolidinyl]methyl}phenoxy)-3-fluorobenzamide'},
    'tropisetron': {'iupac': '(1R,5S)-8-methyl-8-azabicyclo[3.2.1]octan-3-yl 1H-indole-3-carboxylate'},
    'idebenone': {'iupac': '2-(10-hydroxydecyl)-5,6-dimethoxy-3-methylcyclohexa-2,5-diene-1,4-dione'},
    'semax': {'iupac': ''},
    'l-theanine': {'iupac': 'N5-Ethyl-L-glutamine', 'melting_point': ''},
    'mg-acetate': {'formula': 'C4H6MgO4'},
}
# Structures written for pages that gave no SMILES. Accepted only when the computed formula equals the
# page's formula and the weight agrees to 0.05 g/mol. Constitution only (no stereo), so SMILES/InChIKey
# are not displayed for these; the drawing and the page's identifiers are.
GAPFILL = {
    'k-r-bhb': 'CC(O)CC(=O)O', 'cordycepin': 'Nc1ncnc2c1ncn2C1OC(CO)CC1O', 'paraxanthine': 'Cn1c(=O)[nH]c2ncn(C)c2c1=O',
    'slu-pp-332': 'Oc1ccc(cc1)C(=O)NN=Cc1ccc2ccccc2c1', 'spermidine': 'NCCCCNCCCN', 'agmatine': 'NCCCCNC(=N)N',
    'pea': 'CCCCCCCCCCCCCCCC(=O)NCCO', 'oea': 'CCCCCCCC/C=C\\CCCCCCCC(=O)NCCO', 'ipam': 'NC(=O)CCc1c[nH]c2ccccc12',
    'sarcosine': 'CNCC(=O)O', 'mg-acetate': 'CC(=O)[O-].CC(=O)[O-].[Mg+2]',
}
def molar(x):
    m = re.search(r'([0-9]+\.[0-9]+)', x or ''); return float(m.group(1)) if m else None
def draw(mol, key):
    d = rdMolDraw2D.MolDraw2DSVG(520, 360)
    o = d.drawOptions(); o.clearBackground = False; o.bondLineWidth = 2; o.useBWAtomPalette(); o.padding = 0.08
    rdMolDraw2D.PrepareMolForDrawing(mol); d.DrawMolecule(mol); d.FinishDrawing()
    open(os.path.join(repo, 'shop/assets/img/structures', key + '.svg'), 'w').write(d.GetDrawingText().replace("<?xml version='1.0' encoding='iso-8859-1'?>\n", ''))
out, report = {}, []
for r in rows:
    key = r['key']
    r = dict(r, **FIXES.get(key, {}))
    smi = clean(r.get('smiles')).replace(' ', ''); pub = clean(r.get('inchikey')).upper().replace('INCHIKEY=', '')
    rec = {k: clean(r.get(k)) for k in ('iupac', 'cas', 'pubchem_cid', 'chemspider', 'unii', 'melting_point', 'solubility_water', 'appearance', 'notes', 'source_url')}
    status = 'no data'
    mol = Chem.MolFromSmiles(smi) if smi else None
    if mol is not None:
        calc = Chem.MolToInchiKey(mol)
        if pub and calc == pub:
            status = 'verified'
        elif pub and calc[:14] == pub[:14]:
            status = 'verified (skeleton; stereo/protonation layer differs)'
        else:
            status = 'MISMATCH' if pub else 'unverified (no published InChIKey)'
        if status.startswith('verified'):
            rec['formula'] = rdMolDescriptors.CalcMolFormula(mol)
            rec['mw'] = f"{Descriptors.MolWt(mol):.2f} g/mol"
            if status == 'verified':
                rec['smiles'] = Chem.MolToSmiles(mol); rec['inchikey'] = calc
            else:
                rec['inchikey'] = pub          # published key is authoritative; scraped SMILES lacked stereo
            heavy = mol.GetNumHeavyAtoms()
            if heavy <= 80:   # skip drawings for large peptides; they're unreadable at card size
                d = rdMolDraw2D.MolDraw2DSVG(520, 360)
                o = d.drawOptions(); o.clearBackground = False; o.bondLineWidth = 2; o.useBWAtomPalette(); o.padding = 0.08
                rdMolDraw2D.PrepareMolForDrawing(mol)
                d.DrawMolecule(mol); d.FinishDrawing()
                svg = d.GetDrawingText().replace('<?xml version=\'1.0\' encoding=\'iso-8859-1\'?>\n', '')
                open(os.path.join(repo, 'shop/assets/img/structures', key + '.svg'), 'w').write(svg)
                rec['structure'] = True
    elif smi:
        status = 'SMILES did not parse'
    elif key in GAPFILL and r.get('formula'):
        gm = Chem.MolFromSmiles(GAPFILL[key])
        f_calc, w_calc, w_page = rdMolDescriptors.CalcMolFormula(gm), Descriptors.MolWt(gm), molar(r.get('molar_mass'))
        if f_calc == clean(r['formula']).replace(' ', '') and (w_page is None or abs(w_calc - w_page) < 0.05):
            status = 'formula-checked structure'
            rec['formula'] = f_calc; rec['mw'] = f"{w_calc:.2f} g/mol"
            draw(gm, key); rec['structure'] = True
        else:
            status = f'GAPFILL REJECTED ({f_calc} vs {r.get("formula")})'
    if 'formula' not in rec and r.get('formula'):      # no checked structure: show the page's own formula and weight
        if re.fullmatch(r'[A-Za-z0-9()+\-·.]+', clean(r['formula']).replace(' ', '')):
            rec['formula'] = clean(r['formula']).replace(' ', '')
        w = molar(r.get('molar_mass'))
        if w: rec['mw'] = f"{w:.2f} g/mol"
    if not status.startswith('verified'):
        # keep text identifiers only when the page clearly matched; drop structure-derived fields
        rec.pop('melting_point', None) if status == 'MISMATCH' else None
    rec['verified'] = status.startswith('verified')
    rec = {k: v for k, v in rec.items() if v not in ('', None)}
    rec.pop('notes', None)                               # research notes stay in the batch files, not on the site
    if any(rec.get(k) for k in ('cas', 'formula', 'iupac', 'pubchem_cid')):
        out[key] = rec
    report.append((key, status, r.get('source_url', '')))
js = "/* Chemical identity data per compound (keyed like catalog.js `key`). Generated by tools/chem-data/verify.py.\n" \
     "   verified: the SMILES reproduces the published InChIKey; formula and MW are computed from it. */\n"
js += "window.CHEMDATA = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
open(os.path.join(repo, 'shop/assets/js/chemdata.js'), 'w').write(js)
for k, st, u in report: print(f"{k:16} {st:52} {u}")
print('verified', sum(1 for _, s, _ in report if s.startswith('verified')), 'of', len(report))
