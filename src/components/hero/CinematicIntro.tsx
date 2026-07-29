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
  const sceneRef = useRef<Scene>("letters");

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setScene("exit");
  }, []);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyPlayed) { onDone(); return; }

    const t0 = setTimeout(() => setGo(true), 400);
    const t1 = setTimeout(() => { setScene("collide"); setCollided(true); }, 1300);
    const t2 = setTimeout(() => setScene("flow"), 1650);
    const t3 = setTimeout(() => setScene("portrait"), 2400);
    const t4 = setTimeout(() => setScene("text"), 4200);
    const t5 = setTimeout(() => finish(), 6600);
    const tFinal = setTimeout(() => onDone(), 7500);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") { e.preventDefault(); finish(); setTimeout(onDone, 600); }
    };
    window.addEventListener("keydown", skip);

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(tFinal);
      window.removeEventListener("keydown", skip);
    };
  }, [finish, onDone]);

  // Keep sceneRef in sync
  useEffect(() => { sceneRef.current = scene; }, [scene]);

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

    const fontSize = Math.min(W * 0.3, 260);
    const offY = H * 0.5;

    // M sampled at right (where DOM M slides to), R at left
    const mPts = sampleLetter(ctx, "M", W * 0.66, offY, fontSize, W, H);
    const rPts = sampleLetter(ctx, "R", W * 0.34, offY, fontSize, W, H);

    interface P {
      x: number; y: number;
      ox: number; oy: number;
    }

    const particles: P[] = [
      ...mPts.map((p) => ({ ...p, ox: p.x, oy: p.y })),
      ...rPts.map((p) => ({ ...p, ox: p.x, oy: p.y })),
    ];

    // Portrait circle target positions
    const pcx = W * 0.5;
    const pcy = H * 0.47;
    const pradius = Math.min(W * 0.13, 130);

    const targets = particles.map(() => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * pradius;
      return { x: pcx + Math.cos(angle) * r, y: pcy + Math.sin(angle) * r };
    });

    type Phase = "hidden" | "holdShape" | "flow" | "spiral" | "settled" | "exit";
    let phase: Phase = "hidden";
    let alpha = 0;
    let targetAlpha = 0;
    let phaseStart = 0;
    let globalTime = 0;

    const flowAngles = particles.map(() => {
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      const mag = Math.hypot(dx, dy) || 1;
      return { dx: dx / mag, dy: dy / mag, speed: 1.5 + Math.random() * 2.5 };
    });

    function setPhase(p: Phase) {
      phase = p;
      phaseStart = performance.now();
      if (p === "hidden") targetAlpha = 0;
      if (p === "holdShape") targetAlpha = 0.45;
      if (p === "flow") targetAlpha = 0.55;
      if (p === "spiral" || p === "settled") targetAlpha = 0.6;
      if (p === "exit") targetAlpha = 0;
    }

    function tick(now: number) {
      const dt = Math.min((now - globalTime) / 16.67, 2.5);
      globalTime = now;
      ctx!.clearRect(0, 0, W, H);

      // Update phase based on current scene
      const s = sceneRef.current;
      if (s === "letters") { /* stay hidden */ }
      else if (s === "collide") { if (phase === "hidden") setPhase("holdShape"); }
      else if (s === "flow") { if (phase === "holdShape") setPhase("flow"); }
      else if (s === "portrait") { if (phase === "flow") setPhase("spiral"); }
      else if (s === "text") { if (phase === "spiral") setPhase("settled"); }
      else if (s === "exit") { if (phase !== "exit") setPhase("exit"); }

      if (phase === "hidden") return;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const t = targets[i];

        if (phase === "holdShape") {
          p.x += (p.ox - p.x) * 0.25 + (Math.random() - 0.5) * 0.5;
          p.y += (p.oy - p.y) * 0.25 + (Math.random() - 0.5) * 0.5;
        }
        if (phase === "flow") {
          const f = flowAngles[i];
          p.x += f.dx * f.speed * dt;
          p.y += f.dy * f.speed * dt;
        }
        if (phase === "spiral") {
          const dx = t.x - p.x;
          const dy = t.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const force = 0.06;
          const a = Math.atan2(dy, dx);
          p.x += Math.cos(a) * force * Math.min(dist, 40) * dt + Math.cos(a + 1.2) * 0.4 * dt;
          p.y += Math.sin(a) * force * Math.min(dist, 40) * dt + Math.sin(a + 1.2) * 0.4 * dt;
        }
        if (phase === "settled") {
          p.x += (t.x - p.x) * 0.03;
          p.y += (t.y - p.y) * 0.03;
        }
        if (phase === "exit") {
          p.x += (Math.random() - 0.5) * 2.5 * dt;
          p.y += (Math.random() - 0.5) * 2.5 * dt;
        }
      }

      alpha += (targetAlpha - alpha) * 0.04;

      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 0.7 + Math.random() * 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(170,195,240,${alpha.toFixed(3)})`;
        ctx!.fill();
      }
    }

    let raf = 0;
    function loop(now: number) {
      tick(now);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, []);

  const isExit = scene === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden select-none"
      onClick={() => { finish(); setTimeout(onDone, 600); }}
      animate={isExit ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 0.8, 0.22, 1] }}
    >
      {/* Scene marker for canvas tick to read */}
      <div data-scene={scene} className="hidden" aria-hidden />

      {/* Particle canvas — only renders after DOM letters exit */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient bloom */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(50,80,160,0.05)_0%,_transparent_55%)]" />

      {isExit && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)]" />
      )}

      {/* ─── Energy pulse ─── */}
      <AnimatePresence>
        {collided && !isExit && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4, height: 4,
              left: "50%", top: "50%",
              marginLeft: -2, marginTop: -2,
              border: "1px solid rgba(130,160,220,0.45)",
            }}
            initial={{ width: 4, height: 4, marginLeft: -2, marginTop: -2, opacity: 0.5 }}
            animate={{ width: 500, height: 500, marginLeft: -250, marginTop: -250, opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 0.8, 0.22, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ─── M + R DOM letters — ONLY visible before/at collision, not after ─── */}
      <AnimatePresence>
        {scene === "letters" && (
          <>
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
                filter: "drop-shadow(0 0 18px rgba(100,140,220,0.25))",
              }}
              initial={go ? { x: 120, opacity: 0 } : { x: 120, opacity: 0 }}
              animate={go ? { x: 24, opacity: 1 } : {}}
              exit={{ x: 80, opacity: 0, filter: "drop-shadow(0 0 40px rgba(100,140,220,0.6)) blur(3px)", transition: { duration: 0.3 } }}
              transition={
                go
                  ? { x: { duration: 0.75, ease: [0.22, 0.8, 0.22, 1] }, opacity: { duration: 0.35, delay: 0.05 } }
                  : {}
              }
            >
              M
            </motion.span>

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
                filter: "drop-shadow(0 0 18px rgba(100,140,220,0.25))",
              }}
              initial={go ? { x: -120, opacity: 0 } : { x: -120, opacity: 0 }}
              animate={go ? { x: -24, opacity: 1 } : {}}
              exit={{ x: -80, opacity: 0, filter: "drop-shadow(0 0 40px rgba(100,140,220,0.6)) blur(3px)", transition: { duration: 0.3 } }}
              transition={
                go
                  ? { x: { duration: 0.75, ease: [0.22, 0.8, 0.22, 1] }, opacity: { duration: 0.35, delay: 0.05 } }
                  : {}
              }
            >
              R
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Collide flash — brief overlap between DOM letters exiting and particles starting */}
      <AnimatePresence>
        {scene === "collide" && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ background: "radial-gradient(ellipse at center, rgba(130,160,220,1) 0%, transparent 60%)" }}
          />
        )}
      </AnimatePresence>

      {/* ─── Portrait ─── */}
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
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: "contrast(1.03) brightness(1.04)" }}
              />
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.35), inset 0 0 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(130,160,220,0.06)" }}
              />
              <div className="absolute inset-[-2px] rounded-full pointer-events-none border border-white/[0.05]" />
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
