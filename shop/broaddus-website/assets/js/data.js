/* ============================================================
   MERIDIAN PEPTIDES — Glossary + Product Data
   ------------------------------------------------------------
   This single dataset powers the entire site:
     • The Glossary (educational encyclopedia)
     • The Shop (purchasable product grid)
     • Product detail pages
   To add a product, add an entry here. That's it.
   ============================================================ */

/* Research categories (structure modeled on common RUO catalogs) */
const CATEGORIES = [
  { id: "glp1",         name: "GLP-1 Research",          blurb: "Incretin-mimetic and metabolic signaling peptides studied in glucose regulation models." },
  { id: "growth",       name: "Growth Hormone Research", blurb: "Secretagogues and releasing peptides studied for GH/IGF-1 axis modulation." },
  { id: "metabolic",    name: "Metabolic Research",      blurb: "Compounds investigated in energy metabolism, lipolysis, and body-composition models." },
  { id: "recovery",     name: "Recovery Research",       blurb: "Peptides studied in tissue repair, angiogenesis, and healing pathways." },
  { id: "neuro",        name: "Neuroscience Research",   blurb: "Nootropic and neuroprotective peptides studied in cognition and CNS models." },
  { id: "immune",       name: "Immune Research",         blurb: "Immunomodulatory peptides studied in immune-signaling pathways." },
  { id: "endocrine",    name: "Endocrine Research",      blurb: "Peptides studied in reproductive, hormonal, and neuroendocrine signaling." },
  { id: "performance",  name: "Performance Research",    blurb: "Peptides investigated in endurance, mitochondrial, and physical-performance models." },
  { id: "copper",       name: "Copper Peptides",         blurb: "Copper-complex peptides studied in skin, collagen, and regenerative research." },
  { id: "cosmetic",     name: "Skin & Cosmetic Peptides", blurb: "Peptides studied in dermal, collagen, and cosmetic-science research." },
  { id: "longevity",    name: "Longevity Research",      blurb: "Peptides studied in cellular aging, telomere, and senescence models." },
  { id: "blends",       name: "Peptide Blends",          blurb: "Pre-combined research blends for multi-pathway study designs." },
  { id: "supplies",     name: "Supplies",                blurb: "Reconstitution solutions, bacteriostatic water, and lab consumables." }
];

