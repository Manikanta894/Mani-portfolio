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
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const centerX = 0;
    const centerY = 0;

    // ─── "MANIKANTA" bursts into view ─────────────────
    const first = "MANIKANTA";
    first.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.cssText = `
        position: absolute;
        font-family: "Instrument Serif", "Fraunces Variable", ui-serif, Georgia, serif;
        font-style: italic;
        font-weight: 400;
        font-size: clamp(3.5rem, 9vw, 7.5rem);
        line-height: 1;
        letter-spacing: -0.03em;
        color: #FFFFFF;
        opacity: 0;
        will-change: transform, opacity;
        pointer-events: none;
      `;
      container.appendChild(span);

      // Start from center, tiny
      gsap.set(span, { x: centerX, y: centerY, scale: 0, opacity: 0, rotation: 0 });

      // Burst outward to form the word
      const posX = -(first.length * 50) / 2 + i * 50;
      tl.to(span, {
        x: posX,
        y: 0,
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(2)",
        delay: i * 0.03,
      });
      letters.push(span);
    });

    // ─── "R" drops from center ────────────────────────
    const rSpan = document.createElement("span");
    rSpan.textContent = "R";
    rSpan.style.cssText = `
      position: absolute;
      font-family: "Instrument Serif", "Fraunces Variable", ui-serif, Georgia, serif;
      font-style: italic;
      font-weight: 400;
      font-size: clamp(3.5rem, 9vw, 7.5rem);
      line-height: 1;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      opacity: 0;
      will-change: transform, opacity;
      pointer-events: none;
    `;
    container.appendChild(rSpan);

    // R starts hidden at center, then appears and settles to the right of MANIKANTA
    gsap.set(rSpan, { x: centerX, y: centerY, scale: 0, opacity: 0 });

    // Delay slightly, then R appears and moves to position
    tl.to(rSpan, {
      x: (first.length * 50) / 2 + 10,
      y: 0,
      scale: 1.15,
      opacity: 1,
      duration: 0.35,
      ease: "back.out(3)",
    }, "+=0.05");

    letters.push(rSpan);

    // Pause — full "MANIKANTA R" visible
    tl.to({}, { duration: 0.6 });

    // ─── R GLOWS, THEN BREAKS THE NAME ────────────────
    // R grows and becomes the center of destruction
    tl.to(rSpan, {
      scale: 2.5,
      duration: 0.2,
      ease: "power2.out",
    });

    // "MANIKANTA" letters shatter/ explode outward
    first.split("").forEach((_, i) => {
      const span = letters[i];
      const angle = (i / first.length) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 200 + Math.random() * 300;
      tl.to(span, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 50,
        rotation: Math.random() * 720 - 360,
        scale: 0.1,
        opacity: 0,
        duration: 0.4 + Math.random() * 0.2,
        ease: "power3.in",
      }, "-=0.15");
    });

    // R expands into a massive portal
    tl.to(rSpan, {
      scale: 20,
      opacity: 0.3,
      duration: 0.5,
      ease: "power2.in",
    }, "-=0.25");

    // Galaxy starfield through R
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

        const flash = document.createElement("div");
        flash.style.cssText = `position:fixed;inset:0;background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3), transparent 60%);pointer-events:none;z-index:10003;opacity:0;`;
        document.body.appendChild(flash);
        gsap.to(flash, { opacity: 1, duration: 0.06, ease: "none" });
        gsap.to(flash, { opacity: 0, duration: 0.3, ease: "power2.out", delay: 0.06 });

        tl.to(rSpan, { opacity: 0, scale: 25, duration: 0.2, ease: "power2.in" }, "-=0.15");
        tl.to(canvas, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.05");
        tl.call(() => { onRReady?.(); gsap.delayedCall(0.3, () => flash.remove()); }, [], "-=0.05");
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