'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSupabase } from '@/lib/supabase';

/* Lesson metadata (will be migrated to Supabase) */
const LESSON_MAP = {
  'credit-score-decoded': { dept: 'Finance', code: 'FIN 101', title: 'The credit score algorithm, decoded', teaser: 'The five inputs, what actually moves them, and the 30-day fixes most people never try.' },
  'index-fund-wins': { dept: 'Finance', code: 'FIN 102', title: 'Why your first index fund beats your best stock pick', teaser: 'The math of diversification, in plain English — and how to start with $50.' },
  'negotiation-scripts': { dept: 'Finance', code: 'FIN 103', title: 'Negotiation scripts that survive contact with HR', teaser: 'Word-for-word scripts for salary, bills, and rent — and the silence that does the heavy lifting.' },
  'crypto-without-cult': { dept: 'Finance', code: 'FIN 104', title: 'Crypto without the cult', teaser: 'What blockchains actually do, what the tickers mean, and how to size risk you can live with.' },
  'tax-moves': { dept: 'Finance', code: 'FIN 105', title: 'The tax moves hiding in plain sight', teaser: "Deductions, retirement accounts, and timing tricks the form instructions won't explain." },
  'reading-tickers': { dept: 'Finance', code: 'FIN 106', title: 'Reading a market ticker like a native', teaser: "Indexes vs. stocks, what 24h change really tells you, and why red days aren't emergencies." },
  'read-bloodwork': { dept: 'Health', code: 'HLTH 101', title: 'How to read your own bloodwork', teaser: 'CBC, metabolic panel, lipids, thyroid — what each marker means, what the ranges hide, and when to push back.' },
  'sleep-construction': { dept: 'Health', code: 'HLTH 102', title: 'Sleep is not rest. It is construction.', teaser: 'Circadian architecture, REM debt, the adenosine cycle — and why the alarm clock is a saboteur.' },
  'nutrition-no-cult': { dept: 'Health', code: 'HLTH 103', title: 'Nutrition without the cult', teaser: 'Macros, micronutrients, glycemic load — stripped of ideology. What the meta-analyses actually say.' },
  'anxiety-algorithm': { dept: 'Health', code: 'HLTH 104', title: 'The anxiety algorithm, decoded', teaser: 'The HPA axis, cortisol feedback loops, vagal tone — your nervous system has settings. Learn them.' },
  'exercise-medicine': { dept: 'Health', code: 'HLTH 105', title: 'Exercise is medicine — literally', teaser: 'VO₂ max, Zone 2 training, the minimum effective dose. What moves the needle and what is noise.' },
  'gut-speaks': { dept: 'Health', code: 'HLTH 106', title: 'The gut speaks first', teaser: 'Microbiome, the enteric nervous system, short-chain fatty acids. Your second brain is not a metaphor.' },
  'resume-survives-machine': { dept: 'Careers', code: 'CAR 101', title: 'The résumé that survives the machine', teaser: 'Applicant tracking systems discard 75% of submissions before a human sees them. Format is doctrine.' },
  'interview-answers': { dept: 'Careers', code: 'CAR 102', title: 'Interview answers they actually remember', teaser: 'The STAR method is known. The version that lands — situation, tension, resolution — is not taught.' },
  'salary-negotiation': { dept: 'Careers', code: 'CAR 103', title: 'Salary negotiation: the silence after the number', teaser: 'Name a number and stop talking. The discomfort is the negotiation. Most people fill it — and lose.' },
  'hidden-network': { dept: 'Careers', code: 'CAR 104', title: 'The network no one tells you to build', teaser: 'Not LinkedIn connections. Not coffee chats. The five-person board of advisors you assemble quietly.' },
  'cover-letters': { dept: 'Careers', code: 'CAR 105', title: 'Cover letters that open doors', teaser: "Three sentences. The problem they have. The proof you've solved it. The ask. Everything else is noise." },
  'ninety-day-rule': { dept: 'Careers', code: 'CAR 106', title: 'The 90-day rule no manager explains', teaser: "Reputation is set in the first quarter. What you do before you're asked determines what you're trusted with after." },
  'bill-to-law': { dept: 'Systems', code: 'SYS 101', title: 'How a bill actually becomes a law — the unabridged version', teaser: 'Committees, riders, reconciliation, and the steps the civics textbook left out.' },
  'reading-contracts': { dept: 'Systems', code: 'SYS 102', title: 'Reading a contract like the party who wrote it', teaser: 'Indemnity clauses, arbitration traps, and the sentences that matter most.' },
  'mapping-power': { dept: 'Systems', code: 'SYS 103', title: 'The org chart is a lie — mapping real power', teaser: 'Informal networks, information brokers, and who actually decides.' },
  'filing-government': { dept: 'Systems', code: 'SYS 104', title: 'How to file anything with the government and have it work', teaser: 'Forms, deadlines, chain-of-custody — the bureaucratic survival guide.' },
  'insurance-dictionary': { dept: 'Systems', code: 'SYS 105', title: 'Insurance is a language — here is the dictionary', teaser: 'Premiums, deductibles, exclusions, and the words that determine payouts.' },
  'algorithm-literacy': { dept: 'Systems', code: 'SYS 106', title: 'How algorithms decide what you see, buy, and believe', teaser: 'Recommendation engines, ranking signals, and the invisible hand of code.' },
};

export default function LessonPage() {
  const params = useParams();
  const slug = params.slug;
  const lesson = LESSON_MAP[slug];
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user || null);
        setAuthChecked(true);
      });
    } else {
      setAuthChecked(true);
    }
  }, []);

  if (!lesson) {
    return (
      <>
        <Starfield />
        <Nav />
        <div className="wrap" style={{ textAlign: 'center', padding: '120px 24px' }}>
          <h1>Lesson not found.</h1>
          <p className="sub">This page of the archive has not been declassified.</p>
          <Link href="/lessons" style={{ color: 'var(--gold)', textDecoration: 'none', fontFamily: 'Helvetica,sans-serif', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ← Back to catalog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const isGated = authChecked && !user;

  return (
    <>
      <Starfield />
      <Nav />
      <div className="wrap">
        <section style={{ paddingTop: '80px' }}>
          <div className="section-label">{lesson.code} · {lesson.dept}</div>
          <h2 style={{ marginBottom: '20px' }}>{lesson.title}</h2>
          <p className="section-note" style={{ marginBottom: '40px' }}>{lesson.teaser}</p>

          {isGated ? (
            /* Gated — show teaser + CTA */
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '48px 32px', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--gold)' }}>✦</div>
                <h3 style={{ fontWeight: 400, fontSize: '1.15rem', marginBottom: '12px' }}>This lesson requires enrollment.</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--muted)', marginBottom: '24px' }}>
                  The full content is available to enrolled members only.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-block', background: 'linear-gradient(135deg, var(--gold), #d9a63f)',
                    color: '#1a1305', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none',
                    fontFamily: 'Helvetica,sans-serif', fontSize: '0.82rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}
                >
                  Knock
                </Link>
              </div>
            </div>
          ) : (
            /* Authenticated — show content placeholder */
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '48px 32px', maxWidth: '700px', margin: '0 auto' }}>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>
                Full lesson content is being prepared. Check back soon.
              </p>
            </div>
          )}
        </section>

        {/* Back to catalog */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Link href="/lessons" style={{ color: 'var(--violet)', textDecoration: 'none', fontFamily: 'Helvetica,sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ← Back to catalog
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
