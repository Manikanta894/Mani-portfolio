"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portraitImg from "@/assets/portrait.jpg";

function SpecCarousel({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = items[i % items.length];
    const t = setInterval(() => {
      if (!deleting) {
        if (char < word.length) setChar((c) => c + 1);
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (char > 0) setChar((c) => c - 1);
        else { setDeleting(false); setI((n) => n + 1); }
      }
    }, deleting ? 22 : 50);
    return () => clearInterval(t);
  }, [char, deleting, i, items]);

  return <span className="inline-block min-w-[1ch]">{items[i % items.length].slice(0, char)}<span className="animate-pulse text-vermilion">|</span></span>;
}

export function Ch00Cover() {
  const { profile } = usePortfolio();

  const roles = (profile?.target_roles as string[]) || ["HR Analytics", "Business Analytics", "AI Strategy", "People Analytics", "Research"];
  const skills = (profile?.hero_skills as string[]) || ["HR Analytics", "Business Analytics", "AI Strategy", "Research", "Power BI", "People Analytics"];
  const tagline = profile?.tagline || "Building intelligent systems where business, AI and human insight intersect.";
  const location = profile?.location || "Bengaluru, India";
  const name = profile?.name || "Manikanta R";
  const status = profile?.availability_status || "Open for Collaboration";
  const heroMeta = (profile?.hero_meta as any[]) || [
    { label: "Publications", value: "04", sub: "Research Papers" },
    { label: "Experience", value: "3+", sub: "Years" },
    { label: "MBA", value: "'27", sub: "HR & Business Analytics" },
    { label: "Availability", value: "Open", sub: "For Collaboration" },
  ];
  const ctas = (profile?.ctas as any[]) || [
    { label: "Explore Journey", href: "#about", type: "primary" },
    { label: "View Research", href: "#research", type: "ghost" },
    { label: "Resume", href: "https://manikantar.in/resume.pdf", type: "ghost", download: true },
  ];

  const [entered, setEntered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300);
    window.dispatchEvent(new CustomEvent("mr-hero-entered"));
    return () => clearTimeout(t);
  }, []);

  const stagger = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: entered ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.6, ease: [0.22, 0.8, 0.22, 1] },
  });

  return (
    <section ref={containerRef} onMouseMove={onMouseMove} id="cover" className="relative min-h-screen flex items-center overflow-hidden bg-[#F8F5EF]">
      {/* MR Watermark — parallax */}
      <motion.div
        className="absolute pointer-events-none select-none text-[clamp(18rem,30vw,36rem)] font-display leading-none text-ink/[0.015]"
        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%", fontFamily: "var(--font-display)" }}
        animate={{ x: mouseX, y: mouseY }}
      >
        MR
      </motion.div>

      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,_rgba(212,106,46,0.05)_0%,_transparent_60%)]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none bg-[radial-gradient(circle,_rgba(212,106,46,0.03)_0%,_transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1300px] px-6 sm:px-10 lg:px-14 py-20 lg:py-0 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
          {/* LEFT — Text */}
          <div className="lg:col-span-7">
            <motion.div className="flex items-center gap-3 mb-6" {...stagger(0.1)}>
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-vermilion font-semibold">{location}</span>
              <span className="w-6 h-px bg-ink/20" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-ink/30">Portfolio · 2026</span>
            </motion.div>

            <motion.h1 className="font-display font-normal text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.9] tracking-[-0.025em] text-ink mb-1" {...stagger(0.2)}>
              {name.split(" ")[0]}<br />
              <span className="text-vermilion">{name.split(" ").slice(1).join(" ")}</span>
            </motion.h1>

            <motion.p className="mt-3 max-w-[40ch] font-display text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.35] text-ink/60" {...stagger(0.3)}>
              {tagline}
            </motion.p>

            <motion.div className="mt-4 font-mono text-[clamp(0.85rem,1.1vw,1rem)] tracking-[0.03em] text-ink/45" {...stagger(0.4)}>
              Specializing in{" "}
              <span className="text-ink font-medium"><SpecCarousel items={roles} /></span>
            </motion.div>

            <motion.div className="mt-6 flex flex-wrap gap-2" {...stagger(0.5)}>
              {skills.slice(0, 6).map((s: string) => (
                <span key={s} className="px-4 py-2 rounded-full text-[10.5px] font-mono tracking-[0.03em] border border-ink/12 text-ink/55 hover:border-vermilion/40 hover:text-vermilion hover:-translate-y-0.5 transition-all duration-200 cursor-default">{s}</span>
              ))}
            </motion.div>

            <motion.div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3" {...stagger(0.6)}>
              {heroMeta.map((m: any, i: number) => (
                <motion.div key={m.label} className="rounded-xl border border-ink/8 bg-white/50 backdrop-blur-sm p-4 hover:border-vermilion/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-vermilion/5 transition-all duration-300" whileHover={{ scale: 1.03 }}>
                  <div className="font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-none text-vermilion">{m.value}</div>
                  <div className="text-[9px] uppercase tracking-[0.14em] font-mono text-ink/40 mt-1">{m.label}</div>
                  <div className="text-[10px] text-ink/35 mt-0.5">{m.sub}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="mt-8 flex flex-wrap gap-3" {...stagger(0.7)}>
              {ctas.map((cta: any) => (
                <motion.a key={cta.label} href={cta.href} download={cta.download}
                  className={`px-6 py-3.5 rounded-full text-[11px] font-mono tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-0.5 ${
                    cta.type === "primary"
                      ? "bg-ink text-bone hover:bg-ink/90 hover:shadow-xl hover:shadow-ink/10"
                      : "border border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
                  }`}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >{cta.label}</motion.a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Portrait */}
          <motion.div className="lg:col-span-5 flex justify-center lg:justify-end relative" {...stagger(0.15)}>
            <div className="relative">
              {/* Rotating accent ring */}
              <motion.div className="absolute rounded-full pointer-events-none"
                style={{ width: "clamp(260px, 34vw, 360px)", height: "clamp(260px, 34vw, 360px)", left: "50%", top: "50%", x: "-50%", y: "-50%", border: "1.5px dashed rgba(212,106,46,0.08)" }}
                animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              {/* Cursor glow */}
              <motion.div className="absolute rounded-full pointer-events-none"
                style={{ width: "clamp(230px, 30vw, 330px)", height: "clamp(230px, 30vw, 330px)", background: "radial-gradient(circle, rgba(212,106,46,0.08) 0%, transparent 55%)", left: "50%", top: "50%" }}
                animate={{ x: mouseX, y: mouseY }}
              />
              {/* Portrait with subtle rotation */}
              <motion.div className="relative"
                animate={{ rotateY: entered ? mouseX : 0, rotateX: entered ? mouseY : 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                <div className="absolute -inset-3 rounded-full bg-[conic-gradient(from_200deg,_rgba(212,106,46,0.3),_rgba(24,24,24,0.05),_rgba(212,106,46,0.3))] blur-sm opacity-30" />
                <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none z-10" />
                <div className="relative w-[clamp(200px,26vw,300px)] h-[clamp(200px,26vw,300px)] rounded-full overflow-hidden border-2 border-white/30 shadow-[0_0_70px_rgba(212,106,46,0.08),0_20px_50px_-16px_rgba(0,0,0,0.18)]">
                  <img src={portraitImg} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.15)]" />
                </div>
              </motion.div>
              {/* Status badge */}
              <motion.div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-ink/8 shadow-sm z-10" {...stagger(0.65)}>
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
                <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-ink/60">{status}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