/* ---------------------------------------------------------------
   PRODUCTS / GLOSSARY ENTRIES
   Fields:
     id, name, aka, category, tags[], sizes[{label, price, sku}],
     summary (short, for cards), overview (long, glossary),
     research (bullet research-area strings),
     cas, sequence, molFormula, molWeight, halfLife, storage,
     purity, featured
   All content is written for Research Use Only context.
--------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "bpc-157", name: "BPC-157", aka: "Body Protection Compound-157",
    category: "recovery", tags: ["healing", "gut", "angiogenesis"], featured: true,
    sizes: [{label:"5mg", price:39.99, sku:"BPC-5"}, {label:"10mg", price:59.99, sku:"BPC-10"}],
    summary: "A pentadecapeptide studied extensively in tissue-repair and angiogenesis models.",
    overview: "BPC-157 is a synthetic peptide derived from a partial sequence of body protection compound found in gastric juice. In preclinical literature it is one of the most-studied peptides for tissue healing, and researchers have examined it in models of tendon, ligament, muscle, and gastrointestinal repair. Reported mechanisms of interest include upregulation of growth-factor receptors and promotion of angiogenesis (new blood-vessel formation).",
    research: ["Tendon & ligament repair models", "Gastrointestinal mucosal integrity", "Angiogenesis & VEGF pathways", "Nitric-oxide system interaction"],
    cas: "137525-51-0", sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    molFormula: "C62H98N16O22", molWeight: "1419.5 g/mol", halfLife: "~4 hours (model-dependent)",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C, use within 3–4 weeks.", purity: "≥99%"
  },
  {
    id: "tb-500", name: "TB-500", aka: "Thymosin Beta-4 Fragment",
    category: "recovery", tags: ["healing", "actin", "flexibility"], featured: true,
    sizes: [{label:"5mg", price:44.99, sku:"TB5-5"}, {label:"10mg", price:74.99, sku:"TB5-10"}],
    summary: "A synthetic fragment of Thymosin Beta-4 studied in cell-migration and repair models.",
    overview: "TB-500 is a synthetic version of the active region of Thymosin Beta-4, a naturally occurring peptide involved in actin regulation. Research literature examines its role in cell migration, wound healing, and flexibility, with particular interest in actin sequestration and its downstream effect on tissue regeneration and angiogenesis.",
    research: ["Cell migration & actin regulation", "Wound-healing models", "Cardiac tissue repair studies", "Flexibility & fibrosis research"],
    cas: "77591-33-4", sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
    molFormula: "C212H350N56O78S", molWeight: "4963.4 g/mol", halfLife: "~2–3 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "semaglutide", name: "Semaglutide", aka: "GLP-1 Receptor Agonist",
    category: "glp1", tags: ["glp-1", "glucose", "metabolic"], featured: true,
    sizes: [{label:"5mg", price:89.99, sku:"SEMA-5"}, {label:"10mg", price:149.99, sku:"SEMA-10"}],
    summary: "A long-acting GLP-1 receptor agonist widely studied in glucose-regulation models.",
    overview: "Semaglutide is a GLP-1 (glucagon-like peptide-1) receptor agonist. In research settings it is studied for its effect on incretin signaling, insulin secretion in glucose-dependent contexts, and gastric-emptying dynamics. Its structure is engineered for extended half-life relative to native GLP-1, making it a common reference compound in metabolic research.",
    research: ["Incretin & insulin-signaling models", "Glucose-dependent secretion studies", "Appetite/satiety pathway research", "Gastric-emptying dynamics"],
    cas: "910463-68-2", sequence: "Modified GLP-1(7-37) analog with C18 fatty-diacid chain",
    molFormula: "C187H291N45O59", molWeight: "4113.6 g/mol", halfLife: "~7 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "tirzepatide", name: "Tirzepatide", aka: "GIP/GLP-1 Dual Agonist",
    category: "glp1", tags: ["glp-1", "gip", "metabolic"], featured: true,
    sizes: [{label:"5mg", price:99.99, sku:"TIRZ-5"}, {label:"10mg", price:169.99, sku:"TIRZ-10"}, {label:"15mg", price:229.99, sku:"TIRZ-15"}],
    summary: "A dual GIP and GLP-1 receptor agonist studied in advanced metabolic models.",
    overview: "Tirzepatide is a dual agonist targeting both the GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 receptors. This dual-incretin mechanism is of significant research interest for its combined effects on glucose regulation and energy metabolism, and it is frequently used as a comparator to single-pathway GLP-1 agonists.",
    research: ["Dual-incretin receptor signaling", "Glucose & lipid metabolism models", "Energy-expenditure research", "Comparative agonist studies"],
    cas: "2023788-19-2", sequence: "39-aa synthetic peptide with C20 fatty-diacid moiety",
    molFormula: "C225H348N48O68", molWeight: "4813.5 g/mol", halfLife: "~5 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "ipamorelin", name: "Ipamorelin", aka: "Growth Hormone Secretagogue",
    category: "growth", tags: ["ghrp", "secretagogue", "selective"], featured: true,
    sizes: [{label:"5mg", price:42.99, sku:"IPA-5"}, {label:"10mg", price:69.99, sku:"IPA-10"}],
    summary: "A selective growth-hormone secretagogue studied for clean GH-pulse release.",
    overview: "Ipamorelin is a pentapeptide and selective growth-hormone secretagogue (GHRP). It is studied for its ability to stimulate GH release with minimal effect on cortisol or prolactin, making it a frequently referenced 'selective' secretagogue in GH-axis research.",
    research: ["GH-axis stimulation models", "Selectivity vs. cortisol/prolactin", "Body-composition research", "Ghrelin-receptor signaling"],
    cas: "170851-70-4", sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
    molFormula: "C38H49N9O5", molWeight: "711.9 g/mol", halfLife: "~2 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "cjc-1295-dac", name: "CJC-1295 with DAC", aka: "GHRH Analog (DAC)",
    category: "growth", tags: ["ghrh", "long-acting"], featured: false,
    sizes: [{label:"2mg", price:44.99, sku:"CJC-2"}, {label:"5mg", price:84.99, sku:"CJC-5"}],
    summary: "A long-acting GHRH analog studied for sustained GH/IGF-1 elevation.",
    overview: "CJC-1295 is a synthetic analog of growth-hormone-releasing hormone (GHRH). The DAC (Drug Affinity Complex) variant binds albumin to substantially extend half-life, and it is studied for producing sustained increases in GH and IGF-1 in preclinical models, often alongside a secretagogue such as Ipamorelin.",
    research: ["GHRH-receptor signaling", "Sustained GH/IGF-1 elevation", "Albumin-binding half-life extension", "Combination secretagogue studies"],
    cas: "863288-34-0", sequence: "Modified GRF(1-29) with DAC",
    molFormula: "C152H252N44O42", molWeight: "3367.9 g/mol", halfLife: "~6–8 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "tesamorelin", name: "Tesamorelin", aka: "GHRH Analog",
    category: "growth", tags: ["ghrh", "lipolysis"], featured: false,
    sizes: [{label:"5mg", price:74.99, sku:"TES-5"}, {label:"10mg", price:129.99, sku:"TES-10"}],
    summary: "A stabilized GHRH analog studied in visceral-fat and metabolic models.",
    overview: "Tesamorelin is a synthetic GHRH analog studied for its effect on the GH/IGF-1 axis, with particular research focus on visceral adipose tissue and lipid metabolism. Structural stabilization gives it greater resistance to enzymatic degradation than native GHRH.",
    research: ["Visceral adipose tissue models", "GH/IGF-1 axis stimulation", "Lipid-metabolism research", "Cognitive-aging studies"],
    cas: "218949-48-5", sequence: "Trans-3-hexenoyl-GRF(1-44)",
    molFormula: "C221H366N72O67S", molWeight: "5135.9 g/mol", halfLife: "~30 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "hexarelin", name: "Hexarelin", aka: "GH Releasing Peptide-6 Analog",
    category: "growth", tags: ["ghrp", "cardiac"], featured: false,
    sizes: [{label:"5mg", price:49.99, sku:"HEX-5"}],
    summary: "A potent hexapeptide secretagogue studied in GH-release and cardiac models.",
    overview: "Hexarelin is a synthetic hexapeptide and one of the more potent growth-hormone-releasing peptides. Beyond GH release, research literature examines its interaction with cardiac tissue and the CD36 receptor, distinguishing it from other secretagogues.",
    research: ["Potent GH-release models", "Cardiac-tissue receptor studies", "CD36 pathway research", "Neuroprotection studies"],
    cas: "140703-51-1", sequence: "His-D-2-methyl-Trp-Ala-Trp-D-Phe-Lys-NH2",
    molFormula: "C47H58N12O6", molWeight: "887.0 g/mol", halfLife: "~55 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "mk-677", name: "MK-677", aka: "Ibutamoren",
    category: "growth", tags: ["oral", "ghrelin", "secretagogue"], featured: false, form: "solution",
    sizes: [{label:"25mg/mL (30mL)", price:59.99, sku:"MK-30"}],
    summary: "A non-peptide ghrelin-mimetic studied as an orally active GH secretagogue.",
    overview: "MK-677 (Ibutamoren) is a non-peptide, orally active growth-hormone secretagogue that mimics ghrelin at its receptor. It is widely studied for sustained elevation of GH and IGF-1 without the injection requirement of peptide secretagogues, making it a common oral reference compound.",
    research: ["Oral GH-secretagogue models", "Ghrelin-receptor signaling", "IGF-1 elevation studies", "Sleep & body-composition research"],
    cas: "159752-10-0", sequence: "Non-peptide small molecule",
    molFormula: "C27H36N4O5S", molWeight: "528.7 g/mol", halfLife: "~24 hours",
    storage: "Store solution at room temperature away from light.", purity: "≥99%"
  },
  {
    id: "ghk-cu", name: "GHK-Cu", aka: "Copper Peptide",
    category: "copper", tags: ["copper", "skin", "collagen"], featured: true,
    sizes: [{label:"50mg", price:39.99, sku:"GHK-50"}, {label:"100mg", price:64.99, sku:"GHK-100"}],
    summary: "A copper-binding tripeptide studied in skin-remodeling and collagen research.",
    overview: "GHK-Cu is a naturally occurring copper-complex of the tripeptide glycyl-L-histidyl-L-lysine. Research literature focuses on its role in skin remodeling, collagen and elastin synthesis, wound healing, and antioxidant signaling, with copper delivery central to its studied mechanisms.",
    research: ["Collagen & elastin synthesis models", "Skin-remodeling research", "Antioxidant & anti-inflammatory pathways", "Hair-follicle studies"],
    cas: "89030-95-5", sequence: "Gly-His-Lys : Cu(II)",
    molFormula: "C14H24CuN6O4", molWeight: "403.9 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "pt-141", name: "PT-141", aka: "Bremelanotide",
    category: "neuro", tags: ["melanocortin", "cns"], featured: false,
    sizes: [{label:"10mg", price:44.99, sku:"PT1-10"}],
    summary: "A melanocortin-receptor agonist studied in CNS and arousal-pathway models.",
    overview: "PT-141 (Bremelanotide) is a melanocortin-receptor agonist derived from Melanotan II. Unlike its predecessor, research interest centers on central nervous system pathways rather than pigmentation, particularly melanocortin signaling in the brain.",
    research: ["Melanocortin-receptor signaling", "CNS pathway models", "Arousal & behavior research"],
    cas: "189691-06-3", sequence: "Ac-Nle-cyclo(-Asp-His-D-Phe-Arg-Trp-Lys)-OH",
    molFormula: "C50H68N14O10", molWeight: "1025.2 g/mol", halfLife: "~2–3 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "melanotan-2", name: "Melanotan II", aka: "MT-II",
    category: "metabolic", tags: ["melanocortin", "pigment"], featured: false,
    sizes: [{label:"10mg", price:39.99, sku:"MT2-10"}],
    summary: "A synthetic melanocortin analog studied in pigmentation-pathway research.",
    overview: "Melanotan II is a synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH). It is studied in melanocortin-pathway research, particularly the MC1R receptor and its role in melanogenesis (pigment production).",
    research: ["MC1R receptor signaling", "Melanogenesis models", "Appetite-pathway research"],
    cas: "121062-08-6", sequence: "Ac-Nle-cyclo(-Asp-His-D-Phe-Arg-Trp-Lys)-NH2",
    molFormula: "C50H69N15O9", molWeight: "1024.2 g/mol", halfLife: "~1–2 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "sermorelin", name: "Sermorelin", aka: "GRF(1-29)",
    category: "growth", tags: ["ghrh", "releasing"], featured: false,
    sizes: [{label:"5mg", price:49.99, sku:"SER-5"}],
    summary: "A GHRH(1-29) fragment studied as a growth-hormone-releasing peptide.",
    overview: "Sermorelin is the 1-29 amino-acid fragment of GHRH — the shortest sequence retaining full GH-releasing activity. It is a long-standing reference compound in GH-axis research and is often compared against longer-acting GHRH analogs.",
    research: ["GHRH-receptor signaling", "GH-pulse stimulation models", "Aging & GH-axis research"],
    cas: "86168-78-7", sequence: "GRF(1-29)-NH2",
    molFormula: "C149H246N44O42S", molWeight: "3357.9 g/mol", halfLife: "~10–20 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "thymosin-alpha-1", name: "Thymosin Alpha-1", aka: "Tα1",
    category: "immune", tags: ["immune", "thymus"], featured: false,
    sizes: [{label:"5mg", price:64.99, sku:"TA1-5"}, {label:"10mg", price:109.99, sku:"TA1-10"}],
    summary: "A thymus-derived peptide studied in immune-modulation research.",
    overview: "Thymosin Alpha-1 is a 28-amino-acid peptide originally isolated from the thymus. It is one of the most-studied immunomodulatory peptides, with research focus on T-cell maturation, dendritic-cell function, and broad immune-signaling pathways.",
    research: ["T-cell maturation models", "Innate & adaptive immune signaling", "Antiviral-response research", "Vaccine-adjuvant studies"],
    cas: "62304-98-7", sequence: "Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn",
    molFormula: "C129H215N33O55", molWeight: "3108.3 g/mol", halfLife: "~2 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "epithalon", name: "Epithalon", aka: "Epitalon / AEDG",
    category: "longevity", tags: ["telomere", "longevity", "pineal"], featured: true,
    sizes: [{label:"10mg", price:39.99, sku:"EPI-10"}, {label:"50mg", price:89.99, sku:"EPI-50"}],
    summary: "A tetrapeptide studied in telomerase and cellular-aging research.",
    overview: "Epithalon is a synthetic tetrapeptide based on epithalamin, a pineal-gland extract. It is studied in longevity research for its reported effect on telomerase activity, telomere length, and circadian/melatonin regulation in aging models.",
    research: ["Telomerase-activity models", "Cellular-aging & senescence research", "Circadian/melatonin studies", "Antioxidant pathways"],
    cas: "307297-39-8", sequence: "Ala-Glu-Asp-Gly",
    molFormula: "C14H22N4O9", molWeight: "390.3 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "semax", name: "Semax", aka: "ACTH(4-10) Analog",
    category: "neuro", tags: ["nootropic", "bdnf", "cns"], featured: false,
    sizes: [{label:"30mg", price:54.99, sku:"SEMX-30"}],
    summary: "A nootropic peptide studied for BDNF modulation and neuroprotection.",
    overview: "Semax is a synthetic peptide derived from a fragment of ACTH (adrenocorticotropic hormone). It is studied primarily in neuroscience for reported effects on BDNF (brain-derived neurotrophic factor) expression, cognition, and neuroprotection in CNS models.",
    research: ["BDNF & NGF expression models", "Cognitive-function research", "Neuroprotection studies", "Attention & memory pathways"],
    cas: "80714-61-0", sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    molFormula: "C37H51N9O10S", molWeight: "813.9 g/mol", halfLife: "short (minutes)",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "selank", name: "Selank", aka: "TP-7",
    category: "neuro", tags: ["anxiolytic", "nootropic"], featured: false,
    sizes: [{label:"10mg", price:49.99, sku:"SEL-10"}],
    summary: "A tuftsin-derived peptide studied in anxiolytic and immune-modulation models.",
    overview: "Selank is a synthetic analog of the immunomodulatory peptide tuftsin. Research literature examines it in anxiolytic (anti-anxiety) models, as well as effects on BDNF, immune signaling, and neurotransmitter balance.",
    research: ["Anxiolytic-behavior models", "BDNF-expression research", "Immune-modulation studies", "GABA/serotonin pathway research"],
    cas: "129954-34-3", sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    molFormula: "C33H57N11O9", molWeight: "751.9 g/mol", halfLife: "short (minutes)",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "dsip", name: "DSIP", aka: "Delta Sleep-Inducing Peptide",
    category: "neuro", tags: ["sleep", "cns"], featured: false,
    sizes: [{label:"5mg", price:44.99, sku:"DSIP-5"}],
    summary: "A neuropeptide studied in sleep-regulation and stress-response models.",
    overview: "DSIP is a naturally occurring nonapeptide studied for its role in sleep architecture and stress modulation. Research interest includes its interaction with circadian rhythms and neuroendocrine stress pathways.",
    research: ["Sleep-architecture models", "Stress & cortisol research", "Circadian-rhythm studies"],
    cas: "62568-57-4", sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    molFormula: "C35H48N10O15", molWeight: "848.8 g/mol", halfLife: "short (minutes)",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "aod-9604", name: "AOD-9604", aka: "GH Fragment 176-191",
    category: "metabolic", tags: ["lipolysis", "fragment"], featured: false,
    sizes: [{label:"5mg", price:49.99, sku:"AOD-5"}],
    summary: "A modified GH fragment studied in fat-metabolism research.",
    overview: "AOD-9604 is a modified fragment of the C-terminus of human growth hormone (residues 176-191). It is studied for lipolytic (fat-breakdown) activity without the growth-promoting effects of full GH, making it a targeted metabolic research compound.",
    research: ["Lipolysis & fat-metabolism models", "Body-composition research", "Cartilage-repair studies"],
    cas: "221231-10-3", sequence: "Tyr-GH(177-191) fragment",
    molFormula: "C78H123N23O23S2", molWeight: "1815.1 g/mol", halfLife: "short",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "mots-c", name: "MOTS-c", aka: "Mitochondrial Peptide",
    category: "performance", tags: ["mitochondrial", "metabolic", "endurance"], featured: true,
    sizes: [{label:"10mg", price:59.99, sku:"MOTS-10"}],
    summary: "A mitochondrial-derived peptide studied in metabolic-regulation and exercise models.",
    overview: "MOTS-c is a mitochondrial-derived peptide encoded within the mitochondrial genome. It is studied for its role as a regulator of metabolic homeostasis, insulin sensitivity, and exercise capacity, and is a leading compound in mitochondrial-signaling research.",
    research: ["Metabolic-homeostasis models", "AMPK-pathway signaling", "Exercise-capacity & endurance research", "Insulin-sensitivity studies"],
    cas: "1627580-64-6", sequence: "Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg",
    molFormula: "C101H152N28O22S2", molWeight: "2174.6 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "5-amino-1mq", name: "5-Amino-1MQ", aka: "NNMT Inhibitor",
    category: "metabolic", tags: ["nnmt", "metabolic", "oral"], featured: false, form: "solution",
    sizes: [{label:"50mg/mL (30mL)", price:69.99, sku:"AMQ-30"}],
    summary: "A small-molecule NNMT inhibitor studied in metabolic and adipocyte research.",
    overview: "5-Amino-1MQ is a small-molecule inhibitor of the enzyme NNMT (nicotinamide N-methyltransferase). It is studied in metabolic research for effects on adipocyte metabolism, NAD+ salvage pathways, and body-composition models.",
    research: ["NNMT-enzyme inhibition models", "Adipocyte-metabolism research", "NAD+ pathway studies"],
    cas: "42464-96-0", sequence: "Non-peptide small molecule",
    molFormula: "C10H13N2+", molWeight: "173.2 g/mol", halfLife: "model-dependent",
    storage: "Store solution at room temperature away from light.", purity: "≥98%"
  },
  {
    id: "kpv", name: "KPV", aka: "α-MSH Fragment",
    category: "immune", tags: ["anti-inflammatory", "gut"], featured: false,
    sizes: [{label:"10mg", price:39.99, sku:"KPV-10"}],
    summary: "A tripeptide α-MSH fragment studied in anti-inflammatory and gut research.",
    overview: "KPV is the C-terminal tripeptide of alpha-melanocyte-stimulating hormone. It is studied for anti-inflammatory activity, particularly in gastrointestinal and skin-inflammation models, retaining anti-inflammatory effects while lacking pigmentary activity.",
    research: ["Anti-inflammatory-pathway models", "Gastrointestinal-inflammation research", "Skin-inflammation studies"],
    cas: "67727-97-3", sequence: "Lys-Pro-Val",
    molFormula: "C16H30N4O4", molWeight: "342.4 g/mol", halfLife: "short",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "retatrutide", name: "Retatrutide", aka: "GGG Tri-Agonist (LY3437943)",
    category: "glp1", tags: ["glp-1", "gip", "glucagon", "triple-agonist"], featured: true,
    sizes: [{label:"5mg", price:109.99, sku:"RETA-5"}, {label:"10mg", price:189.99, sku:"RETA-10"}],
    summary: "A triple GIP / GLP-1 / glucagon receptor agonist studied in advanced metabolic models.",
    overview: "Retatrutide is a single-molecule agonist acting on three incretin and energy-metabolism receptors — GIP, GLP-1, and glucagon. This triple-agonist mechanism is a leading area of metabolic research, studied for combined effects on glucose regulation, lipid metabolism, and energy expenditure beyond single- or dual-incretin compounds.",
    research: ["Triple-receptor incretin signaling", "Energy-expenditure & thermogenesis models", "Glucose & lipid metabolism", "Comparative agonist studies"],
    cas: "2381089-83-2", sequence: "39-aa synthetic peptide with fatty-diacid moiety",
    molFormula: "—", molWeight: "≈4731 g/mol", halfLife: "~6 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "cagrilintide", name: "Cagrilintide", aka: "Long-Acting Amylin Analog",
    category: "glp1", tags: ["amylin", "satiety", "metabolic"], featured: false,
    sizes: [{label:"5mg", price:99.99, sku:"CAGRI-5"}, {label:"10mg", price:169.99, sku:"CAGRI-10"}],
    summary: "A long-acting amylin analog studied alongside incretins in satiety research.",
    overview: "Cagrilintide is a long-acting analog of amylin, a pancreatic hormone co-secreted with insulin. It is studied for effects on satiety signaling and gastric emptying, frequently in combination with GLP-1 agonists to model complementary metabolic pathways.",
    research: ["Amylin-receptor signaling", "Satiety & appetite models", "Gastric-emptying research", "Combination incretin studies"],
    cas: "N/A (provided per lot)", sequence: "Modified amylin analog, acylated",
    molFormula: "—", molWeight: "≈3800 g/mol", halfLife: "~7 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "mod-grf-1-29", name: "Mod GRF 1-29", aka: "CJC-1295 (no DAC)",
    category: "growth", tags: ["ghrh", "releasing"], featured: false,
    sizes: [{label:"2mg", price:39.99, sku:"MGRF-2"}, {label:"5mg", price:74.99, sku:"MGRF-5"}],
    summary: "A stabilized GHRH(1-29) analog studied for short-acting GH pulses.",
    overview: "Mod GRF 1-29 (CJC-1295 without DAC) is a tetra-substituted GHRH(1-29) analog engineered for resistance to enzymatic degradation while retaining a short half-life. It is a common reference compound in GH-axis research and is frequently paired with a secretagogue such as Ipamorelin.",
    research: ["GHRH-receptor signaling", "Short-acting GH-pulse models", "Combination secretagogue studies"],
    cas: "N/A (research compound)", sequence: "Modified GRF(1-29) — D-Ala2, Gln8, Ala15, Leu27",
    molFormula: "—", molWeight: "≈3367 g/mol", halfLife: "~30 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "ghrp-2", name: "GHRP-2", aka: "Pralmorelin",
    category: "growth", tags: ["ghrp", "secretagogue"], featured: false,
    sizes: [{label:"5mg", price:39.99, sku:"GHRP2-5"}, {label:"10mg", price:64.99, sku:"GHRP2-10"}],
    summary: "A growth-hormone-releasing hexapeptide studied for potent GH-pulse release.",
    overview: "GHRP-2 (Pralmorelin) is a synthetic hexapeptide secretagogue that stimulates GH release via the ghrelin receptor. It is studied for potent GH-pulse induction, with some documented effect on appetite and prolactin relative to more selective secretagogues.",
    research: ["Ghrelin-receptor signaling", "GH-pulse stimulation models", "Appetite-pathway research"],
    cas: "158861-67-7", sequence: "D-Ala-D-2-Nal-Ala-Trp-D-Phe-Lys-NH2",
    molFormula: "C45H55N9O6", molWeight: "817.9 g/mol", halfLife: "~30–60 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "ghrp-6", name: "GHRP-6", aka: "GH Releasing Peptide-6",
    category: "growth", tags: ["ghrp", "secretagogue", "appetite"], featured: false,
    sizes: [{label:"5mg", price:37.99, sku:"GHRP6-5"}, {label:"10mg", price:59.99, sku:"GHRP6-10"}],
    summary: "A first-generation GH-releasing hexapeptide studied in GH and appetite models.",
    overview: "GHRP-6 is one of the original growth-hormone-releasing peptides. It stimulates GH secretion through the ghrelin receptor and is notably studied for its pronounced effect on appetite signaling, serving as a reference compound in secretagogue research.",
    research: ["Ghrelin-receptor signaling", "GH-secretion models", "Appetite & food-intake research", "Cytoprotection studies"],
    cas: "87616-84-0", sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH2",
    molFormula: "C46H56N12O6", molWeight: "873.0 g/mol", halfLife: "~15–60 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "igf-1-lr3", name: "IGF-1 LR3", aka: "Long R3 IGF-1",
    category: "performance", tags: ["igf-1", "growth-factor", "anabolic"], featured: true,
    sizes: [{label:"1mg", price:99.99, sku:"IGF-1"}],
    summary: "A long-acting IGF-1 analog studied in cell growth and hypertrophy models.",
    overview: "IGF-1 LR3 is an 83-amino-acid analog of insulin-like growth factor 1, modified for reduced binding to IGF-binding proteins and therefore extended half-life. It is studied extensively in cell proliferation, differentiation, and muscle-hypertrophy research.",
    research: ["IGF-1 receptor signaling", "Cell proliferation & differentiation", "Muscle-hypertrophy models", "Nutrient-partitioning research"],
    cas: "946870-92-4", sequence: "83-aa IGF-1 analog (Arg3, N-terminal 13-aa extension)",
    molFormula: "—", molWeight: "≈9111 g/mol", halfLife: "~20–30 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "ss-31", name: "SS-31", aka: "Elamipretide",
    category: "performance", tags: ["mitochondrial", "cardiolipin", "antioxidant"], featured: false,
    sizes: [{label:"10mg", price:79.99, sku:"SS31-10"}, {label:"50mg", price:279.99, sku:"SS31-50"}],
    summary: "A mitochondria-targeting tetrapeptide studied in cardiolipin and energy models.",
    overview: "SS-31 (Elamipretide) is a cell-permeable tetrapeptide that concentrates in the inner mitochondrial membrane and associates with cardiolipin. It is studied for its role in stabilizing mitochondrial structure, supporting electron transport, and reducing reactive oxygen species in energy-metabolism research.",
    research: ["Cardiolipin-interaction models", "Mitochondrial bioenergetics", "Reactive-oxygen-species research", "Ischemia-reperfusion studies"],
    cas: "736992-21-5", sequence: "D-Arg-Dmt-Lys-Phe-NH2",
    molFormula: "C32H49N9O5", molWeight: "639.8 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "humanin", name: "Humanin", aka: "HN / Mitochondrial Peptide",
    category: "longevity", tags: ["mitochondrial", "cytoprotection", "longevity"], featured: false,
    sizes: [{label:"5mg", price:69.99, sku:"HN-5"}],
    summary: "A mitochondrial-derived peptide studied in cytoprotection and aging models.",
    overview: "Humanin is a mitochondrial-derived peptide studied for cytoprotective signaling and its role in cellular stress resistance. Research interest spans metabolic regulation, neuroprotection, and cellular-aging pathways, making it a companion compound to MOTS-c in mitochondrial research.",
    research: ["Cytoprotection & apoptosis models", "Metabolic-regulation research", "Neuroprotection studies", "Cellular-aging pathways"],
    cas: "N/A (research compound)", sequence: "24-aa mitochondrial-derived peptide",
    molFormula: "—", molWeight: "≈2687 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "kisspeptin-10", name: "Kisspeptin-10", aka: "KP-10 / Metastin fragment",
    category: "endocrine", tags: ["endocrine", "reproductive", "gnrh"], featured: false,
    sizes: [{label:"5mg", price:54.99, sku:"KP10-5"}],
    summary: "A decapeptide studied in reproductive and neuroendocrine signaling.",
    overview: "Kisspeptin-10 is the active decapeptide fragment of kisspeptin, a key upstream regulator of GnRH release. It is studied in reproductive-axis and neuroendocrine research for its role in triggering downstream gonadotropin signaling.",
    research: ["KISS1R receptor signaling", "GnRH-release models", "Reproductive-axis research", "Neuroendocrine studies"],
    cas: "374675-21-5", sequence: "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH2",
    molFormula: "C63H83N17O14", molWeight: "1302.4 g/mol", halfLife: "short (minutes)",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "gonadorelin", name: "Gonadorelin", aka: "GnRH",
    category: "endocrine", tags: ["endocrine", "gnrh", "reproductive"], featured: false,
    sizes: [{label:"2mg", price:39.99, sku:"GONA-2"}, {label:"10mg", price:89.99, sku:"GONA-10"}],
    summary: "A synthetic GnRH decapeptide studied in gonadotropin-release models.",
    overview: "Gonadorelin is a synthetic form of gonadotropin-releasing hormone (GnRH). It is studied for its stimulation of pituitary LH and FSH release, serving as a foundational reference compound in reproductive-endocrinology research.",
    research: ["GnRH-receptor signaling", "LH/FSH-release models", "Pituitary-axis research"],
    cas: "33515-09-2", sequence: "pGlu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH2",
    molFormula: "C55H75N17O13", molWeight: "1182.3 g/mol", halfLife: "~2–10 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "oxytocin", name: "Oxytocin", aka: "OT / Neuropeptide",
    category: "endocrine", tags: ["endocrine", "neuropeptide", "behavior"], featured: false,
    sizes: [{label:"5mg", price:49.99, sku:"OXY-5"}],
    summary: "A nonapeptide hormone studied in social-behavior and neuroendocrine models.",
    overview: "Oxytocin is a nine-amino-acid neuropeptide hormone studied for its role in social bonding, behavior, and smooth-muscle signaling. It is a widely referenced compound in neuroendocrine and behavioral research.",
    research: ["Oxytocin-receptor signaling", "Social-behavior models", "Neuroendocrine research", "Smooth-muscle studies"],
    cas: "50-56-6", sequence: "Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2 (disulfide)",
    molFormula: "C43H66N12O12S2", molWeight: "1007.2 g/mol", halfLife: "~3–5 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "melanotan-1", name: "Melanotan I", aka: "Afamelanotide / MT-I",
    category: "metabolic", tags: ["melanocortin", "pigment"], featured: false,
    sizes: [{label:"10mg", price:44.99, sku:"MT1-10"}],
    summary: "A linear α-MSH analog studied in pigmentation-pathway research.",
    overview: "Melanotan I (Afamelanotide) is a linear analog of alpha-melanocyte-stimulating hormone. Compared with Melanotan II, it is more selective for the MC1R receptor and is studied specifically in melanogenesis (pigmentation) research.",
    research: ["MC1R receptor selectivity", "Melanogenesis models", "Photoprotection research"],
    cas: "75921-69-6", sequence: "Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2",
    molFormula: "C78H111N21O19", molWeight: "1646.9 g/mol", halfLife: "~1 hour",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "ll-37", name: "LL-37", aka: "Cathelicidin (Human)",
    category: "immune", tags: ["antimicrobial", "immune", "cathelicidin"], featured: false,
    sizes: [{label:"5mg", price:79.99, sku:"LL37-5"}],
    summary: "A human cathelicidin peptide studied in antimicrobial and immune research.",
    overview: "LL-37 is the only human cathelicidin-derived antimicrobial peptide. It is studied for broad antimicrobial activity, immunomodulation, and roles in wound healing and angiogenesis, making it a key compound in innate-immunity research.",
    research: ["Antimicrobial-activity models", "Innate-immune signaling", "Wound-healing research", "Angiogenesis studies"],
    cas: "154947-66-7", sequence: "37-aa cathelicidin peptide (LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES)",
    molFormula: "—", molWeight: "≈4493 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥95%"
  },
  {
    id: "nad-plus", name: "NAD+", aka: "Nicotinamide Adenine Dinucleotide",
    category: "longevity", tags: ["nad", "coenzyme", "metabolic"], featured: false, form: "vial",
    sizes: [{label:"100mg", price:44.99, sku:"NAD-100"}, {label:"500mg", price:129.99, sku:"NAD-500"}],
    summary: "A central coenzyme studied in cellular energy and aging research.",
    overview: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to cellular energy metabolism and redox reactions. It is studied in aging, mitochondrial-function, and sirtuin-pathway research as levels decline with cellular age.",
    research: ["Cellular energy-metabolism models", "Sirtuin-pathway signaling", "Mitochondrial-function research", "Cellular-aging studies"],
    cas: "53-84-9", sequence: "Dinucleotide coenzyme (non-peptide)",
    molFormula: "C21H27N7O14P2", molWeight: "663.4 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C, protected from light. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "peg-mgf", name: "PEG-MGF", aka: "Pegylated Mechano Growth Factor",
    category: "performance", tags: ["mgf", "growth-factor", "repair"], featured: false,
    sizes: [{label:"2mg", price:54.99, sku:"PMGF-2"}, {label:"5mg", price:99.99, sku:"PMGF-5"}],
    summary: "A pegylated IGF-1 splice variant studied in muscle-repair and satellite-cell models.",
    overview: "PEG-MGF is a pegylated form of Mechano Growth Factor, a splice variant of IGF-1 (IGF-1Ec) expressed in response to mechanical load. Pegylation extends its half-life. It is studied for its role in activating muscle satellite cells and supporting local tissue repair following mechanical stress.",
    research: ["Satellite-cell activation models", "Local muscle-repair research", "IGF-1 splice-variant signaling"],
    cas: "N/A (research compound)", sequence: "Pegylated MGF (IGF-1Ec) analog",
    molFormula: "—", molWeight: "≈2900 g/mol (peptide portion)", halfLife: "extended (pegylated)",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "igf-1-des", name: "IGF-1 DES", aka: "DES(1-3) IGF-1",
    category: "performance", tags: ["igf-1", "growth-factor", "potent"], featured: false,
    sizes: [{label:"1mg", price:109.99, sku:"IGFD-1"}],
    summary: "A truncated, highly potent IGF-1 variant studied in localized growth models.",
    overview: "IGF-1 DES is a naturally occurring, truncated form of IGF-1 lacking the first three N-terminal amino acids. This modification greatly reduces binding-protein affinity, making it substantially more potent than native IGF-1 in localized-action research models.",
    research: ["IGF-1 receptor signaling", "Localized hypertrophy models", "Cell-proliferation research"],
    cas: "112603-35-3", sequence: "67-aa DES(1-3) IGF-1 analog",
    molFormula: "—", molWeight: "≈7649 g/mol", halfLife: "very short",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "follistatin-344", name: "Follistatin 344", aka: "FST-344",
    category: "performance", tags: ["myostatin", "muscle", "protein"], featured: false, stock: "low",
    sizes: [{label:"1mg", price:189.99, sku:"FST-1"}],
    summary: "A myostatin-binding protein studied in muscle-regulation research.",
    overview: "Follistatin 344 is a glycoprotein that binds and inhibits myostatin and other TGF-β family members. It is a key research protein for studying negative regulation of muscle growth and the myostatin pathway.",
    research: ["Myostatin-inhibition models", "TGF-β family signaling", "Muscle-regulation research"],
    cas: "N/A (research protein)", sequence: "344-aa follistatin isoform",
    molFormula: "—", molWeight: "≈38 kDa", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C, use promptly.", purity: "≥95%"
  },
  {
    id: "adipotide", name: "Adipotide", aka: "FTPP / Prohibitin-TP",
    category: "metabolic", tags: ["adipose", "experimental", "metabolic"], featured: false, stock: "out",
    sizes: [{label:"5mg", price:99.99, sku:"ADIPO-5"}, {label:"10mg", price:169.99, sku:"ADIPO-10"}],
    summary: "A targeted pro-apoptotic peptide studied in adipose-vasculature models.",
    overview: "Adipotide (FTPP) is an experimental peptidomimetic designed to target the vasculature supplying white adipose tissue, triggering localized apoptosis. It is studied in metabolic and obesity research models as a targeted anti-adipose approach.",
    research: ["Adipose-vasculature targeting", "Pro-apoptotic signaling models", "Obesity & metabolic research"],
    cas: "N/A (research compound)", sequence: "CKGGRAKDC-GG-D(KLAKLAK)2 peptidomimetic",
    molFormula: "—", molWeight: "≈2620 g/mol", halfLife: "short",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "survodutide", name: "Survodutide", aka: "GLP-1 / Glucagon Dual Agonist (BI 456906)",
    category: "glp1", tags: ["glp-1", "glucagon", "metabolic"], featured: false,
    sizes: [{label:"5mg", price:109.99, sku:"SURV-5"}, {label:"10mg", price:189.99, sku:"SURV-10"}],
    summary: "A GLP-1 / glucagon dual receptor agonist studied in metabolic and hepatic models.",
    overview: "Survodutide is a dual agonist of the GLP-1 and glucagon receptors. The glucagon component adds an energy-expenditure and hepatic dimension to incretin signaling, and it is studied in metabolic, body-composition, and liver-research models.",
    research: ["GLP-1 + glucagon dual signaling", "Energy-expenditure models", "Hepatic-metabolism research"],
    cas: "N/A (research compound)", sequence: "Acylated GLP-1/glucagon dual-agonist peptide",
    molFormula: "—", molWeight: "≈4700 g/mol", halfLife: "~6–7 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "mazdutide", name: "Mazdutide", aka: "GLP-1 / Glucagon Dual Agonist (IBI362)",
    category: "glp1", tags: ["glp-1", "glucagon", "metabolic"], featured: false,
    sizes: [{label:"5mg", price:104.99, sku:"MAZ-5"}, {label:"10mg", price:179.99, sku:"MAZ-10"}],
    summary: "An oxyntomodulin-based GLP-1 / glucagon dual agonist studied in metabolic models.",
    overview: "Mazdutide is a GLP-1 and glucagon receptor dual agonist based on the oxyntomodulin backbone. It is studied for combined effects on glucose regulation, energy expenditure, and body composition in metabolic research.",
    research: ["Oxyntomodulin-analog signaling", "Dual GLP-1/glucagon models", "Body-composition research"],
    cas: "N/A (research compound)", sequence: "Oxyntomodulin-based dual-agonist peptide",
    molFormula: "—", molWeight: "≈4800 g/mol", halfLife: "~5–7 days",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "dihexa", name: "Dihexa", aka: "N-hexanoic-Tyr-Ile-(6) aminohexanoic amide",
    category: "neuro", tags: ["nootropic", "oral", "hgf"], featured: false, form: "solution",
    sizes: [{label:"10mg/mL (10mL)", price:79.99, sku:"DIHEXA-10"}],
    summary: "An orally active angiotensin-derived peptide studied for synaptogenesis.",
    overview: "Dihexa is a small, orally active peptide derived from angiotensin IV, studied for potent effects on synapse formation (synaptogenesis) via the HGF/c-Met system. It is a leading compound in cognition and neuroplasticity research.",
    research: ["HGF/c-Met signaling", "Synaptogenesis models", "Cognition & neuroplasticity research"],
    cas: "1401708-83-5", sequence: "N-hexanoic-Tyr-Ile-(6)-aminohexanoic amide",
    molFormula: "—", molWeight: "≈442.6 g/mol", halfLife: "model-dependent",
    storage: "Store solution at room temperature away from light.", purity: "≥98%"
  },
  {
    id: "pinealon", name: "Pinealon", aka: "Ala-Glu-Asp-Gly bioregulator",
    category: "neuro", tags: ["bioregulator", "neuroprotection", "peptide"], featured: false,
    sizes: [{label:"20mg", price:49.99, sku:"PIN-20"}],
    summary: "A short peptide bioregulator studied in neuroprotection and brain-aging models.",
    overview: "Pinealon is a synthetic tripeptide bioregulator studied for neuroprotective effects and roles in brain cellular function and aging. It belongs to the family of short-peptide bioregulators researched for tissue-specific gene-expression modulation.",
    research: ["Neuroprotection models", "Brain-aging research", "Peptide-bioregulator signaling"],
    cas: "N/A (research compound)", sequence: "Glu-Asp-Arg (EDR)",
    molFormula: "C15H26N6O8", molWeight: "≈418.4 g/mol", halfLife: "short",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "thymalin", name: "Thymalin", aka: "Thymus Peptide Bioregulator",
    category: "immune", tags: ["immune", "thymus", "bioregulator"], featured: false,
    sizes: [{label:"10mg", price:59.99, sku:"THYM-10"}],
    summary: "A thymus-derived peptide complex studied in immune-regulation research.",
    overview: "Thymalin is a peptide bioregulator derived from the thymus, studied for its role in T-cell regulation and restoration of immune balance in aging models. It is a companion compound to Thymosin Alpha-1 in immune research.",
    research: ["T-cell regulation models", "Immune-senescence research", "Thymic-peptide signaling"],
    cas: "N/A (research compound)", sequence: "Thymic peptide complex",
    molFormula: "—", molWeight: "complex", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥95%"
  },
  {
    id: "vip", name: "VIP", aka: "Vasoactive Intestinal Peptide",
    category: "immune", tags: ["immune", "anti-inflammatory", "neuropeptide"], featured: false,
    sizes: [{label:"5mg", price:74.99, sku:"VIP-5"}],
    summary: "A 28-amino-acid neuropeptide studied in immune-modulation and inflammation research.",
    overview: "VIP (Vasoactive Intestinal Peptide) is a 28-amino-acid neuropeptide with broad signaling roles, studied for anti-inflammatory and immunomodulatory activity as well as effects on vasodilation and circadian regulation.",
    research: ["VPAC-receptor signaling", "Anti-inflammatory models", "Immune-modulation research", "Circadian studies"],
    cas: "37221-79-7", sequence: "His-Ser-Asp-Ala-Val-Phe-Thr-Asp-Asn-Tyr-Thr-Arg-Leu-Arg-Lys-Gln-Met-Ala-Val-Lys-Lys-Tyr-Leu-Asn-Ser-Ile-Leu-Asn-NH2",
    molFormula: "C147H237N43O43S", molWeight: "3326.8 g/mol", halfLife: "~1–2 minutes",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "argireline", name: "Argireline", aka: "Acetyl Hexapeptide-8",
    category: "cosmetic", tags: ["cosmetic", "topical", "wrinkle"], featured: true, form: "solution",
    sizes: [{label:"10mg/mL (30mL)", price:44.99, sku:"ARG-30"}],
    summary: "A topical hexapeptide studied in expression-line and dermal-cosmetic research.",
    overview: "Argireline (Acetyl Hexapeptide-8) is a synthetic peptide studied in cosmetic science for its reported effect on reducing the appearance of expression lines by modulating catecholamine release at the neuromuscular junction. It is a widely referenced topical cosmetic peptide.",
    research: ["Neuromuscular-signaling (topical) models", "Expression-line cosmetic research", "Dermal-formulation studies"],
    cas: "616204-22-9", sequence: "Ac-Glu-Glu-Met-Gln-Arg-Arg-NH2",
    molFormula: "C34H60N14O12S", molWeight: "888.98 g/mol", halfLife: "topical",
    storage: "Store solution refrigerated 2–8°C, away from light.", purity: "≥95%"
  },
  {
    id: "matrixyl", name: "Matrixyl", aka: "Palmitoyl Pentapeptide-4",
    category: "cosmetic", tags: ["cosmetic", "collagen", "topical"], featured: false, form: "solution",
    sizes: [{label:"10mg/mL (30mL)", price:49.99, sku:"MTX-30"}],
    summary: "A palmitoylated peptide studied in collagen and dermal-matrix cosmetic research.",
    overview: "Matrixyl (Palmitoyl Pentapeptide-4, Pal-KTTKS) is a lipopeptide studied in cosmetic science for stimulating extracellular-matrix and collagen synthesis in dermal-research models. The palmitoyl chain improves skin penetration in topical formulations.",
    research: ["Collagen & matrix-synthesis models", "Dermal-fibroblast research", "Topical-formulation studies"],
    cas: "214047-00-4", sequence: "Pal-Lys-Thr-Thr-Lys-Ser",
    molFormula: "C39H75N7O10", molWeight: "802.06 g/mol", halfLife: "topical",
    storage: "Store solution refrigerated 2–8°C, away from light.", purity: "≥95%"
  },
  {
    id: "liraglutide", name: "Liraglutide", aka: "GLP-1 Receptor Agonist (daily)",
    category: "glp1", tags: ["glp-1", "glucose", "metabolic"], featured: false,
    sizes: [{label:"5mg", price:79.99, sku:"LIRA-5"}, {label:"10mg", price:139.99, sku:"LIRA-10"}],
    summary: "A once-daily GLP-1 receptor agonist widely used as a reference incretin compound.",
    overview: "Liraglutide is a GLP-1 receptor agonist with an acylated structure giving it a ~13-hour half-life suited to daily dosing. It is a long-established reference compound in incretin, glucose-regulation, and appetite-pathway research, predating the weekly agonists.",
    research: ["Incretin & insulin-secretion models", "Glucose-dependent signaling", "Appetite/satiety research", "Gastric-emptying studies"],
    cas: "204656-20-2", sequence: "Arg34,Lys26-(N-ε-(γ-Glu(N-α-hexadecanoyl)))-GLP-1(7-37)",
    molFormula: "C172H265N43O51", molWeight: "3751.2 g/mol", halfLife: "~13 hours",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "hgh-191", name: "HGH 191aa", aka: "Somatropin (recombinant)",
    category: "growth", tags: ["growth-hormone", "igf-1", "recombinant"], featured: false, stock: "low",
    sizes: [{label:"10 IU", price:79.99, sku:"HGH-10"}, {label:"15 IU", price:109.99, sku:"HGH-15"}],
    summary: "Recombinant 191-amino-acid human growth hormone, a core GH-axis reference protein.",
    overview: "HGH 191aa (somatropin) is recombinant human growth hormone with the full native 191-amino-acid sequence. It is the reference standard in GH/IGF-1 axis research, studied for effects on cellular growth, metabolism, and body composition.",
    research: ["GH-receptor signaling", "IGF-1 axis models", "Metabolism & body-composition research", "Cellular-growth studies"],
    cas: "12629-01-5", sequence: "191-aa recombinant hGH",
    molFormula: "C990H1528N262O300S7", molWeight: "≈22124 g/mol", halfLife: "~2–4 hours",
    storage: "Lyophilized: store at 2–8°C. Reconstituted: refrigerate, use within days.", purity: "≥98%"
  },
  {
    id: "cerebrolysin", name: "Cerebrolysin", aka: "Neuropeptide Preparation",
    category: "neuro", tags: ["neurotrophic", "cognition", "cns"], featured: false, form: "solution",
    sizes: [{label:"5mL × 5 amp", price:99.99, sku:"CERE-5"}],
    summary: "A neuropeptide preparation studied for neurotrophic and neuroprotective activity.",
    overview: "Cerebrolysin is a standardized preparation of low-molecular-weight neuropeptides and amino acids studied for neurotrophic, neuroprotective, and cognition-supporting effects in CNS research models. It is supplied as a ready-to-use solution.",
    research: ["Neurotrophic-factor mimetic models", "Neuroprotection research", "Cognition & recovery studies"],
    cas: "N/A (peptide preparation)", sequence: "Mixture of neuropeptides & free amino acids",
    molFormula: "Mixture", molWeight: "Mixture (<10 kDa)", halfLife: "preparation-dependent",
    storage: "Store at room temperature, protected from light.", purity: "Standardized preparation"
  },
  {
    id: "snap-8", name: "SNAP-8", aka: "Acetyl Octapeptide-3",
    category: "cosmetic", tags: ["cosmetic", "topical", "expression-lines"], featured: false, form: "solution",
    sizes: [{label:"10mg/mL (30mL)", price:44.99, sku:"SNAP-30"}],
    summary: "A topical octapeptide studied in expression-line cosmetic research.",
    overview: "SNAP-8 (Acetyl Octapeptide-3) is an elongation of the Argireline hexapeptide, studied in cosmetic science for modulating neurotransmitter release at the neuromuscular junction to reduce the appearance of expression lines in topical formulations.",
    research: ["SNARE-complex (topical) models", "Expression-line cosmetic research", "Dermal-formulation studies"],
    cas: "868844-74-0", sequence: "Ac-Glu-Glu-Met-Gln-Arg-Arg-NH2 (octapeptide analog)",
    molFormula: "C43H74N16O15S", molWeight: "1075.2 g/mol", halfLife: "topical",
    storage: "Store solution refrigerated 2–8°C, away from light.", purity: "≥95%"
  },
  {
    id: "glutathione", name: "Glutathione", aka: "Reduced GSH",
    category: "longevity", tags: ["antioxidant", "detox", "cellular"], featured: false, form: "vial",
    sizes: [{label:"600mg", price:39.99, sku:"GSH-600"}, {label:"1500mg", price:79.99, sku:"GSH-1500"}],
    summary: "The primary cellular antioxidant tripeptide, studied in redox and detox research.",
    overview: "Glutathione (reduced, GSH) is a tripeptide and the body's principal intracellular antioxidant. It is studied in redox-balance, detoxification, and cellular-aging research, central to protecting cells from oxidative stress.",
    research: ["Redox-balance models", "Oxidative-stress research", "Detoxification pathways", "Cellular-aging studies"],
    cas: "70-18-8", sequence: "γ-Glu-Cys-Gly",
    molFormula: "C10H17N3O6S", molWeight: "307.32 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C, protected from light. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "larazotide", name: "Larazotide", aka: "AT-1001 (oral)",
    category: "immune", tags: ["gut", "barrier", "oral"], featured: false, form: "solution",
    sizes: [{label:"10mg/mL (10mL)", price:59.99, sku:"LARA-10"}],
    summary: "An orally active peptide studied in intestinal tight-junction and gut-barrier research.",
    overview: "Larazotide (AT-1001) is an orally active octapeptide studied for its effect on intestinal tight junctions and gut-barrier integrity, notably as a zonulin antagonist in permeability ('leaky gut') research models.",
    research: ["Tight-junction regulation models", "Gut-barrier integrity research", "Zonulin-pathway studies"],
    cas: "258818-34-7", sequence: "Gly-Gly-Val-Leu-Val-Gln-Pro-Gly",
    molFormula: "C33H57N9O10", molWeight: "739.9 g/mol", halfLife: "gut-localized",
    storage: "Store solution refrigerated 2–8°C.", purity: "≥98%"
  },
  {
    id: "tesa-ipa-blend", name: "Tesamorelin + Ipamorelin Blend", aka: "GHRH + GHRP Blend",
    category: "blends", tags: ["blend", "gh-axis"], featured: false,
    sizes: [{label:"12mg + 6mg", price:139.99, sku:"BLND-TI"}],
    summary: "A pre-combined GHRH + secretagogue blend for multi-pathway GH-axis study.",
    overview: "This research blend combines Tesamorelin (a GHRH analog) with Ipamorelin (a selective secretagogue) in a single vial. The pairing is commonly used in GH-axis research to study the complementary GHRH + GHRP mechanism in one preparation.",
    research: ["Combined GHRH + GHRP signaling", "GH/IGF-1 axis models", "Body-composition research"],
    cas: "N/A (blend)", sequence: "See individual components",
    molFormula: "Blend", molWeight: "Blend", halfLife: "component-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "aicar", name: "AICAR", aka: "Acadesine / AMPK Activator",
    category: "metabolic", tags: ["ampk", "endurance", "metabolic"], featured: false, form: "vial",
    sizes: [{label:"50mg", price:59.99, sku:"AICAR-50"}],
    summary: "An AMPK-activating nucleotide studied in endurance and metabolic models.",
    overview: "AICAR (5-aminoimidazole-4-carboxamide ribonucleotide) is an activator of AMP-activated protein kinase (AMPK), a central regulator of cellular energy. It is studied in metabolic and exercise-physiology research for effects on glucose uptake, fatty-acid oxidation, and endurance capacity.",
    research: ["AMPK-pathway activation", "Glucose-uptake models", "Fatty-acid oxidation research", "Endurance & exercise-mimetic studies"],
    cas: "2627-69-2", sequence: "Nucleotide (non-peptide)",
    molFormula: "C9H14N4O5", molWeight: "258.23 g/mol", halfLife: "model-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥98%"
  },
  {
    id: "glow-blend", name: "GLOW Blend", aka: "GHK-Cu + BPC-157 + TB-500",
    category: "blends", tags: ["blend", "skin", "recovery"], featured: true, form: "vial",
    sizes: [{label:"GHK 50mg + BPC 10mg + TB 10mg", price:129.99, sku:"BLND-GLOW"}],
    summary: "A popular three-peptide research blend combining skin-remodeling and repair compounds.",
    overview: "The GLOW blend combines GHK-Cu, BPC-157, and TB-500 in a single vial — pairing a copper skin-remodeling peptide with two of the most-studied repair peptides. It is dosed by the amount of each component the label lists rather than as a single compound, and is used to study skin, connective-tissue, and systemic-repair pathways together.",
    research: ["Skin-remodeling + systemic repair", "Collagen & connective-tissue models", "Angiogenesis pathways"],
    cas: "N/A (blend)", sequence: "See individual components: GHK-Cu, BPC-157, TB-500",
    molFormula: "Blend", molWeight: "Blend", halfLife: "component-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "recovery-blend", name: "Recovery Blend", aka: "BPC-157 + TB-500",
    category: "blends", tags: ["blend", "recovery", "healing"], featured: false, form: "vial",
    sizes: [{label:"BPC 10mg + TB 10mg", price:99.99, sku:"BLND-REC"}],
    summary: "The classic two-peptide repair blend in a single research vial.",
    overview: "This blend combines BPC-157 and TB-500 — the two most-referenced tissue-repair peptides — in one vial for multi-pathway healing research. Components are dosed individually per the label.",
    research: ["Tendon & ligament repair", "Angiogenesis + actin regulation", "Gastrointestinal-integrity models"],
    cas: "N/A (blend)", sequence: "See individual components: BPC-157, TB-500",
    molFormula: "Blend", molWeight: "Blend", halfLife: "component-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "cjc-ipa-blend", name: "CJC-1295 + Ipamorelin Blend", aka: "GHRH + GHRP Blend",
    category: "blends", tags: ["blend", "gh-axis"], featured: false, form: "vial",
    sizes: [{label:"CJC 5mg + IPA 5mg", price:99.99, sku:"BLND-CI"}],
    summary: "A GHRH + secretagogue blend for combined GH-axis research.",
    overview: "This blend pairs CJC-1295 (a GHRH analog) with Ipamorelin (a selective secretagogue) — the most common GH-optimization combination — in a single vial for studying the complementary GHRH + GHRP mechanism.",
    research: ["Combined GHRH + GHRP signaling", "GH/IGF-1 axis models", "Body-composition research"],
    cas: "N/A (blend)", sequence: "See individual components: CJC-1295, Ipamorelin",
    molFormula: "Blend", molWeight: "Blend", halfLife: "component-dependent",
    storage: "Lyophilized: store at -20°C. Reconstituted: refrigerate 2–8°C.", purity: "≥99%"
  },
  {
    id: "bac-water", name: "Bacteriostatic Water", aka: "0.9% Benzyl Alcohol",
    category: "supplies", tags: ["reconstitution", "solvent"], featured: false, form: "vial",
    sizes: [{label:"30mL", price:16.99, sku:"BAC-30"}, {label:"3-pack (30mL)", price:39.99, sku:"BAC-3PK"}],
    summary: "Sterile bacteriostatic water for laboratory reconstitution of lyophilized compounds.",
    overview: "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol as a preservative, allowing multiple withdrawals from a single vial. It is the standard solvent for reconstituting lyophilized research peptides. For laboratory use only.",
    research: ["Reconstitution solvent", "Multi-use vial preservative"],
    cas: "N/A", sequence: "N/A", molFormula: "H2O + 0.9% benzyl alcohol", molWeight: "N/A", halfLife: "N/A",
    storage: "Store at room temperature. Discard 28 days after first puncture.", purity: "USP-grade"
  },
  {
    id: "recon-kit", name: "Reconstitution Kit", aka: "Lab Supplies Kit",
    category: "supplies", tags: ["supplies", "kit"], featured: false, form: "kit",
    sizes: [{label:"Starter kit", price:24.99, sku:"KIT-STD"}],
    summary: "Insulin syringes, alcohol prep pads, and storage case for research handling.",
    overview: "A consumables kit for laboratory handling of reconstituted compounds, including graduated insulin syringes, alcohol prep pads, and a storage case. For laboratory use only.",
    research: ["Sample handling", "Measurement & storage"],
    cas: "N/A", sequence: "N/A", molFormula: "N/A", molWeight: "N/A", halfLife: "N/A",
    storage: "Store at room temperature.", purity: "N/A"
  }
];

/* ---------------------------------------------------------------
   CURATED STACKS — multi-peptide research combinations.
   `components` reference product ids (with optional sizeIndex).
   Dosing figures are research/educational references only.
--------------------------------------------------------------- */
const STACKS = [
  {
    id: "recovery-stack", name: "Recovery & Repair Stack", goal: "Tissue repair · tendon, ligament & gut research",
    featured: true, components: [{id:"bpc-157", sizeIndex:1}, {id:"tb-500", sizeIndex:1}],
    dosing: "BPC-157 200–500 mcg/day; TB-500 2–2.5 mg twice weekly.",
    cycle: "4–8 weeks", note: "The most-referenced healing combination — the two flagship repair peptides run together."
  },
  {
    id: "gh-stack", name: "GH Optimization Stack", goal: "GH / IGF-1 axis research",
    featured: true, components: [{id:"cjc-1295-dac", sizeIndex:0}, {id:"ipamorelin", sizeIndex:0}],
    dosing: "CJC-1295 & Ipamorelin 100–300 mcg each, combined in one draw, pre-sleep.",
    cycle: "8–12 weeks · 5 days on / 2 off", note: "A GHRH analog paired with a selective secretagogue for a clean GH pulse."
  },
  {
    id: "glow-stack", name: "GLOW Skin & Repair Stack", goal: "Skin remodeling + systemic repair",
    featured: true, components: [{id:"ghk-cu", sizeIndex:0}, {id:"bpc-157", sizeIndex:1}, {id:"tb-500", sizeIndex:1}],
    dosing: "Dose each component per label: GHK-Cu ~1–2 mg/day; BPC-157 250 mcg/day; TB-500 2 mg twice weekly.",
    cycle: "4–8 weeks", note: "Copper skin-remodeling peptide plus the two repair flagships — also available pre-mixed as the GLOW blend."
  },
  {
    id: "cognitive-stack", name: "Cognitive Stack", goal: "Nootropic / neuroprotection research",
    featured: false, components: [{id:"semax", sizeIndex:0}, {id:"selank", sizeIndex:0}],
    dosing: "Semax 300–600 mcg/day; Selank 250–500 mcg/day (intranasal in most protocols).",
    cycle: "2–4 weeks", note: "Pairs a BDNF-modulating nootropic with an anxiolytic tuftsin analog."
  },
  {
    id: "longevity-stack", name: "Longevity Stack", goal: "Cellular-aging & mitochondrial research",
    featured: false, components: [{id:"epithalon", sizeIndex:0}, {id:"mots-c", sizeIndex:0}],
    dosing: "Epithalon 5–10 mg/day in short cycles; MOTS-c 5–10 mg/week.",
    cycle: "10–20 day cycles, repeated quarterly", note: "A telomerase-studied tetrapeptide with a mitochondrial-derived peptide."
  },
  {
    id: "metabolic-stack", name: "Metabolic / GLP Stack", goal: "Glucose regulation & body-composition research",
    featured: false, components: [{id:"retatrutide", sizeIndex:0}, {id:"5-amino-1mq", sizeIndex:0}],
    dosing: "Titrate the incretin agonist per protocol; 5-Amino-1MQ taken as an oral solution.",
    cycle: "12+ weeks with titration", note: "A triple-agonist incretin alongside an oral NNMT inhibitor."
  }
];

