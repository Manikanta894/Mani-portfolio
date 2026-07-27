"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onRReady?: () => void;
}

const COLORS = ["#3B82F6", "#8B5CF6", "#22D3EE", "#FFFFFF", "#60A5FA", "#A78BFA"];

export function FloatingLetters({ onRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();
    const name = "MANIKANTA R";
    const letters: HTMLSpanElement[] = [];
    const finalPositions: { x: number; y: number }[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Center positions for the full name
    const startX = -(name.length * 45) / 2;
    name.split("").forEach((_, i) => {
      finalPositions.push({ x: startX + i * 45, y: 0 });
    });

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

      // Random start - far off screen
      const angle = Math.random() * Math.PI * 2;
      const dist = 400 + Math.random() * 600;
      gsap.set(span, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 120,
        scale: 0.1,
        opacity: 0,
      });
      letters.push(span);

      // Fast colorful scatter into view
      tl.to(span, {
        x: (Math.random() - 0.5) * vw * 0.5,
        y: (Math.random() - 0.5) * vh * 0.4,
        rotation: 0,
        scale: 1.2,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.5)",
        delay: i * 0.02,
      });
    });

    // Brief pause
    tl.to({}, { duration: 0.15 });

    // R comes to center BIG and glowing
    const rSpan = letters[9];
    if (rSpan) {
      rSpan.style.color = "#FFFFFF";
      rSpan.style.textShadow = "0 0 30px #3B82F6, 0 0 80px #8B5CF6, 0 0 120px #22D3EE";
      tl.to(rSpan, {
        x: 0, y: 0, scale: 2.5, opacity: 1,
        duration: 0.35, ease: "power3.out",
      });
    }

    // All letters rush to form name with colors
    letters.forEach((span, i) => {
      if (i === 9) return;
      tl.to(span, {
        x: finalPositions[i].x,
        y: finalPositions[i].y,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      }, "-=0.25");
    });

    // R settles
    if (rSpan) {
      tl.to(rSpan, {
        x: finalPositions[9].x,
        y: finalPositions[9].y,
        scale: 1.15,
        duration: 0.2,
        ease: "back.out(2)",
      }, "-=0.12");
    }

    // Pause - name visible
    tl.to({}, { duration: 0.6 });

    // EXPLOSION: R expands hugely, flash, all letters burst
    if (rSpan) {
      // R grows with glow
      tl.to(rSpan, {
        scale: 2.2,
        duration: 0.12,
        ease: "power2.out",
      });

      // Huge flash
      const flash = document.createElement("div");
      flash.style.cssText = `
        position: fixed; inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(59,130,246,0.5), rgba(139,92,246,0.3), transparent 60%);
        pointer-events: none;
        z-index: 10002;
        opacity: 0;
      `;
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 1, duration: 0.06, ease: "none" });
      gsap.to(flash, { opacity: 0, duration: 0.3, ease: "power2.out", delay: 0.06 });

      // R falls
      tl.to(rSpan, {
        y: 120, rotation: 8, scale: 1.5,
        duration: 0.25, ease: "power2.in",
      });

      // All letters burst outward with color trails
      letters.forEach((span, i) => {
        const angle = (i / letters.length) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 150 + Math.random() * 300;
        const color = COLORS[i % COLORS.length];
        span.style.textShadow = `0 0 40px ${color}`;
        tl.to(span, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 80,
          rotation: Math.random() * 720 - 360,
          scale: 0.15,
          opacity: 0,
          duration: 0.35 + Math.random() * 0.25,
          ease: "power2.in",
        }, "-=0.2");
      });

      tl.call(() => onRReady?.(), [], "-=0.25");
      gsap.delayedCall(0.4, () => flash.remove());
    }

    return () => { tl.kill(); letters.forEach(l => l.remove()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ pointerEvents: "none" }} />
  );
}