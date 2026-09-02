'use client';

import { useEffect, useRef } from 'react';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LessonCard from '@/components/LessonCard';
import GateLink from '@/components/GateLink';
import HackerNewsFeed from '@/components/HackerNewsFeed';

/* ── System anatomy tiles ────────────── */
const ANATOMY = [
  { icon: '⚙', label: 'Rules', desc: 'Written and unwritten. The code the system runs on.' },
  { icon: '🔑', label: 'Gatekeepers', desc: 'Who decides access. The human checkpoints.' },
  { icon: '📊', label: 'Incentives', desc: 'Follow the reward. It explains the behavior.' },
  { icon: '🔄', label: 'Feedback loops', desc: 'What reinforces itself. Where momentum lives.' },
  { icon: '🕳', label: 'Gaps', desc: 'Where the rules don\'t reach. Where opportunity hides.' },
  { icon: '📜', label: 'History', desc: 'Why it was built. The original problem it solved.' },
];

const LESSONS = [
  { code: 'SYS 101', title: '"How a bill actually becomes a law — the unabridged version"', teaser: 'Committees, riders, reconciliation, and the steps the civics textbook left out.', slug: 'bill-to-law' },
  { code: 'SYS 102', title: '"Reading a contract like the party who wrote it"', teaser: 'Indemnity clauses, arbitration traps, and the sentences that matter most.', slug: 'reading-contracts' },
  { code: 'SYS 103', title: '"The org chart is a lie — mapping real power"', teaser: 'Informal networks, information brokers, and who actually decides.', slug: 'mapping-power' },
  { code: 'SYS 104', title: '"How to file anything with the government and have it work"', teaser: 'Forms, deadlines, chain-of-custody — the bureaucratic survival guide.', slug: 'filing-government' },
  { code: 'SYS 105', title: '"Insurance is a language — here is the dictionary"', teaser: 'Premiums, deductibles, exclusions, and the words that determine payouts.', slug: 'insurance-dictionary' },
  { code: 'SYS 106', title: '"How algorithms decide what you see, buy, and believe"', teaser: 'Recommendation engines, ranking signals, and the invisible hand of code.', slug: 'algorithm-literacy' },
];

const GATES = [
  { href: 'https://www.govtrack.us', name: 'GovTrack', desc: 'Every bill in Congress, tracked in real time. The actual legislative record.', color: '#4a90d9' },
  { href: 'https://www.courtlistener.com', name: 'CourtListener', desc: 'Free case law and oral arguments. The judiciary, searchable.', color: '#8b7cf7' },
  { href: 'https://www.regulations.gov', name: 'Regulations.gov', desc: 'Federal rulemaking. Comment periods. Where policy is written before it becomes law.', color: '#2e8b57' },
  { href: 'https://www.opensecrets.org', name: 'OpenSecrets', desc: 'Campaign finance data. Who funds whom. Follow the money.', color: '#c0392b' },
  { href: 'https://usaspending.gov', name: 'USASpending', desc: 'Every federal dollar, tracked. Contracts, grants, loans — the spending graph.', color: '#f0c96c' },
  { href: 'https://www.pacer.gov', name: 'PACER', desc: 'Federal court filings. The raw documents behind every headline case.', color: '#e67e22' },
  { href: 'https://www.sec.gov/cgi-bin/browse-edgar', name: 'SEC EDGAR', desc: 'Corporate filings. 10-Ks, proxy statements, insider trades — the paper trail.', color: '#3498db' },
  { href: 'https://fred.stlouisfed.org', name: 'FRED', desc: 'Federal Reserve data. 800,000+ economic time series. The macroeconomic dashboard.', color: '#1a5276' },
  { href: 'https://scholar.google.com', name: 'Google Scholar', desc: 'The academic record. Peer-reviewed research on every system ever studied.', color: '#4285f4' },
];

export default function SystemsPage() {
  const nodeCanvasRef = useRef(null);

  /* ── Network-node background ────────────── */
  useEffect(() => {
    const canvas = nodeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      nodes = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 2 + Math.random() * 2,
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLight = document.documentElement.classList.contains('light');

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isLight
              ? `rgba(107,92,231,${0.06 * (1 - dist / 180)})`
              : `rgba(139,124,247,${0.12 * (1 - dist / 180)})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(107,92,231,0.15)' : 'rgba(139,124,247,0.25)';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <style>{`
        .node-overlay { position:fixed; inset:0; z-index:0; pointer-events:none; }
        html.light .node-overlay { pointer-events:none; }
        .anatomy-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px; }
        .anatomy-tile {
          background:var(--card); border:1px solid var(--border); border-radius:14px;
          padding:24px 22px; transition:transform .3s, border-color .3s;
        }
        .anatomy-tile:hover { transform:translateY(-4px); border-color:var(--gold); }
        .anatomy-tile .tile-icon { font-size:1.4rem; margin-bottom:10px; }
        .anatomy-tile h4 { font-weight:400; font-size:0.95rem; margin-bottom:6px; color:var(--ink); }
        .anatomy-tile p { font-size:0.82rem; color:var(--muted); line-height:1.5; }
      `}</style>

      <Starfield />
      <canvas className="node-overlay" ref={nodeCanvasRef} />
      <Nav />

      <div className="wrap">
        <header className="hero">
          <div className="eyebrow">Department of Systems</div>
          <h1>Every institution runs<br />on rules it never <em>published</em>.</h1>
          <p className="sub">
            How institutions, bureaucracies, and power structures actually work — the operating manual school never issued.
          </p>
        </header>

        {/* Anatomy */}
        <section>
          <div className="section-label">Anatomy</div>
          <h2 className="mb-sm">The shape of every system</h2>
          <p className="section-note">Every bureaucracy, market, or institution follows the same skeleton. Learn the bones.</p>
          <div className="anatomy-grid">
            {ANATOMY.map((a) => (
              <div className="anatomy-tile" key={a.label}>
                <div className="tile-icon">{a.icon}</div>
                <h4>{a.label}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Course Catalog */}
        <section>
          <div className="section-label">Course Catalog</div>
          <h2>Systems lessons in session</h2>
          <div className="lessons">
            {LESSONS.map((l) => (
              <LessonCard key={l.slug} department={l.code} title={l.title} teaser={l.teaser} slug={l.slug} />
            ))}
          </div>
        </section>

        {/* The Wire */}
        <section id="feed">
          <div className="section-label">The Wire</div>
          <h2 className="mb-sm">How systems are discussed, live</h2>
          <p className="section-note">From the forums where builders, policy minds, and engineers think aloud.</p>
          <HackerNewsFeed />
        </section>

        {/* Gates */}
        <section>
          <div className="section-label">Gates</div>
          <h2 className="mb-sm">Where the systems-literate gather</h2>
          <p className="section-note">Primary sources. Each one a window into how the machine runs.</p>
          <div className="gates">
            {GATES.map((g) => (
              <GateLink key={g.name} {...g} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
