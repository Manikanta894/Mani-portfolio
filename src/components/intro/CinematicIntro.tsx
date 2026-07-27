"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { AmbientParticles } from "./AmbientParticles";
import portraitCutout from "@/assets/portrait-cutout.png";

/**
 * CinematicIntro — PORTRAIT REVEAL.
 * Black background. Portrait emerges from a circle.
 * "Manikanta" + "R." reveals like the hero section.
 * Smooth transition to homepage.
 */
export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const nameRow1Ref = useRef<HTMLDivElement>(null);
  const nameRow2Ref = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
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

    // 1. Quick fade in from black
    tl.set(containerRef.current, { autoAlpha: 1 });
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });

    // 2. Portrait — starts as tiny circle, expands
    if (portraitWrapRef.current) {
      gsap.set(portraitWrapRef.current, {
        scale: 0,
        opacity: 0,
        filter: "blur(8px)",
      });
      tl.to(portraitWrapRef.current, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
      });
    }

    // 3. "Manikanta" — drops in from above, Fraunces italic
    if (nameRow1Ref.current) {
      gsap.set(nameRow1Ref.current, {
        opacity: 0,
        y: -40,
        scale: 0.8,
      });
      tl.to(nameRow1Ref.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.3");
    }

    // 4. "R." — drops in from right with vermilion flash
    if (nameRow2Ref.current) {
      gsap.set(nameRow2Ref.current, {
        opacity: 0,
        x: 40,
        scale: 0.6,
      });
      tl.to(nameRow2Ref.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)",
      }, "-=0.2");
    }

    // 5. Tagline
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 15 });
      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "+=0.1");
    }

    // 6. Brief pause to breathe
    tl.to({}, { duration: 0.5 });

    // 7. Fade out entire intro
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
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

  return (
    <>
      <AmbientParticles />

      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          opacity: 0,
          backgroundColor: "#000000",
        }}
      >
        {/* Skip button */}
        <button
          ref={skipRef}
          onClick={skip}
          className={`fixed top-6 right-6 z-[10000] px-4 py-2 text-[11px] tracking-[0.2em] uppercase rounded-full backdrop-blur-sm transition-all duration-300 ${
            showSkip ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: "rgba(245, 241, 235, 0.4)",
            border: "1px solid rgba(245, 241, 235, 0.12)",
          }}
        >
          Skip &rarr;
        </button>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center gap-6 relative w-full px-4">
          {/* Portrait — circular reveal */}
          <div
            ref={portraitWrapRef}
            className="relative"
            style={{
              width: "clamp(200px, 28vw, 360px)",
              aspectRatio: "1",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 0 0 4px rgba(212,106,46,0.15), 0 0 60px rgba(212,106,46,0.08)",
              opacity: 0,
              transform: "scale(0)",
            }}
          >
            <img
              src={portraitCutout}
              alt="Manikanta R"
              draggable={false}
              style={{
                width: "112%",
                height: "112%",
                objectFit: "cover",
                objectPosition: "50% 18%",
                position: "absolute",
                left: "-6%",
                top: "-6%",
                filter: "grayscale(0.1) contrast(1.02)",
              }}
            />
          </div>

          {/* Name — matches hero section exactly */}
          <div className="flex flex-col items-center text-center">
            <h1
              className="flex flex-row flex-wrap items-baseline justify-center"
              style={{ columnGap: "0.22em" }}
              aria-label="Manikanta R"
            >
              <div
                ref={nameRow1Ref}
                style={{
                  fontFamily: '"Instrument Serif", "Fraunces Variable", ui-serif, Georgia, serif',
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(48px, 7.2vw, 128px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#F5F1EB",
                  opacity: 0,
                  transform: "translateY(-40px) scale(0.8)",
                }}
              >
                Manikanta
              </div>
              <div
                ref={nameRow2Ref}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  fontFamily: '"Instrument Serif", "Fraunces Variable", ui-serif, Georgia, serif',
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(48px, 7.2vw, 128px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#F5F1EB",
                  opacity: 0,
                  transform: "translateX(40px) scale(0.6)",
                }}
              >
                <span style={{ fontSize: "1.02em" }}>R</span>
                <span style={{ color: "#D46A2E", marginLeft: "0.06em", fontStyle: "italic" }}>.</span>
              </div>
            </h1>
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            style={{
              fontFamily: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif',
              fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)",
              letterSpacing: "0.02em",
              opacity: 0,
              transform: "translateY(15px)",
              color: "rgba(200, 194, 184, 0.6)",
              maxWidth: "34ch",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Turning workforce & business data into decisions leaders can act on
          </div>
        </div>

        {/* Bottom skip hint */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            showSkip ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(245, 241, 235, 0.15)" }}>
            <span className="w-10 h-px" style={{ backgroundColor: "rgba(245, 241, 235, 0.1)" }} />
            <span>Space or Esc to skip</span>
            <span className="w-10 h-px" style={{ backgroundColor: "rgba(245, 241, 235, 0.1)" }} />
          </div>
        </div>
      </div>
    </>
  );
}