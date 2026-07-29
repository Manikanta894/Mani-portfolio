"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import portraitImg from "@/assets/portrait.jpg";

const SESSION_KEY = "mr-hero-played";

type Scene = "letters" | "collide" | "flow" | "portrait" | "text" | "exit";

/* ─── Particle sampler ──────────────────────────────────── */
function sampleLetter(
  ctx: CanvasRenderingContext2D,
  letter: string,
  cx: number, cy: number,
  size: number,
  w: number, h: number,
): { x: number; y: number }[] {
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.font = `${size}px "Instrument Serif", Georgia, serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, cx, cy);
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
  const [collided, setCollided] = useState(false);
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

    const t0 = setTimeout(() => setGo(true), 300);
    const tCol = setTimeout(() => { setScene("collide"); setCollided(true); }, 1200);
    const t2 = setTimeout(() => setScene("flow"), 1500);
    const t3 = setTimeout(() => setScene("portrait"), 2400);
    const t4 = setTimeout(() => setScene("text"), 4200);
    const t5 = setTimeout(() => finish(), 6600);
    const tFinal = setTimeout(() => onDone(), 7500);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") { e.preventDefault(); finish(); setTimeout(onDone, 600); }
    };
    window.addEventListener("keydown", skip);

    return () => {
      clearTimeout(t0); clearTimeout(tCol); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(tFinal);
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

    const fontSize = Math.min(W * 0.28, 240);
    const letterCY = H * 0.5;

    // M from right side, R from left side
    const mPts = sampleLetter(ctx, "M", W * 0.68, letterCY, fontSize, W, H);
    const rPts = sampleLetter(ctx, "R", W * 0.32, letterCY, fontSize, W, H);

    // Each particle stores: current pos, origin pos (letter shape), velocity
    interface P {
      x: number; y: number;
      ox: number; oy: number;
      vx: number; vy: number;
    }

    const particles: P[] = [
      ...mPts.map((p) => ({ ...p, ox: p.x, oy: p.y, vx: 0, vy: 0 })),
      ...rPts.map((p) => ({ ...p, ox: p.x, oy: p.y, vx: 0, vy: 0 })),
    ];

    // Target: circular portrait frame at center
    const pcx = W * 0.5;
    const pcy = H * 0.47;
    const pradius = Math.min(W * 0.13, 130);

    const targets = particles.map(() => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * pradius;
      return { x: pcx + Math.cos(angle) * r, y: pcy + Math.sin(angle) * r };
    });

    type Phase = "idle" | "holdShape" | "flow" | "spiral" | "settled" | "exit";
    let phase: Phase = "idle";
    let phaseStart = 0;
    let alpha = 0;
    let targetAlpha = 0;
    let globalTime = 0;
    let flowAngle = 0;

    // Assign random outward flow directions (magnetic field look)
    const flowAngles = particles.map(() => {
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      const mag = Math.hypot(dx, dy) || 1;
      return { dx: dx / mag, dy: dy / mag, speed: 1.5 + Math.random() * 2.5 };
    });

    function tick(now: number) {
      const dt = Math.min((now - globalTime) / 16.67, 3); // normalize to ~60fps
      globalTime = now;
      ctx!.clearRect(0, 0, W, H);

      if (phase === "idle") {
        // nothing visible yet
      } else if (phase === "holdShape") {
        // Brief hold at collision — subtle vibration
        for (const p of particles) {
          p.x += (p.ox - p.x) * 0.3 + (Math.random() - 0.5) * 0.4;
          p.y += (p.oy - p.y) * 0.3 + (Math.random() - 0.5) * 0.4;
        }
        targetAlpha = 0.5;
      } else if (phase === "flow") {
        // Graceful outward magnetic drift
        const elapsed = (now - phaseStart) / 1000;
        flowAngle += 0.003;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const f = flowAngles[i];
          // Add slight curvature for magnetic feel
          const ca = flowAngle + i * 0.001;
          p.x += (f.dx * f.speed + Math.cos(ca) * 0.3) * dt;
          p.y += (f.dy * f.speed + Math.sin(ca) * 0.3) * dt;
        }
        targetAlpha = elapsed > 0.3 ? 0.55 : 0.35;
      } else if (phase === "spiral") {
        // Spiral inward toward portrait circle
        const elapsed = (now - phaseStart) / 1000;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const t = targets[i];
          const dx = t.x - p.x;
          const dy = t.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = 0.04 + elapsed * 0.002;
          // Add spiral motion
          const angle = Math.atan2(dy, dx);
          const spiralX = Math.cos(angle + 1.2) * 0.5;
          const spiralY = Math.sin(angle + 1.2) * 0.5;
          p.x += (dx / dist) * force * dist * 0.15 + spiralX * dt;
          p.y += (dy / dist) * force * dist * 0.15 + spiralY * dt;
        }
        targetAlpha = 0.65;
      } else if (phase === "settled") {
        // Gentle orbit around target
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const t = targets[i];
          p.x += (t.x - p.x) * 0.03;
          p.y += (t.y - p.y) * 0.03;
        }
        targetAlpha = 0.55;
      } else if (phase === "exit") {
        for (const p of particles) {
          p.x += (Math.random() - 0.5) * 2.5 * dt;
          p.y += (Math.random() - 0.5) * 2.5 * dt;
        }
        targetAlpha = 0;
      }

      alpha += (targetAlpha - alpha) * 0.04;

      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 0.7 + Math.random() * 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(170,195,235,${alpha.toFixed(3)})`;
        ctx!.fill();
      }
    }

    // Scene watcher
    const el = document.querySelector("[data-scene]");
    const observer = new MutationObserver(() => {
      const s = el?.getAttribute("data-scene");
      if (s === "collide") { phase = "holdShape"; phaseStart = performance.now(); targetAlpha = 0.5; }
      if (s === "flow") { phase = "flow"; phaseStart = performance.now(); }
      if (s === "portrait") { phase = "spiral"; phaseStart = performance.now(); }
      if (s === "text") { phase = "settled"; }
      if (s === "exit") { phase = "exit"; targetAlpha = 0; }
    });
    if (el) observer.observe(el, { attributes: true, attributeFilter: ["data-scene"] });

    let raf = requestAnimationFrame(function loop(now: number) {
      tick(now);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
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
      <div data-scene={scene} className="hidden" aria-hidden />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient bloom */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(50,80,160,0.05)_0%,_transparent_55%)]" />

      {scene === "exit" && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)]" />
      )}

      {/* ─── Energy pulse ring ─── */}
      <AnimatePresence>
        {collided && scene !== "exit" && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4, height: 4,
              left: "50%", top: "50%",
              marginLeft: -2, marginTop: -2,
              border: "1px solid rgba(130,160,220,0.5)",
            }}
            initial={{ width: 4, height: 4, marginLeft: -2, marginTop: -2, opacity: 0.6 }}
            animate={{ width: 600, height: 600, marginLeft: -300, marginTop: -300, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 0.8, 0.22, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ─── M + R letters ─── */}
      <AnimatePresence>
        {(scene === "letters" || scene === "collide") && (
          <>
            {/* M from right — metallic finish */}
            <motion.span
              className="absolute select-none"
              style={{
                fontSize: "clamp(8rem, 22vw, 18rem)",
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
                fontWeight: 300,
                lineHeight: 1,
                background: "linear-gradient(135deg, #d0d8f0 0%, #8098d0 30%, #fff 55%, #6078b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 18px rgba(100,140,220,0.3))",
              }}
              initial={go ? { x: 140, opacity: 0 } : { x: 140, opacity: 0 }}
              animate={go ? { x: 28, opacity: 1 } : {}}
              exit={{ x: 80, opacity: 0, filter: "drop-shadow(0 0 40px rgba(100,140,220,0.6)) blur(2px)" }}
              transition={
                go
                  ? { x: { duration: 0.75, ease: [0.22, 0.8, 0.22, 1] }, opacity: { duration: 0.4, delay: 0.05 } }
                  : { duration: 0.35 }
              }
            >
              M
            </motion.span>

            {/* R from left — metallic finish */}
            <motion.span
              className="absolute select-none"
              style={{
                fontSize: "clamp(8rem, 22vw, 18rem)",
                fontFamily: "var(--font-display, 'Instrument Serif', serif)",
                fontWeight: 300,
                lineHeight: 1,
                background: "linear-gradient(135deg, #d0d8f0 0%, #8098d0 30%, #fff 55%, #6078b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 18px rgba(100,140,220,0.3))",
              }}
              initial={go ? { x: -140, opacity: 0 } : { x: -140, opacity: 0 }}
              animate={go ? { x: -28, opacity: 1 } : {}}
              exit={{ x: -80, opacity: 0, filter: "drop-shadow(0 0 40px rgba(100,140,220,0.6)) blur(2px)" }}
              transition={
                go
                  ? { x: { duration: 0.75, ease: [0.22, 0.8, 0.22, 1] }, opacity: { duration: 0.4, delay: 0.05 } }
                  : { duration: 0.35 }
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
              {/* Rim light — subtle white/blue edge glow */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 60px rgba(0,0,0,0.35), inset 0 0 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(130,160,220,0.08)",
                }}
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
            className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6"
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

            {/* Accent line — draws left to right */}
            <div style={{ width: "clamp(100px, 20vw, 180px)", height: 1, overflow: "hidden" }}>
              <motion.div
                className="h-full"
                style={{ background: "linear-gradient(to right, transparent, #8098d0, transparent)", width: "100%" }}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1], delay: 0.3 }}
              />
            </div>

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
