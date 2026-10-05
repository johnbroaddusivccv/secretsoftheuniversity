/* ============================================================
   MERIDIAN PEPTIDES — Shared app logic
   Header/footer, cart (localStorage), rendering helpers.
   ============================================================ */

const SITE = {
  name: "Broaddus Scientific Group",
  wordmark: "BROADDUS",
  tagline: "Scientific Group — research peptides & reference data for the lab.",
  freeShipThreshold: 150,
  parentName: "Secrets of the University",
  parentUrl: "/",
  email: "support@broaddusscientific.example"
};

/* ---------- Utilities ---------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => "$" + Number(n).toFixed(2);
const productById = id => PRODUCTS.find(p => p.id === id);
const categoryById = id => CATEGORIES.find(c => c.id === id);
const catName = id => (categoryById(id)||{}).name || id;
function qs(name){ return new URLSearchParams(location.search).get(name); }
function _hsearch(e){ e.preventDefault(); const q=(e.target.querySelector("input").value||"").trim(); location.href = "shop.html" + (q ? ("?q="+encodeURIComponent(q)) : ""); return false; }
window._hsearch = _hsearch;
function lowestPrice(p){ return Math.min(...p.sizes.map(s=>s.price)); }
function stockOf(p){ return (p && p.stock) || "in"; }
function stockLabel(p){ const s=stockOf(p); return s==="out" ? "Sold out" : s==="low" ? "Low stock" : "In stock"; }
function stockDot(p){ const s=stockOf(p); return (s==="out" ? "○ " : s==="low" ? "◐ " : "● ") + stockLabel(p); }


/* ---------- CART (localStorage) ---------- */
const CART_KEY = "broaddus_cart_v1";
function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; } }
/* ---------- Volume tiers (catalog sizes only) ----------
   A size with tiers [t1,t2,t3] is priced per vial by how many vials of that
   exact size are in the cart: 1–4 -> t1, 5–9 -> t2, 10+ -> t3. */
function tierIndex(qty){ const t = window.VOLUME_TIERS || [{min:1},{min:5},{min:10}]; let i = 0; t.forEach((x,k)=>{ if(qty >= x.min) i = k; }); return i; }
function sizeBySku(id, sku){ const p = productById(id); return p ? p.sizes.find(z => z.sku === sku) : null; }
function unitPrice(size, qty){ if(!size) return 0; return size.tiers ? size.tiers[Math.min(tierIndex(qty), size.tiers.length-1)] : size.price; }
function repriceCart(c){ c.forEach(it => { const s = sizeBySku(it.id, it.sku); if(s){ it.price = unitPrice(s, it.qty); it.tier = s.tiers ? tierIndex(it.qty) : 0; } }); return c; }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(repriceCart(c))); updateCartCount(); }
function cartCount(){ return getCart().reduce((n,i)=>n+i.qty,0); }
function cartSubtotal(){ return getCart().reduce((s,i)=>s + i.price*i.qty, 0); }
function updateCartCount(){ $$(".js-cart-count").forEach(el => el.textContent = cartCount()); }

function addToCart(productId, sizeIndex=0, qty=1, silent=false){
  const p = productById(productId); if(!p) return;
  const size = p.sizes[sizeIndex] || p.sizes[0];
  const key = productId + "::" + size.sku;
  const cart = getCart();
  const existing = cart.find(i => i.key === key);
  if(existing){ existing.qty += qty; }
  else{ cart.push({ key, id:productId, name:p.name, size:size.label, sku:size.sku, price:size.price, qty }); }
  saveCart(cart);
  if(!silent){ if($("#cart-drawer")) openCart(); else toast(`Added — ${p.name} (${size.label})`); }
}

/* ---------- Stacks & protocols ---------- */
const stackById = id => (window.STACKS || []).find(s => s.id === id);
const protocolById = id => (window.PROTOCOLS || []).find(r => r.id === id);
const stacksWith = id => (window.STACKS || []).filter(s => s.components.some(c => c.id === id));
function stackPrice(s){
  return s.components.reduce((sum,c)=>{
    const p = productById(c.id); if(!p) return sum;
    const size = p.sizes[c.sizeIndex||0] || p.sizes[0];
    return sum + size.price;
  }, 0);
}
function addStackToCart(stackId){
  const s = stackById(stackId); if(!s) return;
  let n = 0;
  s.components.forEach(c => { if(productById(c.id)){ addToCart(c.id, c.sizeIndex||0, 1, true); n++; } });
  updateCartCount();
  toast(`Added stack — ${s.name} (${n} items)`);
  if($("#cart-drawer")) openCart();
}

