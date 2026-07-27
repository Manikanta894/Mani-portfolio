"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { AmbientParticles } from "./AmbientParticles";
import portraitCutout from "@/assets/portrait-cutout.png";

/**
 * CinematicIntro — PORTRAIT REVEAL · ~5 seconds.
 *
 * Black background. Portrait emerges. "Manikanta" welcomes you.
 * "R." slides in. Tagline appears. Smooth → homepage.
 * Fully responsive for mobile.
 */
export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const nameRow1Ref = useRef<HTMLDivElement>(null);
  const nameRow2Ref = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
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
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);

    const tl = gsap.timeline({
      onComplete: () => gsap.delayedCall(0.15, onComplete),
    });

    animRef.current = tl;

    // 1. Fade in from black
    tl.set(containerRef.current, { autoAlpha: 1 });
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });

    // 2. Portrait — tiny circle expands outward
    if (portraitWrapRef.current) {
      gsap.set(portraitWrapRef.current, { scale: 0, opacity: 0, filter: "blur(10px)" });
      tl.to(portraitWrapRef.current, {
        scale: 1, opacity: 1, filter: "blur(0px)",
        duration: 1.0, ease: "power3.out",
      });
    }

    // 3. "Manikanta" — drops in from above
    if (nameRow1Ref.current) {
      gsap.set(nameRow1Ref.current, { opacity: 0, y: -50, scale: 0.7 });
      tl.to(nameRow1Ref.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, ease: "power3.out",
      }, "-=0.4");
    }

    // 4. "R." — slides in from right
    if (nameRow2Ref.current) {
      gsap.set(nameRow2Ref.current, { opacity: 0, x: 50, scale: 0.5 });
      tl.to(nameRow2Ref.current, {
        opacity: 1, x: 0, scale: 1,
        duration: 0.5, ease: "back.out(2)",
      }, "-=0.25");
    }

    // 5. "Welcome to My Portfolio" — appears below name
    if (welcomeRef.current) {
      gsap.set(welcomeRef.current, { opacity: 0, y: 15, filter: "blur(4px)" });
      tl.to(welcomeRef.current, {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.5, ease: "power2.out",
      }, "+=0.1");
    }

    // 6. Tagline
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 12 });
      tl.to(taglineRef.current, {
        opacity: 1, y: 0,
        duration: 0.4, ease: "power2.out",
      }, "-=0.1");
    }

    // 7. Pause — let everything breathe (~5s total)
    tl.to({}, { duration: 0.8 });

    // 8. Fade out
    tl.to(containerRef.current, {
      opacity: 0, duration: 0.5, ease: "power2.inOut",
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
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden px-4"
        style={{ opacity: 0, backgroundColor: "#000000" }}
      >
        {/* Skip button */}
        <button
          ref={skipRef}
          onClick={skip}
          className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-[10000] px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase rounded-full backdrop-blur-sm transition-all duration-300 ${
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
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 relative w-full max-w-2xl mx-auto">
          {/* Portrait — circular reveal */}
          <div
            ref={portraitWrapRef}
            className="relative"
            style={{
              width: "clamp(160px, 35vw, 360px)",
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

          {/* Name + Welcome */}
          <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
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
                  fontSize: "clamp(36px, 8vw, 128px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#F5F1EB",
                  opacity: 0,
                  transform: "translateY(-50px) scale(0.7)",
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
                  fontSize: "clamp(36px, 8vw, 128px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#F5F1EB",
                  opacity: 0,
                  transform: "translateX(50px) scale(0.5)",
                }}
              >
                <span style={{ fontSize: "1.02em" }}>R</span>
                <span style={{ color: "#D46A2E", marginLeft: "0.06em", fontStyle: "italic" }}>.</span>
              </div>
            </h1>

            <div
              ref={welcomeRef}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "clamp(0.65rem, 1.1vw, 0.9rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#D46A2E",
                opacity: 0,
                filter: "blur(4px)",
                transform: "translateY(15px)",
              }}
            >
              Welcome to My Portfolio
            </div>
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            style={{
              fontFamily: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif',
              fontSize: "clamp(0.75rem, 1.2vw, 1.05rem)",
              letterSpacing: "0.02em",
              opacity: 0,
              transform: "translateY(12px)",
              color: "rgba(200, 194, 184, 0.5)",
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
          className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            showSkip ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(245, 241, 235, 0.15)" }}>
            <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: "rgba(245, 241, 235, 0.1)" }} />
            <span>Space or Esc to skip</span>
            <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: "rgba(245, 241, 235, 0.1)" }} />
          </div>
        </div>
      </div>
    </>
  );
}