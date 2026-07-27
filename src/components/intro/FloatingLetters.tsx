"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onRReady?: () => void;
}

export function FloatingLetters({ onRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
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

    // Create letters — all white, no neon
    name.split("").forEach((char, i) => {
      if (char === " ") return;
      const span = document.createElement("span");
      span.textContent = char;
      span.style.cssText = `
        position: absolute;
        font-family: "Fraunces Variable", ui-serif, Georgia, serif;
        font-style: italic;
        font-weight: 500;
        font-size: clamp(3.5rem, 9vw, 7.5rem);
        line-height: 1;
        letter-spacing: -0.02em;
        color: #FFFFFF;
        opacity: 0;
        will-change: transform, opacity;
        pointer-events: none;
      `;
      container.appendChild(span);

      const angle = Math.random() * Math.PI * 2;
      const dist = 400 + Math.random() * 600;
      gsap.set(span, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rotation: (Math.random() - 0.5) * 120, scale: 0.1, opacity: 0 });
      letters.push(span);

      tl.to(span, {
        x: (Math.random() - 0.5) * vw * 0.5,
        y: (Math.random() - 0.5) * vh * 0.4,
        rotation: 0, scale: 1.1, opacity: 1,
        duration: 0.3, ease: "back.out(1.5)", delay: i * 0.02,
      });
    });

    tl.to({}, { duration: 0.15 });

    // R comes to center
    const rSpan = letters[9];
    if (rSpan) {
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

    // R becomes a gateway — expands, other letters fade
    if (rSpan) {
      tl.to(rSpan, { scale: 20, opacity: 0.4, duration: 0.5, ease: "power2.in" });

      letters.forEach((span, i) => {
        if (i === 9) return;
        tl.to(span, { opacity: 0, scale: 0.1, duration: 0.3, ease: "power2.in" }, "-=0.25");
      });

      // Galaxy starfield
      if (galaxyRef.current) {
        const canvas = galaxyRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const stars: { x: number; y: number; z: number; size: number; speed: number }[] = [];
          for (let i = 0; i < 150; i++) {
            stars.push({
              x: (Math.random() - 0.5) * 800,
              y: (Math.random() - 0.5) * 800,
              z: Math.random() * 1000,
              size: 1 + Math.random() * 2.5,
              speed: 0.5 + Math.random() * 2,
            });
          }

          gsap.set(canvas, { opacity: 0 });
          tl.to(canvas, { opacity: 0.8, duration: 0.3, ease: "power2.out" }, "-=0.3");

          let galaxyAnim = 0;
          const drawGalaxy = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.globalAlpha = opacity;
                ctx.fill();
              }
            });
            ctx.globalAlpha = 1;
            galaxyAnim = requestAnimationFrame(drawGalaxy);
          };
          drawGalaxy();

          tl.call(() => { cancelAnimationFrame(galaxyAnim); }, [], "-=0.1");

          // Gentle white flash
          const flash = document.createElement("div");
          flash.style.cssText = `position:fixed;inset:0;background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3), transparent 60%);pointer-events:none;z-index:10003;opacity:0;`;
          document.body.appendChild(flash);
          gsap.to(flash, { opacity: 1, duration: 0.06, ease: "none" });
          gsap.to(flash, { opacity: 0, duration: 0.3, ease: "power2.out", delay: 0.06 });

          if (rSpan) {
            tl.to(rSpan, { opacity: 0, scale: 25, duration: 0.2, ease: "power2.in" }, "-=0.15");
          }
          tl.to(canvas, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.05");
          tl.call(() => { onRReady?.(); gsap.delayedCall(0.3, () => flash.remove()); }, [], "-=0.05");
        }
      }
    }

    return () => { tl.kill(); letters.forEach(l => l.remove()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ pointerEvents: "none" }} />
      <canvas ref={galaxyRef} className="fixed inset-0 z-[10001] pointer-events-none" style={{ opacity: 0 }} />
    </>
  );
}