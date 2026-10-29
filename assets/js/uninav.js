/* Secrets of the University: the site nav bar, for the pages that are not single-file
   University pages (the shop and Shortage Watch). It matches the nav on index.html,
   finance.html, health.html, careers.html and systems.html; change those together.
   Include it as the first thing in <body>:  <script src="/assets/js/uninav.js"></script> */
(function () {
  var LINKS = [
    ['/', 'Home', /^\/(index\.html)?$/],
    ['/shop/', 'Store', /^\/shop\//],
    ['/shortage/', 'Shortage Watch', /^\/shortage\//],
    ['/finance.html', 'Finance', /^\/finance(\.html)?$/],
    ['/health.html', 'Health', /^\/health(\.html)?$/],
    ['/careers.html', 'Careers', /^\/careers(\.html)?$/]
  ];
  var path = location.pathname;
  var isShortage = /^\/shortage\//.test(path);

  /* Theme: Shortage Watch keeps its own (data-theme on <html>); everywhere else the
     University cookie decides, dark by default. */
  function readCookie() { var m = document.cookie.match(/(?:^|; )theme=(light|dark)/); return m ? m[1] : 'dark'; }
  function isLight() {
    if (isShortage) {
      var t = document.documentElement.dataset.theme;
      return t ? t === 'light' : !matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return readCookie() === 'light';
  }

  var css = '' +
    '.uninav{--un-bg:#1f262d;--un-bg2:#252e37;--un-ink:#e3eaf0;--un-muted:#9aa9b6;--un-gold:#8fbbd9;--un-sd:rgba(0,0,0,.5);--un-sl:rgba(255,255,255,.05);' +
      'position:relative;z-index:50;width:100%;background:var(--un-bg);box-shadow:0 6px 14px -8px var(--un-sd);' +
      'font-family:"Inter",-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}' +
    '.uninav.is-light{--un-bg:#f6f7f9;--un-bg2:#eceef2;--un-ink:#14263a;--un-muted:#46607a;--un-gold:#1d4e6e;--un-sd:rgba(166,174,188,.5);--un-sl:rgba(255,255,255,.85)}' +
    '.uninav *{box-sizing:border-box}' +
    '.uninav__in{max-width:1160px;margin:0 auto;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;gap:32px;position:relative}' +
    '.uninav__brand{font-family:Georgia,"Times New Roman",serif;font-size:1.05rem;letter-spacing:.22em;text-transform:uppercase;color:var(--un-gold);text-decoration:none;white-space:nowrap;line-height:1.6}' +
    '.uninav__brand span{color:var(--un-muted)}' +
    '.uninav__links{display:flex;gap:20px;align-items:center}' +
    '.uninav__links a{font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--un-muted);text-decoration:none;white-space:nowrap;transition:color .3s}' +
    '.uninav__links a:hover,.uninav__links a.is-current{color:var(--un-gold)}' +
    '.uninav__btn{background:var(--un-bg);border:0;border-radius:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;line-height:1;' +
      'box-shadow:3px 3px 7px var(--un-sd),-3px -3px 7px var(--un-sl);transition:color .3s}' +
    '.uninav__theme{width:32px;height:32px;color:var(--un-muted);font-size:1rem}' +
    '.uninav__menu{width:40px;height:40px;color:var(--un-gold);font-size:1.3rem}' +
    '.uninav__btn:hover{color:var(--un-gold)}' +
    '.uninav__drop{position:absolute;top:calc(100% - 2px);right:24px;width:250px;padding:14px 0;background:var(--un-bg);box-shadow:7px 7px 16px var(--un-sd),-7px -7px 16px var(--un-sl);z-index:60}' +
    '.uninav__drop[hidden]{display:none}' +
    '.uninav__drop a{display:block;padding:11px 26px;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--un-ink);text-decoration:none}' +
    '.uninav__drop a:hover{background:var(--un-bg2);color:var(--un-gold)}' +
    '.uninav__droptheme{display:none;width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--un-bg2);margin-top:8px;padding:14px 26px 6px;font:inherit;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--un-gold);cursor:pointer}' +
    '' +
    '@media (max-width:1180px){.uninav__links{gap:15px}}' +
    '@media (max-width:1080px){.uninav__links a{display:none}.uninav__links{gap:10px}.uninav__theme{width:40px;height:40px}}' +
    '@media (max-width:700px){.uninav__in{gap:12px}.uninav__brand{flex:1 1 auto;min-width:0;font-size:.84rem;letter-spacing:.14em;overflow:hidden;text-overflow:ellipsis}.uninav__drop{right:16px}}' +
    '@media (max-width:440px){.uninav__in{padding:16px;gap:10px}.uninav__brand{font-size:.74rem;letter-spacing:.1em}}';

  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var all = LINKS.concat([['/systems.html', 'Systems']]);
  var nav = document.createElement('div');
  nav.className = 'uninav';
  nav.innerHTML =
    '<div class="uninav__in">' +
      '<a class="uninav__brand" href="/">Secrets <span>of the</span> University</a>' +
      '<nav class="uninav__links" aria-label="Secrets of the University">' +
        all.map(function (l) { var on = l[2] && l[2].test(path); return '<a href="' + l[0] + '"' + (on ? ' class="is-current" aria-current="page"' : '') + '>' + l[1] + '</a>'; }).join('') +
        '<button class="uninav__btn uninav__theme" type="button" aria-label="Toggle light mode"></button>' +
        '<button class="uninav__btn uninav__menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="uninav-drop">☰</button>' +
      '</nav>' +
      '<div class="uninav__drop" id="uninav-drop" hidden>' +
        all.map(function (l) { return '<a href="' + l[0] + '">' + l[1] + '</a>'; }).join('') +
        '<button class="uninav__droptheme" type="button"></button>' +
      '</div>' +
    '</div>';

  var host = document.body;
  host.insertBefore(nav, host.firstChild);

  var dropTheme = nav.querySelector('.uninav__droptheme');
  var themeBtn = nav.querySelector('.uninav__theme'), menuBtn = nav.querySelector('.uninav__menu'), drop = nav.querySelector('.uninav__drop');
  function paint() { var l = isLight(); nav.classList.toggle('is-light', l); themeBtn.textContent = l ? '☀' : '☾'; dropTheme.textContent = l ? '☀ Light mode' : '☾ Dark mode'; }
  paint();
  function flip() {
    var next = isLight() ? 'dark' : 'light';
    if (isShortage) {
      var own = document.getElementById('themeBtn');
      if (own) own.click(); else document.documentElement.dataset.theme = next;
    }
    document.cookie = 'theme=' + next + ';path=/;max-age=31536000;SameSite=Lax';
    paint();
  }
  themeBtn.addEventListener('click', flip);
  dropTheme.addEventListener('click', function (e) { e.stopPropagation(); flip(); });
  if (isShortage) new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function setOpen(o) { drop.hidden = !o; menuBtn.setAttribute('aria-expanded', String(o)); }
  menuBtn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(drop.hidden); });
  document.addEventListener('click', function (e) { if (!drop.hidden && !drop.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
})();
