"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { AmbientParticles } from "./AmbientParticles";
import { FloatingLetters } from "./FloatingLetters";
import portraitCutout from "@/assets/portrait-cutout.png";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitZoomRef = useRef<HTMLDivElement>(null);
  const handwritingRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const shatterParticlesRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const [skipped, setSkipped] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [phase, setPhase] = useState<"letters" | "shatter" | "portrait" | "handwriting" | "final" | "transition">("letters");

  const skip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    gsap.killTweensOf("*");
    onComplete();
  }, [skipped, onComplete]);

  const handleRReady = useCallback(() => {
    setPhase("shatter");
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        x: gsap.utils.random(-6, 6),
        y: gsap.utils.random(-4, 4),
        duration: 0.04,
        repeat: 10,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(containerRef.current, { x: 0, y: 0 }),
      });
    }
    if (shatterParticlesRef.current) {
      const particles = shatterParticlesRef.current;
      gsap.set(particles, { opacity: 1 });
      const els = particles.querySelectorAll(".sp");
      els.forEach((p, i) => {
        const angle = (i / els.length) * Math.PI * 2;
        const dist = 80 + Math.random() * 250;
        gsap.set(p as HTMLElement, { x: 0, y: 0, scale: 1, opacity: 1 });
        gsap.to(p as HTMLElement, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 40,
          rotation: Math.random() * 600 - 300,
          scale: 0, opacity: 0,
          duration: 0.7 + Math.random() * 0.5,
          ease: "power2.out",
          delay: Math.random() * 0.1,
        });
      });
      gsap.to(particles, { opacity: 0, duration: 0.3, delay: 1.0 });
    }
    gsap.delayedCall(0.7, () => setPhase("portrait"));
  }, []);

  const handleLettersComplete = useCallback(() => {}, []);

  useEffect(() => {
    if (phase !== "portrait") return;
    const tl = gsap.timeline({ onComplete: () => setPhase("handwriting") });
    if (portraitRef.current) {
      gsap.set(portraitRef.current, { opacity: 0, scale: 0.8, filter: "blur(20px)" });
      tl.to(portraitRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" });
    }
    if (ringsRef.current) {
      const rings = ringsRef.current.querySelectorAll(".ring-el");
      rings.forEach((ring, i) => {
        const el = ring as HTMLElement;
        gsap.set(el, { scale: 0, opacity: 0 });
        tl.to(el, { scale: 1, opacity: 0.25, duration: 1.5, ease: "power2.out", delay: i * 0.2 }, "-=1.0");
        tl.to(el, { opacity: 0, duration: 0.5, ease: "power2.in" }, "-=0.2");
      });
    }
    return () => { tl.kill(); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "handwriting") return;
    const tl = gsap.timeline({ onComplete: () => setPhase("final") });
    if (handwritingRef.current) {
      const chars = handwritingRef.current.querySelectorAll(".hw-char");
      gsap.set(chars, { opacity: 0 });
      tl.to(chars, { opacity: 1, duration: 0.08, stagger: 0.04, ease: "none" });
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
      }, [], "+=0.3");
      tl.to(handwritingRef.current, { duration: 0.6, ease: "power2.inOut" }, "-=0.3");
    }
    return () => { tl.kill(); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "final") return;
    const tl = gsap.timeline({ onComplete: () => setPhase("transition") });
    if (nameRef.current) {
      gsap.set(nameRef.current, { opacity: 0, y: 20 });
      tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
    }
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 15 });
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
    }
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      tl.to(lineRef.current, { scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.2");
      tl.to(lineRef.current, { opacity: 0.3, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }
    return () => { tl.kill(); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "transition") return;
    const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.2, onComplete) });
    if (portraitZoomRef.current) {
      tl.to(portraitZoomRef.current, { scale: 1.3, duration: 1.0, ease: "power2.inOut" });
    }
    tl.to(containerRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.4");
    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [skip]);

  const hwText = "WELCOME TO MY PORTFOLIO";
  const hwChars = hwText.split("").map((char, i) => (
    <span key={i} className="hw-char" style={{
      fontFamily: '"Caveat", cursive', fontWeight: 500,
      fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#FFFFFF",
      opacity: 0, display: "inline-block",
    }}>{char === " " ? "\u00A0" : char}</span>
  ));

  const shatterParticles = Array.from({ length: 30 }).map((_, i) => (
    <div key={i} className="sp" style={{
      position: "absolute", width: `${2 + Math.random() * 6}px`,
      height: `${2 + Math.random() * 6}px`, backgroundColor: "#FFFFFF",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      opacity: 0, pointerEvents: "none",
    }} />
  ));

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] overflow-hidden" style={{ backgroundColor: "#050505", opacity: 0 }}>
      <AmbientParticles />

      <button ref={skipRef} onClick={skip}
        className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-[10002] px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase rounded-full backdrop-blur-sm transition-all duration-300 ${showSkip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ fontFamily: '"JetBrains Mono", monospace', color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
      >Skip &rarr;</button>

      {(phase === "letters" || phase === "shatter") && (
        <FloatingLetters onRReady={handleRReady} onLettersComplete={handleLettersComplete} />
      )}

      <div ref={shatterParticlesRef} className="fixed inset-0 z-[10001] flex items-center justify-center pointer-events-none" style={{ opacity: 0 }}>
        {shatterParticles}
      </div>

      {(phase === "portrait" || phase === "handwriting" || phase === "final" || phase === "transition") && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center px-4">
          <div ref={portraitRef} className="relative mb-6 sm:mb-8" style={{ width: "clamp(180px, 30vw, 320px)", aspectRatio: "1", borderRadius: "50%", overflow: "hidden", opacity: 0, filter: "blur(20px)", transform: "scale(0.8)" }}>
            <div ref={portraitZoomRef}>
              <img src={portraitCutout} alt="Manikanta R" draggable={false} style={{ width: "112%", height: "112%", objectFit: "cover", objectPosition: "50% 18%", position: "absolute", left: "-6%", top: "-6%", filter: "grayscale(0.05) contrast(1.02)" }} />
            </div>
          </div>

          <div ref={ringsRef} className="absolute" style={{ width: "clamp(220px, 35vw, 380px)", aspectRatio: "1", borderRadius: "50%", pointerEvents: "none" }}>
            <div className="ring-el" style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "1px solid rgba(59,130,246,0.15)", opacity: 0, transform: "scale(0)" }} />
            <div className="ring-el" style={{ position: "absolute", inset: "-20px", borderRadius: "50%", border: "1px solid rgba(139,92,246,0.1)", opacity: 0, transform: "scale(0)" }} />
            <div className="ring-el" style={{ position: "absolute", inset: "-30px", borderRadius: "50%", border: "1px dashed rgba(34,211,238,0.08)", opacity: 0, transform: "scale(0)" }} />
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }} viewBox="0 0 1000 800">
            <line x1="200" y1="100" x2="500" y2="300" stroke="rgba(59,130,246,0.06)" strokeWidth="1" />
            <line x1="800" y1="150" x2="500" y2="300" stroke="rgba(139,92,246,0.06)" strokeWidth="1" />
            <line x1="300" y1="600" x2="500" y2="400" stroke="rgba(34,211,238,0.05)" strokeWidth="1" />
            <line x1="700" y1="650" x2="500" y2="400" stroke="rgba(59,130,246,0.05)" strokeWidth="1" />
            <circle cx="500" cy="300" r="3" fill="rgba(59,130,246,0.15)" />
            <circle cx="200" cy="100" r="2" fill="rgba(139,92,246,0.1)" />
            <circle cx="800" cy="150" r="2" fill="rgba(34,211,238,0.1)" />
            <circle cx="300" cy="600" r="2" fill="rgba(59,130,246,0.08)" />
            <circle cx="700" cy="650" r="2" fill="rgba(139,92,246,0.08)" />
          </svg>

          <div ref={handwritingRef} className="text-center mb-4" style={{ fontFamily: '"Caveat", cursive', fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#FFFFFF", letterSpacing: "0.05em" }}>
            {hwChars}
          </div>

          <div ref={nameRef} className="text-center" style={{ fontFamily: '"Fraunces Variable", ui-serif, Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.8rem, 4vw, 3.5rem)", color: "#FFFFFF", letterSpacing: "-0.02em", opacity: 0, transform: "translateY(20px)" }}>
            Manikanta R
          </div>

          <div ref={lineRef} className="h-px mt-4 mb-4" style={{ width: "clamp(120px, 20vw, 240px)", background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.4), transparent)", transform: "scaleX(0)", opacity: 0 }} />

          <div ref={taglineRef} className="text-center max-w-[40ch]" style={{ fontFamily: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif', fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", lineHeight: 1.6, opacity: 0, transform: "translateY(15px)" }}>
            Researcher &bull; HR & Business Analytics &bull; AI &bull; Data Intelligence
          </div>
        </div>
      )}

      <div className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 z-[10002] ${showSkip ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.1)" }}>
          <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <span>Space or Esc to skip</span>
          <span className="w-8 sm:w-10 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
        </div>
      </div>
    </div>
  );
}