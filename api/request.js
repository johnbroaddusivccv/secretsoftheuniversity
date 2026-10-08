// Vercel serverless function: emails Shortage Watch requests to the Gmail inbox.
// No npm dependencies — speaks SMTP to Gmail over TLS directly.
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   GMAIL_USER          john@secretsoftheuniversity.com
//   GMAIL_APP_PASSWORD  a 16-character Google app password (not your normal password)
// Optional:
//   REQUEST_TO          where requests go (defaults to GMAIL_USER)
const tls = require('tls');

const clean = (v, max) => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim().slice(0, max);
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const wrap = (s) => s.replace(/.{1,76}/g, '$&\r\n');

function sendMail({ user, pass, to, replyTo, subject, text }) {
  return new Promise((resolve, reject) => {
    const sock = tls.connect({ host: 'smtp.gmail.com', port: 465, servername: 'smtp.gmail.com' });
    sock.setEncoding('utf8');
    sock.setTimeout(15000, () => { sock.destroy(); reject(new Error('SMTP timeout')); });
    let buf = '';
    const waiters = [];
    sock.on('data', (d) => {
      buf += d;
      let m;
      while ((m = buf.match(/^\d{3} [^\r\n]*\r\n/m))) {
        const end = buf.indexOf(m[0]) + m[0].length;
        const chunk = buf.slice(0, end);
        buf = buf.slice(end);
        const w = waiters.shift();
        if (w) w(chunk);
      }
    });
    sock.on('error', reject);
    const read = () => new Promise((r) => waiters.push(r));
    const step = async (line, ok) => {
      if (line !== null) sock.write(line + '\r\n');
      const resp = await read();
      const code = resp.trim().split('\n').pop().slice(0, 3);
      if (!ok.includes(code)) throw new Error('SMTP ' + code);
      return resp;
    };
    (async () => {
      await step(null, ['220']);
      await step('EHLO secretsoftheuniversity.com', ['250']);
      await step('AUTH LOGIN', ['334']);
      await step(b64(user), ['334']);
      await step(b64(pass), ['235']);
      await step(`MAIL FROM:<${user}>`, ['250']);
      await step(`RCPT TO:<${to}>`, ['250', '251']);
      await step('DATA', ['354']);
      const msg = [
        `From: Shortage Watch <${user}>`,
        `To: <${to}>`,
        replyTo ? `Reply-To: <${replyTo}>` : '',
        `Subject: =?UTF-8?B?${b64(subject)}?=`,
        `Date: ${new Date().toUTCString()}`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        wrap(b64(text)),
      ].filter((l, i) => l !== '' || i > 3).join('\r\n');
      await step(msg + '\r\n.', ['250']);
      await step('QUIT', ['221']).catch(() => {});
      sock.end();
      resolve();
    })().catch((e) => { sock.destroy(); reject(e); });
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'POST only' }); return; }
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) { res.status(503).json({ ok: false, error: 'Email is not configured yet' }); return; }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (b.website) { res.status(200).json({ ok: true }); return; } // honeypot: bots fill hidden field
  const name = clean(b.name, 120), email = clean(b.email, 200);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({ ok: false, error: 'Name and a valid email are required' }); return; }
  const intent = clean(b.intent, 80) || 'Request';
  const text = [
    `New ${intent} from the Shortage Watch site`,
    '',
    `Name: ${name}`,
    `Organization: ${clean(b.org, 200)}`,
    `Email: ${email}`,
    `Role: ${clean(b.role, 80)}`,
    `Request type: ${intent}`,
    '',
    String(b.message || '').slice(0, 4000),
  ].join('\n');
  try {
    await sendMail({ user, pass, to: process.env.REQUEST_TO || user, replyTo: email, subject: `${intent}: ${name}${b.org ? ' (' + clean(b.org, 80) + ')' : ''}`, text });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ ok: false, error: 'Could not send' });
  }
};