/* ---------------------------------------------------------------
   QUICK-REFERENCE PROTOCOL CHART — per-compound research figures.
   Joined to PRODUCTS by id for name/price/COA on the page.
--------------------------------------------------------------- */
const PROTOCOLS = [
  { id:"bpc-157",      goal:"Tissue repair / gut",       dosing:"200–500 mcg/day",            cycle:"4–8 weeks",      vialLasts:"10mg ≈ 20–50 days" },
  { id:"tb-500",       goal:"Repair / flexibility",      dosing:"2–2.5 mg twice weekly",      cycle:"4–6 weeks",      vialLasts:"10mg ≈ 2–3 weeks" },
  { id:"ipamorelin",   goal:"GH pulse (selective)",      dosing:"100–300 mcg, 1–3×/day",      cycle:"8–12 weeks",     vialLasts:"5mg ≈ 2–4 weeks" },
  { id:"cjc-1295-dac", goal:"Sustained GH / IGF-1",      dosing:"1–2 mg per week",            cycle:"8–12 weeks",     vialLasts:"2mg ≈ 1–2 weeks" },
  { id:"mod-grf-1-29", goal:"Short GH pulse",            dosing:"100 mcg per dose",           cycle:"8–12 weeks",     vialLasts:"2mg ≈ 2–3 weeks" },
  { id:"tesamorelin",  goal:"Visceral fat / GH",         dosing:"1–2 mg/day",                 cycle:"12+ weeks",      vialLasts:"5mg ≈ 3–5 days" },
  { id:"ghrp-2",       goal:"Potent GH pulse",           dosing:"100–300 mcg, 1–3×/day",      cycle:"8–12 weeks",     vialLasts:"5mg ≈ 2–4 weeks" },
  { id:"ghrp-6",       goal:"GH pulse + appetite",       dosing:"100–300 mcg, 1–3×/day",      cycle:"8–12 weeks",     vialLasts:"5mg ≈ 2–4 weeks" },
  { id:"ghk-cu",       goal:"Skin / collagen",           dosing:"1–2 mg/day",                 cycle:"4–8 weeks",      vialLasts:"50mg ≈ 3–7 weeks" },
  { id:"semaglutide",  goal:"Glucose / metabolic",       dosing:"Titrate 0.25 → 2 mg/week",   cycle:"12+ weeks",      vialLasts:"5mg ≈ 5–20 weeks" },
  { id:"tirzepatide",  goal:"Glucose / metabolic",       dosing:"Titrate 2.5 → 15 mg/week",   cycle:"12+ weeks",      vialLasts:"10mg ≈ 4–8 weeks" },
  { id:"retatrutide",  goal:"Metabolic (tri-agonist)",   dosing:"Titrate weekly per protocol",cycle:"12+ weeks",      vialLasts:"5mg ≈ 2–5 weeks" },
  { id:"epithalon",    goal:"Longevity / telomere",      dosing:"5–10 mg/day",                cycle:"10–20 day cycles", vialLasts:"50mg ≈ 5–10 days" },
  { id:"mots-c",       goal:"Mitochondrial / endurance", dosing:"5–10 mg per week",           cycle:"Cyclic",         vialLasts:"10mg ≈ 1–2 weeks" },
  { id:"semax",        goal:"Cognition / focus",         dosing:"300–600 mcg/day",            cycle:"2–4 weeks",      vialLasts:"30mg ≈ 7–10 weeks" },
  { id:"selank",       goal:"Anxiolytic / calm",         dosing:"250–500 mcg/day",            cycle:"2–4 weeks",      vialLasts:"10mg ≈ 3–6 weeks" },
  { id:"ss-31",        goal:"Mitochondrial support",     dosing:"Per research protocol",      cycle:"Cyclic",         vialLasts:"10mg ≈ 1–2 weeks" },
  { id:"pt-141",       goal:"CNS / melanocortin",        dosing:"0.5–2 mg per use",           cycle:"As needed",      vialLasts:"10mg ≈ 5–20 uses" },
  { id:"hexarelin",    goal:"Potent GH pulse",           dosing:"100 mcg, 1–2×/day",          cycle:"6–8 weeks (desensitizes)", vialLasts:"5mg ≈ 3–7 weeks" },
  { id:"mk-677",       goal:"Oral GH secretagogue",      dosing:"10–25 mg/day (oral)",        cycle:"8–16 weeks",     vialLasts:"750mg ≈ 30–75 days" },
  { id:"sermorelin",   goal:"GH release (GHRH)",         dosing:"100–300 mcg pre-sleep",      cycle:"8–12 weeks",     vialLasts:"5mg ≈ 2–4 weeks" },
  { id:"tesa-ipa-blend", goal:"GHRH + GHRP (blend)",     dosing:"Dose each component per label", cycle:"8–12 weeks",  vialLasts:"12+6mg ≈ 2–4 weeks" },
  { id:"igf-1-lr3",    goal:"IGF-1 (hypertrophy)",       dosing:"20–50 mcg/day",              cycle:"4–6 weeks",      vialLasts:"1mg ≈ 20–50 days" },
  { id:"igf-1-des",    goal:"IGF-1 DES (localized)",     dosing:"50–150 mcg per site",        cycle:"4–6 weeks",      vialLasts:"1mg ≈ 1–3 weeks" },
  { id:"peg-mgf",      goal:"MGF (satellite cells)",     dosing:"200–400 mcg post-training",  cycle:"4–6 weeks",      vialLasts:"2mg ≈ 1–2 weeks" },
  { id:"follistatin-344", goal:"Myostatin inhibition",   dosing:"100 mcg/day",                cycle:"10–30 day cycles", vialLasts:"1mg ≈ 10 days" },
  { id:"aod-9604",     goal:"Fat metabolism",            dosing:"300 mcg/day",                cycle:"8–12 weeks",     vialLasts:"5mg ≈ 2–3 weeks" },
  { id:"aicar",        goal:"AMPK / endurance",          dosing:"Per research protocol",      cycle:"Cyclic",         vialLasts:"50mg ≈ model-dependent" },
  { id:"5-amino-1mq",  goal:"NNMT inhibition (oral)",    dosing:"50–150 mg/day (oral)",       cycle:"8–12 weeks",     vialLasts:"1500mg ≈ 10–30 days" },
  { id:"adipotide",    goal:"Adipose-targeting (exp.)",  dosing:"Per research protocol",      cycle:"Short experimental cycles", vialLasts:"5mg ≈ model-dependent" },
  { id:"melanotan-2",  goal:"Pigmentation (MC1R)",       dosing:"250–500 mcg/day loading",    cycle:"Load, then maintenance", vialLasts:"10mg ≈ 20–40 days" },
  { id:"melanotan-1",  goal:"Pigmentation (MC1R)",       dosing:"500 mcg–1 mg/day loading",   cycle:"Load, then maintenance", vialLasts:"10mg ≈ 10–20 days" },
  { id:"cagrilintide", goal:"Amylin (satiety)",          dosing:"Titrate 0.3 → 2.4 mg/week",  cycle:"12+ weeks",      vialLasts:"5mg ≈ 2–15 weeks" },
  { id:"survodutide",  goal:"GLP-1/glucagon dual",       dosing:"Titrate weekly per protocol", cycle:"12+ weeks",     vialLasts:"5mg ≈ 2–5 weeks" },
  { id:"mazdutide",    goal:"GLP-1/glucagon dual",       dosing:"Titrate weekly per protocol", cycle:"12+ weeks",     vialLasts:"5mg ≈ 2–5 weeks" },
  { id:"thymosin-alpha-1", goal:"Immune modulation",     dosing:"1.6 mg, 2×/week",            cycle:"4–8 weeks",      vialLasts:"5mg ≈ 3 weeks" },
  { id:"thymalin",     goal:"Immune (thymic)",           dosing:"5–10 mg/day",                cycle:"10-day cycles",  vialLasts:"10mg ≈ 1–2 weeks" },
  { id:"kpv",          goal:"Anti-inflammatory / gut",   dosing:"200–500 mcg/day",            cycle:"2–6 weeks",      vialLasts:"10mg ≈ 3–7 weeks" },
  { id:"ll-37",        goal:"Antimicrobial / immune",    dosing:"Per research protocol",      cycle:"Short cycles",   vialLasts:"5mg ≈ model-dependent" },
  { id:"vip",          goal:"Anti-inflammatory (VPAC)",  dosing:"Per research protocol",      cycle:"Cyclic",         vialLasts:"5mg ≈ model-dependent" },
  { id:"dsip",         goal:"Sleep / stress",            dosing:"100–300 mcg pre-sleep",      cycle:"As needed",      vialLasts:"5mg ≈ 2–7 weeks" },
  { id:"dihexa",       goal:"Cognition (oral)",          dosing:"5–20 mg/day (oral)",         cycle:"2–4 weeks",      vialLasts:"100mg ≈ 5–20 days" },
  { id:"pinealon",     goal:"Neuroprotection (bioreg.)", dosing:"5–10 mg/day",                cycle:"10-day cycles",  vialLasts:"20mg ≈ 2–4 days" },
  { id:"kisspeptin-10", goal:"Reproductive axis",        dosing:"Per research protocol",      cycle:"Cyclic",         vialLasts:"5mg ≈ model-dependent" },
  { id:"gonadorelin",  goal:"LH/FSH release (GnRH)",     dosing:"100–200 mcg, 2×/week",       cycle:"Ongoing",        vialLasts:"2mg ≈ 1–2 weeks" },
  { id:"oxytocin",     goal:"Social / behavior",         dosing:"Per research protocol",      cycle:"As needed",      vialLasts:"5mg ≈ model-dependent" },
  { id:"nad-plus",     goal:"Cellular energy / NAD+",    dosing:"50–100 mg/day",              cycle:"Cyclic",         vialLasts:"500mg ≈ 5–10 days" },
  { id:"humanin",      goal:"Cytoprotection / aging",    dosing:"Per research protocol",      cycle:"Cyclic",         vialLasts:"5mg ≈ model-dependent" },
  { id:"argireline",   goal:"Topical anti-wrinkle",      dosing:"Topical, 2×/day",            cycle:"Ongoing",        vialLasts:"300mg ≈ formulation-dependent" },
  { id:"matrixyl",     goal:"Topical collagen",          dosing:"Topical, 1–2×/day",          cycle:"Ongoing",        vialLasts:"300mg ≈ formulation-dependent" },
  { id:"liraglutide",  goal:"GLP-1 (daily)",             dosing:"Titrate 0.6 → 3 mg/day",     cycle:"12+ weeks",      vialLasts:"10mg ≈ 3–16 days" },
  { id:"hgh-191",      goal:"GH / IGF-1",                dosing:"1–4 IU/day",                 cycle:"12+ weeks",      vialLasts:"10 IU ≈ 3–10 days" },
  { id:"cerebrolysin", goal:"Neurotrophic / cognition",  dosing:"1–5 mL/day",                 cycle:"10–20 day cycles", vialLasts:"5mL amp ≈ 1–5 days" },
  { id:"snap-8",       goal:"Topical anti-wrinkle",      dosing:"Topical, 2×/day",            cycle:"Ongoing",        vialLasts:"formulation-dependent" },
  { id:"glutathione",  goal:"Antioxidant / redox",       dosing:"Per research protocol",      cycle:"Cyclic",         vialLasts:"600mg ≈ model-dependent" },
  { id:"larazotide",   goal:"Gut barrier (oral)",        dosing:"0.5–1 mg before meals",      cycle:"Ongoing",        vialLasts:"100mg ≈ 10–20 days" }
];

