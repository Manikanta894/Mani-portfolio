"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  hue: number;
  hueShift: number;
}

export function AmbientParticles({ count = 80, colors = false }: { count?: number; colors?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = count;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2 - 0.08,
      life: 0,
      maxLife: 800 + Math.random() * 600,
      size: 1 + Math.random() * 2.5,
      opacity: 0.2 + Math.random() * 0.4,
      hue: colors ? 20 + Math.random() * 20 : 0,
      hueShift: colors ? (Math.random() - 0.5) * 0.2 : 0,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    const mouse = { x: -9999, y: -9999 };
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    if (colors) window.addEventListener("mousemove", onMouse);

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02;
          p.vx -= dx * force;
          p.vy -= dy * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (colors) p.hue += p.hueShift;

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(p.life / 100, 1);
        const fadeOut = lifeRatio > 0.75 ? 1 - (lifeRatio - 0.75) / 0.25 : 1;
        const currentOpacity = p.opacity * fadeIn * fadeOut;

        const color = colors
          ? `hsla(${p.hue}, 70%, 60%, ${currentOpacity})`
          : `rgba(212, 106, 46, ${currentOpacity * 0.5})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = colors
            ? `hsla(${p.hue}, 70%, 60%, ${currentOpacity * 0.12})`
            : `rgba(212, 106, 46, ${currentOpacity * 0.1})`;
          ctx.fill();
        }

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
          particles[i].life = 0;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (colors) window.removeEventListener("mousemove", onMouse);
    };
  }, [count, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
    />
  );
}
