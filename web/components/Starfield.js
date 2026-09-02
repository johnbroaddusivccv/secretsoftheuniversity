'use client';

import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let stars = [];
    let animId;

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      stars = Array.from({ length: Math.min(180, window.innerWidth / 6) }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * 1.4 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.005,
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    const SOLAR = [
      [240, 201, 108],
      [232, 163, 48],
      [245, 208, 160],
      [255, 180, 100],
    ];

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      const isLight = document.documentElement.classList.contains('light');
      for (const st of stars) {
        st.p += st.s;
        const a = 0.25 + Math.abs(Math.sin(st.p)) * 0.6;
        if (isLight) {
          // Solar flare mode — warm glowing orbs
          const col = SOLAR[Math.floor((st.x + st.y) * 7) % SOLAR.length];
          const sz = st.r * 3.5 + 1.5;
          const glow = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, sz * 3);
          glow.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${a * 0.55})`);
          glow.addColorStop(0.35, `rgba(${col[0]},${col[1]},${col[2]},${a * 0.18})`);
          glow.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
          ctx.beginPath();
          ctx.arc(st.x, st.y, sz * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(st.x, st.y, sz * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,248,230,${a * 0.7})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,230,245,${a})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="stars" ref={canvasRef} />;
}
