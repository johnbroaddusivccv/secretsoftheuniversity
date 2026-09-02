'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Starfield from '@/components/Starfield';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSupabase } from '@/lib/supabase';

const DEPARTMENTS = [
  { name: 'Finance', href: '/finance', lessons: 6 },
  { name: 'Health', href: '/health', lessons: 6 },
  { name: 'Careers', href: '/careers', lessons: 6 },
  { name: 'Systems', href: '/systems', lessons: 6 },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  }

  if (loading) {
    return (
      <>
        <Starfield />
        <Nav />
        <div className="dashboard">
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '80px 0' }}>Loading…</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Starfield />
      <Nav />
      <div className="dashboard">
        <h1>Welcome back.</h1>
        <p className="dashboard-sub">
          {user?.email || 'Scholar'} — enrolled.
          <button
            onClick={handleSignOut}
            style={{
              background: 'none', border: 'none', color: 'var(--violet)',
              fontFamily: 'Helvetica,Arial,sans-serif', fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              marginLeft: '12px',
            }}
          >
            Sign out
          </button>
        </p>

        <div className="dashboard-grid">
          {/* Departments */}
          {DEPARTMENTS.map((d) => (
            <Link href={d.href} key={d.name} style={{ textDecoration: 'none' }}>
              <div className="dash-card">
                <div className="dash-card-label">{d.name}</div>
                <div className="dash-stat">{d.lessons}</div>
                <p>lessons available</p>
              </div>
            </Link>
          ))}

          {/* Progress */}
          <div className="dash-card">
            <div className="dash-card-label">Progress</div>
            <div className="dash-stat">0 / 24</div>
            <p>lessons completed</p>
          </div>

          {/* Community */}
          <div className="dash-card">
            <div className="dash-card-label">Community</div>
            <h3>Discussion threads</h3>
            <p>Join conversations under each lesson.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
