'use client';

import { useEffect, useState, useCallback } from 'react';

const TABS = [
  { key: 'top', label: 'Top', endpoint: 'topstories' },
  { key: 'new', label: 'New', endpoint: 'newstories' },
  { key: 'best', label: 'Best', endpoint: 'beststories' },
  { key: 'ask', label: 'Ask', endpoint: 'askstories' },
  { key: 'show', label: 'Show', endpoint: 'showstories' },
];

export default function HackerNewsFeed({ limit = 7 }) {
  const [active, setActive] = useState('top');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStories = useCallback(async (tabKey) => {
    setLoading(true);
    const tab = TABS.find((t) => t.key === tabKey);
    try {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/${tab.endpoint}.json`);
      const ids = await res.json();
      const top = ids.slice(0, limit);
      const items = await Promise.all(
        top.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
        )
      );
      setStories(items.filter(Boolean));
    } catch {
      setStories([]);
    }
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    loadStories(active);
  }, [active, loadStories]);

  return (
    <>
      <div className="hn-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`hn-tab${active === t.key ? ' active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="hn-stories">
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>
            Loading…
          </div>
        ) : (
          stories.map((s, i) => (
            <div className="hn-story" key={s.id}>
              <span className="hn-rank">{i + 1}</span>
              <div>
                <a href={s.url || `https://news.ycombinator.com/item?id=${s.id}`} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                <div className="hn-meta">
                  {s.score} pts · {s.by} · {s.descendants ?? 0} comments
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
