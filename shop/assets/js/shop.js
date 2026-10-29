/* Broaddus Scientific Group shop: shared header, footer, cards, product art and cart.
   Catalog data lives in catalog.js (window.CATALOG). */
(function () {
  'use strict';

  const SITE = {
    name: 'Broaddus Scientific Group',
    email: 'john@secretsoftheuniversity.com',     // where customers reach you and where orders go if email sending is off
    freeShip: 150,                                 // free standard US shipping at or above this subtotal
    standard: 12, express: 25, expressOverFree: 15
  };

  const C = window.CATALOG || { chemicals: [], peptides: [], chemCats: [], pepCats: [] };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2);
  const qs = k => new URLSearchParams(location.search).get(k);

  /* ── One shape for every product ── */
  const ITEMS = [];
  C.chemicals.forEach(c => ITEMS.push(Object.assign({}, c, {
    type: 'chem',
    title: c.name + ' – ' + c.form + ' (' + c.size + ')',
    sizes: [{ label: c.form + ' · ' + c.size, short: c.size, price: c.price, img: c.img }]
  })));
  C.peptides.forEach(p => ITEMS.push(Object.assign({}, p, {
    type: 'pep',
    cats: [p.cat],
    title: p.sizes.length === 1 ? p.name + ' – ' + (p.cat === 'supplies' ? p.sizes[0].label : p.form.replace('Lyophilized ', '').replace(/^vial$/, 'Vial') + ' (' + p.sizes[0].label + ')') : p.name,
    sizes: p.sizes.map(s => Object.assign({ short: s.label }, s))
  })));
  const BY_ID = Object.fromEntries(ITEMS.map(p => [p.id, p]));
  // Old links used one id per compound (e.g. "piracetam"); send those to the first listing of that compound.
  const byId = id => BY_ID[id] || ITEMS.find(p => p.key === id);
  const minPrice = p => Math.min(...p.sizes.map(s => s.price));
  const catName = (type, id) => ((type === 'pep' ? C.pepCats : C.chemCats).find(c => c[0] === id) || [id, id])[1];

  /* ── Storage that never throws ── */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  /* ── Cart: [{id, s (size index), q}] priced live from the catalog ── */
  const CART = 'bsg_cart_v2';
  const getCart = () => store.get(CART, []).filter(l => byId(l.id) && byId(l.id).sizes[l.s]);
  const setCart = c => { store.set(CART, c); syncCount(); };
  const lines = () => getCart().map(l => { const p = byId(l.id), z = p.sizes[l.s]; return { p, z, s: l.s, q: l.q, total: z.price * l.q }; });
  const subtotal = () => lines().reduce((t, l) => t + l.total, 0);
  const count = () => getCart().reduce((t, l) => t + l.q, 0);
  function addToCart(id, s = 0, q = 1) {
    const p = byId(id); if (!p || p.status === 'out') return;
    const c = getCart(); const hit = c.find(l => l.id === id && l.s === s);
    if (hit) hit.q = Math.min(99, hit.q + q); else c.push({ id, s, q });
    setCart(c);
    toast((p.status === 'backorder' ? 'Pre-ordered: ' : 'Added to cart: ') + p.name + ' · ' + p.sizes[s].short);
  }
  function setQty(id, s, q) {
    let c = getCart(); const hit = c.find(l => l.id === id && l.s === s); if (!hit) return;
    if (q <= 0) c = c.filter(l => l !== hit); else hit.q = Math.min(99, q);
    setCart(c);
  }
  function shipping(sub, method, country) {
    if (!sub) return 0;
    if (country && country !== 'US') return null;   // quoted by email
    if (method === 'express') return sub >= SITE.freeShip ? SITE.expressOverFree : SITE.express;
    return sub >= SITE.freeShip ? 0 : SITE.standard;
  }
  function syncCount() { $$('.js-count').forEach(el => { el.textContent = count(); }); }

  /* ── Toast ── */
  let toastTimer;
  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ── Product art: real render when we have one, otherwise a drawn stand-in in the same studio style ── */
  let artSeq = 0;
  function art(p, s = 0, eager = false) {
    const z = p.sizes[s] || p.sizes[0];
    if (z.img) return '<img src="assets/img/products/' + esc(z.img) + '.webp" alt="' + esc(p.title) + '" width="720" height="720"' + (eager ? '' : ' loading="lazy" decoding="async"') + '>';
    return drawn(p, z);
  }
  function drawn(p, z) {
    const id = 'a' + (++artSeq);
    const form = (p.form || '').toLowerCase();
    const kind = /gel/.test(form) ? 'gel' : /spray/.test(form) ? 'spray' : /aliquot/.test(form) ? 'aliquot' : /capsule/.test(form) ? 'caps' : /solution/.test(form) ? 'dropper' : /powder/.test(form) ? 'jar' : 'vial';
    const name = p.name.replace(/\s*\(.*\)\s*/, '').toUpperCase();
    const fs = Math.max(9, Math.min(19, 150 / Math.max(6, name.length * 0.62)));
    const label = (x, y, w, h, nameSize) =>
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#fbfbfb" stroke="#d8d8dc"/>' +
      '<rect x="' + (x + w / 2 - 31) + '" y="' + (y + 9) + '" width="62" height="14" fill="none" stroke="#8b8d92" stroke-width="1"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + 19.5) + '" font-size="7.2" letter-spacing="1.8" fill="#55575c" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="600">BROADDUS</text>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + nameSize * 0.45) + '" font-size="' + nameSize + '" fill="#26272b" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="500">' + esc(name) + '</text>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h - 12) + '" font-size="8.5" fill="#6b6d72" text-anchor="middle" font-family="Inter,Arial,sans-serif">' + esc(z.short) + '</text>' +
      '<line x1="' + (x + 8) + '" x2="' + (x + w - 8) + '" y1="' + (y + h - 4) + '" y2="' + (y + h - 4) + '" stroke="#8fa9c8" stroke-width="1.5"/>';
    let body = '';
    if (kind === 'jar') {
      body = '<rect x="205" y="330" width="190" height="140" rx="12" fill="url(#w' + id + ')"/>' +
        '<rect x="200" y="298" width="200" height="44" rx="6" fill="#26272b"/>' +
        [...Array(18)].map((_, i) => '<line x1="' + (208 + i * 10.6) + '" x2="' + (208 + i * 10.6) + '" y1="302" y2="338" stroke="#3a3b40" stroke-width="2"/>').join('') +
        label(222, 352, 156, 96, fs);
    } else if (kind === 'dropper') {
      body = '<rect x="232" y="300" width="136" height="170" rx="20" fill="url(#am' + id + ')"/>' +
        '<rect x="268" y="262" width="64" height="44" rx="4" fill="#1e1f22"/>' +
        '<rect x="282" y="188" width="36" height="80" rx="18" fill="#2b2c30"/>' +
        label(244, 360, 112, 92, Math.min(fs, 15));
    } else if (kind === 'spray') {
      body = '<rect x="240" y="318" width="120" height="152" rx="18" fill="url(#w' + id + ')"/>' +
        '<rect x="262" y="296" width="76" height="28" rx="4" fill="#eceef1" stroke="#d6d8dc"/>' +
        '<path d="M282 296 L292 214 Q300 204 308 214 L318 296 Z" fill="#f7f8f9" stroke="#d6d8dc"/>' +
        label(250, 356, 100, 92, Math.min(fs, 14));
    } else if (kind === 'gel') {
      body = '<rect x="266" y="286" width="68" height="184" rx="8" fill="url(#w' + id + ')"/>' +
        '<rect x="272" y="250" width="56" height="42" rx="6" fill="#e6e8eb" stroke="#d2d4d8"/>' +
        '<rect x="292" y="232" width="16" height="22" fill="#d9dbdf"/>' +
        label(270, 340, 60, 96, Math.min(fs, 10));
    } else if (kind === 'aliquot') {
      body = '<rect x="262" y="350" width="76" height="120" rx="8" fill="url(#am' + id + ')"/>' +
        '<rect x="258" y="322" width="84" height="34" rx="4" fill="#2f6fa8"/>' +
        label(266, 380, 68, 70, Math.min(fs, 10));
    } else if (kind === 'caps') {
      body = '<rect x="222" y="318" width="156" height="152" rx="16" fill="url(#w' + id + ')"/>' +
        '<rect x="236" y="286" width="128" height="40" rx="5" fill="#26272b"/>' +
        label(236, 350, 128, 96, Math.min(fs, 16));
    } else {
      body = '<rect x="250" y="320" width="100" height="150" rx="10" fill="url(#gl' + id + ')" stroke="#cfd2d6"/>' +
        '<rect x="262" y="296" width="76" height="28" fill="#c9ccd1"/><rect x="258" y="276" width="84" height="24" rx="3" fill="#6f8fb0"/>' +
        label(256, 352, 88, 92, Math.min(fs, 13));
    }
    return '<svg viewBox="0 0 600 600" role="img" aria-label="' + esc(p.title) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="bg' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9dadd"/><stop offset=".6" stop-color="#e2e3e6"/><stop offset=".601" stop-color="#e9eaec"/><stop offset="1" stop-color="#f1f1f3"/></linearGradient>' +
      '<linearGradient id="w' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#e9eaed"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#dcdee2"/></linearGradient>' +
      '<linearGradient id="am' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#4a1f0b"/><stop offset=".4" stop-color="#8a3d17"/><stop offset="1" stop-color="#3a1808"/></linearGradient>' +
      '<linearGradient id="gl' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#e2e6ea"/><stop offset=".45" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#d7dce1"/></linearGradient>' +
      '<radialGradient id="sh' + id + '"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="600" height="600" fill="url(#bg' + id + ')"/>' +
      '<line x1="0" x2="600" y1="360" y2="360" stroke="#c9cacd" stroke-width="1"/>' +
      '<ellipse cx="300" cy="546" rx="150" ry="16" fill="url(#sh' + id + ')"/>' +
      '<g transform="translate(300 540) scale(1.62) translate(-300 -470)">' + body + '</g></svg>';
  }

  /* ── Cards ── */
  const BADGE = { out: 'Out of Stock', backorder: 'Backorder', delay: '1–3 day delay' };
  function card(p) {
    const multi = p.sizes.length > 1;
    const href = 'product.html?id=' + encodeURIComponent(p.id);
    let action = '';
    if (p.status === 'out') action = '';
    else if (multi) action = '<a class="btn btn--solid" href="' + href + '">Select options</a>';
    else action = '<button class="btn btn--solid" type="button" data-add="' + esc(p.id) + '">' + (p.status === 'backorder' ? 'Pre order' : 'Add to cart') + '</button>';
    return '<article class="card">' +
      '<a class="card__img" href="' + href + '" tabindex="-1" aria-hidden="true">' + (BADGE[p.status] ? '<span class="badge">' + BADGE[p.status] + '</span>' : '') + art(p) + '</a>' +
      '<h3 class="card__name"><a href="' + href + '">' + esc(p.title) + '</a></h3>' +
      '<div class="card__price">' + (multi ? 'From ' : '') + money(minPrice(p)) + '</div>' +
      '<div class="card__actions"><a class="btn" href="' + href + '">Read more<span class="sr"> about ' + esc(p.name) + '</span></a>' + action + '</div></article>';
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    addToCart(b.dataset.add, +(b.dataset.size || 0), +(b.dataset.qty || 1));
  });

  /* ── Header & footer ── */
  function header(tab) {
    const el = $('#hdr'); if (!el) return;
    el.className = 'hdr';
    el.innerHTML = '<div class="wrap"><div class="hdr__row">' +
      '<a class="logo" href="index.html" aria-label="Broaddus Scientific Group, shop home"><b>BROADDUS</b><small>Scientific Group</small></a>' +
      '<div class="hdr__lines"><b>Research compounds and peptides, documented lot by lot</b><span class="ship">Free shipping on US orders over $' + SITE.freeShip + '</span></div>' +
      '<nav class="hdr__nav" aria-label="Shop">' +
        '<a class="cartlink" href="cart.html">Cart <span class="n js-count">0</span></a>' +
        '<a class="help-link" href="help.html">Help center</a><span class="hdr__sep"></span>' +
        '<button class="iconbtn" type="button" id="searchbtn" aria-label="Search" aria-expanded="false" aria-controls="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg></button>' +
      '</nav></div>' +
      '<div class="search" id="search"><form action="index.html" role="search"><label class="sr" for="q">Search products</label><input id="q" name="q" type="search" placeholder="Search by name, e.g. Semax, Piracetam, BPC-157" value="' + esc(qs('q') || '') + '"><button class="btn btn--solid" type="submit">Search</button></form></div>' +
      (tab !== false ? '<nav class="tabs" aria-label="Departments"><a href="index.html"' + (tab === 'chem' ? ' aria-current="page"' : '') + '>Chemicals</a><a href="index.html?tab=peptides"' + (tab === 'pep' ? ' aria-current="page"' : '') + '>Peptides</a></nav>' : '') +
      '</div>';
    const sb = $('#searchbtn'), box = $('#search');
    if (qs('q')) { box.classList.add('open'); sb.setAttribute('aria-expanded', 'true'); }
    sb.addEventListener('click', () => { const o = box.classList.toggle('open'); sb.setAttribute('aria-expanded', o); if (o) $('#q').focus(); });
    syncCount();
  }
  function footer() {
    const el = $('#ftr'); if (!el) return;
    el.className = 'ftr';
    const chem = C.chemCats.map(c => '<li><a href="index.html?cat=' + c[0] + '">' + esc(c[1]) + '</a></li>').join('');
    el.innerHTML = '<div class="wrap"><div class="ftr__grid">' +
      '<div><h4>All products</h4><ul>' + chem + '<li><a href="index.html?tab=peptides">Peptides</a></li></ul></div>' +
      '<div><h4>Support</h4><ul><li><a href="help.html">Help center</a></li><li><a href="help.html#contact">Contact us</a></li><li><a href="help.html#shipping">Shipping &amp; delivery</a></li><li><a href="help.html#returns">Refunds &amp; returns</a></li><li><a href="help.html#testing">Testing &amp; COAs</a></li></ul></div>' +
      '<div><a class="logo" href="index.html"><b>BROADDUS</b><small>Scientific Group</small></a><ul><li><a href="help.html#about">About</a></li><li><a href="help.html#terms">Terms &amp; conditions</a></li><li><a href="help.html#privacy">Privacy policy</a></li><li><a href="/">Secrets of the University</a></li></ul></div>' +
      '</div><p class="ftr__legal">All products are sold strictly for laboratory research use only. They are not drugs, dietary supplements, foods or cosmetics, and are not for human or veterinary use. Nothing on this site is medical advice. &copy; ' + new Date().getFullYear() + ' ' + SITE.name + '.</p></div>';
  }

  /* ── Research-use gate (once per browser) ── */
  function gate() {
    if (store.get('bsg_ruo_ok', false)) return;
    const g = document.createElement('div');
    g.className = 'gate'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-labelledby', 'gate-h');
    g.innerHTML = '<div class="gate__box"><span class="flag">Research use only</span><h2 id="gate-h">Before you enter</h2>' +
      '<p>Everything sold here is for laboratory research use only and is not for human or animal consumption. By entering you confirm you are 21 or older and purchasing for research.</p>' +
      '<button class="btn btn--solid" type="button" id="gate-ok" style="width:100%">I confirm, enter the shop</button>' +
      '<p style="margin:14px 0 0"><a href="/">Leave</a></p></div>';
    document.body.appendChild(g);
    $('#gate-ok').focus();
    $('#gate-ok').addEventListener('click', () => { store.set('bsg_ruo_ok', true); g.remove(); });
  }

  window.SHOP = { SITE, C, ITEMS, byId, minPrice, catName, esc, money, qs, $, $$, art, card, header, footer, gate,
    getCart, setCart, lines, subtotal, count, addToCart, setQty, shipping, toast, store, BADGE };
})();
