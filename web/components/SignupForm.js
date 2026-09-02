'use client';

import { useState } from 'react';

export default function SignupForm({ id = 'join' }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
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
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      // Fallback to mailto if API is not yet wired
      const subject = encodeURIComponent('Inquiry from ' + email);
      const body = encodeURIComponent('From: ' + email + '\n\n' + (message || 'I would like to learn more.'));
      window.location.href = 'mailto:john@secretsoftheuniversity.com?subject=' + subject + '&body=' + body;
      setSubmitted(true);
      form.reset();
    }
  }

  return (
    <>
      <form className="signup" id={id} onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="your@email.com" required />
        <textarea name="message" placeholder="Your message" rows="3" />
        <button type="submit">Knock</button>
      </form>
      <div className="signup-note">No cost. No noise. Ask, and the first lesson is given.</div>
      {submitted && (
        <div id="signup-msg" style={{ display: 'block' }}>
          Knock, and it is opened. Watch your inbox. ✦
        </div>
      )}
      {error && (
        <div id="signup-msg" style={{ display: 'block', color: '#e74c3c' }}>
          {error}
        </div>
      )}
    </>
  );
}
