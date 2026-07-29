"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import MRMonogram, { type MRMonogramHandle } from "./MRMonogram";
import { AmbientParticles } from "./AmbientParticles";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<MRMonogramHandle>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const logoSmallRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
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
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    const tl = gsap.timeline({
      onComplete: () => gsap.delayedCall(0.1, onComplete),
    });

    animRef.current = tl;

    tl.set(containerRef.current, { autoAlpha: 1 });

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });

    if (scanlineRef.current) {
      tl.fromTo(scanlineRef.current, { y: "-100%" }, { y: "100%", duration: 0.8, ease: "power2.inOut" }, "-=0.2");
    }

    tl.add(monogramRef.current?.dominateM() || gsap.timeline(), "+=0.2");

    tl.add(monogramRef.current?.burstR() || gsap.timeline(), "-=0.1");

    if (flashOverlayRef.current) {
      tl.set(flashOverlayRef.current, { opacity: 0 });
      tl.to(flashOverlayRef.current, { opacity: 0.35, duration: 0.1, ease: "none" });
      tl.to(flashOverlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }

    tl.add(monogramRef.current?.lockMonogram() || gsap.timeline(), "-=0.05");

    tl.to({}, { duration: 0.3 });

    if (welcomeRef.current) {
      tl.fromTo(
        welcomeRef.current,
        { opacity: 0, y: 15, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }

    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll(".intro-char");
      tl.to(chars, {
        opacity: 1, y: 0, scale: 1, rotation: 0,
        duration: 0.4, stagger: 0.035, ease: "back.out(2.5)",
      }, "-=0.15");
    }

    if (taglineRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        "+=0.05"
      );
    }

    if (logoSmallRef.current) {
      tl.to(logoSmallRef.current, {
        scale: 0.15, opacity: 0,
        duration: 0.5, ease: "power2.inOut",
      }, "+=0.2");
    }

    tl.to(containerRef.current, {
      opacity: 0, duration: 0.5, ease: "power2.inOut",
    });

    return () => {
      clearTimeout(skipTimer);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [skip]);

  const name = "MANIKANTA R";
  const nameChars = name.split("").map((char, i) => (
    <span
      key={i}
      className="intro-char inline-block"
      style={{
        opacity: 0,
        transform: "translateY(-50px) scale(0.3) rotate(-15deg)",
        fontFamily: '"Fraunces Variable", ui-serif, Georgia, serif',
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: "clamp(3rem, 6vw, 5.5rem)",
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        color: "#F5F1EB",
        textShadow: "0 0 30px rgba(212, 106, 46, 0.35), 0 0 60px rgba(212, 106, 46, 0.15)",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <>
      <AmbientParticles count={100} colors={false} />

      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          opacity: 0,
          backgroundColor: "#0E0E10",
        }}
      >
        <div
          ref={vignetteRef}
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        <div
          ref={scanlineRef}
          className="fixed inset-0 z-[9997] pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(245,241,235,0.03) 50%, transparent 100%)",
            height: "100%",
          }}
        />

        <div
          ref={flashOverlayRef}
          className="fixed inset-0 z-[10001] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(212,106,46,0.25), transparent 60%)",
            opacity: 0,
          }}
        />

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

        <div className="flex flex-col items-center justify-center gap-3 relative w-full px-4">
          <div ref={logoSmallRef} className="flex items-center justify-center w-full">
            <MRMonogram ref={monogramRef} size={500} />
          </div>

          <div className="flex flex-col items-center text-center mt-3 gap-1.5">
            <div
              ref={welcomeRef}
              className="tracking-[0.35em] text-[clamp(0.7rem,1vw,0.9rem)]"
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
                fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
                letterSpacing: "0.03em",
                opacity: 0,
                color: "rgba(245, 241, 235, 0.45)",
              }}
            >
              Building the Future of HR through AI &amp; Analytics
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
            showSkip ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(245, 241, 235, 0.2)" }}>
            <span className="w-10 h-px" style={{ backgroundColor: "rgba(245, 241, 235, 0.1)" }} />
            <span>Space or Esc to skip</span>
            <span className="w-10 h-px" style={{ backgroundColor: "rgba(245, 241, 235, 0.1)" }} />
          </div>
        </div>
      </div>
    </>
  );
}
