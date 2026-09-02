'use client';

import { useEffect, useRef } from 'react';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LessonCard from '@/components/LessonCard';
import GateLink from '@/components/GateLink';
import HackerNewsFeed from '@/components/HackerNewsFeed';

export default function FinancePage() {
  const angelRef = useRef(null);
  const cryptoRef = useRef(null);
  const tickerRef = useRef(null);
  const hotlistRef = useRef(null);

  /* ── Angel numbers ambient layer ────────────── */
  useEffect(() => {
    const overlay = angelRef.current;
    if (!overlay) return;
    const ANGEL = ['111','222','333','444','555','666','777','888','999','1111','1212','1010','808','369','777','144','1234'];
    for (let i = 0; i < 45; i++) {
      const el = document.createElement('span');
      el.className = 'angel-num';
      el.textContent = ANGEL[Math.floor(Math.random() * ANGEL.length)];
      const dirs = [
        { dx: (Math.random() - 0.5) * 60, dy: -(30 + Math.random() * 60) },
        { dx: (Math.random() - 0.5) * 40, dy: (20 + Math.random() * 50) },
        { dx: -(20 + Math.random() * 60), dy: (Math.random() - 0.5) * 40 },
        { dx: (20 + Math.random() * 60), dy: (Math.random() - 0.5) * 40 },
      ];
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      el.style.cssText = `
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        font-size:${0.7+Math.random()*1.1}rem;
        opacity:${0.03+Math.random()*0.06};
        --dx:${d.dx}vw;--dy:${d.dy}vh;
        animation:angelDrift ${18+Math.random()*22}s linear infinite;
        animation-delay:-${Math.random()*20}s;
      `;
      overlay.appendChild(el);
    }
  }, []);

  /* ── Crypto ticker (CoinGecko) ────────────── */
  useEffect(() => {
    const ticker = cryptoRef.current;
    if (!ticker) return;
    let interval;

    async function loadCrypto() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false&price_change_percentage=24h');
        const coins = await res.json();
        if (!Array.isArray(coins)) return;
        ticker.innerHTML = coins.map(c => {
          const pct = c.price_change_percentage_24h || 0;
          const color = pct >= 0 ? '#4ecdc4' : '#e2708a';
          const arrow = pct >= 0 ? '▲' : '▼';
          return `<div class="crypto-row">
            <span class="crypto-sym">${c.symbol.toUpperCase()}</span>
            <span class="crypto-price">$${c.current_price.toLocaleString()}</span>
            <span class="crypto-chg" style="color:${color}">${arrow} ${Math.abs(pct).toFixed(2)}%</span>
          </div>`;
        }).join('');
      } catch { /* silent */ }
    }

    loadCrypto();
    interval = setInterval(loadCrypto, 60000);
    return () => clearInterval(interval);
  }, []);

  const LESSONS = [
    { code: 'FIN 101', title: '"The credit score algorithm, decoded"', teaser: 'The five inputs, what actually moves them, and the 30-day fixes most people never try.', slug: 'credit-score-decoded' },
    { code: 'FIN 102', title: '"Why your first index fund beats your best stock pick"', teaser: 'The math of diversification, in plain English — and how to start with $50.', slug: 'index-fund-wins' },
    { code: 'FIN 103', title: '"Negotiation scripts that survive contact with HR"', teaser: 'Word-for-word scripts for salary, bills, and rent — and the silence that does the heavy lifting.', slug: 'negotiation-scripts' },
    { code: 'FIN 104', title: '"Crypto without the cult"', teaser: 'What blockchains actually do, what the tickers mean, and how to size risk you can live with.', slug: 'crypto-without-cult' },
    { code: 'FIN 105', title: '"The tax moves hiding in plain sight"', teaser: "Deductions, retirement accounts, and timing tricks the form instructions won't explain.", slug: 'tax-moves' },
    { code: 'FIN 106', title: '"Reading a market ticker like a native"', teaser: "Indexes vs. stocks, what 24h change really tells you, and why red days aren't emergencies.", slug: 'reading-tickers' },
  ];

  const GATES = [
    { href: 'https://news.ycombinator.com', name: 'Hacker News', desc: "Y Combinator's forum. Where founders and engineers think aloud.", color: '#f60' },
    { href: 'https://www.bloomberg.com/markets', name: 'Bloomberg', desc: 'Global markets, macro, and the stories that move capital.', color: '#1e1e1e' },
    { href: 'https://www.reuters.com/business/finance/', name: 'Reuters', desc: 'Wire service. Facts before opinion. The source of sources.', color: '#ff8000' },
    { href: 'https://seekingalpha.com', name: 'Seeking Alpha', desc: 'Crowd-sourced equity research. Retail conviction, measured.', color: '#f68a1e' },
    { href: 'https://www.wsj.com/news/markets', name: 'WSJ Markets', desc: 'The broadsheet of record for American finance.', color: '#0274b6' },
    { href: 'https://finance.yahoo.com', name: 'Yahoo Finance', desc: "Free charts, screeners, and earnings data. The people's terminal.", color: '#6001d2' },
    { href: 'https://www.ft.com/markets', name: 'Financial Times', desc: 'Global perspective. Where policy meets capital.', color: '#f2c7a7' },
    { href: 'https://ark-invest.com/articles', name: 'ARK Invest', desc: "Cathie Wood's research. Disruptive innovation, quantified.", color: '#00c2ff' },
    { href: 'https://www.reddit.com/r/wallstreetbets/', name: 'r/wallstreetbets', desc: 'The mob. Sometimes wrong, always first to feel the shift.', color: '#ff4500' },
  ];

  /* ── TradingView widget injection ────────────── */
  /* TradingView embeds use a non-standard pattern: the JSON config is the
     text content of the <script> element. React can't render that, so we
     inject the script + config via the DOM on mount. */
  useEffect(() => {
    function injectWidget(container, src, config) {
      if (!container) return;
      // Avoid double-injection on hot reload
      if (container.querySelector('script[src="' + src + '"]')) return;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.async = true;
      script.textContent = JSON.stringify(config);
      container.appendChild(script);
    }

    injectWidget(tickerRef.current,
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js',
      {
        symbols: [
          { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
          { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
          { proName: 'FOREXCOM:DJI', title: 'Dow Jones' },
          { proName: 'NASDAQ:AAPL', title: 'Apple' },
          { proName: 'NASDAQ:NVDA', title: 'Nvidia' },
          { proName: 'NASDAQ:TSLA', title: 'Tesla' },
          { proName: 'NASDAQ:MSFT', title: 'Microsoft' },
          { proName: 'NASDAQ:AMZN', title: 'Amazon' },
        ],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: 'adaptive',
        colorTheme: 'dark',
        locale: 'en',
      }
    );

    injectWidget(hotlistRef.current,
      'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js',
      {
        colorTheme: 'dark',
        dateRange: '1D',
        exchange: 'US',
        showChart: true,
        locale: 'en',
        largeChartUrl: '',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: true,
        width: '100%',
        height: '550',
        plotLineColorGrowing: 'rgba(240,201,108, 1)',
        plotLineColorFalling: 'rgba(226,112,138, 1)',
        gridLineColor: 'rgba(139,124,247, 0.06)',
        scaleFontColor: 'rgba(155,151,184, 1)',
        belowLineFillColorGrowing: 'rgba(240,201,108, 0.06)',
        belowLineFillColorFalling: 'rgba(226,112,138, 0.06)',
        belowLineFillColorGrowingBottom: 'rgba(240,201,108, 0)',
        belowLineFillColorFallingBottom: 'rgba(226,112,138, 0)',
        symbolActiveColor: 'rgba(139,124,247, 0.12)',
      }
    );
  }, []);

  return (
    <>
      <style>{`
        @keyframes angelDrift {
          0% { transform:translate(0,0); opacity:0; }
          10% { opacity:var(--angel-opacity, 0.04); }
          90% { opacity:var(--angel-opacity, 0.04); }
          100% { transform:translate(var(--dx),var(--dy)); opacity:0; }
        }
        .angel-overlay {
          position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden;
        }
        .angel-num {
          position:absolute; font-family:Georgia,serif; color:var(--gold);
          user-select:none; pointer-events:none;
        }
        .stock-ticker-band {
          position:relative; z-index:2; margin:-1px 0 0; padding:6px 0;
          border-bottom:1px solid var(--border);
        }
        #crypto-ticker {
          position:fixed; right:0; top:70px; width:120px; z-index:2;
          background:linear-gradient(180deg, rgba(13,13,36,0.95), rgba(7,7,19,0.95));
          border-left:1px solid var(--border); border-bottom:1px solid var(--border);
          border-radius:0 0 0 12px; padding:10px 12px;
          font-family:Helvetica,Arial,sans-serif; font-size:0.65rem;
          max-height:calc(100vh - 80px); overflow-y:auto;
        }
        .crypto-row { display:flex; flex-direction:column; padding:6px 0; border-bottom:1px solid rgba(139,124,247,0.08); }
        .crypto-sym { color:var(--gold); font-weight:700; letter-spacing:0.08em; font-size:0.6rem; }
        .crypto-price { color:var(--ink); margin:2px 0; }
        .crypto-chg { font-size:0.6rem; }
        .market-widget-wrap { border-radius:12px; overflow:hidden; border:1px solid var(--border); }
        .section-note { text-align:center; font-size:0.95rem; color:var(--muted); margin-bottom:40px; max-width:600px; margin-left:auto; margin-right:auto; }
        .disclaimer-bar {
          text-align:center; font-family:Helvetica,Arial,sans-serif; font-size:0.68rem;
          color:var(--muted); padding:20px 24px; border-top:1px solid var(--border);
          max-width:700px; margin:0 auto; line-height:1.6;
        }
        @media (max-width:900px) { #crypto-ticker { display:none; } .wrap { padding-right:24px; } }
        @media (min-width:901px) { .wrap { padding-right:140px; } }
      `}</style>

      <Starfield />
      <Nav />

      {/* Angel numbers ambient */}
      <div className="angel-overlay" ref={angelRef} aria-hidden="true" />

      {/* Crypto sidebar */}
      <div id="crypto-ticker" ref={cryptoRef}>
        <div style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading…</div>
      </div>

      <div className="wrap">
        {/* TradingView ticker tape — injected via useEffect */}
        <div className="stock-ticker-band">
          <div className="tradingview-widget-container" ref={tickerRef}>
            <div className="tradingview-widget-container__widget" />
          </div>
        </div>

        <header className="hero">
          <div className="eyebrow">Department of Finance</div>
          <h1>The market doesn&rsquo;t care<br />what you didn&rsquo;t <em>learn</em>.</h1>
          <p className="sub">
            Live markets above and beside you. Below — the lessons that make sense of them:
            credit, taxes, negotiation, and investing without the jargon.
          </p>
        </header>

        {/* Market overview widget */}
        <section>
          <div className="section-label">The Board</div>
          <h2 className="mb-sm">Top performers, in motion</h2>
          <p className="section-note">Benchmarks and movers. The numbers the world watches.</p>
          <div className="market-widget-wrap">
            <div className="tradingview-widget-container" ref={hotlistRef}>
              <div className="tradingview-widget-container__widget" />
            </div>
          </div>
        </section>

        {/* Course Catalog */}
        <section>
          <div className="section-label">Course Catalog</div>
          <h2>Finance lessons in session</h2>
          <div className="lessons">
            {LESSONS.map((l) => (
              <LessonCard key={l.slug} department={l.code} title={l.title} teaser={l.teaser} slug={l.slug} />
            ))}
          </div>
        </section>

        {/* The Wire — HN Feed */}
        <section id="feed">
          <div className="section-label">The Wire</div>
          <h2 className="mb-sm">What the informed are reading</h2>
          <p className="section-note">Live from the rooms where founders, engineers, and allocators gather.</p>
          <HackerNewsFeed />
        </section>

        {/* Gates */}
        <section>
          <div className="section-label">Gates</div>
          <h2 className="mb-sm">Where the informed reside</h2>
          <p className="section-note">Curated rooms. Each one a door to a different kind of intelligence.</p>
          <div className="gates">
            {GATES.map((g) => (
              <GateLink key={g.name} {...g} />
            ))}
          </div>
        </section>
      </div>

      <Footer />

      {/* Disclaimer */}
      <div className="disclaimer-bar">
        This page is educational. It is not financial advice. Consult a licensed professional before making investment decisions.
        Live data via TradingView and CoinGecko. News feed via Hacker News (Y Combinator).
      </div>

    </>
  );
}
