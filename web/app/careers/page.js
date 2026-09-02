'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LessonCard from '@/components/LessonCard';

const LESSONS = [
  { code: 'CAR 101', title: '"The résumé that survives the machine"', teaser: 'Applicant tracking systems discard 75% of submissions before a human sees them. Format is doctrine.', slug: 'resume-survives-machine' },
  { code: 'CAR 102', title: '"Interview answers they actually remember"', teaser: 'The STAR method is known. The version that lands — situation, tension, resolution — is not taught.', slug: 'interview-answers' },
  { code: 'CAR 103', title: '"Salary negotiation: the silence after the number"', teaser: 'Name a number and stop talking. The discomfort is the negotiation. Most people fill it — and lose.', slug: 'salary-negotiation' },
  { code: 'CAR 104', title: '"The network no one tells you to build"', teaser: 'Not LinkedIn connections. Not coffee chats. The five-person board of advisors you assemble quietly.', slug: 'hidden-network' },
  { code: 'CAR 105', title: '"Cover letters that open doors"', teaser: "Three sentences. The problem they have. The proof you've solved it. The ask. Everything else is noise.", slug: 'cover-letters' },
  { code: 'CAR 106', title: '"The 90-day rule no manager explains"', teaser: "Reputation is set in the first quarter. What you do before you're asked determines what you're trusted with after.", slug: 'ninety-day-rule' },
];

const DEFAULT_LATEX = `\\\\documentclass[11pt,a4paper]{article}
\\\\usepackage[margin=0.75in]{geometry}
\\\\usepackage{enumitem}
\\\\setlist{nosep}
\\\\pagestyle{empty}

\\\\begin{document}

\\\\begin{center}
  {\\\\Large\\\\bfseries Your Name}\\\\\\\\[4pt]
  city, state \\\\quad $\\\\cdot$ \\\\quad your@email.com \\\\quad $\\\\cdot$ \\\\quad (555) 000-0000
\\\\end{center}

\\\\vspace{8pt}
\\\\hrule
\\\\vspace{6pt}

\\\\section*{Experience}
\\\\textbf{Job Title} \\\\hfill Company Name \\\\\\\\
\\\\textit{Start -- End} \\\\hfill City, State
\\\\begin{itemize}
  \\\\item Accomplishment that quantifies impact.
  \\\\item Another result, stated in numbers where possible.
\\\\end{itemize}

\\\\section*{Education}
\\\\textbf{Degree} \\\\hfill University \\\\\\\\
\\\\textit{Year} \\\\hfill City, State

\\\\section*{Skills}
LaTeX, Python, SQL, Public Speaking, Project Management

\\\\end{document}`;

export default function CareersPage() {
  const editorRef = useRef(null);
  const cmRef = useRef(null);
  const [cmLoaded, setCmLoaded] = useState(false);

  useEffect(() => {
    if (!cmLoaded || !editorRef.current || cmRef.current) return;

    // Initialize CodeMirror
    if (typeof window !== 'undefined' && window.CodeMirror) {
      cmRef.current = window.CodeMirror.fromTextArea(editorRef.current, {
        mode: 'stex',
        theme: 'default',
        lineNumbers: true,
        lineWrapping: true,
        scrollbarStyle: 'simple',
      });
      cmRef.current.setSize('100%', '400px');

      // Apply dark styling
      const cmEl = cmRef.current.getWrapperElement();
      cmEl.style.background = 'rgba(13,13,36,0.8)';
      cmEl.style.color = '#e8e6f5';
      cmEl.style.borderRadius = '12px';
      cmEl.style.border = '1px solid rgba(139,124,247,0.22)';
      cmEl.style.fontSize = '0.85rem';
      cmEl.style.fontFamily = 'monospace';
    }
  }, [cmLoaded]);

  function handleOverleaf() {
    if (!cmRef.current) return;
    const latex = cmRef.current.getValue();
    const encoded = encodeURIComponent(latex);

    // POST to Overleaf (same pattern as static site)
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.overleaf.com/docs';
    form.target = '_blank';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'encoded_snip';
    input.value = encoded;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  return (
    <>
      <style>{`
        .lab-container {
          background:var(--card); border:1px solid var(--border); border-radius:16px;
          padding:32px 28px; max-width:800px; margin:0 auto;
        }
        .lab-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
        .lab-header h3 { font-weight:400; font-size:1.1rem; }
        .lab-actions { display:flex; gap:10px; flex-wrap:wrap; }
        .lab-btn {
          background:linear-gradient(135deg, var(--gold), #d9a63f);
          color:#1a1305; border:none; border-radius:100px; padding:10px 22px;
          font-family:Helvetica,Arial,sans-serif; font-size:0.72rem; font-weight:700;
          letter-spacing:0.08em; text-transform:uppercase; cursor:pointer;
          transition:transform .2s, box-shadow .3s;
        }
        .lab-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(240,201,108,0.3); }
        .lab-btn.secondary {
          background:none; border:1px solid var(--border); color:var(--muted);
          box-shadow:none;
        }
        .lab-btn.secondary:hover { border-color:var(--gold); color:var(--gold); box-shadow:none; }
        .lab-note { font-family:Helvetica,Arial,sans-serif; font-size:0.72rem; color:var(--muted); margin-top:16px; text-align:center; }
        .lab-note a { color:var(--violet); text-decoration:none; }
        .lab-note a:hover { color:var(--gold); }
        .CodeMirror-gutters { background:rgba(13,13,36,0.6) !important; border-right:1px solid rgba(139,124,247,0.15) !important; }
        .CodeMirror-linenumber { color:var(--muted) !important; }
      `}</style>

      <Starfield />
      <Nav />

      <div className="wrap">
        <header className="hero">
          <div className="eyebrow">Department of Careers</div>
          <h1>The race is not<br />to the <em>swift</em>.</h1>
          <p className="sub">
            Résumés, interviews, negotiations — the moves that actually land the position. Written by those who hire.
          </p>
        </header>

        {/* Course Catalog */}
        <section>
          <div className="section-label">Course Catalog</div>
          <h2>Career lessons in session</h2>
          <div className="lessons">
            {LESSONS.map((l) => (
              <LessonCard key={l.slug} department={l.code} title={l.title} teaser={l.teaser} slug={l.slug} />
            ))}
          </div>
        </section>

        {/* Resume Lab */}
        <section id="lab">
          <div className="section-label">Resume Lab</div>
          <h2 className="mb-sm">Forge your document</h2>
          <p className="section-note">
            Write LaTeX here. When ready, send it to Overleaf to compile and download your PDF.
          </p>
          <div className="lab-container">
            <div className="lab-header">
              <h3>LaTeX Editor</h3>
              <div className="lab-actions">
                <button className="lab-btn" onClick={handleOverleaf}>
                  Open in Overleaf →
                </button>
              </div>
            </div>
            <textarea ref={editorRef} defaultValue={DEFAULT_LATEX.replace(/\\\\/g, '\\')} />
            <div className="lab-note">
              Powered by <a href="https://codemirror.net/" target="_blank" rel="noopener noreferrer">CodeMirror 5</a> ·
              Compiled via <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer">Overleaf</a>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* CodeMirror 5 from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Load stex mode after core
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/stex/stex.min.js';
          s.onload = () => {
            // Load simplescrollbars
            const sb = document.createElement('script');
            sb.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/scroll/simplescrollbars.min.js';
            sb.onload = () => setCmLoaded(true);
            document.head.appendChild(sb);
          };
          document.head.appendChild(s);
        }}
      />
      {/* CodeMirror CSS is imported via link tags */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/scroll/simplescrollbars.css" />
    </>
  );
}
