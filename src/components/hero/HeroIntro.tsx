"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Cinematic intro — canvas particle engine.
 *
 * Timeline (≈ 6.0s):
 *  0.0 – 0.7   void           dark stage + ambient drifting motes
 *  0.7 – 1.6   ignite         violent burst from center, embers fly outward
 *  1.6 – 3.0   assemble       particles reverse-magnet, snap into giant "MR"
 *  3.0 – 3.6   hold           MR breathes; metallic shimmer sweeps across
 *  3.6 – 5.0   morph          MR particles intelligently retarget to "MANIKANTA R"
 *  5.0 – 5.6   signature      tagline rises beneath the name
 *  5.6 – 6.1   handoff        name scales/drifts to hero position, particles dissolve up
 */

const TAGLINE = "Research • Analytics • Intelligence";
const SESSION_KEY = "manikanta-intro-v7";

type Particle = {
  // current
  x: number;
  y: number;
  vx: number;
  vy: number;
  // targets (per phase)
  homeMR: { x: number; y: number };
  homeFull: { x: number; y: number };
  // appearance
  size: number;
  hue: number;       // 18 (vermilion) .. 32 (peach)
  light: number;     // 55..78
  alpha: number;
  twinkle: number;   // phase offset for shimmer
  // ambient seed (for void drift)
  ax: number;
  ay: number;
};

