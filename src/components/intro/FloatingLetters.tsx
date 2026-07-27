"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onRReady?: () => void;
}

const COLORS = ["#3B82F6", "#8B5CF6", "#22D3EE", "#FFFFFF", "#60A5FA", "#A78BFA"];

export function FloatingLetters({ onRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();
    const name = "MANIKANTA R";
    const letters: HTMLSpanElement[] = [];
    const finalPositions: { x: number; y: number }[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const startX = -(name.length * 45) / 2;
    name.split("").forEach((_, i) => finalPositions.push({ x: startX + i * 45, y: 0 }));

    // ─── CREATE LETTERS ─────────────────────────────────
    name.split("").forEach((char, i) => {
      if (char === " ") return;
      const span = document.createElement("span");
      span.textContent = char;
      const color = COLORS[i % COLORS.length];
      span.style.cssText = `
        position: absolute;
        font-family: "Fraunces Variable", ui-serif, Georgia, serif;
        font-style: italic;
        font-weight: 600;
        font-size: clamp(3.5rem, 9vw, 7.5rem);
        line-height: 1;
        letter-spacing: -0.02em;
        color: ${color};
        opacity: 0;
        will-change: transform, opacity;
        pointer-events: none;
        text-shadow: 0 0 20px ${color}40, 0 0 60px ${color}20;
      `;
      container.appendChild(span);

      const angle = Math.random() * Math.PI * 2;
      const dist = 400 + Math.random() * 600;
      gsap.set(span, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rotation: (Math.random() - 0.5) * 120, scale: 0.1, opacity: 0 });
      letters.push(span);

      tl.to(span, {
        x: (Math.random() - 0.5) * vw * 0.5,
        y: (Math.random() - 0.5) * vh * 0.4,
        rotation: 0, scale: 1.2, opacity: 1,
        duration: 0.3, ease: "back.out(1.5)", delay: i * 0.02,
      });
    });

    tl.to({}, { duration: 0.15 });

    // ─── R COMES TO CENTER ─────────────────────────────
    const rSpan = letters[9];
    if (rSpan) {
      rSpan.style.color = "#FFFFFF";
      rSpan.style.textShadow = "0 0 40px #3B82F6, 0 0 100px #8B5CF6, 0 0 160px #22D3EE";
      tl.to(rSpan, { x: 0, y: 0, scale: 2.5, opacity: 1, duration: 0.35, ease: "power3.out" });
    }

    letters.forEach((span, i) => {
      if (i === 9) return;
      tl.to(span, { x: finalPositions[i].x, y: finalPositions[i].y, scale: 1, rotation: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, "-=0.25");
    });

    if (rSpan) {
      tl.to(rSpan, { x: finalPositions[9].x, y: finalPositions[9].y, scale: 1.15, duration: 0.2, ease: "back.out(2)" }, "-=0.12");
    }

    tl.to({}, { duration: 0.5 });

    // ─── THE R BECOMES A DOORWAY ──────────────────────
    if (rSpan) {
      // R grows HUGE to fill the viewport
      tl.to(rSpan, {
        scale: 25,
        opacity: 0.6,
        duration: 0.6,
        ease: "power2.in",
      });

      // All other letters dissolve into light
      letters.forEach((span, i) => {
        if (i === 9) return;
        tl.to(span, {
          opacity: 0, scale: 0.1,
          duration: 0.3, ease: "power2.in",
        }, "-=0.3");
      });

      // Portal ring appears
      if (portalRef.current) {
        gsap.set(portalRef.current, { opacity: 0, scale: 0.5 });
        tl.to(portalRef.current, {
          opacity: 1, scale: 1,
          duration: 0.5, ease: "power2.out",
        }, "-=0.3");
      }

      // Galaxy canvas activates
      if (galaxyRef.current) {
        const canvas = galaxyRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const stars: { x: number; y: number; z: number; size: number; color: string; speed: number }[] = [];
          for (let i = 0; i < 200; i++) {
            stars.push({
              x: (Math.random() - 0.5) * 800,
              y: (Math.random() - 0.5) * 800,
              z: Math.random() * 1000,
              size: 1 + Math.random() * 3,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              speed: 0.5 + Math.random() * 2,
            });
          }

          gsap.set(canvas, { opacity: 0 });
          tl.to(canvas, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.3");

          let galaxyAnim = 0;
          const drawGalaxy = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            stars.forEach(s => {
              s.z -= s.speed;
              if (s.z <= 0) s.z = 1000;

              const sx = (s.x / s.z) * 200;
              const sy = (s.y / s.z) * 200;
              const size = s.size * (1000 / s.z) * 0.5;
              const opacity = Math.min(1, (1000 - s.z) / 500);

              if (size > 0.3) {
                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.globalAlpha = opacity * 0.8;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(1, size * 3), 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.globalAlpha = opacity * 0.06;
                ctx.fill();
              }
            });

            ctx.restore();
            galaxyAnim = requestAnimationFrame(drawGalaxy);
          };
          drawGalaxy();

          // Cleanup galaxy after transition
          tl.call(() => { cancelAnimationFrame(galaxyAnim); }, [], "-=0.1");

          // Flash — KABOOM
          const flash = document.createElement("div");
          flash.style.cssText = `
            position: fixed; inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6), rgba(59,130,246,0.4), rgba(139,92,246,0.2), transparent 70%);
            pointer-events: none; z-index: 10003; opacity: 0;
          `;
          document.body.appendChild(flash);
          gsap.to(flash, { opacity: 1, duration: 0.08, ease: "none" });
          gsap.to(flash, { opacity: 0, duration: 0.4, ease: "power2.out", delay: 0.08 });

          // R dissolves into the galaxy
          if (rSpan) {
            tl.to(rSpan, { opacity: 0, scale: 30, duration: 0.3, ease: "power2.in" }, "-=0.2");
          }

          tl.to(canvas, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1");
          tl.call(() => {
            onRReady?.();
            gsap.delayedCall(0.5, () => flash.remove());
          }, [], "-=0.05");
        }
      }
    }

    return () => { tl.kill(); letters.forEach(l => l.remove()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ pointerEvents: "none" }} />

      {/* Portal ring behind R */}
      <div ref={portalRef} className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center" style={{ opacity: 0 }}>
        <div style={{
          width: "clamp(300px, 50vw, 600px)",
          aspectRatio: "1",
          borderRadius: "50%",
          border: "2px solid rgba(59,130,246,0.15)",
          boxShadow: "0 0 80px rgba(59,130,246,0.1), 0 0 160px rgba(139,92,246,0.05), inset 0 0 80px rgba(59,130,246,0.05)",
          position: "absolute",
        }} />
        <div style={{
          width: "clamp(250px, 40vw, 500px)",
          aspectRatio: "1",
          borderRadius: "50%",
          border: "1px dashed rgba(139,92,246,0.1)",
          position: "absolute",
        }} />
      </div>

      {/* Galaxy canvas */}
      <canvas ref={galaxyRef} className="fixed inset-0 z-[10001] pointer-events-none" style={{ opacity: 0 }} />
    </>
  );
}