/* ---------- Orders (localStorage; payment wired later) ---------- */
const ORDERS_KEY = "broaddus_orders_v1";
function getOrders(){ try{ return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }catch(e){ return []; } }
function saveOrders(o){ localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
const orderById = id => getOrders().find(o => o.id === id);
function shippingCost(sub, method){
  if(sub === 0) return 0;
  if(sub >= SITE.freeShipThreshold) return method === "express" ? 15 : 0;
  return method === "express" ? 25 : 12;
}
/* Automatic volume discount tiers (by subtotal) */
function bulkEligible(){ return getCart().reduce((t,i)=> t + (i.tier ? 0 : i.price*i.qty), 0); }
function bulkDiscount(sub){
  sub = bulkEligible();
  let pct = 0;
  if(sub >= 1000) pct = 15; else if(sub >= 500) pct = 10; else if(sub >= 250) pct = 5;
  if(!pct) return null;
  return { code:"BULK", amount:+(sub * pct/100).toFixed(2), freeShip:false, label:`Bulk discount ${pct}%`, auto:true };
}
function nextBulkTier(sub){
  sub = bulkEligible();
  const tiers = [[250,5],[500,10],[1000,15]];
  for(const [min,pct] of tiers){ if(sub < min) return { min, pct, add: +(min - sub).toFixed(2) }; }
  return null;
}
function createOrder(customer, shipDetails, discounts){
  discounts = (discounts || []).filter(Boolean);
  const items = getCart();
  const sub = cartSubtotal();
  let ship = shippingCost(sub, shipDetails.method);
  let discTotal = 0, freeShip = false;
  discounts.forEach(d => { discTotal += (d.amount || 0); if(d.freeShip) freeShip = true; });
  if(freeShip) ship = 0;
  const total = Math.max(0, +(sub - discTotal).toFixed(2)) + ship;
  const id = "BSG-" + Date.now().toString(36).toUpperCase().slice(-5) + "-" + Math.floor(1000 + Math.random()*9000);
  const order = { id, date: new Date().toISOString(), items, subtotal: sub, discounts, shipping: ship, total, customer, shipDetails, status: "awaiting-payment" };
  const orders = getOrders(); orders.push(order); saveOrders(orders);
  return order;
}

/* Back-in-stock notify requests */
const NOTIFY_KEY = "broaddus_notify_v1";
function saveNotify(productId, email){
  let list = []; try{ list = JSON.parse(localStorage.getItem(NOTIFY_KEY)) || []; }catch(e){}
  list.push({ productId, email, date: new Date().toISOString() });
  localStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
}
window.saveNotify = saveNotify;

/* ---------- Discount codes ---------- */
const DISCOUNTS = {
  RESEARCH10: { type:"pct",  value:10, label:"10% off" },
  WELCOME15:  { type:"pct",  value:15, label:"15% off — welcome" },
  LAB20:      { type:"pct",  value:20, min:200, label:"20% off orders $200+" },
  FREESHIP:   { type:"ship", label:"Free shipping" }
};
function applyDiscount(code, sub){
  const key = (code||"").trim().toUpperCase();
  const c = DISCOUNTS[key];
  if(!c) return { error:"Invalid code" };
  if(c.min && sub < c.min) return { error:`Requires a $${c.min}+ subtotal` };
  if(c.type === "pct")  return { code:key, amount:+(sub * c.value/100).toFixed(2), freeShip:false, label:c.label };
  if(c.type === "ship") return { code:key, amount:0, freeShip:true, label:c.label };
  return { error:"Invalid code" };
}

/* ---------- Favorites (wishlist) ---------- */
const FAV_KEY = "broaddus_favs_v1";
function getFavs(){ try{ return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }catch(e){ return []; } }
function saveFavs(f){ localStorage.setItem(FAV_KEY, JSON.stringify(f)); updateFavCount(); }
function isFav(id){ return getFavs().includes(id); }
function favCount(){ return getFavs().length; }
function toggleFav(id){ const f=getFavs(); const i=f.indexOf(id); if(i>=0) f.splice(i,1); else f.push(id); saveFavs(f); return isFav(id); }
function updateFavCount(){ $$(".js-fav-count").forEach(el => el.textContent = favCount()); }
function toggleFavBtn(el, id){ const on = toggleFav(id); el.classList.toggle("on", on); el.setAttribute("aria-pressed", on); toast(on ? "Saved to favorites" : "Removed from favorites"); }
window.toggleFavBtn = toggleFavBtn;

/* ---------- Recently viewed ---------- */
const RECENT_KEY = "broaddus_recent_v1";
function getRecent(){ try{ return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }catch(e){ return []; } }
function pushRecent(id){ let r = getRecent().filter(x => x !== id); r.unshift(id); localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0,10))); }