/* ---------------------------------------------------------------
   RESEARCH NOTES — extra educational context per compound (research
   library style). Shown as a second paragraph on the product page.
   Written from established preclinical literature; RUO context only.
--------------------------------------------------------------- */
const RESEARCH_NOTES = {
  "bpc-157": "In preclinical literature, BPC-157 is investigated for interaction with the nitric-oxide (NO) system and upregulation of growth-factor receptors such as VEGFR2, which researchers associate with its angiogenic and cytoprotective effects across gastrointestinal, tendon, and muscle-injury models. It remains a research compound with no approved human indication.",
  "tb-500": "Research on TB-500 centers on the actin-binding (G-actin sequestering) region of Thymosin Beta-4; by regulating actin polymerization, studies examine its influence on cell migration, wound closure, and revascularization in tissue-injury models.",
  "semaglutide": "Beyond glucose-dependent insulin secretion, research examines semaglutide's action on hypothalamic appetite circuits and its slowing of gastric emptying. Its C18 fatty-diacid linker drives albumin binding and the extended half-life used in weekly-dosing study designs.",
  "tirzepatide": "As a dual GIP/GLP-1 agonist, research explores whether concurrent GIP-receptor activation potentiates GLP-1 effects on insulin sensitivity and lipid handling — a mechanism of interest versus single-incretin comparators.",
  "retatrutide": "Retatrutide's triple GIP/GLP-1/glucagon agonism adds a glucagon-driven energy-expenditure component to incretin signaling, a mechanism studied for effects beyond dual agonists.",
  "ipamorelin": "Studies characterize ipamorelin as a selective ghrelin/GHS-R1a agonist that triggers GH release with minimal ACTH/cortisol or prolactin response — a selectivity profile that distinguishes it from earlier GHRPs in endocrine research.",
  "cjc-1295-dac": "The DAC (drug-affinity-complex) maleimide binds serum albumin, extending half-life to several days and producing the sustained GH/IGF-1 elevation studied alongside secretagogues such as ipamorelin.",
  "ghk-cu": "GHK-Cu research focuses on copper(II) delivery and modulation of gene expression tied to tissue remodeling; studies report effects on collagen, elastin, and glycosaminoglycan synthesis and on antioxidant enzymes in dermal and wound models.",
  "epithalon": "Epithalon (Ala-Glu-Asp-Gly) is studied for putative telomerase induction and normalization of circadian melatonin rhythms; interest derives from earlier pineal-peptide (epithalamin) aging research.",
  "mots-c": "As a mitochondrial-derived peptide, MOTS-c is studied as a regulator of AMPK signaling and metabolic flexibility, with research linking it to exercise-mimetic effects and insulin sensitivity.",
  "igf-1-lr3": "The Arg3 substitution and 13-residue N-terminal extension in IGF-1 LR3 reduce IGF-binding-protein affinity, prolonging free-ligand activity at the IGF-1 receptor in cell-proliferation and hypertrophy research.",
  "ss-31": "SS-31 concentrates in the inner mitochondrial membrane via cardiolipin binding, where research examines its stabilization of cristae, support of electron transport, and reduction of reactive oxygen species.",
  "tesamorelin": "Tesamorelin is a stabilized GHRH(1-44) analog whose trans-3-hexenoyl modification resists enzymatic degradation; research focuses on its selective reduction of visceral adipose tissue through GH/IGF-1 signaling.",
  "hexarelin": "Hexarelin is among the most potent GHRP hexapeptides; beyond GHS-R1a-mediated GH release, research examines its binding to the cardiac CD36 receptor and possible cardioprotective signaling.",
  "ghrp-2": "GHRP-2 (pralmorelin) acts at the ghrelin receptor to evoke robust GH pulses; studies note accompanying appetite stimulation and modest prolactin/cortisol relative to selective secretagogues.",
  "ghrp-6": "GHRP-6 was among the first synthetic secretagogues; research highlights its pronounced ghrelin-mimetic appetite stimulation alongside GH release and cytoprotective signaling.",
  "sermorelin": "Sermorelin is the GHRH(1-29) fragment retaining full receptor activity; its very short half-life makes it a model compound for studying pulsatile, physiologic GH release.",
  "mk-677": "MK-677 (ibutamoren) is a non-peptide ghrelin-receptor agonist studied as an orally bioavailable secretagogue that produces sustained GH/IGF-1 elevation without injection.",
  "mod-grf-1-29": "Mod GRF 1-29 (CJC-1295 without DAC) carries four substitutions that resist enzymatic cleavage while keeping a short half-life, making it a common GHRH partner for secretagogues in pulse-synchronized designs.",
  "semax": "Semax is a heptapeptide derived from ACTH(4-10); research associates it with increased BDNF/NGF expression, modulation of dopaminergic and serotonergic systems, and neuroprotection in ischemia models.",
  "selank": "Selank is a synthetic tuftsin analog studied for anxiolytic effects thought to involve GABAergic and enkephalinase modulation, alongside BDNF expression and immune signaling.",
  "dsip": "Delta sleep-inducing peptide is studied for its influence on sleep architecture and slow-wave activity, as well as neuroendocrine stress responses including cortisol modulation.",
  "pt-141": "PT-141 (bremelanotide) is a melanocortin agonist acting centrally at MC4R; research distinguishes its CNS-mediated arousal pathway from the peripheral pigmentary action of its precursor.",
  "melanotan-2": "Melanotan II is a cyclic α-MSH analog with broad melanocortin-receptor activity; research examines MC1R-driven melanogenesis and MC4R-linked appetite and behavioral effects.",
  "melanotan-1": "Melanotan I (afamelanotide) is a linear α-MSH analog with greater MC1R selectivity, studied specifically for eumelanin synthesis and photoprotection.",
  "aod-9604": "AOD-9604 is a modified hGH(176-191) C-terminal fragment studied for lipolytic and anti-lipogenic activity reported to be independent of the growth-promoting IGF-1 axis.",
  "5-amino-1mq": "5-Amino-1MQ is a small-molecule NNMT inhibitor studied for restoring cellular methylation capacity and NAD+ salvage, with downstream effects on adipocyte energy expenditure.",
  "kpv": "KPV is the C-terminal tripeptide of α-MSH that retains anti-inflammatory activity while lacking pigmentary effects; research examines NF-κB pathway modulation in gastrointestinal and dermal inflammation.",
  "thymosin-alpha-1": "Thymosin Alpha-1 is studied as an immunomodulator that promotes T-cell maturation and dendritic-cell function via Toll-like-receptor signaling, of interest in antiviral and immune-restoration research.",
  "kisspeptin-10": "Kisspeptin-10 is the active fragment of the KISS1 gene product; signaling through KISS1R, it drives GnRH release and sits upstream of the reproductive hormone axis.",
  "gonadorelin": "Gonadorelin is synthetic GnRH; pulsatile exposure stimulates pituitary LH/FSH release while continuous exposure desensitizes the receptor — a duality central to reproductive-endocrinology research.",
  "peg-mgf": "PEG-MGF is a pegylated form of the IGF-1Ec (mechano growth factor) splice variant expressed after mechanical load; research links it to satellite-cell activation and local muscle repair, with pegylation extending its window of action.",
  "igf-1-des": "IGF-1 DES lacks the first three N-terminal residues, sharply lowering IGF-binding-protein affinity and yielding a more potent, shorter-acting IGF-1R agonist used in localized-action research.",
  "follistatin-344": "Follistatin 344 binds and neutralizes myostatin and related TGF-β ligands; research uses it to probe negative regulation of skeletal-muscle growth.",
  "aicar": "AICAR is an AMP analog that activates AMPK, shifting cells toward catabolic energy production; it is a classic exercise-mimetic tool compound in metabolic research.",
  "nad-plus": "NAD+ is a central redox coenzyme and substrate for sirtuins and PARPs; declining levels with cellular age make its repletion a focus of longevity and mitochondrial research.",
  "liraglutide": "Liraglutide's single fatty-acid acylation gives roughly 13-hour albumin-bound persistence; it is a long-standing daily reference agonist for GLP-1-receptor pharmacology.",
  "larazotide": "Larazotide (AT-1001) acts locally in the gut lumen as a zonulin antagonist, tightening epithelial tight junctions; research focuses on intestinal-permeability ('leaky gut') models."
};

