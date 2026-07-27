"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { AmbientParticles } from "./AmbientParticles";
import { FloatingLetters } from "./FloatingLetters";
import portraitCutout from "@/assets/portrait-cutout.png";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitZoomRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subNameRef = useRef<HTMLDivElement>(null);
  const handwritingRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [showLetters, setShowLetters] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const skip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    gsap.killTweensOf("*");
    onComplete();
  }, [skipped, onComplete]);

  // Initial fade in
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" });
  }, []);

  // When R shatters, show portrait below name
  const handleRReady = useCallback(() => {
    // Camera shake
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: gsap.utils.random(-3, 3),
        y: gsap.utils.random(-2, 2),
        duration: 0.03,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(containerRef.current, { x: 0, y: 0 }),
      });
    }
    // Show the content (portrait + name below)
    gsap.delayedCall(0.2, () => {
      setShowLetters(false);
      setShowContent(true);
    });
  }, []);

  // Content reveal animation
  useEffect(() => {
    if (!showContent) return;
    const tl = gsap.timeline();

    // Portrait pops in
    if (portraitWrapRef.current) {
      gsap.set(portraitWrapRef.current, { opacity: 0, scale: 0.3, filter: "blur(10px)" });
      tl.to(portraitWrapRef.current, {
        opacity: 1, scale: 1, filter: "blur(0px)",
        duration: 0.5, ease: "back.out(2)",
      });
    }

    // "Manikanta R" name below portrait
    if (nameRef.current) {
      gsap.set(nameRef.current, { opacity: 0, y: 20 });
      tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
    }

    // Handwriting
    if (handwritingRef.current) {
      const chars = handwritingRef.current.querySelectorAll(".hw-char");
      gsap.set(chars, { opacity: 0 });
      tl.to(chars, { opacity: 1, duration: 0.04, stagger: 0.025, ease: "none" }, "+=0.1");
      tl.call(() => {
        if (handwritingRef.current) {
          const el = handwritingRef.current;
          el.style.fontFamily = '"Fraunces Variable", ui-serif, Georgia, serif';
          el.style.fontStyle = "italic";
          el.style.fontWeight = "400";
          el.style.fontSize = "clamp(1.2rem, 2.5vw, 2rem)";
          el.style.letterSpacing = "0.15em";
          el.style.color = "#FFFFFF";
        }
      }, [], "+=0.1");
      tl.to({}, { duration: 0.15 });
    }

    // Tagline
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 10 });
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.15");
    }
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      tl.to(lineRef.current, { scaleX: 1, opacity: 1, duration: 0.3, ease: "power3.out" }, "-=0.15");
      tl.to(lineRef.current, { opacity: 0.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }

    // Transition out
    if (portraitZoomRef.current) {
      tl.to(portraitZoomRef.current, { scale: 1.15, duration: 0.5, ease: "power2.inOut" }, "+=0.3");
    }
    tl.to(containerRef.current, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.15");
    tl.call(() => onComplete(), [], "+=0.05");

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showContent]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onComplete]);

  const hwText = "WELCOME TO MY PORTFOLIO";
  const hwChars = hwText.split("").map((char, i) => (
    <span key={i} className="hw-char" style={{
      fontFamily: '"Caveat", cursive', fontWeight: 500,
      fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#FFFFFF",
      opacity: 0, display: "inline-block",
    }}>{char === " " ? "\u00A0" : char}</span>
  ));

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-hidden" style={{ backgroundColor: "#050505", opacity: 0 }}>
      <AmbientParticles />

      <button onClick={skip}
        className={`fixed top-4 right-4 z-[10002] px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full backdrop-blur-sm transition-all duration-300 ${showSkip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ fontFamily: '"JetBrains Mono", monospace', color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
      >Skip &rarr;</button>

      {showLetters && <FloatingLetters onRReady={handleRReady} />}

      {showContent && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center px-4">
          {/* Portrait */}
          <div ref={portraitWrapRef} className="relative mb-4" style={{ width: "clamp(160px, 28vw, 300px)", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", opacity: 0, transform: "scale(0.3)", filter: "blur(10px)" }}>
            <div ref={portraitZoomRef}>
              <img src={portraitCutout} alt="" draggable={false} style={{ width: "112%", height: "112%", objectFit: "cover", objectPosition: "50% 18%", position: "absolute", left: "-6%", top: "-6%" }} />
            </div>
          </div>

          {/* Name below portrait */}
          <div ref={nameRef} className="text-center mb-3" style={{ fontFamily: '"Fraunces Variable", ui-serif, Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 3.5vw, 3rem)", color: "#FFFFFF", letterSpacing: "-0.02em", opacity: 0, transform: "translateY(20px)" }}>
            Manikanta R
          </div>

          {/* Handwriting */}
          <div ref={handwritingRef} className="text-center mb-3">{hwChars}</div>

          <div ref={lineRef} className="h-px mb-3" style={{ width: "clamp(100px, 18vw, 200px)", background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)", transform: "scaleX(0)", opacity: 0 }} />

          <div ref={taglineRef} className="text-center max-w-[36ch]" style={{ fontFamily: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif', fontSize: "clamp(0.65rem, 1vw, 0.9rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", lineHeight: 1.5, opacity: 0, transform: "translateY(10px)" }}>
            Researcher &bull; HR & Business Analytics &bull; AI &bull; Data Intelligence
          </div>
        </div>
      )}

      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 z-[10002] ${showSkip ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 text-[9px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.1)" }}>
          <span className="w-8 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <span>Skip</span>
          <span className="w-8 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </div>
  );
}