/* ---------- Compare (up to 4) ---------- */
const CMP_KEY = "broaddus_compare_v1";
const CMP_MAX = 4;
function getCompare(){ try{ return JSON.parse(localStorage.getItem(CMP_KEY)) || []; }catch(e){ return []; } }
function saveCompare(a){ localStorage.setItem(CMP_KEY, JSON.stringify(a)); }
function isCompare(id){ return getCompare().includes(id); }
function clearCompare(){ saveCompare([]); }
function toggleCompareCapped(id){
  const a = getCompare(); const i = a.indexOf(id);
  if(i >= 0){ a.splice(i,1); saveCompare(a); return false; }
  if(a.length >= CMP_MAX) return null;
  a.push(id); saveCompare(a); return true;
}
function toggleCompareBtn(el, id){
  const r = toggleCompareCapped(id);
  if(r === null){ toast(`Compare up to ${CMP_MAX} items`); return; }
  el.classList.toggle("on", r); syncCompareUI();
}
function syncCompareUI(){ $$(".cmp-btn").forEach(b => b.classList.toggle("on", isCompare(b.dataset.id))); renderCompareBar(); }
function renderCompareBar(){
  const bar = $("#compare-bar"); if(!bar) return;
  const ids = getCompare();
  if(!ids.length){ bar.classList.remove("show"); bar.innerHTML = ""; document.body.classList.remove("has-cmp-bar"); return; }
  bar.classList.add("show"); document.body.classList.add("has-cmp-bar");
  bar.innerHTML = `<div class="container cmp-bar__in">
    <div class="cmp-bar__items"><b class="small" style="text-transform:uppercase;letter-spacing:.05em">Compare ${ids.length}/${CMP_MAX}</b>
      ${ids.map(id=>{ const p=productById(id); return p?`<span class="cmp-chip">${p.name}<button data-id="${id}" aria-label="Remove">×</button></span>`:""; }).join("")}
    </div>
    <div class="cmp-bar__act"><button class="btn btn--sm" id="cmp-clear">Clear</button><a class="btn btn--sm btn--solid" href="compare.html">Compare</a></div>
  </div>`;
  $$("#compare-bar .cmp-chip button").forEach(b => b.onclick = ()=>{ toggleCompareCapped(b.dataset.id); syncCompareUI(); });
  $("#cmp-clear").onclick = ()=>{ clearCompare(); syncCompareUI(); };
}
window.toggleCompareBtn = toggleCompareBtn;

