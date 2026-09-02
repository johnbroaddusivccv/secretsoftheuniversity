'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
/* ── Verse rotation (matches static site) ────────────── */
const VERSES = [
  { t: 'The heavens declare the glory of God; the skies proclaim the work of his hands.', r: 'Psalm 19:1' },
  { t: 'It is the glory of God to conceal a matter; to search out a matter is the glory of kings.', r: 'Proverbs 25:2' },
  { t: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', r: 'Jeremiah 29:11' },
  { t: 'Trust in the Lord with all your heart and lean not on your own understanding.', r: 'Proverbs 3:5' },
  { t: 'The fear of the Lord is the beginning of knowledge, but fools despise wisdom and instruction.', r: 'Proverbs 1:7' },
  { t: 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.', r: 'Matthew 7:7' },
  { t: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', r: 'Joshua 1:9' },
  { t: 'I can do all things through Christ who strengthens me.', r: 'Philippians 4:13' },
  { t: 'The Lord is my shepherd; I shall not want.', r: 'Psalm 23:1' },
  { t: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', r: 'John 3:16' },
  { t: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', r: 'Romans 8:28' },
  { t: 'The Lord is my light and my salvation — whom shall I fear?', r: 'Psalm 27:1' },
  { t: 'He has made everything beautiful in its time. He has also set eternity in the human heart.', r: 'Ecclesiastes 3:11' },
  { t: 'Commit to the Lord whatever you do, and he will establish your plans.', r: 'Proverbs 16:3' },
  { t: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles.', r: 'Isaiah 40:31' },
  { t: 'The name of the Lord is a fortified tower; the righteous run to it and are safe.', r: 'Proverbs 18:10' },
  { t: 'Delight yourself in the Lord, and he will give you the desires of your heart.', r: 'Psalm 37:4' },
  { t: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', r: 'Philippians 4:6' },
  { t: 'The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness.', r: 'Zephaniah 3:17' },
  { t: 'For where your treasure is, there your heart will be also.', r: 'Matthew 6:21' },
  { t: 'A generous person will prosper; whoever refreshes others will be refreshed.', r: 'Proverbs 11:25' },
  { t: 'The earth is the Lord\u2019s, and everything in it, the world, and all who live in it.', r: 'Psalm 24:1' },
  { t: 'Whatever you do, work at it with all your heart, as working for the Lord.', r: 'Colossians 3:23' },
  { t: 'Be still, and know that I am God.', r: 'Psalm 46:10' },
  { t: 'The tongue has the power of life and death, and those who love it will eat its fruit.', r: 'Proverbs 18:21' },
  { t: 'He who walks with wise men will be wise, but the companion of fools will suffer harm.', r: 'Proverbs 13:20' },
  { t: 'For nothing will be impossible with God.', r: 'Luke 1:37' },
  { t: 'The light shines in the darkness, and the darkness has not overcome it.', r: 'John 1:5' },
  { t: 'Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life.', r: 'James 1:12' },
  { t: 'The Lord makes firm the steps of the one who delights in him.', r: 'Psalm 37:23' },
  { t: 'Iron sharpens iron, and one man sharpens another.', r: 'Proverbs 27:17' },
];

function getVerseOfDay() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return VERSES[dayOfYear % VERSES.length];
}

/* ── Departments ────────────────────────────────── */
const DEPARTMENTS = [
  { name: 'Finance', desc: 'Money answers everything, said the Preacher. We teach the questions.', href: '/finance' },
  { name: 'Health', desc: 'Knowing your own body is more.', href: '/health' },
  { name: 'Careers', desc: 'The race is not to the swift — nor the job to the best résumé.', href: '/careers' },
  { name: 'Systems', desc: 'Nothing is new under the sun. Every system runs on old rules. Learn them.', href: '/systems' },
];


export default function HomePage() {
  const [hubble, setHubble] = useState(null);
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    setVerse(getVerseOfDay());

    /* NASA Image & Video Library — Hubble-specific, no API key */
    fetch('https://images-api.nasa.gov/search?q=hubble+space+telescope&media_type=image&page_size=100')
      .then((r) => r.json())
      .then((data) => {
        const items = data?.collection?.items || [];
        if (items.length === 0) throw new Error('empty');
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const pick = items[dayOfYear % items.length];
        const link = pick.links?.[0]?.href || '';
        const meta = pick.data?.[0] || {};
        setHubble({
          title: meta.title || 'Hubble Space Telescope',
          url: link,
          date: meta.date_created ? meta.date_created.slice(0, 10) : '',
          desc: meta.description || '',
          nasaId: meta.nasa_id || '',
        });
      })
      .catch(() =>
        setHubble({
          title: 'Pillars of Creation — Hubble Space Telescope',
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/800px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
          date: '',
          desc: '',
          nasaId: '',
        })
      );
  }, []);



  return (
    <>
      <Starfield />
      <Nav />
      <div className="wrap">
        {/* Daily Revelation — Two-Panel */}
        <section>
          <div className="section-label">Daily Revelation</div>
          <h2>Consider the stars.</h2>
          <div className="daily-revelation">

            {/* Panel 1 — Hubble Image */}
            <div className="daily-panel">
              <div className="panel-label">From the Telescope</div>
              <div className="daily-img-wrap">
                {hubble && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hubble.url}
                      alt={hubble.title}
                      style={{ opacity: 1 }}
                    />
                    <div className="img-caption">
                      <span>{hubble.title}</span><br />
                      <a
                        href={hubble.nasaId ? `https://images.nasa.gov/details/${hubble.nasaId}` : 'https://images.nasa.gov'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NASA · Hubble{hubble.date ? ` · ${hubble.date}` : ''}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Panel 2 — Verse of the Day */}
            <div className="daily-panel">
              <div className="panel-label">Word for the Day</div>
              {verse && (
                <div className="daily-verse-card">
                  <div className="verse-glyph">✦</div>
                  <div className="verse-text">&ldquo;{verse.t}&rdquo;</div>
                  <div className="verse-ref">&mdash; {verse.r}</div>
                  <div className="verse-source">
                    Verse of the Day ·{' '}
                    <a href="https://www.bible.com/verse-of-the-day" target="_blank" rel="noopener noreferrer">
                      YouVersion
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        <div className="divider">✦ ✦ ✦</div>


        {/* Four Departments */}
        <section>
          <div className="section-label">The Four Departments</div>
          <h2>Get wisdom. Get understanding.</h2>
          <div className="pillars">
            {DEPARTMENTS.map((d) => (
              <div className="pillar" key={d.name}>
                <div className="glyph">✦</div>
                <h3>{d.name}</h3>
                <p>{d.desc}</p>
                <Link className="pillar-link" href={d.href}>Enter →</Link>
              </div>
            ))}
          </div>
        </section>



        {/* Manifesto */}
        <section>
          <div className="manifesto">
            <div className="section-label">The Only Answer We Give</div>
            <p>
              &ldquo;It is the glory of God to conceal a matter, but the glory of kings
              is to search out a matter. Twelve years of school, and no one handed you the search.&rdquo;
            </p>
            <div className="sig">&mdash; The Registrar, citing Proverbs 25:2</div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
