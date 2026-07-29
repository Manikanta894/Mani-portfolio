"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import portraitImg from "@/assets/portrait.jpg";

const SESSION_KEY = "mr-hero-played";

type Scene = "letters" | "collide" | "portrait" | "text" | "exit";

/* ─── Particle sampler ──────────────────────────────────── */
function sampleLetter(
  ctx: CanvasRenderingContext2D,
  letter: string,
  offX: number, offY: number,
  size: number,
  w: number, h: number,
): { x: number; y: number }[] {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.font = `${size}px "Instrument Serif", Georgia, serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, offX, offY);
  ctx.restore();

  const img = ctx.getImageData(0, 0, w, h);
  const pts: { x: number; y: number }[] = [];
  const step = 2;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (img.data[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    }
  }
  return pts;
}

/* ─── Component ─────────────────────────────────────────── */
export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scene, setScene] = useState<Scene>("letters");
  const [go, setGo] = useState(false);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setScene("exit");
  }, []);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyPlayed) { onDone(); return; }

    // Small delay then start letter slide
    const t0 = setTimeout(() => setGo(true), 400);

    // Letters collide at ~1.2s
    const t1 = setTimeout(() => setScene("collide"), 1200);
    // Portrait reveals at ~2.2s
    const t2 = setTimeout(() => setScene("portrait"), 2200);
    // Text at ~4s
    const t3 = setTimeout(() => setScene("text"), 4000);
    // Exit at ~6.5s
    const t4 = setTimeout(() => finish(), 6500);
    const tFinal = setTimeout(() => onDone(), 7500);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") { e.preventDefault(); finish(); setTimeout(onDone, 600); }
    };
    window.addEventListener("keydown", skip);

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(tFinal);
      window.removeEventListener("keydown", skip);
    };
  }, [finish, onDone]);

  /* ─── Particle canvas ──────────────────────────────────── */
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
    window.addEventListener("resize", fit);

    const fontSize = Math.min(W * 0.32, 280);
    const offY = H * 0.5;

    // Sample M at right-center, R at left-center
    const mPts = sampleLetter(ctx, "M", W * 0.7, offY, fontSize, W, H);
    const rPts = sampleLetter(ctx, "R", W * 0.3, offY, fontSize, W, H);

    // Combine both into one particle array
    const particles = [
      ...mPts.map((p) => ({ ...p, ox: p.x, oy: p.y })),
      ...rPts.map((p) => ({ ...p, ox: p.x, oy: p.y })),
    ];

    // Target positions for reassembly: center circle (portrait shape)
    const cx = W * 0.5;
    const cy = H * 0.5;
    const radius = Math.min(W * 0.14, 140);

    const targets = particles.map(() => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      return { x: cx + Math.cos(angle) * r, y: cy * 0.9 + Math.sin(angle) * r };
    });

    let phase: "idle" | "burst" | "reform" | "hold" | "exit" = "idle";
    let burstStart = 0;
    let alpha = 0;
    let targetAlpha = 0;

    function tick(now: number) {
      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const t = targets[i];

        if (phase === "idle") {
          // Invisible — waiting for collision
          continue;
        }

        if (phase === "burst") {
          // Explode outward from original positions
          const dx = p.x - p.ox;
          const dy = p.y - p.oy;
          const dist = Math.hypot(dx, dy) || 1;
          p.x += (dx / dist) * 4 + (Math.random() - 0.5) * 2;
          p.y += (dy / dist) * 4 + (Math.random() - 0.5) * 2;
        }

        if (phase === "reform") {
          // Float toward target
          p.x += (t.x - p.x) * 0.06 + (Math.random() - 0.5) * 0.3;
          p.y += (t.y - p.y) * 0.06 + (Math.random() - 0.5) * 0.3;
        }

        if (phase === "hold") {
          p.x += (t.x - p.x) * 0.03;
          p.y += (t.y - p.y) * 0.03;
        }

        if (phase === "exit") {
          p.x += (Math.random() - 0.5) * 4;
          p.y += (Math.random() - 0.5) * 4;
        }

        alpha += (targetAlpha - alpha) * 0.05;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 0.8 + Math.random() * 0.6, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,200,245,${alpha.toFixed(3)})`;
        ctx!.fill();
      }
    }

    // Watch scene changes to control particle phase
    const check = setInterval(() => {
      const el = document.querySelector("[data-scene]");
      const s = el?.getAttribute("data-scene");
      if (s === "collide" && phase === "idle") {
        phase = "burst";
        targetAlpha = 0.6;
        burstStart = performance.now();
      }
      if (s === "portrait") {
        phase = "reform";
        targetAlpha = 0.7;
      }
      if (s === "text" || s === "exit") {
        if (s === "exit") {
          phase = "exit";
          targetAlpha = 0;
        } else {
          phase = "hold";
          targetAlpha = 0.6;
        }
      }
    }, 200);

    let raf = requestAnimationFrame(function loop(now: number) {
      tick(now);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(check);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden select-none"
      onClick={() => { finish(); setTimeout(onDone, 600); }}
      animate={scene === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 0.8, 0.22, 1] }}
    >
      {/* Scene tracker for canvas */}
      <div data-scene={scene} className="hidden" aria-hidden />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient bloom */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(50,80,160,0.06)_0%,_transparent_60%)]" />

      {/* ─── M + R collision ─── */}
      <AnimatePresence>
        {(scene === "letters" || scene === "collide") && (
          <>
            {/* M from right */}
            <motion.span
              className="absolute text-white font-light"
              style={{
                fontSize: "clamp(8rem, 22vw, 18rem)",
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
                lineHeight: 1,
              }}
              initial={go ? { x: 120, opacity: 0 } : { x: 120, opacity: 0 }}
              animate={go ? { x: 30, opacity: 1 } : {}}
              exit={{ x: 300, opacity: 0 }}
              transition={
                go
                  ? { x: { duration: 0.7, ease: [0.22, 0.8, 0.22, 1] }, opacity: { duration: 0.35 } }
                  : { duration: 0.3 }
              }
            >
              M
            </motion.span>

            {/* R from left */}
            <motion.span
              className="absolute text-white font-light"
              style={{
                fontSize: "clamp(8rem, 22vw, 18rem)",
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
                lineHeight: 1,
              }}
              initial={go ? { x: -120, opacity: 0 } : { x: -120, opacity: 0 }}
              animate={go ? { x: -30, opacity: 1 } : {}}
              exit={{ x: -300, opacity: 0 }}
              transition={
                go
                  ? { x: { duration: 0.7, ease: [0.22, 0.8, 0.22, 1] }, opacity: { duration: 0.35 } }
                  : { duration: 0.3 }
              }
            >
              R
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* ─── Portrait reveal ─── */}
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
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: [0.22, 0.8, 0.22, 1] }}
            >
              <img
                src={portraitImg}
                alt="Manikanta R"
                className="w-full h-full object-cover"
                style={{ filter: "contrast(1.03) brightness(1.04)" }}
              />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.35), inset 0 0 20px rgba(0,0,0,0.15)" }}
              />
              <div className="absolute inset-[-2px] rounded-full pointer-events-none border border-white/[0.06]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Text ─── */}
      <AnimatePresence>
        {scene === "text" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-white font-light"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                letterSpacing: "0.06em",
                lineHeight: 1,
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.8, 0.22, 1], delay: 0.1 }}
            >
              MANIKANTA R
            </motion.h1>

            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-[#8098d0] to-transparent"
              style={{ width: "clamp(100px, 20vw, 180px)" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.5 }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1], delay: 0.3 }}
            />

            <motion.p
              className="text-white/45 text-sm tracking-[0.35em] uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1], delay: 0.5 }}
            >
              Welcome to my portfolio.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.span
        className="absolute bottom-6 right-6 text-white/15 text-[10px] tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        press esc to skip
      </motion.span>
    </motion.div>
  );
}
