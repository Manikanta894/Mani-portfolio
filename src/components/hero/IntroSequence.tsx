"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import portraitImg from "@/assets/portrait.jpg";

const STORAGE_KEY = "mr_intro_seen";
const GREETINGS = ["Hello", "ನಮಸ್ಕಾರ", "नमस्ते", "ഹലോ", "வணக்கம்"];
const ACCENT = "#D9782E";
const INK = "#1E1E1E";
const GRAY = "#8A8578";
const BG = "#F7F4EC";

/* ─── Particle System ─── */
function ParticleCanvas({ phase, onRingComplete, onParticlesReady }: { phase: string; onRingComplete: () => void; onParticlesReady: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const COUNT = Math.min(200, Math.floor((W * H) / 12000));
    const cx = W * 0.5;
    const cy = H * 0.45;
    const ringR = Math.min(W * 0.1, 130);

    interface P { x: number; y: number; ox: number; oy: number; vx: number; vy: number; }
    const particles: P[] = [];

    // Sample M and R via offscreen canvas
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const octx = off.getContext("2d")!;
    const fs = Math.min(W * 0.26, 240);
    octx.font = `${fs}px "Instrument Serif", Georgia, serif`;
    octx.fillStyle = "#fff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText("M", W * 0.38, cy);
    octx.fillText("R", W * 0.62, cy);
    const img = octx.getImageData(0, 0, W, H);
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < H; y += 4) {
      for (let x = 0; x < W; x += 4) {
        if (img.data[(y * W + x) * 4 + 3] > 100) pts.push({ x, y });
      }
    }

    // Shuffle and trim to COUNT
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    const sample = pts.slice(0, COUNT);

    // Ring targets
    const ringTargs = sample.map((_, i) => {
      const a = (i / COUNT) * Math.PI * 2;
      const r = ringR * (0.75 + Math.random() * 0.25);
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    });

    // Scatter targets (watermark)
    const scatterTargs = sample.map(() => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.3 }));

    for (let i = 0; i < COUNT; i++) {
      const p = sample[i];
      particles.push({
        x: p.x + (Math.random() - 0.5) * 60,
        y: p.y + (Math.random() - 0.5) * 60,
        ox: p.x, oy: p.y,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
      });
    }

    let currentPhase = "idle";
    let alpha = 0; let targetAlpha = 0;
    let globalTime = 0;

    const observer = new MutationObserver(() => {
      const p = document.querySelector("[data-particle-phase]")?.getAttribute("data-particle-phase");
      if (p === "burst") { currentPhase = "burst"; targetAlpha = 0.75; }
      if (p === "ring") { currentPhase = "ring"; targetAlpha = 0.55; }
      if (p === "scatter") { currentPhase = "scatter"; targetAlpha = 0.25; }
      if (p === "done") { currentPhase = "exit"; targetAlpha = 0; }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-particle-phase"] });

    function tick(now: number) {
      const dt = Math.min((now - globalTime) / 16.67, 3);
      globalTime = now;
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        if (currentPhase === "burst") {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.97;
          p.vy *= 0.97;
        }
        if (currentPhase === "ring") {
          const t = ringTargs[particles.indexOf(p)];
          if (!t) continue;
          const dx = t.x - p.x; const dy = t.y - p.y;
          p.x += dx * 0.06 * dt;
          p.y += dy * 0.06 * dt;
        }
        if (currentPhase === "scatter") {
          const t = scatterTargs[particles.indexOf(p)];
          if (!t) continue;
          p.x += (t.x - p.x) * 0.02 * dt;
          p.y += (t.y - p.y) * 0.02 * dt;
        }
        if (currentPhase === "exit") {
          p.x += (Math.random() - 0.5) * 2 * dt;
          p.y += (Math.random() - 0.5) * 2 * dt;
        }

        alpha += (targetAlpha - alpha) * 0.05;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 0.7 + Math.random() * 1, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(217,120,46,${(alpha * (0.5 + Math.random() * 0.5)).toFixed(3)})`;
        ctx!.fill();
      }

      if (currentPhase === "ring" && alpha > 0.5) {
        onRingComplete();
      }
    }

    const raf = requestAnimationFrame(function loop(now: number) { tick(now); requestAnimationFrame(loop); });
    setTimeout(() => onParticlesReady(), 100);

    return () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener("resize", fit); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ─── Main Intro ─── */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState("letters");
  const [showFlash, setShowFlash] = useState(false);
  const [showRing, setShowRing] = useState(false);
  const [showPortrait, setShowPortrait] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(-1);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [pPhase, setPPhase] = useState("idle");

  const finish = useCallback(() => {
    tlRef.current?.kill();
    localStorage.setItem(STORAGE_KEY, "1");
    setPPhase("done");
    setTimeout(onDone, 600);
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // 0.0–0.5s: M+R slam → shatter
    tl.call(() => setPhase("collide"), null, 0);       // letters meet
    tl.call(() => { setPhase("shatter"); setPPhase("burst"); setShowFlash(true); }, null, 0.5); // impact
    tl.call(() => { setShowFlash(false); setShowRing(true); setPPhase("ring"); }, null, 0.7);

    // 0.6–2.2s: Particles reform → portrait iris
    tl.call(() => setShowPortrait(true), null, 1.8);

    // 2.2–3.6s: Greetings
    tl.call(() => setGreetingIdx(0), null, 2.2);
    for (let i = 1; i < GREETINGS.length; i++) { tl.call(() => setGreetingIdx(i), null, `+=0.12`); }
    tl.call(() => setGreetingIdx(-1), null, "+=0.3");

    // 3.6–5.2s: Name
    tl.call(() => setShowIdentity(true), null, "+=0.2");

    // 5.2–7s: Transform
    tl.call(() => { setPPhase("scatter"); }, null, "+=1.8");
    tl.call(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      onDone();
    }, null, "+=1.5");

    // Skip button
    tl.call(() => setShowSkip(true), null, 1.2);

    tl.play();
    return () => { tl.kill(); };
  }, [finish, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: BG }}
      animate={{ opacity: phase === "transform" ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      onClick={finish}
    >
      {/* Hidden phase tracker */}
      <div data-particle-phase={pPhase} className="hidden" />

      {/* Particle canvas */}
      <ParticleCanvas
        phase={phase}
        onRingComplete={() => setShowRing(true)}
        onParticlesReady={() => {}}
      />

      {/* ─── Scene 1: M+R collision ─── */}
      <AnimatePresence>
        {(phase === "letters" || phase === "collide" || phase === "shatter") && (
          <>
            {/* M from right */}
            <motion.span
              className="absolute font-display italic text-[#1E1E1E]"
              style={{ fontSize: "clamp(7rem,16vw,14rem)", fontFamily: "var(--font-display, 'Instrument Serif', serif)", lineHeight: 1 }}
              initial={{ x: 140, opacity: 0 }}
              animate={phase !== "letters" ? { x: 0, opacity: 1 } : { x: 140, opacity: 0 }}
              exit={phase === "shatter" ? { x: -40, opacity: 0, scale: 0.5 } : {}}
              transition={{ x: { duration: 0.35, ease: "easeInExpo" }, opacity: { duration: 0.2 } }}
            >R</motion.span>
            {/* M from left */}
            <motion.span
              className="absolute font-display italic text-[#1E1E1E]"
              style={{ fontSize: "clamp(7rem,16vw,14rem)", fontFamily: "var(--font-display, 'Instrument Serif', serif)", lineHeight: 1 }}
              initial={{ x: -140, opacity: 0 }}
              animate={phase !== "letters" ? { x: 0, opacity: 1 } : { x: -140, opacity: 0 }}
              exit={phase === "shatter" ? { x: 40, opacity: 0, scale: 0.5 } : {}}
              transition={{ x: { duration: 0.35, ease: "easeInExpo" }, opacity: { duration: 0.2 } }}
            >M</motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Flash overlay */}
      <AnimatePresence>{showFlash && <motion.div className="absolute inset-0 bg-white pointer-events-none" initial={{ opacity: 0.4 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.06 }} />}</AnimatePresence>

      {/* ─── Ring + Portrait ─── */}
      <AnimatePresence>
        {showRing && (
          <motion.div className="absolute flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative">
              {showPortrait && (
                <motion.div className="relative w-[clamp(180px,23vw,250px)] h-[clamp(180px,23vw,250px)] rounded-full overflow-hidden"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(50% at 50% 50%)" }}
                  transition={{ duration: 0.6, ease: "easeOutExpo" }}
                >
                  <div className="absolute -inset-[10px] rounded-full border-[10px] border-[#F7F4EC] shadow-[0_0_0_1px_rgba(30,30,30,0.06),0_12px_32px_-12px_rgba(0,0,0,0.15)]" />
                  <img src={portraitImg} alt="" className="w-full h-full object-cover" />
                </motion.div>
              )}
            </div>

            {/* Small greetings */}
            {greetingIdx >= 0 && (
              <div className="flex flex-col items-center gap-1 mt-6">
                {GREETINGS.map((g, i) => {
                  const isCur = greetingIdx === i;
                  const isPast = greetingIdx > i;
                  return (
                    <motion.span
                      key={g}
                      className="font-mono uppercase tracking-[0.18em] select-none"
                      style={{ fontSize: "clamp(1.1rem,1.8vw,1.4rem)" }}
                      animate={{ opacity: isCur ? 1 : isPast ? 0.4 : 0, color: isCur ? INK : GRAY, y: 0 }}
                      initial={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                    >{g}</motion.span>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Name + Tagline ─── */}
      <AnimatePresence>
        {showIdentity && (
          <motion.div className="absolute flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <motion.h1
              className="font-display italic text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[0.94] text-[#1E1E1E]"
              style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >Manikanta<span className="text-[#D9782E]">.</span>R</motion.h1>
            <motion.div className="w-1.5 h-1.5 rounded-full bg-[#D9782E] my-3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ delay: 0.25, duration: 0.3 }}
            />
            <motion.p className="text-[clamp(0.9rem,1.2vw,1.05rem)] text-[#8A8578]" style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
            >Welcome to my Portfolio.</motion.p>
            <motion.p className="mt-3 max-w-[48ch] text-[clamp(0.85rem,1.1vw,0.95rem)] text-[#8A8578]/70" style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
            >Building intelligent solutions where AI, Business Analytics and Human Insight come together.</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip */}
      <AnimatePresence>{showSkip && <motion.button className="absolute bottom-8 right-8 px-4 py-2 rounded-full border border-[#1E1E1E]/12 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8578] hover:text-[#1E1E1E] hover:border-[#1E1E1E]/25 transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={(e) => { e.stopPropagation(); finish(); }}
      >Skip Intro</motion.button>}</AnimatePresence>
    </motion.div>
  );
}