/* ---------- Cart drawer (mini-cart) ---------- */
function renderDrawer(){
  const body = $("#drawer-items"), foot = $("#drawer-foot");
  if(!body || !foot) return;
  const cart = getCart();
  if(!cart.length){
    body.innerHTML = `<p class="muted" style="padding:40px 0;text-align:center">Your cart is empty.</p>`;
    foot.innerHTML = `<a href="shop.html" class="btn btn--full" onclick="closeCart()">Browse peptides</a>`;
    return;
  }
  body.innerHTML = cart.map(i=>`
    <div class="drawer-item" data-key="${i.key}">
      <div>
        <a href="product.html?id=${i.id}"><b class="small">${i.name}</b></a>
        <div class="small muted">${i.size} · ${money(i.price)}${i.tier ? ` <b class="tier-tag">${(window.VOLUME_TIERS||[])[i.tier].label} price</b>` : ""}</div>
        <div class="qty qty--sm" style="margin-top:8px">
          <button data-act="minus" aria-label="decrease">−</button>
          <input data-act="qty" type="number" value="${i.qty}" min="1" inputmode="numeric">
          <button data-act="plus" aria-label="increase">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="price small mono">${money(i.price*i.qty)}</div>
        <button class="linkbtn" data-act="remove" style="margin-top:8px">Remove</button>
      </div>
    </div>`).join("");
  const sub = cartSubtotal();
  const hint = sub < SITE.freeShipThreshold
    ? `<p class="small muted" style="margin:0 0 12px">Add ${money(SITE.freeShipThreshold - sub)} for free shipping</p>`
    : `<p class="small" style="margin:0 0 12px"><b>✓ Free shipping unlocked</b></p>`;
  foot.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-weight:800;font-size:1.05rem;margin-bottom:10px"><span>Subtotal</span><span>${money(sub)}</span></div>
    ${hint}
    <a href="checkout.html" class="btn btn--solid btn--full" style="margin-bottom:8px">Checkout</a>
    <a href="cart.html" class="btn btn--full">View full cart</a>`;
  $$("#drawer-items .drawer-item").forEach(row=>{
    const key = row.dataset.key;
    row.querySelector('[data-act="minus"]').onclick = ()=>{ const it=getCart().find(x=>x.key===key); setQty(key, it.qty-1); renderDrawer(); };
    row.querySelector('[data-act="plus"]').onclick  = ()=>{ const it=getCart().find(x=>x.key===key); setQty(key, it.qty+1); renderDrawer(); };
    row.querySelector('[data-act="qty"]').onchange  = (e)=>{ setQty(key, parseInt(e.target.value)||1); renderDrawer(); };
    row.querySelector('[data-act="remove"]').onclick = ()=>{ removeItem(key); renderDrawer(); };
  });
}
function openCart(){ const d=$("#cart-drawer"), o=$("#drawer-ov"); if(!d) return; renderDrawer(); d.classList.add("open"); d.setAttribute("aria-hidden","false"); if(o) o.classList.add("show"); }
function closeCart(){ const d=$("#cart-drawer"), o=$("#drawer-ov"); if(!d) return; d.classList.remove("open"); d.setAttribute("aria-hidden","true"); if(o) o.classList.remove("show"); }
window.openCart = openCart; window.closeCart = closeCart;
function setQty(key, qty){
  const cart = getCart();
  const item = cart.find(i=>i.key===key);
  if(!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
}
function removeItem(key){ saveCart(getCart().filter(i=>i.key!==key)); }
function clearCart(){ saveCart([]); }

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg){
  let t = $(".toast");
  if(!t){ t = document.createElement("div"); t.className="toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 2200);
}

/* ---------- Product card markup ---------- */
function cardHTML(p){
  const featured = p.featured ? `<span class="tag-featured">Featured</span>` : "";
  const trust = [stockDot(p),
    (p.category !== "supplies" ? "COA" : null),
    (p.purity && p.purity !== "N/A" ? p.purity : null)].filter(Boolean).join("&nbsp;·&nbsp;");
  return `<a class="card card--text" href="product.html?id=${p.id}">
    <div class="card__media">${productArt(p)}</div>
    <div class="card__body">
      <div class="card__topline">
        <span class="card__cat">${catName(p.category)}</span>
        <span class="card__acts">
          <button type="button" class="fav-btn ${isFav(p.id)?'on':''}" aria-label="Save to favorites" aria-pressed="${isFav(p.id)}" onclick="event.preventDefault();event.stopPropagation();toggleFavBtn(this,'${p.id}')">♥</button>
          <button type="button" class="cmp-btn ${isCompare(p.id)?'on':''}" data-id="${p.id}" aria-label="Add to compare" title="Add to compare" onclick="event.preventDefault();event.stopPropagation();toggleCompareBtn(this,'${p.id}')">⇄</button>
        </span>
      </div>
      <div class="card__title">${p.name}${featured}</div>
      <div class="card__desc">${p.summary}</div>
      <div class="card__trust">${trust}</div>
      <div class="card__foot">
        <span class="price">${money(lowestPrice(p))} <small>from</small></span>
        <span class="btn btn--sm">View</span>
      </div>
    </div>
  </a>`;
}

/* ---------- Header / Footer injection ---------- */
function renderChrome(active){
  const header = `
  <div class="topbar">
    <a class="topbar__back" href="${SITE.parentUrl}"><span aria-hidden="true">←</span> <span class="topbar__back-full">${SITE.parentName}</span><span class="topbar__back-short">University</span></a>
    <span class="topbar__msg">Research Use Only<span class="topbar__more"> · Not for Human Consumption · Free shipping on orders over $${SITE.freeShipThreshold}</span></span>
  </div>
  <header class="header">
    <div class="header__row">
      <a class="brand" href="index.html">
        <span class="brand__mark">${SITE.wordmark}</span>
        <span class="brand__tag">${SITE.tagline}</span>
      </a>
      <div class="header__spacer"></div>
      <form class="hsearch" role="search" onsubmit="return _hsearch(event)">
        <input type="search" placeholder="Search peptides…" aria-label="Search peptides">
      </form>
      <nav class="header__links">
        <a href="favorites.html" class="fav-pill" aria-label="Saved items">♥ <b class="js-fav-count">0</b></a>
        <button type="button" class="cart-pill" id="cart-toggle">Cart <b class="js-cart-count">0</b></button>
      </nav>
    </div>
  </header>
  <nav class="nav"><div class="nav__inner">
    <a href="index.html" data-k="home">Home</a>
    <a href="shop.html" data-k="shop">Shop</a>
    <a href="glossary.html" data-k="glossary">Glossary</a>
    <a href="protocols.html" data-k="protocols">Protocols &amp; Stacks</a>
  </div></nav>`;

  const year = 2026;
  const footer = `
  <footer class="footer"><div class="container">
    <div class="footer__grid">
      <div>
        <span class="brand__mark" style="display:inline-block;margin-bottom:14px">${SITE.wordmark}</span>
        <p class="small muted">${SITE.tagline} All products are sold strictly for in-vitro laboratory research and are not intended for human or veterinary use.</p>
        <span class="ruo-flag">Research Use Only</span>
        <a class="footer__parent" href="${SITE.parentUrl}">← Back to ${SITE.parentName}</a>
      </div>
      <div>
        <h5>Shop</h5>
        <a href="shop.html">All Products</a>
        <a href="category.html">Browse Categories</a>
        <a href="favorites.html">Saved Items</a>
        <a href="category.html?cat=glp1">GLP-1 Research</a>
        <a href="category.html?cat=growth">Growth Hormone</a>
      </div>
      <div>
        <h5>Learn</h5>
        <a href="glossary.html">Peptide Glossary</a>
        <a href="protocols.html">Protocols & Stacks</a>
        <a href="about.html#coa">Certificates of Analysis</a>
        <a href="about.html#quality">Quality & Testing</a>
      </div>
      <div>
        <h5>Company</h5>
        <a href="about.html">About Us</a>
        <a href="faq.html">FAQ</a>
        <a href="orders.html">Order Lookup</a>
        <a href="about.html#shipping">Shipping</a>
        <a href="about.html#terms">Terms & Disclaimer</a>
        <a href="about.html#contact">Contact</a>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${year} ${SITE.name}, a <a href="${SITE.parentUrl}" style="display:inline;padding:0;text-decoration:underline">${SITE.parentName}</a> company. For laboratory research use only.</span>
      <span>Prices shown net of New York State sales tax.</span>
      <span>Products are not drugs and make no therapeutic claims.</span>
    </div>
  </div></footer>`;

  const mount = $("#chrome-top");
  if(mount) mount.innerHTML = header;
  const fmount = $("#chrome-bottom");
  if(fmount) fmount.innerHTML = footer;

  // active state
  $$(".nav__inner a").forEach(a => { if(a.dataset.k === active) a.classList.add("active"); });
  updateCartCount();
  updateFavCount();

  // cart drawer (mini-cart) — inject once, then wire the header toggle
  if(!$("#cart-drawer")){
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="drawer-overlay" id="drawer-ov"></div>
      <aside class="drawer" id="cart-drawer" aria-hidden="true" aria-label="Shopping cart">
        <div class="drawer__head"><b>Your Cart</b><button class="drawer__close" id="drawer-close" aria-label="Close cart">×</button></div>
        <div class="drawer__body" id="drawer-items"></div>
        <div class="drawer__foot" id="drawer-foot"></div>
      </aside>`;
    document.body.appendChild(wrap);
    $("#drawer-ov").addEventListener("click", closeCart);
    $("#drawer-close").addEventListener("click", closeCart);
    document.addEventListener("keydown", e => { if(e.key === "Escape") closeCart(); });
  }
  const toggle = $("#cart-toggle");
  if(toggle) toggle.addEventListener("click", openCart);

  // compare bar — inject once, then render current state
  if(!$("#compare-bar")){
    const cb = document.createElement("div");
    cb.id = "compare-bar";
    cb.className = "compare-bar";
    document.body.appendChild(cb);
  }
  renderCompareBar();
}

