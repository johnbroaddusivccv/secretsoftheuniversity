// Vercel serverless function: one space image per day for the Daily Revelation box.
// 1. NASA Astronomy Picture of the Day (needs a key; DEMO_KEY works but is shared and rate-limited).
// 2. If APOD fails or today's APOD has no picture, a daily pick of Hubble/Webb images
//    from the NASA Image and Video Library (images-api.nasa.gov, no key needed).
// The response is cached at Vercel's edge for 6 hours, so NASA is called a few times a day
// instead of once per visitor.
// Optional environment variable (Vercel → Project → Settings → Environment Variables):
//   NASA_API_KEY   free key from https://api.nasa.gov (steadier than DEMO_KEY)

const QUERIES = [
  'James Webb nebula', 'Hubble galaxy', 'Hubble nebula', 'James Webb galaxy',
  'Hubble star cluster', 'Webb star forming region', 'Hubble spiral galaxy', 'Chandra supernova remnant',
];

const dayNumber = () => Math.floor(Date.now() / 86400000);

async function getJSON(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'secretsoftheuniversity.com' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

async function fromAPOD() {
  const key = process.env.NASA_API_KEY || 'DEMO_KEY';
  const d = await getJSON('https://api.nasa.gov/planetary/apod?thumbs=true&api_key=' + encodeURIComponent(key), 6000);
  const src = d.media_type === 'image' ? d.url : d.thumbnail_url;
  if (!src) throw new Error('No picture today');
  return { src, title: d.title || 'Astronomy Picture of the Day', href: d.hdurl || d.url || 'https://apod.nasa.gov/apod/astropix.html', date: d.date || '', source: 'NASA APOD' };
}

async function fromLibrary() {
  const day = dayNumber();
  const q = QUERIES[day % QUERIES.length];
  const d = await getJSON('https://images-api.nasa.gov/search?media_type=image&page_size=100&q=' + encodeURIComponent(q), 6000);
  const items = ((d.collection && d.collection.items) || []).filter(i =>
    i.links && i.links[0] && i.links[0].href && i.data && i.data[0] && i.data[0].nasa_id);
  if (!items.length) throw new Error('Library returned nothing');
  const it = items[(day * 7) % items.length];
  const meta = it.data[0];
  const thumb = it.links[0].href;
  return {
    src: thumb.replace('~thumb.', '~medium.'),
    fallback: thumb,
    title: meta.title || 'NASA Image Library',
    href: 'https://images.nasa.gov/details/' + encodeURIComponent(meta.nasa_id),
    date: (meta.date_created || '').slice(0, 10),
    source: 'NASA Image Library',
  };
}

module.exports = async (req, res) => {
  let out = null;
  try { out = await fromAPOD(); } catch (e) { /* fall through to the library */ }
  if (!out) { try { out = await fromLibrary(); } catch (e) { /* both failed */ } }
  if (!out) {
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(502).json({ ok: false });
    return;
  }
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
  res.status(200).json({ ok: true, ...out });
};