export function HeroIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<
    "void" | "ignite" | "assemble" | "hold" | "morph" | "signature" | "handoff"
  >("void");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";

    if (reduced || alreadyPlayed) {
      setDone(true);
      onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    // ---------- text-to-points sampler ----------
    const sampleText = (
      text: string,
      fontPx: number,
      weight: number,
      maxWidth: number,
      step: number
    ): { x: number; y: number }[] => {
      const off = document.createElement("canvas");
      const ow = Math.ceil(Math.min(W, maxWidth));
      const oh = Math.ceil(fontPx * 1.4);
      off.width = ow;
      off.height = oh;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return [];
      octx.clearRect(0, 0, ow, oh);
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      // Try variable Fraunces; fallback chain handles unavailability gracefully.
      octx.font = `${weight} ${fontPx}px "Fraunces Variable", "Instrument Serif", "Times New Roman", serif`;
      // Slight optical squeeze for editorial feel
      octx.fillText(text, ow / 2, oh / 2);
      const img = octx.getImageData(0, 0, ow, oh).data;
      const pts: { x: number; y: number }[] = [];
      // center result on screen
      const ox = (W - ow) / 2;
      const oy = (H - oh) / 2;
      for (let y = 0; y < oh; y += step) {
        for (let x = 0; x < ow; x += step) {
          const i = (y * ow + x) * 4 + 3;
          if (img[i] > 128) pts.push({ x: ox + x, y: oy + y });
        }
      }
      return pts;
    };

    // Build target point clouds for "MR" (huge) and "MANIKANTA R"
    const buildTargets = () => {
      const mrFont = Math.min(W * 0.55, H * 0.75);
      const fullFont = Math.min(W * 0.13, H * 0.22);
      const mrStep = 5;
      const fullStep = 4;
      const mr = sampleText("MR", mrFont, 900, W * 0.95, mrStep);
      const full = sampleText("MANIKANTA R", fullFont, 700, W * 0.95, fullStep);
      return { mr, full };
    };
    let { mr: mrPts, full: fullPts } = buildTargets();

    // ---------- particle pool ----------
    const COUNT = Math.min(800, Math.max(900, Math.floor((W * H) / 1200)));
    const particles: Particle[] = new Array(COUNT);

    const cx = W / 2;
    const cy = H / 2;

    // Map particles to MR points (cycle if pts < count)
    for (let i = 0; i < COUNT; i++) {
      const mrTarget = mrPts[i % Math.max(1, mrPts.length)] || { x: cx, y: cy };
      const fullTarget = fullPts[i % Math.max(1, fullPts.length)] || { x: cx, y: cy };
      const angle = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 16;
      particles[i] = {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        homeMR: mrTarget,
        homeFull: fullTarget,
        size: 0.6 + Math.random() * 1.8,
        hue: 0,
        light: 95,
        alpha: 0,
        twinkle: Math.random() * Math.PI * 2,
        ax: Math.random() * W,
        ay: Math.random() * H,
      };
    }

    // ---------- ambient embers (separate layer, slow drift) ----------
    const EMBER_COUNT = 0;
    const embers = Array.from({ length: EMBER_COUNT }).map(() => ({
      x: Math.random() * W,
      y: H + Math.random() * H,
      vy: -0.15 - Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.2,
      r: 0.6 + Math.random() * 1.6,
      a: 0.2 + Math.random() * 0.5,
    }));

    // ---------- timeline ----------
    const T = {
  void: 150,
  ignite: 350,
  assemble: 650,
  hold: 250,
  morph: 650,
  signature: 300,
  handoff: 250,
};
    const cumul = (() => {
      let t = 0;
      const c: Record<string, [number, number]> = {};
      (Object.keys(T) as (keyof typeof T)[]).forEach((k) => {
        c[k] = [t, t + T[k]];
        t += T[k];
      });
      return c as Record<keyof typeof T, [number, number]>;
    })();
    const TOTAL = cumul.handoff[1];

    const start = performance.now();
    let raf = 0;
    let lastPhase: typeof phase = "void";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const inPhase = (now: number, p: keyof typeof T) =>
      now >= cumul[p][0] && now < cumul[p][1];
    const phaseT = (now: number, p: keyof typeof T) =>
      Math.min(1, Math.max(0, (now - cumul[p][0]) / T[p]));

    const draw = (ts: number) => {
      const elapsed = ts - start;

      // Determine logical phase
      let curr: keyof typeof T = "handoff";
      for (const k of Object.keys(T) as (keyof typeof T)[]) {
        if (inPhase(elapsed, k)) {
          curr = k;
          break;
        }
      }
      if (curr !== lastPhase) {
        lastPhase = curr;
        setPhase(curr);
      }

      // Clear with deep cinematic vignette
      ctx.globalCompositeOperation = "source-over";
      const bg = ctx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H * 0.55, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "rgba(22,10,16,1)");
      bg.addColorStop(0.55, "rgba(10,5,9,1)");
      bg.addColorStop(1, "rgba(2,1,6,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ---- ambient embers always ----
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        e.y += e.vy;
        e.x += e.vx;
        if (e.y < -10) {
          e.y = H + 10;
          e.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,190,150,${e.a})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- ignite flash ----
      if (inPhase(elapsed, "ignite")) {
        const t = phaseT(elapsed, "ignite");
        const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
        const a = 0;
        flash.addColorStop(0, `rgba(255,210,160,${a})`);
        flash.addColorStop(0.2, `rgba(232,93,58,${a * 0.7})`);
        flash.addColorStop(1, "rgba(232,93,58,0)");
        // ctx.fillStyle = flash;
// ctx.fillRect(0, 0, W, H);
        ctx.fillRect(0, 0, W, H);
      }

      // ---- particles ----
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        // === target per phase ===
        if (curr === "void") {
          // gentle drift around random ambient seed
          const t = phaseT(elapsed, "void");
          const tx = p.ax;
          const ty = p.ay;
          p.x = lerp(p.x, tx, 0.02);
          p.y = lerp(p.y, ty, 0.02);
          p.alpha = lerp(0, 0.35, t);
        } else if (curr === "ignite") {
          // explode outward from center
          const t = phaseT(elapsed, "ignite");
          if (t < 0.05 && p.vx === 0 && p.vy === 0) {
            const angle = Math.atan2(p.y - cy, p.x - cx) || (Math.random() - 0.5);
            const speed = 9 + Math.random() * 22;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.93;
          p.vy *= 0.93;
          p.alpha = lerp(0.4, 0.85, t);
        } else if (curr === "assemble") {
          // magnet → MR home
          const t = easeInOut(phaseT(elapsed, "assemble"));
          const target = p.homeMR;
          const k = lerp(0.04, 0.22, t);
          p.vx = (p.vx + (target.x - p.x) * k) * 0.78;
          p.vy = (p.vy + (target.y - p.y) * k) * 0.78;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = 0.9;
        } else if (curr === "hold") {
          // breathing & twinkle on MR
          const t = phaseT(elapsed, "hold");
          const target = p.homeMR;
          p.x = lerp(p.x, target.x, 0.35);
          p.y = lerp(p.y, target.y, 0.35);
          p.alpha = 0.85 + 0.15 * Math.sin(elapsed * 0.005 + p.twinkle);
          // shimmer sweep — brightens particles based on horizontal position
          const sweepX = lerp(-W * 0.3, W * 1.3, t);
          const d = Math.abs(p.x - sweepX);
          if (d < 80) p.alpha = Math.min(1, p.alpha + (1 - d / 80) * 0.6);
        } else if (curr === "morph") {
          // intelligent re-target to MANIKANTA R positions with curved paths
          const t = easeInOut(phaseT(elapsed, "morph"));
          const sx = p.homeMR.x;
          const sy = p.homeMR.y;
          const ex = p.homeFull.x;
          const ey = p.homeFull.y;
          // bezier control point — adds elegant arc
          const ctrlX = (sx + ex) / 2 + (p.twinkle - Math.PI) * 12;
          const ctrlY = (sy + ey) / 2 - 60 - p.size * 20;
          const u = 1 - t;
          p.x = u * u * sx + 2 * u * t * ctrlX + t * t * ex;
          p.y = u * u * sy + 2 * u * t * ctrlY + t * t * ey;
          p.alpha = 0.6 + 0.4 * Math.sin(t * Math.PI);
        } else if (curr === "signature") {
          const target = p.homeFull;
          p.x = lerp(p.x, target.x, 0.5);
          p.y = lerp(p.y, target.y, 0.5);
          p.alpha = 0.92 + 0.08 * Math.sin(elapsed * 0.006 + p.twinkle);
        } else if (curr === "handoff") {
          const t = phaseT(elapsed, "handoff");
          // drift upward + fade
          p.y -= 1.2 + t * 3;
          p.x += Math.sin(p.twinkle + elapsed * 0.003) * 0.6;
          p.alpha = lerp(0.9, 0, t);
        }

        if (p.alpha <= 0.01) continue;
        const a = Math.min(1, p.alpha);
        // ember color
        ctx.fillStyle = `hsla(${p.hue}, 92%, ${p.light}%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // halo for larger particles
        if (p.size > 1.4 && a > 0.5) {
          ctx.fillStyle = `hsla(${p.hue}, 92%, ${p.light}%, ${a * 0.18})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";

      if (elapsed < TOTAL) {
        raf = requestAnimationFrame(draw);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setDone(true);
        onComplete();
      }
    };
    raf = requestAnimationFrame(draw);

    // resize handling
    const onResize = () => {
      resize();
      const t = buildTargets();
      mrPts = t.mr;
      fullPts = t.full;
      for (let i = 0; i < COUNT; i++) {
        particles[i].homeMR = mrPts[i % Math.max(1, mrPts.length)] || { x: W / 2, y: H / 2 };
        particles[i].homeFull = fullPts[i % Math.max(1, fullPts.length)] || { x: W / 2, y: H / 2 };
      }
    };
    window.addEventListener("resize", onResize);

    // skip handlers
    const skip = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      cancelAnimationFrame(raf);
      setDone(true);
      onComplete();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", " ", "Enter"].includes(e.key)) skip();
    };
    window.addEventListener("keydown", onKey);
    // do NOT skip on scroll/click — lets the user feel the full sequence

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [onComplete]);

  if (done) return null;

  const showTagline = phase === "morph";
  const dissolving = phase === "handoff";

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden
      style={{
        background: "#050505",
        opacity: dissolving ? 0 : 1,
        transition: "opacity .55s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />


      {/* Tagline */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
        style={{
          bottom: "14%",
          opacity: showTagline ? 1 : 0,
          transform: `translate(-50%, ${showTagline ? "0" : "20px"})`,
          transition: "opacity .8s ease-out, transform 1s cubic-bezier(.2,1,.3,1)",
        }}
      >
        <div
          style={{
            fontFamily: `"Fraunces Variable", "Instrument Serif", serif`,
            fontStyle: "italic",
            fontVariationSettings: `"opsz" 144, "wght" 300, "SOFT" 100`,
            fontSize: "clamp(1.1rem, 2.2vw, 1.85rem)",
            color: "rgba(255,238,222,0.95)",
            letterSpacing: "-0.012em",
            textShadow: "0 4px 30px rgba(232,93,58,0.4)",
          }}
        >
          {TAGLINE}
        </div>
        <div
          className="mt-4 text-eyebrow uppercase"
          style={{
            color: "rgba(232,93,58,0.9)",
            fontFamily: `"JetBrains Mono", monospace`,
            letterSpacing: "0.55em",
          }}
        >

        </div>
      </div>

      {/* Skip hint */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-eyebrow uppercase"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: `"JetBrains Mono", monospace`,
          letterSpacing: "0.45em",
          opacity: phase === "void" || dissolving ? 0 : 1,
          transition: "opacity .6s",
        }}
      >

      </div>
    </div>
  );
}
