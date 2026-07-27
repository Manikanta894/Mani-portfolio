"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface FloatingLettersProps {
  onRReady?: () => void;
  onLettersComplete?: () => void;
}

/**
 * FloatingLetters — "MANIKANTA R"
 * Each letter floats in from random directions, assembles into position,
 * then all fade except R. R then falls and triggers completion.
 */
export function FloatingLetters({ onRReady, onLettersComplete }: FloatingLettersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tl = gsap.timeline({
      onComplete: () => onLettersComplete?.(),
    });
    tlRef.current = tl;

    const name = "MANIKANTA R";
    const letters: HTMLSpanElement[] = [];

    name.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.position = "absolute";
      span.style.fontFamily = '"Fraunces Variable", ui-serif, Georgia, serif';
      span.style.fontStyle = "italic";
      span.style.fontWeight = 500;
      span.style.fontSize = "clamp(3rem, 8vw, 7rem)";
      span.style.lineHeight = "1";
      span.style.letterSpacing = "-0.02em";
      span.style.color = "#FFFFFF";
      span.style.opacity = "0";
      span.style.willChange = "transform, opacity";
      span.style.pointerEvents = "none";
      span.dataset.index = String(i);

      // Random entry: from random direction off-screen
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 400;
      const startX = Math.cos(angle) * dist;
      const startY = Math.sin(angle) * dist;

      gsap.set(span, {
        x: startX,
        y: startY,
        rotation: (Math.random() - 0.5) * 40,
        scale: 0.3 + Math.random() * 0.4,
        opacity: 0,
      });

      container.appendChild(span);
      letters.push(span);

      // Float in with staggered timing
      tl.to(span, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.1 + Math.random() * 0.3,
      }, i * 0.08);
    });

    // After assembly, brief pause
    tl.to({}, { duration: 0.8 });

    // All letters fade except R (index 9 = "R", index 10 = " ")
    letters.forEach((span, i) => {
      if (i === 9) return; // Keep R
      tl.to(span, {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.3");
    });

    // The space also fades
    if (letters[10]) {
      tl.to(letters[10], {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      }, "-=0.4");
    }

    // R slowly falls in slow motion
    if (rRef.current) {
      tl.to(rRef.current, {
        y: 200,
        rotation: 15,
        opacity: 0.9,
        duration: 1.2,
        ease: "power2.in",
      }, "-=0.2");
      // Callback when R is about to hit
      tl.call(() => onRReady?.(), [], "-=0.3");
      // R fades out after shatter
      tl.to(rRef.current, {
        opacity: 0,
        duration: 0.2,
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
    >
      {/* The R is rendered separately for the fall animation */}
      <span
        ref={rRef}
        style={{
          position: "absolute",
          fontFamily: '"Fraunces Variable", ui-serif, Georgia, serif',
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "clamp(3rem, 8vw, 7rem)",
          lineHeight: "1",
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          opacity: 0,
          willChange: "transform",
          pointerEvents: "none",
          zIndex: 10001,
        }}
      >
        R
      </span>
    </div>
  );
}