/* ---------- Age gate ---------- */
function ageGate(){
  if(localStorage.getItem("broaddus_age_ok")) return;
  const g = document.createElement("div");
  g.className = "gate";
  g.innerHTML = `<div class="gate__box">
    <span class="ruo-flag">Research Use Only</span>
    <h3 style="margin-top:14px">Age & Use Confirmation</h3>
    <p>The products on this site are sold strictly for <b>laboratory research use only</b> and are <b>not for human consumption</b>. By entering you confirm you are 21+ and a qualified researcher.</p>
    <button class="btn btn--solid btn--full" id="gate-yes" style="margin-top:18px">I confirm — Enter site</button>
    <p class="small" style="margin-top:14px"><a href="https://www.google.com" style="text-decoration:underline">Leave site</a></p>
  </div>`;
  document.body.appendChild(g);
  $("#gate-yes").addEventListener("click", ()=>{ localStorage.setItem("broaddus_age_ok","1"); g.remove(); });
}

/* ---------- Product art (generated SVG) ----------
   Every product image is drawn from its data: container follows the
   form of the chosen size (vial, dropper, nasal spray, capsule bottle,
   powder jar), label carries the name and strength. No image files. */
const CAT_ACCENT = {
  glp1:"#3b82a0", growth:"#5b6bb5", metabolic:"#b0703a", recovery:"#3f8f6a", neuro:"#7a5fb0",
  nootropics:"#2f6fb3", immune:"#a0463f", endocrine:"#b05a8a", performance:"#c0582a", copper:"#b87333",
  cosmetic:"#c48aa0", longevity:"#4d8f8a", blends:"#0e1116", supplies:"#8b94a3"
};
let _artSeq = 0;
function _esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function artForm(p, size){
  const l = ((size && size.label) || "").toLowerCase();
  if(/nasal/.test(l) || /nasal/i.test(p.name)) return "nasal";
  if(/capsule/.test(l)) return "caps";
  if(/powder/.test(l)) return "powder";
  if(/solution|mg\/ml|\/ml|dropper/.test(l)) return "dropper";
  if(p.category === "nootropics" && /\d\s*g\b/.test(l)) return "powder";
  if(p.form === "solution" && !/^\d+(\.\d+)?\s*mg$/.test(l.trim())) return "dropper";
  return "vial";
}
function artStrength(size){
  let l = ((size && size.label) || "").replace(/^(capsules|powder|solution|nasal spray)\s*(\([^)]*\))?\s*·\s*/i, "");
  if(l.includes("+")){
    const nums = l.match(/\d+(\.\d+)?/g) || [];
    const unit = /iu/i.test(l) ? " IU" : "mg";
    return nums.join("/") + unit;
  }
  return l.replace(/\s*\(\d+\s*ml\)/i, "").replace(/\s+/g, " ").trim() || "—";
}
function artNameLines(name){
  const n = name.toUpperCase();
  if(n.length <= 11) return [n];
  const words = n.split(" ");
  if(words.length === 1) return [n];
  let best = [n], bestLen = n.length;
  for(let i = 1; i < words.length; i++){
    const a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
    const m = Math.max(a.length, b.length);
    if(m < bestLen){ bestLen = m; best = [a, b]; }
  }
  return best;
}
function productArt(p, sizeIndex){
  if(!p) return "";
  const size = p.sizes[sizeIndex == null ? defaultSizeIndex(p) : sizeIndex] || p.sizes[0];
  // rendered 3D product photo when one exists for this size; drawn SVG otherwise
  if(size && window.PRODUCT_PHOTOS && window.PRODUCT_PHOTOS.has(size.sku)){
    return `<img class="product-art product-photo" src="assets/img/products/${encodeURIComponent(size.sku)}.webp" alt="${_esc(p.name)} — ${_esc(size.label)}" width="800" height="800" loading="lazy" decoding="async">`;
  }
  const form = artForm(p, size), id = "a" + (++_artSeq);
  const accent = CAT_ACCENT[p.category] || "#0e1116", ink = "#0e1116";
  const strength = artStrength(size);

  // container geometry: label box {x,y,w,h} and the container body markup
  let body = "", L;
  if(form === "vial"){
    L = {x:146, y:188, w:108, h:112};
    body = `
      <rect x="140" y="150" width="120" height="172" rx="12" fill="url(#${id}g)" stroke="#c9d1db" stroke-width="1.5"/>
      <path d="M140 164 Q140 150 156 146 L166 142 L234 142 L244 146 Q260 150 260 164 Z" fill="url(#${id}g)" stroke="#c9d1db" stroke-width="1.5"/>
      <rect x="164" y="126" width="72" height="20" fill="#dfe4ea" stroke="#c9d1db"/>
      <rect x="152" y="96" width="96" height="36" rx="4" fill="${ink}"/>
      <rect x="152" y="96" width="96" height="36" rx="4" fill="url(#${id}m)"/>
      <rect x="160" y="86" width="80" height="12" rx="3" fill="${accent}"/>
      <rect x="150" y="160" width="8" height="150" rx="4" fill="#fff" opacity=".55"/>`;
  } else if(form === "dropper"){
    L = {x:150, y:208, w:100, h:98};
    body = `
      <path d="M146 196 Q146 176 170 170 L230 170 Q254 176 254 196 L254 306 Q254 322 238 322 L162 322 Q146 322 146 306 Z" fill="url(#${id}amb)"/>
      <rect x="176" y="150" width="48" height="22" fill="#5a2c0c"/>
      <rect x="162" y="112" width="76" height="42" rx="5" fill="${ink}"/>
      <rect x="162" y="112" width="76" height="42" rx="5" fill="url(#${id}m)"/>
      <path d="M178 112 L178 84 Q178 58 200 58 Q222 58 222 84 L222 112 Z" fill="${ink}"/>
      <rect x="156" y="186" width="7" height="118" rx="3.5" fill="#fff" opacity=".28"/>`;
  } else if(form === "nasal"){
    L = {x:154, y:196, w:92, h:108};
    body = `
      <rect x="148" y="176" width="104" height="146" rx="18" fill="url(#${id}w)" stroke="#c9d1db" stroke-width="1.5"/>
      <rect x="160" y="150" width="80" height="30" rx="4" fill="${ink}"/>
      <rect x="160" y="150" width="80" height="30" rx="4" fill="url(#${id}m)"/>
      <path d="M186 150 L190 84 Q200 64 210 84 L214 150 Z" fill="url(#${id}w)" stroke="#c9d1db" stroke-width="1.5"/>
      <circle cx="200" cy="76" r="4" fill="${accent}"/>`;
  } else if(form === "caps"){
    L = {x:136, y:190, w:128, h:112};
    body = `
      <rect x="128" y="150" width="144" height="172" rx="18" fill="url(#${id}w)" stroke="#c9d1db" stroke-width="1.5"/>
      <rect x="136" y="104" width="128" height="50" rx="6" fill="${ink}"/>
      <rect x="136" y="104" width="128" height="50" rx="6" fill="url(#${id}m)"/>
      ${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<line x1="${144+i*11.2}" y1="110" x2="${144+i*11.2}" y2="148" stroke="#ffffff" stroke-opacity=".08" stroke-width="3"/>`).join("")}
      <rect x="136" y="150" width="128" height="6" fill="${accent}"/>`;
  } else { // powder jar
    L = {x:118, y:214, w:164, h:92};
    body = `
      <rect x="110" y="194" width="180" height="128" rx="18" fill="url(#${id}w)" stroke="#c9d1db" stroke-width="1.5"/>
      <rect x="114" y="158" width="172" height="40" rx="6" fill="${ink}"/>
      <rect x="114" y="158" width="172" height="40" rx="6" fill="url(#${id}m)"/>
      <rect x="114" y="194" width="172" height="5" fill="${accent}"/>`;
  }

  // label
  const cx = L.x + L.w/2;
  const lines = artNameLines(p.name);
  const longest = Math.max(...lines.map(s => s.length));
  const avail = L.w - 14;
  const fs = Math.max(8.5, Math.min(lines.length > 1 ? 17 : 21, avail / (longest * 0.66)));
  const nameY0 = L.y + 40 + (lines.length > 1 ? 0 : 4);
  const nameSvg = lines.map((s, i) => {
    const w = s.length * fs * 0.66;
    const fit = w > avail ? ` textLength="${avail}" lengthAdjust="spacingAndGlyphs"` : "";
    return `<text x="${cx}" y="${nameY0 + i*(fs+2)}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="800" fill="${ink}"${fit}>${_esc(s)}</text>`;
  }).join("");
  const pillY = nameY0 + (lines.length-1)*(fs+2) + 8;
  const pillW = Math.min(L.w - 16, Math.max(46, strength.length * 7.4 + 18));
  const compact = L.h < 100;
  const label = `
    <rect x="${L.x}" y="${L.y}" width="${L.w}" height="${L.h}" rx="2" fill="#fff"/>
    <rect x="${L.x}" y="${L.y + L.h - 5}" width="${L.w}" height="5" fill="${accent}"/>
    <rect x="${cx-31}" y="${L.y+9}" width="62" height="15" fill="none" stroke="${ink}" stroke-width="1.4"/>
    <text x="${cx}" y="${L.y+20}" text-anchor="middle" font-size="8.2" font-weight="800" letter-spacing="1.3" fill="${ink}">BROADDUS</text>
    ${nameSvg}
    <rect x="${cx-pillW/2}" y="${pillY}" width="${pillW}" height="17" rx="2" fill="${ink}"/>
    <text x="${cx}" y="${pillY+12.2}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${_esc(strength.toUpperCase())}</text>
    ${compact ? "" : `<text x="${cx}" y="${L.y + L.h - 12}" text-anchor="middle" font-size="6.2" font-weight="700" letter-spacing=".9" fill="#5b6472">RESEARCH USE ONLY</text>`}`;

  return `<svg class="product-art" viewBox="52 44 296 296" role="img" aria-label="${_esc(p.name)} ${_esc(size ? size.label : "")}" font-family="Inter, -apple-system, system-ui, Helvetica, sans-serif">
  <defs>
    <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#eef3f8"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe6ee"/></linearGradient>
    <linearGradient id="${id}w" x1="0" x2="1"><stop offset="0" stop-color="#f4f6f9"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e8ee"/></linearGradient>
    <linearGradient id="${id}amb" x1="0" x2="1"><stop offset="0" stop-color="#5c2d0b"/><stop offset=".45" stop-color="#8a4a17"/><stop offset="1" stop-color="#4a2408"/></linearGradient>
    <linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".35" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}sh"><stop offset="0" stop-color="#0e1116" stop-opacity=".22"/><stop offset="1" stop-color="#0e1116" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="200" cy="352" rx="150" ry="22" fill="url(#${id}sh)"/>
  <path d="M70 330 L70 346 Q200 372 330 346 L330 330 Z" fill="#e6eaef"/>
  <ellipse cx="200" cy="330" rx="130" ry="17" fill="#ffffff" stroke="#dfe3e8"/>
  <ellipse cx="200" cy="324" rx="${form === "powder" ? 96 : 70}" ry="8" fill="#0e1116" opacity=".10"/>
  ${body}
  ${label}
</svg>`;
}
function defaultSizeIndex(p){ const i = p.sizes.findIndex(s => s.tiers); return i >= 0 ? i : 0; }

