"use client";
import { useEffect, useRef, useState } from "react";

/**
 * BrandReveal — Controlled energy fragmentation.
 *
 * A premium "MR" holds for a beat, shatters into thousands of fragments
 * (glass / metal / ink), the fragments travel with motion trails, then
 * re-assemble into the full name "Manikanta R" while a peripheral spray
 * dusts the hero chrome positions (top corners, edges). No orange glow —
 * deep charcoal stage, silver-white particles, faint cool-blue tint.
 *
 * 60fps. Skippable. Plays once per session.
 */

const SIGNATURE = "Curiosity, annotated as research.";
const SESSION_KEY = "brand-reveal-v5-done";

type Props = { onDone: () => void };

export function BrandReveal({ onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [out, setOut] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const tagShownRef = useRef(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
    setOut(true);
    setTimeout(() => onDoneRef.current(), 700);
  };

  // Session-once + reduced motion bypass
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        onDoneRef.current();
        return;
      }
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skip on click / key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const sampleText = (
      text: string,
      fontPx: number,
      weight: number,
      step: number
    ) => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d");
      if (!o) return [] as { x: number; y: number }[];
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.font = `italic ${weight} ${fontPx}px "Fraunces Variable", "Instrument Serif", Georgia, serif`;
      o.fillText(text, W / 2, H / 2);
      const img = o.getImageData(0, 0, W, H).data;
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (img[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
        }
      }
      return pts;
    };

    const mrSize = Math.min(W * 0.34, H * 0.58);
    const nameSize = Math.min(W * 0.105, 150);

    const mrPts = sampleText("MR", mrSize, 900, 3);
    let namePts = sampleText("Manikanta R", nameSize, 700, 3);

    // Ensure we have enough source points
    if (mrPts.length === 0) {
      // text rendering failed (font missing) — fall through to finish
      finish();
      return;
    }
    if (namePts.length === 0) namePts = mrPts.slice();

    type P = {
      x: number; y: number;
      px: number; py: number;
      vx: number; vy: number;
      tx: number; ty: number;
      hue: number; sat: number; light: number; alpha: number; targetAlpha: number;
      size: number;
      jitter: number;
    };

    const N = mrPts.length;
    const particles: P[] = new Array(N);
    for (let i = 0; i < N; i++) {
      const src = mrPts[i];
      const periphery = Math.random() < 0.10;
      let tx: number, ty: number, targetAlpha: number;
      if (periphery) {
        // dust the chrome positions — corners, edges
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { tx = Math.random() * W * 0.22; ty = Math.random() * H * 0.18; }
        else if (side === 1) { tx = W - Math.random() * W * 0.22; ty = Math.random() * H * 0.18; }
        else if (side === 2) { tx = Math.random() * W; ty = H - Math.random() * H * 0.12; }
        else { tx = (Math.random() * 0.4 + 0.3) * W; ty = H * (0.78 + Math.random() * 0.05); }
        targetAlpha = 0.12 + Math.random() * 0.18;
      } else {
        const tgt = namePts[i % namePts.length];
        tx = tgt.x; ty = tgt.y;
        targetAlpha = 0.85 + Math.random() * 0.15;
      }
      // palette: silver-white with rare cool-blue tint
      const r = Math.random();
      const hue = r < 0.7 ? 220 : r < 0.92 ? 210 : 200;
      const sat = r < 0.7 ? 6 : r < 0.92 ? 14 : 22;
      const light = 80 + Math.random() * 16;
      particles[i] = {
        x: src.x, y: src.y, px: src.x, py: src.y,
        vx: 0, vy: 0,
        tx, ty,
        hue, sat, light,
        alpha: 0, targetAlpha,
        size: 0.7 + Math.random() * 1.3,
        jitter: Math.random() * Math.PI * 2,
      };
    }

    // Timeline (ms)
    const T_FORM   = 320;   // particles converge to crisp MR
    const T_HOLD   = 720;   // hold the MR logo
    const T_BURST  = 1050;  // shatter impulse
    const T_DRIFT  = 2400;  // fragments travel with trails
    const T_ASMBL  = 3800;  // strong steering to targets
    const T_SETTLE = 4500;  // snap exact
    const T_END    = 4900;

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);

      // background radial — deep charcoal
      const bg = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.75);
      bg.addColorStop(0, "#161a22");
      bg.addColorStop(0.55, "#0b0d12");
      bg.addColorStop(1, "#05060a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // subtle cool wash, rises during burst+drift then settles
      const washA =
        t < T_HOLD ? 0.05
        : t < T_DRIFT ? 0.12
        : 0.06;
      ctx.fillStyle = `rgba(120,150,190,${washA})`;
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.45, Math.max(W, H) * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < N; i++) {
        const p = particles[i];

        if (t < T_FORM) {
          // converge from a tiny scatter into the MR shape
          const k = 1 - t / T_FORM;
          const sx = p.tx === p.x ? p.x : p.x; // unused, but keep cheap
          p.px = p.x; p.py = p.y;
          // wobble around src
          const wob = k * 8;
          p.x = mrPts[i].x + Math.cos(p.jitter + t * 0.005) * wob;
          p.y = mrPts[i].y + Math.sin(p.jitter + t * 0.005) * wob;
          p.alpha = Math.min(1, t / T_FORM);
          void sx;
        } else if (t < T_HOLD) {
          // hold MR crisp with micro shimmer
          p.px = p.x; p.py = p.y;
          p.x = mrPts[i].x + Math.cos(p.jitter + t * 0.004) * 0.4;
          p.y = mrPts[i].y + Math.sin(p.jitter + t * 0.004) * 0.4;
          p.alpha = 1;
        } else if (t < T_BURST) {
          // impulse — assign outward velocity once
          if (p.vx === 0 && p.vy === 0) {
            const dx = p.x - W / 2;
            const dy = p.y - H * 0.45;
            const d = Math.hypot(dx, dy) || 1;
            const speed = 3 + Math.random() * 6;
            p.vx = (dx / d) * speed + (Math.random() - 0.5) * 3.5;
            p.vy = (dy / d) * speed + (Math.random() - 0.5) * 3.5 - Math.random() * 1.6;
          }
          p.px = p.x; p.py = p.y;
          p.x += p.vx; p.y += p.vy;
          p.vy += 0.03;
          p.vx *= 0.985; p.vy *= 0.985;
        } else if (t < T_DRIFT) {
          // drift — soft steering begins
          p.px = p.x; p.py = p.y;
          const k = (t - T_BURST) / (T_DRIFT - T_BURST);
          const pull = 0.0006 + k * 0.004;
          p.vx += (p.tx - p.x) * pull;
          p.vy += (p.ty - p.y) * pull;
          p.vx *= 0.965; p.vy *= 0.965;
          p.x += p.vx; p.y += p.vy;
          p.alpha += (p.targetAlpha - p.alpha) * 0.04;
        } else if (t < T_ASMBL) {
          p.px = p.x; p.py = p.y;
          p.vx += (p.tx - p.x) * 0.06;
          p.vy += (p.ty - p.y) * 0.06;
          p.vx *= 0.78; p.vy *= 0.78;
          p.x += p.vx; p.y += p.vy;
          p.alpha += (p.targetAlpha - p.alpha) * 0.08;
        } else if (t < T_SETTLE) {
          p.px = p.x; p.py = p.y;
          p.x += (p.tx - p.x) * 0.32;
          p.y += (p.ty - p.y) * 0.32;
        } else {
          p.px = p.x; p.py = p.y;
          p.x = p.tx; p.y = p.ty;
        }

        // motion trail
        if (t > T_HOLD && t < T_SETTLE) {
          const sp = Math.hypot(p.x - p.px, p.y - p.py);
          if (sp > 0.6) {
            ctx.strokeStyle = `hsla(${p.hue},${p.sat}%,${p.light}%,${0.16 * p.alpha})`;
            ctx.lineWidth = p.size * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.light}%,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t > T_ASMBL - 200 && !tagShownRef.current) {
        tagShownRef.current = true;
        setShowTag(true);
      }

      if (t >= T_END) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => finish();

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-[200]"
      style={{
        opacity: out ? 0 : 1,
        transition: "opacity .7s cubic-bezier(.4,0,.2,1)",
        pointerEvents: out ? "none" : "auto",
        cursor: "pointer",
        background: "#06080c",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* chapter marks */}
      <div
        className="absolute left-6 top-6 md:left-12 md:top-8"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.6rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(220,225,232,0.55)",
        }}
      >
        <span style={{ color: "#8fa4be" }}>●</span> Ch · 00 — Cover
      </div>
      <div
        className="absolute right-6 top-6 md:right-12 md:top-8 text-right"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.6rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(220,225,232,0.4)",
        }}
      >
        v · 10
      </div>

      {/* signature + skip hint */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center"
        style={{
          bottom: "12vh",
          opacity: showTag ? 1 : 0,
          transform: `translate(-50%, ${showTag ? "0" : "10px"})`,
          transition:
            "opacity 1s ease-out, transform 1s cubic-bezier(.2,1,.3,1)",
        }}
      >
        <div
          style={{
            fontFamily: '"Fraunces Variable", "Instrument Serif", serif',
            fontStyle: "italic",
            fontVariationSettings: `"opsz" 144, "wght" 300, "SOFT" 100`,
            fontSize: "clamp(1rem, 1.5vw, 1.4rem)",
            color: "rgba(232,236,242,0.88)",
            letterSpacing: "-0.005em",
          }}
        >
          {SIGNATURE}
        </div>
        <div
          className="mt-5 inline-flex items-center gap-3"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.58rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(220,225,232,0.5)",
          }}
        >
          <span
            className="inline-block h-px w-8"
            style={{ background: "rgba(143,164,190,0.7)" }}
          />
          Click anywhere · press Enter to skip
        </div>
      </div>
    </div>
  );
}
