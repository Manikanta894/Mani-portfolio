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
  const handwritingRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const shatterRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [showLetters, setShowLetters] = useState(true);
  const [showPortrait, setShowPortrait] = useState(false);

  const skip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    gsap.killTweensOf("*");
    onComplete();
  }, [skipped, onComplete]);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" });
  }, []);

  const handleRReady = useCallback(() => {
    // Camera shake
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: gsap.utils.random(-4, 4),
        y: gsap.utils.random(-3, 3),
        duration: 0.03,
        repeat: 6,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(containerRef.current, { x: 0, y: 0 }),
      });
    }
    // Shatter particles burst
    if (shatterRef.current) {
      const particles = shatterRef.current;
      gsap.set(particles, { opacity: 1 });
      const els = particles.querySelectorAll(".sp");
      els.forEach((p, i) => {
        const angle = (i / els.length) * Math.PI * 2;
        const dist = 60 + Math.random() * 150;
        const el = p as HTMLElement;
        gsap.set(el, { x: 0, y: 0, scale: 1, opacity: 1 });
        gsap.to(el, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 20,
          rotation: Math.random() * 400 - 200,
          scale: 0, opacity: 0,
          duration: 0.4 + Math.random() * 0.3,
          ease: "power2.out",
          delay: Math.random() * 0.05,
        });
      });
      gsap.to(particles, { opacity: 0, duration: 0.2, delay: 0.5 });
    }
    // Show portrait quickly
    gsap.delayedCall(0.3, () => {
      setShowLetters(false);
      setShowPortrait(true);
    });
  }, []);

  // Portrait reveal — fast and magical
  useEffect(() => {
    if (!showPortrait) return;
    const tl = gsap.timeline();

    // Portrait pops in with elastic scale
    if (portraitWrapRef.current) {
      gsap.set(portraitWrapRef.current, { opacity: 0, scale: 0.3, filter: "blur(10px)" });
      tl.to(portraitWrapRef.current, {
        opacity: 1, scale: 1, filter: "blur(0px)",
        duration: 0.5, ease: "back.out(2)",
      });
    }

    // Rings expand fast
    if (ringsRef.current) {
      const rings = ringsRef.current.querySelectorAll(".ring-el");
      rings.forEach((ring, i) => {
        const el = ring as HTMLElement;
        gsap.set(el, { scale: 0, opacity: 0 });
        tl.to(el, { scale: 1, opacity: 0.15, duration: 0.6, ease: "power2.out" }, "-=0.3");
        tl.to(el, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1");
      });
    }

    // Handwriting — faster
    if (handwritingRef.current) {
      const chars = handwritingRef.current.querySelectorAll(".hw-char");
      gsap.set(chars, { opacity: 0 });
      tl.to(chars, { opacity: 1, duration: 0.04, stagger: 0.025, ease: "none" });
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
      }, [], "+=0.15");
      tl.to({}, { duration: 0.15 });
    }

    // Name + tagline
    if (nameRef.current) {
      gsap.set(nameRef.current, { opacity: 0, y: 15 });
      tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 10 });
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.15");
    }
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      tl.to(lineRef.current, { scaleX: 1, opacity: 1, duration: 0.35, ease: "power3.out" }, "-=0.15");
      tl.to(lineRef.current, { opacity: 0.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }

    // Zoom + transition out
    if (portraitZoomRef.current) {
      tl.to(portraitZoomRef.current, { scale: 1.15, duration: 0.5, ease: "power2.inOut" }, "+=0.3");
    }
    tl.to(containerRef.current, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.15");
    tl.call(() => onComplete(), [], "+=0.05");

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPortrait]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1000);
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

  const shatterParticles = Array.from({ length: 20 }).map((_, i) => (
    <div key={i} className="sp" style={{
      position: "absolute", width: `${2 + Math.random() * 4}px`,
      height: `${2 + Math.random() * 4}px`, backgroundColor: "#FFFFFF",
      borderRadius: Math.random() > 0.5 ? "50%" : "1px",
      opacity: 0, pointerEvents: "none",
    }} />
  ));

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-hidden" style={{ backgroundColor: "#050505", opacity: 0 }}>
      <AmbientParticles />

      <button onClick={skip}
        className={`fixed top-4 right-4 z-[10002] px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full backdrop-blur-sm transition-all duration-300 ${showSkip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ fontFamily: '"JetBrains Mono", monospace', color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
      >Skip &rarr;</button>

      {showLetters && <FloatingLetters onRReady={handleRReady} />}

      <div ref={shatterRef} className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
        {shatterParticles}
      </div>

      {showPortrait && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center px-4">
          <div ref={portraitWrapRef} className="relative mb-6" style={{ width: "clamp(180px, 30vw, 320px)", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", opacity: 0, transform: "scale(0.3)", filter: "blur(10px)" }}>
            <div ref={portraitZoomRef}>
              <img src={portraitCutout} alt="" draggable={false} style={{ width: "112%", height: "112%", objectFit: "cover", objectPosition: "50% 18%", position: "absolute", left: "-6%", top: "-6%" }} />
            </div>
          </div>

          <div ref={ringsRef} className="absolute" style={{ width: "clamp(220px, 35vw, 380px)", aspectRatio: "1", borderRadius: "50%", pointerEvents: "none" }}>
            <div className="ring-el" style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "1px solid rgba(59,130,246,0.12)", opacity: 0, transform: "scale(0)" }} />
            <div className="ring-el" style={{ position: "absolute", inset: "-20px", borderRadius: "50%", border: "1px solid rgba(139,92,246,0.08)", opacity: 0, transform: "scale(0)" }} />
          </div>

          <div ref={handwritingRef} className="text-center mb-4">{hwChars}</div>

          <div ref={nameRef} className="text-center" style={{ fontFamily: '"Fraunces Variable", ui-serif, Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.8rem, 4vw, 3.5rem)", color: "#FFFFFF", letterSpacing: "-0.02em", opacity: 0, transform: "translateY(15px)" }}>
            Manikanta R
          </div>

          <div ref={lineRef} className="h-px mt-3 mb-3" style={{ width: "clamp(120px, 20vw, 240px)", background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)", transform: "scaleX(0)", opacity: 0 }} />

          <div ref={taglineRef} className="text-center max-w-[40ch]" style={{ fontFamily: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif', fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", lineHeight: 1.6, opacity: 0, transform: "translateY(10px)" }}>
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