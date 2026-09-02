import Link from 'next/link';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

/* All lessons across departments — will be seeded from Supabase later */
const ALL_LESSONS = [
  { dept: 'Finance', code: 'FIN 101', title: '"The credit score algorithm, decoded"', slug: 'credit-score-decoded' },
  { dept: 'Finance', code: 'FIN 102', title: '"Why your first index fund beats your best stock pick"', slug: 'index-fund-wins' },
  { dept: 'Finance', code: 'FIN 103', title: '"Negotiation scripts that survive contact with HR"', slug: 'negotiation-scripts' },
  { dept: 'Finance', code: 'FIN 104', title: '"Crypto without the cult"', slug: 'crypto-without-cult' },
  { dept: 'Finance', code: 'FIN 105', title: '"The tax moves hiding in plain sight"', slug: 'tax-moves' },
  { dept: 'Finance', code: 'FIN 106', title: '"Reading a market ticker like a native"', slug: 'reading-tickers' },
  { dept: 'Health', code: 'HLTH 101', title: '"How to read your own bloodwork"', slug: 'read-bloodwork' },
  { dept: 'Health', code: 'HLTH 102', title: '"Sleep is not rest. It is construction."', slug: 'sleep-construction' },
  { dept: 'Health', code: 'HLTH 103', title: '"Nutrition without the cult"', slug: 'nutrition-no-cult' },
  { dept: 'Health', code: 'HLTH 104', title: '"The anxiety algorithm, decoded"', slug: 'anxiety-algorithm' },
  { dept: 'Health', code: 'HLTH 105', title: '"Exercise is medicine — literally"', slug: 'exercise-medicine' },
  { dept: 'Health', code: 'HLTH 106', title: '"The gut speaks first"', slug: 'gut-speaks' },
  { dept: 'Careers', code: 'CAR 101', title: '"The résumé that survives the machine"', slug: 'resume-survives-machine' },
  { dept: 'Careers', code: 'CAR 102', title: '"Interview answers they actually remember"', slug: 'interview-answers' },
  { dept: 'Careers', code: 'CAR 103', title: '"Salary negotiation: the silence after the number"', slug: 'salary-negotiation' },
  { dept: 'Careers', code: 'CAR 104', title: '"The network no one tells you to build"', slug: 'hidden-network' },
  { dept: 'Careers', code: 'CAR 105', title: '"Cover letters that open doors"', slug: 'cover-letters' },
  { dept: 'Careers', code: 'CAR 106', title: '"The 90-day rule no manager explains"', slug: 'ninety-day-rule' },
  { dept: 'Systems', code: 'SYS 101', title: '"How a bill actually becomes a law — the unabridged version"', slug: 'bill-to-law' },
  { dept: 'Systems', code: 'SYS 102', title: '"Reading a contract like the party who wrote it"', slug: 'reading-contracts' },
  { dept: 'Systems', code: 'SYS 103', title: '"The org chart is a lie — mapping real power"', slug: 'mapping-power' },
  { dept: 'Systems', code: 'SYS 104', title: '"How to file anything with the government and have it work"', slug: 'filing-government' },
  { dept: 'Systems', code: 'SYS 105', title: '"Insurance is a language — here is the dictionary"', slug: 'insurance-dictionary' },
  { dept: 'Systems', code: 'SYS 106', title: '"How algorithms decide what you see, buy, and believe"', slug: 'algorithm-literacy' },
];

export const metadata = {
  title: 'Lessons — Secrets of the University',
  description: 'The curriculum school skipped. 24 lessons across Finance, Health, Careers, and Systems.',
};

export default function LessonsIndex() {
  const departments = ['Finance', 'Health', 'Careers', 'Systems'];

  return (
    <>
      <Starfield />
      <Nav />
      <div className="wrap">
        <header className="hero">
          <div className="eyebrow">Course Catalog</div>
          <h1>The restricted <em>archive</em>.</h1>
          <p className="sub">24 lessons across four departments. The curriculum begins when you enroll.</p>
        </header>

        {departments.map((dept) => (
          <section key={dept}>
            <div className="section-label">{dept}</div>
            <h2 style={{ marginBottom: '28px' }}>{dept} lessons</h2>
            <div className="lessons">
              {ALL_LESSONS.filter((l) => l.dept === dept).map((l) => (
                <div className="lesson" key={l.slug}>
                  <div className="lesson-dept">{l.code}</div>
                  <h3>{l.title}</h3>
                  <Link href={`/lessons/${l.slug}`} className="lesson-link">
                    Seek →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
}
