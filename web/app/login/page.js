'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSupabase } from '@/lib/supabase';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError('Auth service not configured. Set Supabase environment variables.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'magic') {
        const { error: err } = await supabase.auth.signInWithOtp({ email });
        if (err) throw err;
        setMsg('A link has been sent. Check your inbox.');
      } else if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setMsg('Account created. Check your email to confirm.');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }

    setLoading(false);
  }

  return (
    <>
      <Starfield />
      <Nav />
      <div className="auth-container">
        <div className="auth-card">
          <h1>
            {mode === 'signup' ? 'Enroll' : mode === 'magic' ? 'Magic Link' : 'Enter'}
          </h1>
          <p className="auth-sub">
            {mode === 'signup'
              ? 'Create your account.'
              : mode === 'magic'
                ? 'We will send a link to your email.'
                : 'The door opens from the inside.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {mode !== 'magic' && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Working…' : mode === 'signup' ? 'Enroll' : mode === 'magic' ? 'Send Link' : 'Enter'}
            </button>
          </form>

          {msg && <div className="auth-msg" style={{ display: 'block' }}>{msg}</div>}
          {error && <div className="auth-error" style={{ display: 'block' }}>{error}</div>}

          <div className="auth-divider">— or —</div>

          {mode === 'login' && (
            <>
              <div className="auth-link">
                New here? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); setMsg(''); setError(''); }}>Enroll</a>
              </div>
              <div className="auth-link">
                <a href="#" onClick={(e) => { e.preventDefault(); setMode('magic'); setMsg(''); setError(''); }}>Use magic link</a>
              </div>
            </>
          )}
          {mode === 'signup' && (
            <div className="auth-link">
              Already enrolled? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setMsg(''); setError(''); }}>Enter</a>
            </div>
          )}
          {mode === 'magic' && (
            <div className="auth-link">
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setMsg(''); setError(''); }}>Use password instead</a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
