'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const message = form.message?.value?.trim() || '';

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setMsg('Something went wrong. Try again.');
      }
    } catch {
      // Fallback to mailto if API is not yet wired
      const subject = encodeURIComponent('Newsletter signup from ' + email);
      const body = encodeURIComponent('From: ' + email + '\n\n' + (message || 'Please add me to the list.'));
      window.location.href = 'mailto:john@secretsoftheuniversity.com?subject=' + subject + '&body=' + body;
      setSubmitted(true);
      form.reset();
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-col-title">Departments</div>
            <Link href="/finance">Finance</Link>
            <Link href="/health">Health</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/systems">Systems</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <Link href="/careers#lab">Resume Lab</Link>
            <Link href="/finance#feed">The Wire</Link>
            <Link href="/#join">Enroll</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Connect</div>
            {/* TODO: Replace with real social links */}
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">YouTube</a>
          </div>
          <div className="footer-col footer-subscribe">
            <div className="footer-col-title">Stay Informed</div>
            <p>One secret a week. No noise.</p>
            {submitted ? (
              <div className="sub-msg" style={{ display: 'block' }}>
                You are in. Watch your inbox. ✦
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="your@email.com" required />
                <textarea name="message" placeholder="Message (optional)" rows="2" />
                <button type="submit">Knock</button>
              </form>
            )}
            {msg && <div className="sub-msg" style={{ display: 'block', color: '#e74c3c' }}>{msg}</div>}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-legal">
            © 2026 Secrets of the University · <a href="#">Privacy</a> · <a href="#">Terms</a>
          </div>
          <div className="footer-socials">
            {/* TODO: Replace with real social links */}
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
