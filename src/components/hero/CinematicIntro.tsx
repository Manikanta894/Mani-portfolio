"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import portraitImg from "@/assets/portrait.jpg";

const SESSION_KEY = "mr-hero-played";
const TOTAL_DURATION = 8000;

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
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
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();

    const particles: { x: number; y: number; r: number; vx: number; vy: number; a: number; ta: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.4 + Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        a: 0, ta: Math.random() * 0.35,
      });
    }

    let raf = 0;
    function tick() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.a += (p.ta - p.a) * 0.005;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,200,240,${p.a.toFixed(3)})`;
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
}

type Scene = "logo" | "portrait" | "text" | "exit";

export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState<Scene>("logo");
  const particleRef = useRef<HTMLCanvasElement | null>(null);
  const done = useRef(false);

  useParticles(particleRef);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setScene("exit");
  }, []);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyPlayed) { onDone(); return; }

    const t1 = setTimeout(() => setScene("portrait"), 1500);
    const t2 = setTimeout(() => setScene("text"), 4000);
    const t3 = setTimeout(() => finish(), 6800);
    const tFinal = setTimeout(() => onDone(), 8000);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") { e.preventDefault(); finish(); onDone(); }
    };
    window.addEventListener("keydown", skip);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(tFinal);
      window.removeEventListener("keydown", skip);
    };
  }, [finish, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      onClick={() => { finish(); setTimeout(onDone, 600); }}
      animate={scene === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 0.8, 0.22, 1] }}
    >
      {/* Subtle particles */}
      <canvas ref={particleRef} className="absolute inset-0 pointer-events-none" />

      {/* Radial lens bloom */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(50,80,160,0.08)_0%,_transparent_65%)]" />

      {/* ─── Scene 1: M Logo ─── */}
      <AnimatePresence>
        {scene === "logo" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1] }}
          >
            <div className="relative">
              <svg viewBox="0 0 160 100" className="w-[clamp(100px,18vw,180px)] h-auto">
                <defs>
                  <linearGradient id="mlight" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#b8c8f0" />
                    <stop offset="50%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#6078c0" />
                  </linearGradient>
                  <filter id="mglow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <g filter="url(#mglow)">
                  {/* M letterform */}
                  <path
                    d="M20 80V20L50 55L80 20V80"
                    fill="none"
                    stroke="url(#mlight)"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M80 20L110 55L140 20V80"
                    fill="none"
                    stroke="url(#mlight)"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </g>
                {/* Light sweep animation */}
                <rect x="0" y="0" width="160" height="100" fill="url(#mlight)" opacity="0.12"
                  style={{ animation: "sweep 2s ease-in-out infinite" }} />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scene 2: Portrait ─── */}
      <AnimatePresence>
        {scene === "portrait" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: [0.22, 0.8, 0.22, 1] }}
          >
            <motion.div
              className="relative overflow-hidden rounded-full"
              style={{
                width: "clamp(140px, 22vw, 240px)",
                height: "clamp(140px, 22vw, 240px)",
                boxShadow: "0 0 60px rgba(80,120,200,0.12), 0 0 120px rgba(60,90,180,0.06)",
              }}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: [0.22, 0.8, 0.22, 1] }}
            >
              <img
                src={portraitImg}
                alt="Manikanta R"
                className="w-full h-full object-cover"
                style={{ filter: "contrast(1.03) brightness(1.04)" }}
              />
              {/* Vignette overlay */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.2)" }}
              />
              {/* Lens bloom ring */}
              <div className="absolute inset-[-2px] rounded-full pointer-events-none border border-white/[0.06]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scene 3: Name + Welcome ─── */}
      <AnimatePresence>
        {scene === "text" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 0.8, 0.22, 1] }}
          >
            {/* Name */}
            <motion.h1
              className="text-white font-light tracking-[0.04em]"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                letterSpacing: "0.06em",
                lineHeight: 1,
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.8, 0.22, 1], delay: 0.15 }}
            >
              MANIKANTA R
            </motion.h1>

            {/* Accent line */}
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-[#8098d0] to-transparent"
              style={{ width: "clamp(100px, 20vw, 180px)" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.5 }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1], delay: 0.4 }}
            />

            {/* Welcome text */}
            <motion.p
              className="text-white/45 text-sm tracking-[0.35em] uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1], delay: 0.6 }}
            >
              Welcome to my portfolio.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip hint */}
      <motion.span
        className="absolute bottom-6 right-6 text-white/15 text-[10px] tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        press esc to skip
      </motion.span>

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: translateX(200%); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
