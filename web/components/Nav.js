'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/finance', label: 'Finance' },
    { href: '/health', label: 'Health' },
    { href: '/careers', label: 'Careers' },
    { href: '/systems', label: 'Systems' },
  ];

  return (
    <>
      <div className="nav-full">
        <div className="nav-inner">
          <Link href="/" className="brand">
            Secrets <span>of the</span> University
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? 'active' : ''}
              >
                {l.label}
              </Link>
            ))}
            <Link className="cta-small" href="/login">
              Enter
            </Link>
            <ThemeToggle />
            <button
              className="hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`} id="mobile-nav">
        <button
          className="mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/login" onClick={() => setMobileOpen(false)}>Enter</Link>
        <ThemeToggle className="mobile-theme" />
      </div>
    </>
  );
}
