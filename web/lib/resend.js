import { Resend } from 'resend';

let resendClient;

export function getResend() {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Resend API key not configured. Email features will not work.');
    return null;
  }
  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendWelcomeEmail(to) {
  const resend = getResend();
  if (!resend) return null;

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  return resend.emails.send({
    from: `The Registrar <${fromAddress}>`,
    to,
    subject: 'The door is opened.',
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#e8e6f5;background:#070713;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-family:Helvetica,sans-serif;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#f0c96c;">
            SECRETS OF THE UNIVERSITY
          </span>
        </div>
        <p style="font-size:18px;line-height:1.7;font-style:italic;text-align:center;margin-bottom:24px;">
          "Knock, and the door will be opened to you."
        </p>
        <p style="font-size:15px;line-height:1.7;color:#9b97b8;text-align:center;margin-bottom:32px;">
          You have been enrolled. The first lesson awaits.
        </p>
        <div style="text-align:center;margin-bottom:40px;">
          <a href="https://secretsoftheuniversity.com" style="background:#f0c96c;color:#1a1305;padding:14px 28px;border-radius:100px;text-decoration:none;font-family:Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
            Enter
          </a>
        </div>
        <div style="text-align:center;color:#8b7cf7;font-size:18px;letter-spacing:0.6em;">✦ ✦ ✦</div>
        <p style="font-family:Helvetica,sans-serif;font-size:11px;color:rgba(155,151,184,0.5);text-align:center;margin-top:32px;">
          Secrets of the University · The curriculum school skipped.
        </p>
      </div>
    `,
  });
}
