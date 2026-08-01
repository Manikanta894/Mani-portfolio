"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portraitImg from "@/assets/portrait.jpg";

const GREETINGS = ["Hello.", "ನಮಸ್ಕಾರ.", "नमस्ते.", "హలో.", "வணக்கம்.", "Welcome."];
const TAGS = "HR Analytics • Business Analytics • AI Strategy • Research • Power BI • People Analytics";

export function Ch00Cover() {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";
  const intro = profile?.tagline || "Building intelligent solutions where AI, Business Analytics and Human Insight come together.";
  const location = profile?.location || "Bengaluru, India";
  const status = profile?.availability_status || "Open for Collaboration";
  const heroMeta = (profile?.hero_meta as any[]) || [
    { label: "Research Publications", value: "06" },
    { label: "MBA", value: "'27", sub: "HR & Business Analytics" },
    { label: "Availability", value: "Open", sub: "For Collaboration" },
  ];
  const companies = (profile?.hero_companies as any[]) || [
    { name: "Fizzy Goblet", role: "Senior Customer Service Advisor", current: true },
    { name: "RCM", role: "Store In-Charge", current: false },
  ];
  const ctas = (profile?.ctas as any[]) || [
    { label: "Explore Journey", href: "#about", type: "primary" },
    { label: "Let's Connect", href: "#linkedin", type: "ghost" },
    { label: "Resume", href: "https://manikantar.in/resume.pdf", type: "ghost", download: true },
  ];

  const [entered, setEntered] = useState(false);
  const [greetIdx, setGreetIdx] = useState(0);
  const [greetOut, setGreetOut] = useState(false);

  // Greeting carousel
  useEffect(() => {
    const t = setInterval(() => {
      setGreetOut(true);
      setTimeout(() => { setGreetIdx((i) => (i + 1) % GREETINGS.length); setGreetOut(false); }, 400);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useTransform(useSpring(rx, { stiffness: 60, damping: 20 }), [-1, 1], [-3, 3]);
  const rotateY = useTransform(useSpring(ry, { stiffness: 60, damping: 20 }), [-1, 1], [3, -3]);
  const portraitX = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const portraitY = useTransform(my, [-0.5, 0.5], [-8, 8]);
  const mrX = useTransform(mx, [-0.5, 0.5], [-15, 15]);
  const mrY = useTransform(my, [-0.5, 0.5], [-15, 15]);

  const containerRef = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x); my.set(y); rx.set(x); ry.set(y);
  }, []);

  useEffect(() => { setTimeout(() => setEntered(true), 200); }, []);

  const stagger = (d: number) => ({ initial: { opacity: 0, y: 16 }, animate: entered ? { opacity: 1, y: 0 } : {}, transition: { delay: d, duration: 0.6, ease: [0.16, 1, 0.3, 1] } });

  return (
    <section ref={containerRef} onMouseMove={onMove} id="cover" className="relative min-h-screen flex items-center overflow-hidden bg-[#F7F4EC] select-none">
      {/* MR Watermark */}
      <motion.div className="absolute pointer-events-none text-[clamp(18rem,32vw,38rem)] font-display italic leading-none text-[#1E1E1E]/[0.015]" style={{ top: "50%", left: "50%", x: "-50%", y: "-50%", fontFamily: "var(--font-display)" }} animate={{ x: mrX, y: mrY }}>MR</motion.div>

      {/* Ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,_rgba(212,120,46,0.04)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(212,120,46,0.02)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1300px] px-6 sm:px-10 lg:px-14 py-20 lg:py-0 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
          {/* LEFT — Text content */}
          <div className="lg:col-span-7">
            {/* Multilingual greeting */}
            <motion.div className="h-8 mb-3 overflow-hidden" {...stagger(0.05)}>
              <motion.span
                className="text-[13px] font-display italic tracking-[0.08em] text-[#8A8578]"
                animate={greetOut ? { opacity: 0, y: -10, filter: "blur(2px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >{GREETINGS[greetIdx]}</motion.span>
            </motion.div>

            {/* Editorial info */}
            <motion.div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[#8A8578]/50 mb-6" {...stagger(0.1)}>
              <span>📍 {location}</span>
              <span className="text-[#8A8578]/25">·</span>
              <span>Edition · 2026</span>
            </motion.div>

            {/* Name */}
            <motion.h1 className="font-display italic text-[clamp(3.4rem,7.5vw,8rem)] leading-[0.92] tracking-[-0.02em] text-[#1E1E1E]" {...stagger(0.15)}>
              {name.split(" ")[0]}<br /><span className="text-[#D9782E]">{name.split(" ").slice(1).join(" ")}.</span>
            </motion.h1>

            {/* Professional intro */}
            <motion.p className="mt-3 max-w-[44ch] text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.4] text-[#8A8578]" style={{ fontFamily: "var(--font-display)" }} {...stagger(0.25)}>
              {intro}
            </motion.p>

            {/* Specialization line */}
            <motion.div className="mt-5 text-[11px] font-mono uppercase tracking-[0.15em] text-[#8A8578]/60" {...stagger(0.35)}>
              <span className="text-[#D9782E] tracking-[0.2em] font-medium mr-2">Specializing in</span>
              {TAGS}
            </motion.div>

            {/* Buttons */}
            <motion.div className="mt-7 flex flex-wrap gap-3" {...stagger(0.45)}>
              {ctas.map((cta: any) => (
                <motion.a key={cta.label} href={cta.href} download={cta.download}
                  className={`px-6 py-3 rounded-full text-[11px] font-mono tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-0.5 ${
                    cta.type === "primary" ? "bg-[#1E1E1E] text-[#F7F4EC] hover:bg-[#1E1E1E]/90 hover:shadow-lg" : "border border-[#1E1E1E]/15 text-[#1E1E1E]/60 hover:border-[#1E1E1E]/30 hover:text-[#1E1E1E]"
                  }`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>{cta.label}</motion.a>
              ))}
            </motion.div>

            {/* Metric cards */}
            <motion.div className="mt-8 flex flex-wrap gap-3" {...stagger(0.55)}>
              {heroMeta.map((m: any) => (
                <motion.div key={m.label} className="rounded-xl border border-[#1E1E1E]/6 bg-white/40 backdrop-blur-sm px-4 py-3 hover:border-[#D9782E]/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300" whileHover={{ scale: 1.02 }}>
                  <div className="font-display text-[clamp(1.4rem,1.8vw,1.6rem)] leading-none text-[#D9782E]">{m.value}</div>
                  <div className="text-[9px] uppercase tracking-[0.12em] font-mono text-[#8A8578]/60 mt-0.5">{m.label}</div>
                  {m.sub && <div className="text-[9px] text-[#8A8578]/40 mt-0.5">{m.sub}</div>}
                </motion.div>
              ))}
            </motion.div>

            {/* Companies */}
            <motion.div className="mt-5 flex flex-wrap gap-2" {...stagger(0.65)}>
              {companies.map((c: any) => (
                <div key={c.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E1E1E]/6 bg-white/30 backdrop-blur-sm">
                  <span className="text-[9px] uppercase tracking-[0.12em] font-mono text-[#8A8578]/50">{c.current ? "Current" : "Previous"}</span>
                  <span className="w-1 h-1 rounded-full bg-[#8A8578]/30" />
                  <span className="text-[11px] font-medium text-[#1E1E1E]/70">{c.name}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Portrait */}
          <motion.div className="lg:col-span-5 flex justify-center lg:justify-end relative" {...stagger(0.2)}>
            <motion.div className="relative" style={{ x: portraitX, y: portraitY }}>
              {/* Accent ring */}
              <motion.div className="absolute rounded-full pointer-events-none" style={{ width: "clamp(260px,34vw,360px)", height: "clamp(260px,34vw,360px)", left: "50%", top: "50%", x: "-50%", y: "-50%", border: "1px dashed rgba(212,120,46,0.06)" }}
                animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} />
              {/* Cursor glow */}
              <motion.div className="absolute rounded-full pointer-events-none" style={{ width: "clamp(230px,30vw,330px)", height: "clamp(230px,30vw,330px)", background: "radial-gradient(circle, rgba(212,120,46,0.06) 0%, transparent 55%)", left: "50%", top: "50%" }}
                animate={{ x: portraitX, y: portraitY }} />
              {/* Portrait with 3D tilt */}
              <motion.div className="relative" style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}>
                <div className="absolute -inset-3 rounded-full bg-[conic-gradient(from_200deg,_rgba(212,120,46,0.25),_rgba(30,30,30,0.04),_rgba(212,120,46,0.25))] blur-sm opacity-25" />
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-10" />
                <div className="relative w-[clamp(200px,26vw,300px)] h-[clamp(200px,26vw,300px)] rounded-full overflow-hidden border-[8px] border-[#F0EAD9] shadow-[0_0_60px_rgba(212,120,46,0.06),0_20px_50px_-16px_rgba(0,0,0,0.15)]">
                  <img src={portraitImg} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.08)] pointer-events-none" />
                </div>
              </motion.div>
              {/* Status */}
              <motion.div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-[#1E1E1E]/6 shadow-sm z-10" {...stagger(0.7)}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-mono tracking-[0.04em] uppercase text-[#8A8578]">{status}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#8A8578]/40">Scroll</span>
        <motion.svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-[#8A8578]/30" animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <path d="M7 1v12M3 9l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
