"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Cinematic 5–6s hero opening.
 *
 * Timeline (ms):
 *   0–1000   ambient — near-black, sparse drifting dust
 *   1000–2000 burst  — energy pulse + explosion, then magnetic return
 *   2000–3000 MR     — particles assemble into giant "MR" (60–70vh)
 *   3000–4000 morph  — MR spreads/morphs into "Manikanta R"
 *   4000+    settled — hero chrome fades in, large MR remains as faint mark
 *
 * - One run per session (sessionStorage), skip on scroll/click/key.
 * - prefers-reduced-motion → jump straight to settled.
 * - DPR-aware canvas2d, single RAF, GPU-friendly transforms only.
 */

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;
  r: number;
  hue: number;
  sat: number;
  light: number;
  kind: 0 | 1; // 0 = body (text), 1 = dust (orbit)
  phase: number;
};

type Stage = "ambient" | "pulse" | "burst" | "mr" | "morph" | "settled";

const SESSION_KEY = "mr-hero-played";

export function NameReveal({
  className = "",
  onSettled,
}: { className?: string; onSettled?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let stage: Stage = "ambient";
    let stageStart = 0;
    let started = 0;
    let mouse = { x: 0, y: 0, active: false, tilt: { x: 0, y: 0 } };
    let pulseR = 0;
    let pulseA = 0;
    let skipped = false;

    const settle = () => {
      if (stage !== "settled") {
        stage = "settled";
        stageStart = performance.now();
        sessionStorage.setItem(SESSION_KEY, "1");
        setSettled(true);
        onSettled?.();
      }
    };

    const sampleText = (text: string, fontPx: number, weight = 800): { x: number; y: number }[] => {
      const off = document.createElement("canvas");
      const oc = off.getContext("2d");
      if (!oc) return [];
      const font = `${weight} ${fontPx}px "Fraunces Variable", Fraunces, ui-serif, Georgia, serif`;
      oc.font = font;
      const m = oc.measureText(text);
      const w = Math.ceil(m.width) + 40;
      const h = Math.ceil(fontPx * 1.3);
      off.width = w; off.height = h;
      oc.font = font;
      oc.fillStyle = "#fff";
      oc.textBaseline = "middle";
      oc.fillText(text, 20, h / 2);
      const img = oc.getImageData(0, 0, w, h).data;
      const pts: { x: number; y: number }[] = [];
      const step = Math.max(3, Math.floor(fontPx / 34));
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (img[(y * w + x) * 4 + 3] > 128) pts.push({ x: x - w / 2, y: y - h / 2 });
        }
      }
      return pts;
    };

    const fit = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const seed = (n: number) => {
      particles = [];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * Math.min(W, H) * 0.55;
        const isDust = i % 6 === 0;
        particles.push({
          x: W / 2 + Math.cos(a) * r,
          y: H / 2 + Math.sin(a) * r,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          tx: W / 2, ty: H / 2,
          r: 0.5 + Math.random() * 1.3,
          hue: 24 + Math.random() * 14,
          sat: 70 + Math.random() * 25,
          light: 60 + Math.random() * 18,
          kind: isDust ? 1 : 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const assignTargets = (text: string, fontPx: number) => {
      const pts = sampleText(text, fontPx);
      if (!pts.length) return;
      const body = particles.filter(p => p.kind === 0);
      const dust = particles.filter(p => p.kind === 1);
      for (let i = 0; i < body.length; i++) {
        const p = pts[i % pts.length];
        body[i].tx = W / 2 + p.x;
        body[i].ty = H / 2 + p.y;
        // M = brushed metal (cool blue-grey), R = glass (warm vermilion)
        const isR = p.x > 0;
        if (text === "MR") {
          if (isR) { body[i].hue = 18; body[i].sat = 85; body[i].light = 65; }
          else     { body[i].hue = 210; body[i].sat = 12; body[i].light = 80; }
        } else {
          body[i].hue = 28; body[i].sat = 30; body[i].light = 88;
        }
      }
      for (let i = 0; i < dust.length; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.min(W, H) * (0.32 + Math.random() * 0.22);
        dust[i].tx = W / 2 + Math.cos(a) * r;
        dust[i].ty = H / 2 + Math.sin(a) * r * 0.5;
      }
    };

    const explode = () => {
      for (const p of particles) {
        const a = Math.atan2(p.y - H / 2, p.x - W / 2) + (Math.random() - 0.5) * 0.6;
        const s = 14 + Math.random() * 26;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
      }
      pulseR = 0; pulseA = 1;
    };

    const enter = (s: Stage) => {
      stage = s; stageStart = performance.now();
      if (s === "pulse") { /* nothing yet */ }
      if (s === "burst") explode();
      if (s === "mr") assignTargets("MR", Math.min(W * 0.42, H * 0.7, 520));
      if (s === "morph") assignTargets("Manikanta R", Math.min(W * 0.13, 170));
      if (s === "settled") settle();
    };

    const tick = (now: number) => {
      const t = now - started;
      const sT = now - stageStart;

      if (!reduced && !skipped) {
        if (stage === "ambient" && t > 1000) enter("pulse");
        else if (stage === "pulse"   && sT > 250)  enter("burst");
        else if (stage === "burst"   && sT > 700)  enter("mr");
        else if (stage === "mr"      && sT > 1100) enter("morph");
        else if (stage === "morph"   && sT > 1050) enter("settled");
      }

      // background — trail
      ctx.fillStyle = stage === "settled" ? "rgba(8,7,10,0.20)" : "rgba(6,5,8,0.32)";
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;

      // pulse ring
      if (stage === "pulse" || stage === "burst") {
        pulseR += stage === "pulse" ? 4 : 22;
        pulseA *= 0.965;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(cx, cy, Math.max(0, pulseR - 60), cx, cy, pulseR + 60);
        grad.addColorStop(0, `hsla(28, 90%, 65%, 0)`);
        grad.addColorStop(0.5, `hsla(18, 95%, 60%, ${0.35 * pulseA})`);
        grad.addColorStop(1, `hsla(18, 95%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, pulseR + 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // tilt easing
      mouse.tilt.x += ((mouse.active ? (mouse.x - cx) / W : 0) - mouse.tilt.x) * 0.08;
      mouse.tilt.y += ((mouse.active ? (mouse.y - cy) / H : 0) - mouse.tilt.y) * 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (stage === "ambient") {
          p.phase += 0.005;
          p.vx += (Math.cos(p.phase) * 0.015 - p.vx) * 0.02;
          p.vy += (Math.sin(p.phase) * 0.015 - p.vy) * 0.02;
        } else if (stage === "pulse") {
          // suck slightly inward
          const dx = cx - p.x, dy = cy - p.y;
          p.vx += dx * 0.0012; p.vy += dy * 0.0012;
          p.vx *= 0.9; p.vy *= 0.9;
        } else if (stage === "burst") {
          p.vx *= 0.93; p.vy *= 0.93;
        } else if (stage === "mr" || stage === "morph") {
          const dx = p.tx - p.x, dy = p.ty - p.y;
          p.vx += dx * 0.055; p.vy += dy * 0.055;
          p.vx *= 0.74; p.vy *= 0.74;
        } else { // settled
          const dx = p.tx - p.x, dy = p.ty - p.y;
          p.vx += dx * 0.04; p.vy += dy * 0.04;
          p.vx *= 0.82; p.vy *= 0.82;
          if (p.kind === 1) {
            const ang = Math.atan2(p.ty - cy, p.tx - cx) + 0.0012;
            const rr = Math.hypot(p.tx - cx, p.ty - cy);
            p.tx = cx + Math.cos(ang) * rr;
            p.ty = cy + Math.sin(ang) * rr;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // tilt parallax during/after MR
        let dx = 0, dy = 0;
        if (stage === "mr" || stage === "morph" || stage === "settled") {
          const depth = p.kind === 1 ? 14 : 24;
          dx = -mouse.tilt.x * depth;
          dy = -mouse.tilt.y * depth;
        }

        const alpha = stage === "ambient" ? 0.5 : (stage === "settled" ? 0.85 : 0.95);
        const size = p.r * (stage === "mr" ? 1.7 : stage === "morph" ? 1.4 : stage === "settled" ? 1 : 1.3);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha})`;
        ctx.shadowBlur = stage === "mr" ? 14 : 9;
        ctx.shadowColor = `hsla(${p.hue}, ${p.sat}%, 60%, 0.6)`;
        ctx.arc(p.x + dx, p.y + dy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    const onResize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      fit();
      if (stage === "mr") assignTargets("MR", Math.min(W * 0.42, H * 0.7, 520));
      if (stage === "morph" || stage === "settled") assignTargets("Manikanta R", Math.min(W * 0.13, 170));
    };
    const skip = () => {
      if (skipped || stage === "settled") return;
      skipped = true;
      enter("morph");
      setTimeout(() => enter("settled"), 350);
    };
    const onScroll = () => { if (window.scrollY > 40) skip(); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
    };

    fit();
    seed(reduced ? 700 : 1700);

    if (reduced || alreadyPlayed) {
      assignTargets("Manikanta R", Math.min(W * 0.13, 170));
      // snap particles to targets
      for (const p of particles) { p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; }
      stage = "settled";
      started = performance.now();
      stageStart = started;
      sessionStorage.setItem(SESSION_KEY, "1");
      setSettled(true);
      onSettled?.();
    } else {
      started = performance.now();
      stageStart = started;
    }

    raf = requestAnimationFrame(tick);
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    wrap.addEventListener("click", skip);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      wrap.removeEventListener("click", skip);
    };
  }, [onSettled]);

  return (
    <div
      ref={wrapRef}
      className={`relative h-[72vh] min-h-[520px] w-full overflow-hidden rounded-sm ${className}`}
      aria-label="Manikanta R"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_38%,_rgba(0,0,0,0.65)_100%)]" />
      <h1 className="sr-only">Manikanta R</h1>

      {/* Skip hint, only while playing */}
      {!settled && (
        <div className="pointer-events-none absolute bottom-4 right-5 text-mono text-eyebrow text-bone/40">
          scroll or press esc to skip
        </div>
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-8 text-center transition-opacity duration-1000 ${
          settled ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="mx-auto max-w-2xl text-balance px-6 text-[0.9rem] leading-snug text-bone/80 md:text-base">
          Building the Future of Work — Through AI, Analytics &amp; Human Insight
        </p>
        <div className="mt-3 text-mono text-eyebrow text-bone/45">● live · Bengaluru</div>
      </div>
    </div>
  );
}