/* ---------------------------------------------------------------
   CATEGORY_ABOUT — richer "more about this category" content shown
   on the category landing page. Each entry is an array of paragraphs;
   add more paragraphs any time. Research / educational context only.
--------------------------------------------------------------- */
const CATEGORY_ABOUT = {
  glp1: [
    "GLP-1 (glucagon-like peptide-1) research centers on the incretin system — the gut hormones that amplify glucose-dependent insulin secretion. Compounds in this area range from single GLP-1 receptor agonists to dual (GIP/GLP-1) and triple (GIP/GLP-1/glucagon) incretin agonists.",
    "They are studied for effects on glucose regulation, appetite and satiety signaling, gastric-emptying dynamics, and energy metabolism, and are among the most active areas of contemporary metabolic research. Structural modifications such as fatty-acid acylation are used to extend half-life for daily or weekly study designs."
  ],
  growth: [
    "Growth-hormone research covers the compounds that modulate the GH/IGF-1 axis: GHRH analogs that stimulate the pituitary, ghrelin-receptor secretagogues (GHRPs) that trigger GH pulses, oral non-peptide secretagogues, and the growth factors downstream.",
    "These are studied for effects on cellular growth, recovery, body composition, and the pulsatile physiology of GH release. GHRH analogs and secretagogues are frequently paired in study designs to model the complementary 'releasing hormone + secretagogue' mechanism."
  ],
  metabolic: [
    "Metabolic research compounds are studied for their effects on energy balance, lipolysis, and body composition — spanning AMPK activators, NNMT inhibitors, growth-hormone fragments, and targeted anti-adipose peptides.",
    "The common thread is how cells partition, store, and expend energy, and how those pathways can be probed in metabolic and obesity research models."
  ],
  recovery: [
    "Recovery-research peptides are studied in tissue repair, angiogenesis, and healing models. The two most-referenced compounds — BPC-157 and TB-500 — appear throughout the preclinical literature on tendon, ligament, muscle, and gastrointestinal repair.",
    "Reported mechanisms of interest include upregulation of growth-factor receptors, promotion of new blood-vessel formation, and regulation of actin dynamics that influence cell migration and wound closure."
  ],
  neuro: [
    "Neuroscience research covers nootropic and neuroprotective peptides studied for effects on BDNF/NGF expression, neurotransmitter systems, synaptogenesis, sleep architecture, and cognition — from ACTH-derived peptides to angiotensin-derived synaptogenic compounds.",
    "Many are investigated in models of learning, memory, stress response, and neuroprotection following ischemic or oxidative insult."
  ],
  immune: [
    "Immune-research peptides are studied for immunomodulation: T-cell maturation and dendritic-cell function, innate antimicrobial defense, and anti-inflammatory signaling. The category spans thymic peptides, human cathelicidins, and α-MSH-derived fragments.",
    "Research interest includes antiviral response, immune restoration in aging models, and modulation of inflammatory pathways such as NF-κB."
  ],
  endocrine: [
    "Endocrine research covers peptides that act on the reproductive and neuroendocrine axes — GnRH and kisspeptin upstream of the pituitary gonadotropins, and neuropeptides such as oxytocin.",
    "A recurring theme is the difference between pulsatile and continuous receptor stimulation, which produces opposite downstream effects and is central to reproductive-endocrinology research."
  ],
  performance: [
    "Performance research covers peptides studied in endurance, mitochondrial function, and physical capacity — IGF-1 variants, mechano growth factor, mitochondria-targeting peptides, and myostatin regulators.",
    "These compounds probe how muscle adapts to load, how mitochondria support energy output, and how negative regulators of growth can be modulated in research models."
  ],
  copper: [
    "Copper-peptide research centers on GHK-Cu and related complexes, studied for copper delivery and its downstream effects on skin remodeling, collagen and elastin synthesis, wound healing, and antioxidant signaling.",
    "The copper ion is central to the studied mechanisms, and research spans dermal, hair-follicle, and regenerative models."
  ],
  cosmetic: [
    "Skin and cosmetic peptide research covers topically-studied compounds — neuromodulating hexapeptides and octapeptides, and collagen-stimulating lipopeptides — investigated in dermal and expression-line cosmetic science.",
    "These peptides are formulated for topical delivery and studied for effects on the neuromuscular junction and the dermal extracellular matrix."
  ],
  longevity: [
    "Longevity research covers peptides and cofactors studied in cellular aging — telomerase-linked tetrapeptides, mitochondrial-derived peptides, NAD+ metabolism, and cytoprotective signaling.",
    "The focus is on the pathways that decline with cellular age and whether they can be supported or restored in aging models."
  ],
  blends: [
    "Peptide blends combine complementary compounds in a single vial for multi-pathway study designs — repair-peptide pairings, GHRH + GHRP secretagogue combinations, and skin-and-repair stacks.",
    "Each blend is dosed by the amount of every component the label lists, and lets a single preparation model a combined mechanism."
  ],
  supplies: [
    "Supplies covers the consumables for laboratory handling of research peptides: bacteriostatic water for reconstitution and syringe/storage kits. These support the safe preparation and storage of lyophilized compounds for in-vitro research."
  ]
};

