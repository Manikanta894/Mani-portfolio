"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onRReady?: () => void;
}

/**
 * FloatingLetters — "MANIKANTA R"
 * Letters scatter randomly across screen. R glows, falls, shatters with lightning.
 */
export function FloatingLetters({ onRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();
    const name = "MANIKANTA R";
    const letters: HTMLSpanElement[] = [];

    name.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "" : char;
      span.style.cssText = `
        position: absolute;
        font-family: "Fraunces Variable", ui-serif, Georgia, serif;
        font-style: italic;
        font-weight: 500;
        font-size: clamp(3rem, 8vw, 7rem);
        line-height: 1;
        letter-spacing: -0.02em;
        color: #FFFFFF;
        opacity: 0;
        will-change: transform, opacity;
        pointer-events: none;
      `;
      container.appendChild(span);

      if (char === " ") return;

      // Random scatter across the full viewport
      const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const startX = (Math.random() - 0.5) * vw * 1.5;
      const startY = (Math.random() - 0.5) * vh * 1.5;

      // Random final position — not in a line
      const finalX = (Math.random() - 0.5) * vw * 0.6;
      const finalY = (Math.random() - 0.5) * vh * 0.4;

      gsap.set(span, {
        x: startX,
        y: startY,
        rotation: (Math.random() - 0.5) * 60,
        scale: 0.2 + Math.random() * 0.4,
        opacity: 0,
      });

      letters.push(span);

      // Float to random position
      tl.to(span, {
        x: finalX,
        y: finalY,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8 + Math.random() * 0.5,
        ease: "power3.out",
        delay: i * 0.05,
      });
    });

    // Brief pause
    tl.to({}, { duration: 0.5 });

    // All letters fade out fast
    letters.forEach((span, i) => {
      if (i === 9) return; // Keep R (index 9 = last R)
      tl.to(span, {
        opacity: 0, scale: 0.2,
        duration: 0.3,
        ease: "power2.in",
      }, "-=0.2");
    });

    // R glows up with lightning effect
    const rSpan = letters[9];
    if (rSpan) {
      // R gets bigger, glows white-hot
      tl.to(rSpan, {
        scale: 2.5,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.1");

      // White flash behind R
      const flash = document.createElement("div");
      flash.style.cssText = `
        position: fixed; inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3), transparent 50%);
        pointer-events: none;
        z-index: 10002;
        opacity: 0;
      `;
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 1, duration: 0.1, ease: "none" });
      gsap.to(flash, { opacity: 0, duration: 0.3, ease: "power2.out", delay: 0.1 });

      // R falls fast
      tl.to(rSpan, {
        y: 200,
        rotation: 15,
        duration: 0.5,
        ease: "power2.in",
      });

      // Lightning crack effect (rapid opacity pulses)
      tl.to(rSpan, {
        opacity: 0.2,
        duration: 0.03,
        repeat: 5,
        yoyo: true,
        ease: "none",
      }, "-=0.2");

      // Trigger shatter
      tl.call(() => onRReady?.(), [], "-=0.1");

      // R shatters away
      tl.to(rSpan, {
        opacity: 0, scale: 0.1,
        duration: 0.1,
        ease: "power2.out",
      });

      // Cleanup flash
      gsap.delayedCall(0.5, () => flash.remove());
    }

    return () => {
      tl.kill();
      letters.forEach(l => l.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ pointerEvents: "none" }}
    />
  );
}