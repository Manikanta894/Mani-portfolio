"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FloatingLettersProps {
  onRReady?: () => void;
  onLettersComplete?: () => void;
}

/**
 * FloatingLetters — "MANIKANTA R"
 * Letters float in from random directions, assemble, then all fade except R.
 * R falls in slow motion → triggers shatter.
 */
export function FloatingLetters({ onRReady }: FloatingLettersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline();
    const name = "MANIKANTA R";
    const letters: HTMLSpanElement[] = [];

    // Create all letter spans
    name.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
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

      if (char === "R" && i === 10) {
        // This is the main R that will fall and shatter
        span.dataset.isR = "true";
      }

      const angle = Math.random() * Math.PI * 2;
      const dist = 350 + Math.random() * 500;
      gsap.set(span, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotation: (Math.random() - 0.5) * 50,
        scale: 0.2 + Math.random() * 0.3,
        opacity: 0,
      });

      letters.push(span);

      // Float into position
      tl.to(span, {
        x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
        duration: 1.2 + Math.random() * 0.3,
        ease: "power3.out",
        delay: i * 0.06,
      });
    });

    // Pause after assembly
    tl.to({}, { duration: 1.0 });

    // Fade all letters except the last R (index 10)
    letters.forEach((span, i) => {
      if (i === 10) return; // Keep the R
      tl.to(span, {
        opacity: 0, scale: 0.3,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.3");
    });

    // R falls in slow motion
    const rSpan = letters[10];
    if (rSpan) {
      tl.to(rSpan, {
        y: 250,
        rotation: 12,
        opacity: 0.9,
        duration: 1.0,
        ease: "power2.in",
      }, "-=0.1");

      // Trigger shatter just before R disappears
      tl.call(() => onRReady?.(), [], "-=0.25");

      // R fades out
      tl.to(rSpan, {
        opacity: 0,
        scale: 0.5,
        duration: 0.15,
        ease: "power2.out",
      });
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