/* Common research applications per category (bullet list). */
const CATEGORY_APPLICATIONS = {
  glp1: ["Glucose-dependent insulin-secretion models", "Appetite & satiety pathway research", "Gastric-emptying dynamics", "Comparative incretin-agonist studies"],
  growth: ["GH/IGF-1 axis stimulation", "Body-composition research", "Pulsatile GH-release modeling", "Secretagogue + GHRH combination studies"],
  metabolic: ["Lipolysis & fat-metabolism models", "Energy-expenditure research", "Insulin-sensitivity studies", "NAD+ / methylation pathways"],
  recovery: ["Tendon & ligament repair models", "Angiogenesis & wound-healing research", "Gastrointestinal-integrity studies", "Cell-migration & actin dynamics"],
  neuro: ["BDNF/NGF expression models", "Cognition & memory research", "Neuroprotection (ischemic/oxidative) studies", "Sleep-architecture & stress research"],
  immune: ["T-cell maturation models", "Antiviral & immune-restoration research", "Anti-inflammatory pathway (NF-κB) studies", "Innate antimicrobial-defense research"],
  endocrine: ["GnRH pulsatility & LH/FSH release", "Reproductive-axis signaling", "Neuropeptide behavior research"],
  performance: ["Satellite-cell activation models", "Mitochondrial-function & endurance research", "Myostatin-regulation studies", "Localized hypertrophy research"],
  copper: ["Collagen & elastin synthesis models", "Skin-remodeling & wound research", "Antioxidant-enzyme studies", "Hair-follicle research"],
  cosmetic: ["Expression-line cosmetic research", "Dermal collagen/matrix studies", "Topical-formulation & penetration research"],
  longevity: ["Telomerase-activity models", "Cellular-senescence research", "Mitochondrial-signaling studies", "NAD+ metabolism research"],
  blends: ["Multi-pathway combined-mechanism studies", "Repair + remodeling research", "GH-axis combination modeling"],
  supplies: ["Reconstitution of lyophilized compounds", "Sample handling & storage"]
};

