'use client';

import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LessonCard from '@/components/LessonCard';
import GateLink from '@/components/GateLink';

const LESSONS = [
  { code: 'HLTH 101', title: '"How to read your own bloodwork"', teaser: 'CBC, metabolic panel, lipids, thyroid — what each marker means, what the ranges hide, and when to push back.', slug: 'read-bloodwork' },
  { code: 'HLTH 102', title: '"Sleep is not rest. It is construction."', teaser: 'Circadian architecture, REM debt, the adenosine cycle — and why the alarm clock is a saboteur.', slug: 'sleep-construction' },
  { code: 'HLTH 103', title: '"Nutrition without the cult"', teaser: 'Macros, micronutrients, glycemic load — stripped of ideology. What the meta-analyses actually say.', slug: 'nutrition-no-cult' },
  { code: 'HLTH 104', title: '"The anxiety algorithm, decoded"', teaser: 'The HPA axis, cortisol feedback loops, vagal tone — your nervous system has settings. Learn them.', slug: 'anxiety-algorithm' },
  { code: 'HLTH 105', title: '"Exercise is medicine — literally"', teaser: 'VO₂ max, Zone 2 training, the minimum effective dose. What moves the needle and what is noise.', slug: 'exercise-medicine' },
  { code: 'HLTH 106', title: '"The gut speaks first"', teaser: 'Microbiome, the enteric nervous system, short-chain fatty acids. Your second brain is not a metaphor.', slug: 'gut-speaks' },
];

const GATES = [
  { href: 'https://pubmed.ncbi.nlm.nih.gov', name: 'PubMed', desc: 'The primary source. 36 million citations.', color: '#326599' },
  { href: 'https://examine.com', name: 'Examine', desc: 'Supplements and nutrition decoded. Independent.', color: '#0dbc79' },
  { href: 'https://www.hubermanlab.com', name: 'Huberman Lab', desc: 'Neuroscience protocols for sleep, focus, stress.', color: '#6b5ce7' },
  { href: 'https://www.who.int/health-topics', name: 'WHO', desc: 'Global health data. Disease burden.', color: '#009edb' },
  { href: 'https://www.nih.gov', name: 'NIH', desc: 'U.S. National Institutes of Health.', color: '#205493' },
  { href: 'https://www.foundmyfitness.com', name: 'FoundMyFitness', desc: 'Longevity, sauna, omega-3s, and genetics.', color: '#e85d3a' },
  { href: 'https://peterattiamd.com', name: 'Peter Attia', desc: 'Longevity medicine. The long game.', color: '#9b97b8' },
  { href: 'https://www.mayoclinic.org', name: 'Mayo Clinic', desc: 'Conditions, symptoms, treatments.', color: '#0057b8' },
  { href: 'https://www.ncbi.nlm.nih.gov/books', name: 'NCBI Bookshelf', desc: 'Free medical textbooks. StatPearls.', color: '#f0c96c' },
];

export default function HealthPage() {
  return (
    <>
      <style>{`
        .vital-strip {
          display:flex; gap:0; overflow-x:auto; border-bottom:1px solid var(--border);
          margin-bottom:40px; padding:12px 0;
        }
        .vital-item {
          flex:1; min-width:140px; text-align:center; padding:10px 16px;
          border-right:1px solid var(--border); font-family:Helvetica,Arial,sans-serif;
        }
        .vital-item:last-child { border-right:none; }
        .vital-label { font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
        .vital-value { font-size:1.3rem; color:var(--gold); font-weight:400; font-family:Georgia,serif; }
        .vital-unit { font-size:0.6rem; color:var(--muted); }


        .health-disclaimer {
          text-align:center; font-family:Helvetica,Arial,sans-serif; font-size:0.68rem;
          color:var(--muted); padding:20px 24px; border-top:1px solid var(--border);
          max-width:700px; margin:0 auto; line-height:1.7;
        }
      `}</style>

      <Starfield />
      <Nav />

      <div className="wrap">
        <header className="hero">
          <div className="eyebrow">Department of Health</div>
          <h1>A merry heart is<br /><em>medicine</em>.</h1>
          <p className="sub">
            Your body runs on systems. Labs, sleep, nutrition, stress — the owner&rsquo;s manual school never handed you.
          </p>
        </header>

        {/* Vital signs strip */}
        <div className="vital-strip">
          <div className="vital-item">
            <div className="vital-label">Heart Rate</div>
            <div className="vital-value">72</div>
            <div className="vital-unit">bpm</div>
          </div>
          <div className="vital-item">
            <div className="vital-label">Blood Pressure</div>
            <div className="vital-value">120/80</div>
            <div className="vital-unit">mmHg</div>
          </div>
          <div className="vital-item">
            <div className="vital-label">Glucose</div>
            <div className="vital-value">95</div>
            <div className="vital-unit">mg/dL</div>
          </div>
          <div className="vital-item">
            <div className="vital-label">SpO₂</div>
            <div className="vital-value">98</div>
            <div className="vital-unit">%</div>
          </div>
        </div>

        {/* Course Catalog */}
        <section>
          <div className="section-label">Course Catalog</div>
          <h2>Health lessons in session</h2>
          <div className="lessons">
            {LESSONS.map((l) => (
              <LessonCard key={l.slug} department={l.code} title={l.title} teaser={l.teaser} slug={l.slug} />
            ))}
          </div>
        </section>

        {/* Gates */}
        <section>
          <div className="section-label">Gates</div>
          <h2 className="mb-sm">Where the health-literate gather</h2>
          <p className="section-note">Primary sources. Each one a door to a different kind of evidence.</p>
          <div className="gates">
            {GATES.map((g) => (
              <GateLink key={g.name} {...g} />
            ))}
          </div>
        </section>
      </div>

      <Footer />

      {/* Health disclaimer */}
      <div className="health-disclaimer">
        This page is educational and does not constitute medical advice. Consult a licensed healthcare professional before making health decisions.
        Peptide and regenerative biologic information is intended for licensed practitioners only. Products referenced are not FDA-approved to treat, cure, or prevent any specific disease.
      </div>
    </>
  );
}
