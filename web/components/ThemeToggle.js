'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = 'theme-toggle' }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Read theme from cookie on mount
    if (document.cookie.includes('theme=light')) {
      document.documentElement.classList.add('light');
      setIsLight(true);
    }
  }, []);

  function toggle() {
    const nowLight = document.documentElement.classList.toggle('light');
    setIsLight(nowLight);
    document.cookie = 'theme=' + (nowLight ? 'light' : 'dark') + ';path=/;SameSite=Lax';
  }

  return (
    <button className={className} onClick={toggle} aria-label="Toggle light mode">
      {isLight ? '☀' : '☾'}
    </button>
  );
}
