"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import portraitImg from "@/assets/portrait.jpg";

const STORAGE_KEY = "mr_intro_seen";
const BG = "#F7F4EC";
const INK = "#1E1E1E";
const ACCENT = "#D9782E";
const GRAY = "#8A8578";

const GREETINGS = [
  { text: "Hello", lang: "en" },
  { text: "ನಮಸ್ಕಾರ", lang: "kn" },
  { text: "नमस्ते", lang: "hi" },
  { text: "ഹലോ", lang: "ml" },
  { text: "வணக்கம்", lang: "ta" },
];

/* ─── Canvas particle system ─── */
function ParticleCanvas({ pPhase }: { pPhase: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
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

    const isMobile = W < 768;
    const COUNT = isMobile ? 120 : 250;
    const cx = W / 2, cy = H * 0.42, ringR = Math.min(W * 0.1, 130);

    // Sample M and R letterforms
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const octx = off.getContext("2d")!;
    const fs = Math.min(W * 0.26, 260);
    octx.font = `${fs}px "Instrument Serif", Georgia, serif`;
    octx.fillStyle = "#fff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText("M", W * 0.35, cy);
    octx.fillText("R", W * 0.65, cy);
    const img = octx.getImageData(0, 0, W, H);
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < H; y += 4) {
      for (let x = 0; x < W; x += 4) {
        if (img.data[(y * W + x) * 4 + 3] > 100) pts.push({ x, y });
      }
    }
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    const sample = pts.slice(0, COUNT);

    // Ring targets
    const ringTargets = sample.map((_, i) => {
      const a = (i / COUNT) * Math.PI * 2;
      const r = ringR * (0.78 + Math.random() * 0.22);
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    });

    // MR watermark targets
    const wmTargets = sample.map((p) => ({ x: p.x + (Math.random() - 0.5) * 40, y: p.y + (Math.random() - 0.5) * 40 }));

    interface P { x: number; y: number; vx: number; vy: number; }
    const particles: P[] = sample.map((p, i) => {
      const spread = isMobile ? 30 : 50;
      return { x: p.x + (Math.random() - 0.5) * spread, y: p.y + (Math.random() - 0.5) * spread, vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 0.5) * 16 };
    });

    let phase = "idle";
    let alpha = 0;
    let targetAlpha = 0;
    let prevTime = performance.now();

    // Scene watcher via data attribute on body
    const checkPhase = () => {
      const dp = document.body.getAttribute("data-particle-phase");
      if (dp === "burst" && phase !== "burst") { phase = "burst"; targetAlpha = 0.7; }
      if (dp === "ring" && phase !== "ring") { phase = "ring"; targetAlpha = 0.55; }
      if (dp === "settle" && phase !== "settle") { phase = "settle"; targetAlpha = 0.35; }
      if (dp === "watermark" && phase !== "watermark") { phase = "watermark"; targetAlpha = 0.15; }
      if (dp === "done") { targetAlpha = 0; }
    };

    function tick(now: number) {
      checkPhase();
      const dt = Math.min((now - prevTime) / 16.67, 3);
      prevTime = now;
      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (phase === "burst") { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.96; p.vy *= 0.96; }
        if (phase === "ring") {
          const t = ringTargets[i];
          p.x += (t.x - p.x) * 0.07 * dt;
          p.y += (t.y - p.y) * 0.07 * dt;
        }
        if (phase === "settle") {
          const t = ringTargets[i];
          p.x += (t.x - p.x) * 0.02 * dt + (Math.random() - 0.5) * 0.3;
          p.y += (t.y - p.y) * 0.02 * dt + (Math.random() - 0.5) * 0.3;
        }
        if (phase === "watermark") {
          const t = wmTargets[i];
          p.x += (t.x - p.x) * 0.04 * dt;
          p.y += (t.y - p.y) * 0.04 * dt;
        }
      }

      alpha += (targetAlpha - alpha) * 0.04;

      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(217,120,46,${(alpha * (0.5 + Math.random() * 0.5)).toFixed(3)})`;
        ctx!.fill();
      }
    }

    const raf = requestAnimationFrame(function loop(now: number) { tick(now); requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ─── Main Intro ─── */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [pPhase, setPPhase] = useState("idle");
  const [showM, setShowM] = useState(false);
  const [showR, setShowR] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showPortrait, setShowPortrait] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(-1);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    tlRef.current?.kill();
    localStorage.setItem(STORAGE_KEY, "1");
    setPPhase("done");
    setTimeout(onDone, 400);
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // Scene 1: M+R slam at 0ms
    tl.call(() => { setShowM(true); setShowR(true); }, null, 0);
    // Impact at 500ms
    tl.call(() => { setPPhase("burst"); setShowFlash(true); setShowM(false); setShowR(false); }, null, 0.5);
    tl.call(() => setShowFlash(false), null, 0.56);

    // Scene 2: particles → ring at 600ms
    tl.call(() => setPPhase("ring"), null, 0.6);
    // Portrait iris at 1100ms
    tl.call(() => setShowPortrait(true), null, 1.1);
    // Particles settle at 1700ms
    tl.call(() => setPPhase("settle"), null, 1.7);

    // Scene 3: Greetings at 2200ms
    tl.call(() => setGreetingIdx(0), null, 2.2);
    for (let i = 1; i < GREETINGS.length; i++) { tl.call(() => setGreetingIdx(i), null, `+=0.12`); }
    tl.call(() => setGreetingIdx(-1), null, "+=0.35");

    // Scene 4: Identity at 3600ms
    tl.call(() => setShowIdentity(true), null, 3.6);

    // Scene 5: Watermark + transform at 5200ms
    tl.call(() => setPPhase("watermark"), null, 5.2);
    tl.call(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      onDone();
    }, null, 7.0);

    // Skip button
    tl.call(() => setShowSkip(true), null, 1.0);

    tl.play();
    return () => { tl.kill(); };
  }, [finish, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: BG }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 6.5 }}
      onClick={finish}
    >
      <ParticleCanvas pPhase={pPhase} />

      {/* ─── Scene 1: M+R SLAM ─── */}
      <AnimatePresence>
        <motion.span
          className="absolute font-display italic text-[#1E1E1E]"
          style={{ fontSize: "clamp(120px, 18vw, 260px)", fontFamily: "var(--font-display, 'Instrument Serif', serif)", lineHeight: 1 }}
          initial={{ x: "-100vw", opacity: 1 }}
          animate={showM ? { x: 0, opacity: 1 } : {}}
          exit={{ x: -40, opacity: 0 }}
          transition={showM ? { x: { duration: 0.32, ease: "easeInExpo" } } : { duration: 0.15 }}
        >M</motion.span>
        <motion.span
          className="absolute font-display italic text-[#1E1E1E]"
          style={{ fontSize: "clamp(120px, 18vw, 260px)", fontFamily: "var(--font-display, 'Instrument Serif', serif)", lineHeight: 1 }}
          initial={{ x: "100vw", opacity: 1 }}
          animate={showR ? { x: 0, opacity: 1 } : {}}
          exit={{ x: 40, opacity: 0 }}
          transition={showR ? { x: { duration: 0.32, ease: "easeInExpo" } } : { duration: 0.15 }}
        >R</motion.span>
      </AnimatePresence>

      {/* Flash */}
      <AnimatePresence>{showFlash && <motion.div className="absolute inset-0 bg-[#F7F4EC] pointer-events-none" initial={{ opacity: 0.4 }} animate={{ opacity: 0 }} transition={{ duration: 0.06 }} />}</AnimatePresence>

      {/* ─── Scene 2+3: Portrait + Greetings ─── */}
      <AnimatePresence>
        {showPortrait && (
          <motion.div className="absolute flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="relative" initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              {/* Portrait iris */}
              <motion.div className="relative w-[clamp(180px,22vw,250px)] h-[clamp(180px,22vw,250px)] rounded-full overflow-hidden"
                initial={{ clipPath: "circle(0% at 50% 50%)" }}
                animate={{ clipPath: "circle(100% at 50% 50%)" }}
                transition={{ duration: 0.6, ease: "easeOutExpo" }}
              >
                <div className="absolute -inset-[9px] rounded-full border-[9px] border-[#F0EAD9] shadow-[0_0_0_1px_rgba(30,30,30,0.06),0_12px_32px_-12px_rgba(0,0,0,0.15)]" />
                <img src={portraitImg} alt="" className="w-full h-full object-cover" />
                {/* Light sweep */}
                <motion.div className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <motion.div className="absolute w-[200%] h-1/3 bg-gradient-to-b from-white/20 to-transparent"
                    initial={{ top: "-33%", left: "-50%", rotate: 22 }}
                    animate={{ top: "133%" }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.6 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Greetings — MASSIVE */}
            {greetingIdx >= 0 && (
              <div className="flex flex-col items-center gap-2 mt-8">
                {GREETINGS.map((g, i) => {
                  const isCur = greetingIdx === i;
                  const isPast = greetingIdx > i;
                  return (
                    <motion.span
                      key={g.text}
                      className="font-mono uppercase tracking-[0.15em] select-none"
                      style={{ fontSize: "clamp(48px, 6vw, 88px)" }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: isCur ? 1 : isPast ? 0.4 : 0, y: 0, color: isCur ? INK : GRAY }}
                      transition={{ duration: 0.22 }}
                    >{g.text}</motion.span>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scene 4: Name ─── */}
      <AnimatePresence>
        {showIdentity && (
          <motion.div className="absolute flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <motion.h1
              className="font-display italic text-[#1E1E1E]"
              style={{ fontSize: "clamp(64px, 9vw, 140px)", fontFamily: "var(--font-display, 'Instrument Serif', serif)", lineHeight: 0.94 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOutQuint" }}
            >Manikanta<span className="text-[#D9782E]">.</span>R</motion.h1>

            {/* Accent dot bloom */}
            <motion.div className="w-2 h-2 rounded-full bg-[#D9782E] my-4"
              initial={{ opacity: 0, scale: 0, boxShadow: "0 0 0 0 rgba(217,120,46,0)" }}
              animate={{ opacity: 1, scale: 1, boxShadow: ["0 0 0 0 rgba(217,120,46,0)", "0 0 0 14px rgba(217,120,46,0.15)", "0 0 0 0 rgba(217,120,46,0)"] }}
              transition={{ delay: 0.4, duration: 0.3, boxShadow: { delay: 0.4, duration: 0.8 } }}
            />

            <motion.p className="text-[#8A8578]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }}
            >Welcome to my Portfolio.</motion.p>

            <motion.p className="mt-4 max-w-[52ch] text-[#8A8578]/70" style={{ fontSize: "clamp(18px, 2vw, 24px)", fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}
            >Building intelligent solutions where AI, Business Analytics and Human Insight come together.</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip */}
      <AnimatePresence>{showSkip && <motion.button className="absolute bottom-8 right-8 px-4 py-2 rounded-full border border-[#1E1E1E]/12 text-[13px] font-mono uppercase tracking-[0.15em] text-[#8A8578] hover:text-[#1E1E1E] hover:border-[#1E1E1E]/25 transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={(e) => { e.stopPropagation(); finish(); }}
      >Skip Intro</motion.button>}</AnimatePresence>
    </motion.div>
  );
}
