"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  onRReady?: () => void;
}

/**
 * FloatingLetters — "MANIKANTA R"
 * Step 1: Letters scatter randomly (fast)
 * Step 2: R comes to center, forms full name
 * Step 3: Name breaks like fire → triggers portrait
 */
export function FloatingLetters({ onRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();
    const name = "MANIKANTA R";
    const letters: HTMLSpanElement[] = [];
    const finalPositions: { x: number; y: number }[] = [];
    const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;

    // Calculate center positions for the full name
    const totalWidth = name.length * 45; // approximate
    const startX = -totalWidth / 2;

    name.split("").forEach((char, i) => {
      finalPositions.push({
        x: startX + i * 45,
        y: 0,
      });
    });

    // Create letters
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

      // Random start position (fast scatter)
      const startX2 = (Math.random() - 0.5) * vw;
      const startY2 = (Math.random() - 0.5) * vh;

      gsap.set(span, {
        x: startX2,
        y: startY2,
        rotation: (Math.random() - 0.5) * 90,
        scale: 0.1 + Math.random() * 0.3,
        opacity: 0,
      });

      letters.push(span);

      // FAST scatter into view (random positions)
      tl.to(span, {
        x: startX2 * 0.3,
        y: startY2 * 0.3,
        rotation: 0,
        scale: 0.8,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        delay: i * 0.02,
      });
    });

    // Brief pause
    tl.to({}, { duration: 0.3 });

    // R comes to center, then ALL letters assemble into full name
    // First move R to center
    const rSpan = letters[9]; // Last "R"
    if (rSpan) {
      tl.to(rSpan, {
        x: 0,
        y: 0,
        scale: 1.5,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    // All other letters rush to form the name around R
    letters.forEach((span, i) => {
      if (i === 9) return; // R already in center
      tl.to(span, {
        x: finalPositions[i].x,
        y: finalPositions[i].y,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      }, "-=0.3");
    });

    // R settles into position
    if (rSpan) {
      tl.to(rSpan, {
        x: finalPositions[9].x,
        y: finalPositions[9].y,
        scale: 1,
        duration: 0.25,
        ease: "back.out(2)",
      }, "-=0.15");
    }

    // Pause — name is fully formed
    tl.to({}, { duration: 0.4 });

    // R glows intensely (fire effect)
    if (rSpan) {
      tl.to(rSpan, {
        scale: 1.8,
        opacity: 0.9,
        duration: 0.15,
        ease: "power2.out",
      });

      // White-hot flash
      const flash = document.createElement("div");
      flash.style.cssText = `
        position: fixed; inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 50%);
        pointer-events: none;
        z-index: 10002;
        opacity: 0;
      `;
      document.body.appendChild(flash);
      gsap.to(flash, { opacity: 1, duration: 0.08, ease: "none" });
      gsap.to(flash, { opacity: 0, duration: 0.2, ease: "power2.out", delay: 0.08 });

      // R falls
      tl.to(rSpan, {
        y: 150,
        rotation: 10,
        duration: 0.3,
        ease: "power2.in",
      });

      // All letters break apart like fire
      letters.forEach((span, i) => {
        const angle = (i / letters.length) * Math.PI * 2;
        const dist = 100 + Math.random() * 200;
        tl.to(span, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 50,
          rotation: Math.random() * 360 - 180,
          scale: 0.2,
          opacity: 0,
          duration: 0.3 + Math.random() * 0.2,
          ease: "power2.in",
        }, "-=0.2");
      });

      // Trigger portrait
      tl.call(() => onRReady?.(), [], "-=0.25");

      // Cleanup
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