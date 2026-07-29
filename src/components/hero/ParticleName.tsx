"use client";
import { useEffect, useRef } from "react";

const SESSION_KEY = "mr-hero-played";
const PARTICLE_COUNT = 400;
const DURATION = 3200;

type Particle = {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  r: number;
  alpha: number;
};

function sampleText(ctx: CanvasRenderingContext2D, text: string, fontSize: number, w: number, h: number): { x: number; y: number }[] {
  ctx.save();
  ctx.font = `${fontSize}px "Instrument Serif", Georgia, serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, w, h);
  const points: { x: number; y: number }[] = [];
  const step = 3;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const alpha = imageData.data[(y * w + x) * 4 + 3];
      if (alpha > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function scrambleParticle(p: Particle, w: number, h: number) {
  p.tx = Math.random() * w;
  p.ty = Math.random() * h;
}

export function ParticleName({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const settled = useRef(false);
  const skipped = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const fontSize = Math.min(W * 0.1, 110);
    let poff = 0; // particle offset index
    const particles: Particle[] = [];
    let textPoints: { x: number; y: number }[] = [];

    function buildTargets() {
      ctx.clearRect(0, 0, W, H);
      textPoints = sampleText(ctx, "MANIKANTA R", fontSize, W, H);

      // Pad targets so we don't run out
      while (textPoints.length < PARTICLE_COUNT) {
        textPoints.push(textPoints[Math.floor(Math.random() * textPoints.length)] || { x: W / 2, y: H / 2 });
      }

      // Shuffle
      for (let i = textPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [textPoints[i], textPoints[j]] = [textPoints[j], textPoints[i]];
      }

      // Assign targets to particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const tp = textPoints[i];
        if (i < particles.length) {
          particles[i].tx = tp.x;
          particles[i].ty = tp.y;
        }
      }
    }

    // Seed particles in random positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        tx: 0, ty: 0,
        vx: 0, vy: 0,
        r: 0.8 + Math.random() * 1.6,
        alpha: 0.55 + Math.random() * 0.45,
      });
    }

    buildTargets();

    // Redraw targets on resize
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTargets();
    };
    window.addEventListener("resize", onResize);

    if (reduced || alreadyPlayed) {
      sessionStorage.setItem(SESSION_KEY, "1");
      settled.current = true;
      onDone();
      return () => window.removeEventListener("resize", onResize);
    }

    const startTime = performance.now();
    let raf = 0;

    function tick() {
      const elapsed = performance.now() - startTime;
      const t = elapsed / DURATION;

      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        if (t < 0.7) {
          // Drift phase — gentle wandering
          p.x += (p.tx - p.x) * 0.008 + (Math.sin(elapsed * 0.001 + p.alpha * 10) * 0.3);
          p.y += (p.ty - p.y) * 0.008 + (Math.cos(elapsed * 0.001 + p.alpha * 10) * 0.3);
          const a = p.alpha * 0.35;
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        } else if (t < 0.85) {
          // Assemble phase — strong attraction
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.x += dx * 0.12;
          p.y += dy * 0.12;
          const dist = Math.hypot(dx, dy);
          const settle = Math.max(0, 1 - dist / 50);
          const a = 0.3 + settle * 0.7;
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        } else if (t < 0.95) {
          // Hold
          p.x += (p.tx - p.x) * 0.06;
          p.y += (p.ty - p.y) * 0.06;
          ctx.fillStyle = `rgba(255,255,255,0.88)`;
        } else if (t >= 0.95) {
          // Dissolve
          const fade = 1 - ((t - 0.95) / 0.05);
          p.x += (Math.random() - 0.5) * 3;
          p.y += (Math.random() - 0.5) * 3;
          ctx.fillStyle = `rgba(255,255,255,${(fade * 0.88).toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t >= 1) {
        if (!skipped.current) {
          skipped.current = true;
          sessionStorage.setItem(SESSION_KEY, "1");
          settled.current = true;
          setTimeout(onDone, 300);
        }
        return;
      }

      raf = requestAnimationFrame(tick);
    }

    // Skip handlers
    const skip = () => {
      if (skipped.current) return;
      skipped.current = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      settled.current = true;
      cancelAnimationFrame(raf);
      onDone();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") skip();
    };
    const onScroll = () => { if (window.scrollY > 30) skip(); };

    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("click", skip);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("click", skip);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0c]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute bottom-4 right-5 text-[10px] tracking-[0.3em] uppercase text-white/20">
        press esc to skip
      </div>
    </div>
  );
}
