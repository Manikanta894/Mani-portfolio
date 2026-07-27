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
    const letters: HTMLSpanElement[] = [];

    // ─── FULL NAME "MANIKANTA R" CENTERED ────────────
    const fullName = "MANIKANTA R";
    fullName.split("").forEach((char, i) => {
      if (char === " ") return;
      const span = document.createElement("span");
      span.textContent = char;
      span.style.cssText = `
        position: absolute;
        font-family: "Instrument Serif", "Fraunces Variable", ui-serif, Georgia, serif;
        font-style: italic;
        font-weight: 400;
        font-size: clamp(3rem, 8vw, 6.5rem);
        line-height: 1;
        letter-spacing: -0.03em;
        color: #FFFFFF;
        opacity: 0;
        will-change: transform, opacity;
        pointer-events: none;
      `;
      container.appendChild(span);
      gsap.set(span, { x: 0, y: 0, scale: 0, opacity: 0 });

      // Position: centered name, R sits at its normal spot
      const letterSpacing = 40;
      const totalChars = fullName.replace(" ", "").length; // 10
      const startX = -(totalChars * letterSpacing) / 2;
      // Skip space in positioning
      const idx = i > 8 ? i - 1 : i; // adjust for space at index 8
      const posX = startX + idx * letterSpacing;

      tl.to(span, {
        x: posX, y: 0, scale: 1, opacity: 1,
        duration: 0.25, ease: "back.out(2)", delay: i * 0.02,
      });
      letters.push(span);
    });

    // Brief pause - full name visible
    tl.to({}, { duration: 0.3 });

    // ─── R MOVES TO EXACT CENTER ──────────────────────
    const rSpan = letters[9]; // R is the last letter
    if (rSpan) {
      tl.to(rSpan, {
        x: 0, y: 0, scale: 3,
        duration: 0.25, ease: "power3.out",
      });
    }

    // ─── R BREAKS THE NAME FROM CENTER ────────────────
    // All other letters shatter outward
    fullName.split("").forEach((char, i) => {
      if (char === " " || i === 9) return;
      const span = letters[i > 8 ? i - 1 : i];
      const angle = (i / 9) * Math.PI * 2;
      const dist = 180 + Math.random() * 250;
      tl.to(span, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rotation: Math.random() * 600 - 300,
        scale: 0.1, opacity: 0,
        duration: 0.2 + Math.random() * 0.1,
        ease: "power3.in",
      }, "-=0.15");
    });

    // R expands from CENTER into portal
    if (rSpan) {
      tl.to(rSpan, {
        scale: 25, opacity: 0.3,
        duration: 0.35, ease: "power2.in",
      }, "-=0.15");
    }

    // Galaxy starfield
    if (galaxyRef.current) {
      const canvas = galaxyRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars: { x: number; y: number; z: number; size: number; speed: number }[] = [];
        for (let i = 0; i < 120; i++) {
          stars.push({
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 600,
            z: Math.random() * 1000,
            size: 1 + Math.random() * 2,
            speed: 1 + Math.random() * 3,
          });
        }

        gsap.set(canvas, { opacity: 0 });
        tl.to(canvas, { opacity: 0.7, duration: 0.2, ease: "power2.out" }, "-=0.2");

        let galaxyAnim = 0;
        const drawGalaxy = () => {
          if (!ctx || !canvas) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          stars.forEach(s => {
            s.z -= s.speed;
            if (s.z <= 0) s.z = 1000;
            const sx = (s.x / s.z) * 150;
            const sy = (s.y / s.z) * 150;
            const size = s.size * (1000 / s.z) * 0.5;
            const opacity = Math.min(1, (1000 - s.z) / 500);
            if (size > 0.3) {
              ctx.beginPath();
              ctx.arc(sx, sy, Math.max(0.5, size), 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255,255,255,0.5)";
              ctx.globalAlpha = opacity;
              ctx.fill();
            }
          });
          ctx.globalAlpha = 1;
          galaxyAnim = requestAnimationFrame(drawGalaxy);
        };
        drawGalaxy();

        tl.call(() => { cancelAnimationFrame(galaxyAnim); }, [], "-=0.05");

        const flash = document.createElement("div");
        flash.style.cssText = `position:fixed;inset:0;background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25), transparent 60%);pointer-events:none;z-index:10003;opacity:0;`;
        document.body.appendChild(flash);
        gsap.to(flash, { opacity: 1, duration: 0.04, ease: "none" });
        gsap.to(flash, { opacity: 0, duration: 0.2, ease: "power2.out", delay: 0.04 });

        if (rSpan) {
          tl.to(rSpan, { opacity: 0, scale: 28, duration: 0.12, ease: "power2.in" }, "-=0.1");
        }
        tl.to(canvas, { opacity: 0, duration: 0.12, ease: "power2.in" }, "-=0.05");
        tl.call(() => { onRReady?.(); gsap.delayedCall(0.2, () => flash.remove()); }, [], "-=0.05");
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