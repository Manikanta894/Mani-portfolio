"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import MRMonogram, { type MRMonogramHandle } from "./MRMonogram";
import { AmbientParticles } from "./AmbientParticles";

/**
 * CinematicIntro — LIGHT THEME VERSION.
 * Matches website light theme:
 *   - bg: #F8F5EF (bone)
 *   - text: #181818 (ink)
 *   - accent: #D46A2E (vermilion)
 *   - secondary: #555555 (graphite)
 *
 * Fast ~4s intro. Skip with Space/Esc/Enter.
 */
export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<MRMonogramHandle>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const logoSmallRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const animRef = useRef<gsap.core.Timeline | null>(null);

  const skip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    animRef.current?.kill();
    onComplete();
  }, [skipped, onComplete]);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1200);

    const tl = gsap.timeline({
      onComplete: () => gsap.delayedCall(0.1, onComplete),
    });

    animRef.current = tl;

    // 1. Quick fade in
    tl.set(containerRef.current, { autoAlpha: 1 });
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power2.out" });

    // 2. M drops from above
    tl.add(monogramRef.current?.dominateM() || gsap.timeline(), "+=0.15");

    // 3. R bursts from right
    tl.add(monogramRef.current?.burstR() || gsap.timeline(), "-=0.1");

    // 4. Quick vermilion flash
    if (flashOverlayRef.current) {
      tl.set(flashOverlayRef.current, { opacity: 0 });
      tl.to(flashOverlayRef.current, { opacity: 0.2, duration: 0.08, ease: "none" });
      tl.to(flashOverlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.out" });
    }

    // 5. Lock monogram
    tl.add(monogramRef.current?.lockMonogram() || gsap.timeline(), "-=0.05");

    // 6. Brief pause
    tl.to({}, { duration: 0.4 });

    // 7. "Welcome to My Portfolio"
    if (welcomeRef.current) {
      tl.fromTo(
        welcomeRef.current,
        { opacity: 0, y: 20, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
      );
    }

    // 8. "MANIKANTA R" — letters drop in
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll(".intro-char");
      tl.to(chars, {
        opacity: 1, y: 0, scale: 1, rotation: 0,
        duration: 0.35, stagger: 0.04, ease: "back.out(2)",
      }, "-=0.15");
    }

    // 9. Tagline
    if (taglineRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "+=0.05"
      );
    }

    // 10. Logo shrinks
    if (logoSmallRef.current) {
      tl.to(logoSmallRef.current, {
        scale: 0.2, opacity: 0,
        duration: 0.5, ease: "power2.inOut",
      }, "+=0.2");
    }

    // 11. Fade out
    tl.to(containerRef.current, {
      opacity: 0, duration: 0.4, ease: "power2.inOut",
    });

    return () => {
      clearTimeout(skipTimer);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard skip
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [skip]);

  // Build letter-by-letter name
  const name = "MANIKANTA R";
  const nameChars = name.split("").map((char, i) => (
    <span
      key={i}
      className="intro-char inline-block"
      style={{
        opacity: 0,
        transform: "translateY(-40px) scale(0.4) rotate(-10deg)",
        fontFamily: '"Fraunces Variable", ui-serif, Georgia, serif',
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: "clamp(3rem, 6vw, 5.5rem)",
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        color: "#181818",
        textShadow: "0 0 40px rgba(212, 106, 46, 0.25)",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <>
      <AmbientParticles />

      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          opacity: 0,
          backgroundColor: "#F8F5EF",
        }}
      >
        {/* Vermilion flash overlay */}
        <div
          ref={flashOverlayRef}
          className="fixed inset-0 z-[10001] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(212,106,46,0.15), transparent 70%)",
            opacity: 0,
          }}
        />

        {/* Skip button */}
        <button
          ref={skipRef}
          onClick={skip}
          className={`fixed top-6 right-6 z-[10000] px-4 py-2 text-[11px] tracking-[0.2em] uppercase rounded-full backdrop-blur-sm transition-all duration-300 ${
            showSkip ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "rgba(24, 24, 24, 0.4)",
            border: "1px solid rgba(24, 24, 24, 0.12)",
          }}
        >
          Skip &rarr;
        </button>

        {/* Main content — centered */}
        <div className="flex flex-col items-center justify-center gap-3 relative w-full px-4">
          {/* Monogram — BIG and CENTERED */}
          <div ref={logoSmallRef} className="flex items-center justify-center w-full">
            <MRMonogram ref={monogramRef} size={500} />
          </div>

          {/* Typography */}
          <div className="flex flex-col items-center text-center mt-3 gap-1.5">
            <div
              ref={welcomeRef}
              className="tracking-[0.35em] text-[clamp(0.75rem,1.2vw,1rem)]"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                textTransform: "uppercase",
                letterSpacing: "0.35em",
                opacity: 0,
                color: "#D46A2E",
              }}
            >
              Welcome to My Portfolio
            </div>

            <div ref={nameRef} className="flex flex-wrap justify-center">
              {nameChars}
            </div>

            <div
              ref={taglineRef}
              className="mt-2 max-w-[40ch] text-center leading-relaxed"
              style={{
                fontFamily: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif',
                fontSize: "clamp(0.8rem, 1.1vw, 1rem)",
                letterSpacing: "0.03em",
                opacity: 0,
                color: "rgba(24, 24, 24, 0.5)",
              }}
            >
              Building the Future of HR through AI & Analytics
            </div>
          </div>
        </div>

        {/* Bottom skip hint */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            showSkip ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(24, 24, 24, 0.2)" }}>
            <span className="w-10 h-px" style={{ backgroundColor: "rgba(24, 24, 24, 0.12)" }} />
            <span>Space or Esc to skip</span>
            <span className="w-10 h-px" style={{ backgroundColor: "rgba(24, 24, 24, 0.12)" }} />
          </div>
        </div>
      </div>
    </>
  );
}