/* References / further reading — links to real, public research databases.
   (Topic searches, not fabricated citations.) Add more any time. */
const CATEGORY_REFERENCES = {
  glp1: [
    {label:"“GLP-1 receptor agonist” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=GLP-1+receptor+agonist"},
    {label:"Incretin therapies — ClinicalTrials.gov", url:"https://clinicaltrials.gov/search?term=GLP-1%20receptor%20agonist"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  growth: [
    {label:"“Growth hormone secretagogue” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+secretagogue"},
    {label:"“GHRH analog” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=GHRH+analog"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  metabolic: [
    {label:"“AMPK metabolism” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=AMPK+metabolism"},
    {label:"“NNMT inhibitor” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=NNMT+inhibitor"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  recovery: [
    {label:"“BPC-157” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=BPC+157"},
    {label:"“Thymosin beta-4” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+beta-4"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  neuro: [
    {label:"“Neuroprotective peptide” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=neuroprotective+peptide"},
    {label:"“BDNF peptide” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=BDNF+peptide"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  immune: [
    {label:"“Thymosin alpha-1 immunomodulation” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha-1+immunomodulation"},
    {label:"“Cathelicidin LL-37” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=cathelicidin+LL-37"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  endocrine: [
    {label:"“Kisspeptin GnRH” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=kisspeptin+GnRH"},
    {label:"“Gonadotropin-releasing hormone” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=gonadotropin-releasing+hormone"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  performance: [
    {label:"“IGF-1 muscle” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=IGF-1+skeletal+muscle"},
    {label:"“Mechano growth factor” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=mechano+growth+factor"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  copper: [
    {label:"“GHK-Cu copper peptide” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+copper+peptide"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  cosmetic: [
    {label:"“Cosmetic peptide skin” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=cosmetic+peptide+skin"},
    {label:"“Acetyl hexapeptide” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=acetyl+hexapeptide"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  longevity: [
    {label:"“Epithalon telomerase” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=epitalon+telomerase"},
    {label:"“NAD+ aging” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=NAD%2B+aging"},
    {label:"PubChem compound database", url:"https://pubchem.ncbi.nlm.nih.gov/"}
  ],
  blends: [
    {label:"“BPC-157” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=BPC+157"},
    {label:"“Growth hormone secretagogue” on PubMed", url:"https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+secretagogue"}
  ]
};

/* Expose globally for non-module scripts */
window.CATEGORY_ABOUT = CATEGORY_ABOUT;
window.CATEGORY_APPLICATIONS = CATEGORY_APPLICATIONS;
window.CATEGORY_REFERENCES = CATEGORY_REFERENCES;
window.CATEGORIES = CATEGORIES;
window.PRODUCTS = PRODUCTS;
window.STACKS = STACKS;
window.PROTOCOLS = PROTOCOLS;
window.RESEARCH_NOTES = RESEARCH_NOTES;