/* ---------- Pricing model ----------
   Displayed price = base price MINUS New York State sales tax,
   then rounded UP to a "smooth repeating" number (e.g. 33.33; over
   $100 the hundreds are kept, e.g. 129.99 -> 133.33). Applied once
   at load so cart, checkout, compare, and stacks all stay consistent. */
const NY_TAX = 0.04; // New York State sales tax rate
function repeatingPrice(x){
  const reps = [11.11,22.22,33.33,44.44,55.55,66.66,77.77,88.88,99.99];
  const EPS = 1e-9;
  if(x <= 99.99 + EPS){
    for(const r of reps){ if(r >= x - EPS) return r; }
    return 99.99;
  }
  const H = Math.floor(x/100);
  const rem = x - H*100;
  for(const r of reps){ if(r >= rem - EPS) return +(H*100 + r).toFixed(2); }
  return +((H+1)*100 + reps[0]).toFixed(2);
}
function displayPrice(base){ return repeatingPrice(base * (1 - NY_TAX)); }
(function applyPricingModel(){
  (window.PRODUCTS || []).forEach(p => p.sizes.forEach(s => {
    if(s.exact) return;                       // catalog sizes keep exact prices
    if(s.base == null) s.base = s.price;      // preserve original base once
    s.price = displayPrice(s.base);
  }));
  // migrate any existing cart items to the current displayed prices
  try{
    const c = getCart(); let changed = false;
    c.forEach(it => { const s = sizeBySku(it.id, it.sku); if(s){ const up = unitPrice(s, it.qty); if(it.price !== up){ it.price = up; changed = true; } } });
    repriceCart(c);
    if(changed) localStorage.setItem(CART_KEY, JSON.stringify(c));
  }catch(e){}
})();

document.addEventListener("DOMContentLoaded", ()=>{
  renderChrome(document.body.dataset.page || "");
  ageGate();
});
