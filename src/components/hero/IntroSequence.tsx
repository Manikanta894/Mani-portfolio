"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import portraitImg from "@/assets/portrait.jpg";

const STORAGE_KEY = "mr_intro_seen";
const GREETINGS = ["HELLO", "ನಮಸ್ಕಾರ", "नमस्ते", "ഹലೋ", "வணக்கம்"];
const PARTICLE_COUNT = 350;
const ACCENT = "#D9782E";
const INK = "#1E1E1E";

/* ─── Sample text into particle positions ─── */
function sampleText(ctx: CanvasRenderingContext2D, text: string, fontSize: number, w: number, h: number, cx: number, cy: number): { x: number; y: number }[] {
  ctx.clearRect(0, 0, w, h);
  ctx.font = `${fontSize}px "Instrument Serif", Georgia, serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy);
  const img = ctx.getImageData(0, 0, w, h);
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      if (img.data[(y * w + x) * 4 + 3] > 100) pts.push({ x, y });
    }
  }
  return pts;
}

function sampleCircle(cx: number, cy: number, r: number, count: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = r * (0.6 + Math.random() * 0.4);
    pts.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  }
  return pts;
}

/* ─── Particle interface ─── */
interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  a: number; ta: number;
  r: number;
}

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState<string>("monogram");
  const [showText, setShowText] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(-1);
  const [showPortrait, setShowPortrait] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    tlRef.current?.kill();
    localStorage.setItem(STORAGE_KEY, "1");
    setScene("transform");
    setTimeout(onDone, 700);
  }, [onDone]);

  /* ─── Canvas particle system ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    function fit() {
      W = window.innerWidth; H = window.innerHeight;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`; canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    window.addEventListener("resize", fit);

    // Sample letterforms
    const mpx = clamp(W * 0.5 - clamp(W * 0.04, 0, 50), 0, W);
    const rpx = clamp(W * 0.5 + clamp(W * 0.04, 0, 50), 0, W);
    const fontSize = Math.min(W * 0.28, 260);
    const mPts = sampleText(ctx, "M", fontSize, W, H, mpx, H * 0.45);
    const rPts = sampleText(ctx, "R", fontSize, W, H, rpx, H * 0.45);
    const letterTargets = [...mPts, ...rPts].slice(0, PARTICLE_COUNT);

    // Circle targets for portrait ring
    const circleTargets = sampleCircle(W * 0.5, H * 0.48, Math.min(W * 0.12, 140), PARTICLE_COUNT);

    // Scatter targets (final position — random)
    const scatterTargets = letterTargets.map(() => ({ x: Math.random() * W, y: Math.random() * H * 0.5 - H * 0.1 }));

    // Initialize particles at random positions
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.6 + H * 0.2,
        tx: letterTargets[i]?.x ?? W * 0.5,
        ty: letterTargets[i]?.y ?? H * 0.5,
        vx: 0, vy: 0,
        a: 0, ta: 0,
        r: 0.6 + Math.random() * 1.4,
      });
    }

    let currentPhase = "idle";
    let phaseStart = 0;
    let alpha = 0;
    let targetAlpha = 0;

    // Scene watcher
    const sceneEl = document.querySelector("[data-intro-scene]");
    const observer = new MutationObserver(() => {
      const s = sceneEl?.getAttribute("data-intro-scene");
      if (!s) return;

      if (s === "monogram" && currentPhase === "idle") {
        currentPhase = "converge";
        phaseStart = performance.now();
        targetAlpha = 0.7;
        // Set targets to letterforms
        for (let i = 0; i < particles.length; i++) {
          particles[i].tx = letterTargets[i].x;
          particles[i].ty = letterTargets[i].y;
          particles[i].vx = (Math.random() - 0.5) * 2;
          particles[i].vy = (Math.random() - 0.5) * 2;
        }
      }
      if (s === "portrait" && currentPhase !== "ring") {
        currentPhase = "ring";
        phaseStart = performance.now();
        for (let i = 0; i < particles.length; i++) {
          particles[i].tx = circleTargets[i].x;
          particles[i].ty = circleTargets[i].y;
          particles[i].vx = (Math.random() - 0.5) * 3;
          particles[i].vy = (Math.random() - 0.5) * 3;
        }
      }
      if (s === "identity" && currentPhase !== "scatter") {
        currentPhase = "scatter";
        targetAlpha = 0.3;
        for (let i = 0; i < particles.length; i++) {
          particles[i].tx = scatterTargets[i].x;
          particles[i].ty = scatterTargets[i].y;
        }
      }
      if (s === "transform") {
        targetAlpha = 0;
      }
    });
    if (sceneEl) observer.observe(sceneEl, { attributes: true, attributeFilter: ["data-intro-scene"] });

    function tick(now: number) {
      const elapsed = (now - phaseStart) / 1000;
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        if (currentPhase === "converge") {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = 0.06 + elapsed * 0.005;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * Math.min(dist, 60) + p.vx * 0.1;
          p.y += Math.sin(angle) * force * Math.min(dist, 60) + p.vy * 0.1;
          p.vx *= 0.95;
          p.vy *= 0.95;
        }
        if (currentPhase === "ring") {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = 0.04 + elapsed * 0.003;
          p.x += (dx / dist) * force * Math.min(dist, 40) + p.vx * 0.05;
          p.y += (dy / dist) * force * Math.min(dist, 40) + p.vy * 0.05;
          p.vx *= 0.93;
          p.vy *= 0.93;
        }
        if (currentPhase === "scatter") {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.x += dx * 0.025;
          p.y += dy * 0.025;
        }
      }

      alpha += (targetAlpha - alpha) * 0.04;

      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(217,120,46,${(alpha * (0.5 + Math.random() * 0.5)).toFixed(3)})`;
        ctx!.fill();
      }
    }

    let raf = requestAnimationFrame(function loop(now: number) { tick(now); raf = requestAnimationFrame(loop); });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  /* ─── GSAP scene sequencing ─── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // Scene 1: Particles converge to monogram
    tl.call(() => setScene("monogram"), null, 0);
    // After particles form MR, show real text underneath
    tl.call(() => setShowText(true), null, 1.4);
    // Greetings stagger
    tl.call(() => setGreetingIdx(0), null, 2.0);
    for (let i = 1; i < GREETINGS.length; i++) {
      tl.call(() => setGreetingIdx(i), null, `+=0.15`);
    }
    tl.call(() => setGreetingIdx(-1), null, "+=0.4");

    // Scene 2: Portrait reveal
    tl.call(() => setScene("portrait"), null, "+=0.3");
    tl.call(() => setShowPortrait(true), null, "+=0.8");

    // Scene 3: Name
    tl.call(() => setScene("identity"), null, "+=2.0");
    tl.call(() => setShowName(true), null, "+=0.3");
    tl.call(() => setShowText(false), null, "+=0");

    // Transform
    tl.call(() => setScene("transform"), null, "+=2.0");
    tl.call(() => { localStorage.setItem(STORAGE_KEY, "1"); onDone(); }, null, "+=1.2");

    // Skip button
    tl.call(() => setShowSkip(true), null, 1.2);

    tl.play();
    return () => { tl.kill(); };
  }, [finish, onDone]);

  const exiting = scene === "transform";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "#F7F4EC" }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={finish}
    >
      {/* Scene tracker for canvas */}
      <div data-intro-scene={scene} className="hidden" aria-hidden />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* ─── Real DOM: Monogram (fades in after particles form it) ─── */}
      <AnimatePresence>
        {showText && scene !== "transform" && (
          <motion.div className="absolute flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0.1 }} transition={{ duration: 0.4 }}>
            <span className="font-display text-[clamp(6rem,14vw,12rem)] leading-none text-[#1E1E1E]" style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)", fontStyle: "italic" }}>
              MR
            </span>

            {/* Greetings */}
            <div className="flex flex-col items-center gap-1.5 mt-6">
              {GREETINGS.map((g, i) => {
                const isCurrent = greetingIdx === i;
                const isPast = greetingIdx > i;
                return (
                  <motion.span
                    key={g}
                    className="font-mono uppercase tracking-[0.2em] select-none"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                    animate={{
                      opacity: greetingIdx === -1 ? 0 : isCurrent ? 1 : isPast ? 0.35 : 0,
                      color: isCurrent ? INK : "#8A8578",
                    }}
                    transition={{ duration: 0.25 }}
                  >{g}</motion.span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Real DOM: Portrait ─── */}
      <AnimatePresence>
        {showPortrait && scene !== "transform" && (
          <motion.div className="absolute flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="relative" initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              <div className="absolute -inset-[10px] rounded-full border-[10px] border-[#F7F4EC] shadow-[0_0_0_1px_rgba(30,30,30,0.06),0_12px_32px_-12px_rgba(0,0,0,0.15)]" />
              <div className="relative w-[clamp(180px,22vw,240px)] h-[clamp(180px,22vw,240px)] rounded-full overflow-hidden">
                <img src={portraitImg} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Real DOM: Name ─── */}
      <AnimatePresence>
        {showName && scene !== "transform" && (
          <motion.div className="absolute flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="overflow-hidden">
              <motion.h1
                className="font-display italic text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-[#1E1E1E] whitespace-nowrap"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >Manikanta<span className="text-[#D9782E]">.</span>R</motion.h1>
            </div>
            <motion.p
              className="mt-4 max-w-[52ch] text-[clamp(0.95rem,1.3vw,1.1rem)] text-[#8A8578]"
              style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >Building intelligent solutions where AI, Business Analytics and Human Insight come together.</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip */}
      <AnimatePresence>
        {showSkip && !exiting && (
          <motion.button className="absolute bottom-8 right-8 px-4 py-2 rounded-full border border-[#1E1E1E]/12 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8578] hover:text-[#1E1E1E] hover:border-[#1E1E1E]/25 transition-colors"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); finish(); }}
          >Skip Intro</motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
