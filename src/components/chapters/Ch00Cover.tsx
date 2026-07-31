"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portraitImg from "@/assets/portrait.jpg";

function roleCarousel(roles: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = roles[i % roles.length];
    const t = setInterval(() => {
      if (!deleting) {
        if (text.length < word.length) setText((c) => c + word[c.length]);
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (text.length > 0) setText((c) => c.slice(0, -1));
        else { setDeleting(false); setI((n) => n + 1); }
      }
    }, deleting ? 25 : 50);
    return () => clearInterval(t);
  }, [text, deleting, i, roles]);

  return <span>{text}<span className="animate-pulse text-vermilion">|</span></span>;
}

export function Ch00Cover() {
  const { profile } = usePortfolio();

  const roles = (profile?.target_roles as string[]) || ["HR Analytics", "Business Analytics", "AI Strategy", "People Analytics", "Research"];
  const skills = (profile?.hero_skills as string[]) || ["HR Analytics", "Business Analytics", "AI Strategy", "Research", "Power BI", "People Analytics"];
  const tagline = profile?.tagline || "Building the future of work through AI, analytics &amp; human insight.";
  const location = profile?.location || "Bengaluru, India";
  const name = profile?.name || "Manikanta R";
  const status = profile?.availability_status || "Available for collaborations";
  const heroMeta = (profile?.hero_meta as any[]) || [
    { label: "Experience", value: "6+ Years", sub: "Analytics & Operations" },
    { label: "Publications", value: "06", sub: "Papers · SSRN · IJIRT" },
    { label: "Certifications", value: "12", sub: "Microsoft · Google · SAP" },
    { label: "MBA", value: "'27", sub: "HR & Business Analytics" },
  ];
  const ctas = (profile?.ctas as any[]) || [
    { label: "Explore", href: "#about", type: "primary" },
    { label: "Resume", href: "https://manikantar.in/resume.pdf", type: "ghost", download: true },
  ];
  const companies = (profile?.hero_companies as any[]) || [
    { name: "Fizzy Goblet", role: "Senior Customer Service Advisor", current: true },
    { name: "RCM", role: "Store In-Charge", current: false },
  ];

  const [entered, setEntered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });

  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 16);
    mouseY.set(y * 16);
    rotateX.set(y * -8);
    rotateY.set(x * 8);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    window.dispatchEvent(new CustomEvent("mr-hero-entered"));
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="cover"
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#F8F5EF]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* MR Watermark */}
      <motion.div
        className="absolute pointer-events-none select-none text-[clamp(20rem,35vw,40rem)] font-display leading-none opacity-[0.018]"
        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%", fontFamily: "var(--font-display)" }}
        animate={{ x: mouseX, y: mouseY }}
      >
        MR
      </motion.div>

      {/* Radial bloom */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,_rgba(212,106,46,0.06)_0%,_transparent_60%)]" />

      {/* Top-right accent gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none bg-[radial-gradient(circle,_rgba(212,106,46,0.04)_0%,_transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[900px] px-6 sm:px-10 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Portrait — magical layered frame */}
          <motion.div
            className="flex justify-center mb-10 sm:mb-14 relative"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={entered ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.22, 0.8, 0.22, 1] }}
          >
            {/* Outer particle orbit */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "clamp(240px, 34vw, 360px)",
                height: "clamp(240px, 34vw, 360px)",
                border: "1px dashed rgba(212,106,46,0.12)",
                left: "50%", top: "50%",
                x: "-50%", y: "-50%",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            {/* Middle glow ring — follows cursor */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "clamp(220px, 31vw, 330px)",
                height: "clamp(220px, 31vw, 330px)",
                background: "conic-gradient(from var(--angle, 0deg), rgba(212,106,46,0.15), rgba(24,24,24,0.03), rgba(212,106,46,0.15), transparent 70%)",
                left: "50%", top: "50%",
                x: mouseX, y: mouseY,
                filter: "blur(12px)",
                ['--angle' as string]: "0deg",
              }}
            />
            {/* Inner glow */}
            <div className="absolute rounded-full pointer-events-none"
              style={{
                width: "clamp(210px, 29vw, 320px)",
                height: "clamp(210px, 29vw, 320px)",
                background: "radial-gradient(circle, rgba(212,106,46,0.06) 0%, transparent 70%)",
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            {/* Glass reflection overlay */}
            <motion.div
              className="absolute rounded-full pointer-events-none z-10"
              style={{
                width: "clamp(200px, 28vw, 300px)",
                height: "clamp(200px, 28vw, 300px)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)",
                left: "50%", top: "50%",
                x: mouseX, y: mouseY,
              }}
            />
            {/* Portrait image */}
            <motion.div
              className="relative z-5"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
            >
              <div
                className="relative rounded-full overflow-hidden border-2 border-white/25"
                style={{
                  width: "clamp(180px, 24vw, 260px)",
                  height: "clamp(180px, 24vw, 260px)",
                  boxShadow: "0 0 80px rgba(212,106,46,0.08), 0 0 40px rgba(212,106,46,0.04), 0 20px 60px -16px rgba(0,0,0,0.25)",
                }}
              >
                <img src={portraitImg} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]" />
              </div>
            </motion.div>
          </motion.div>

          {/* Live status — below portrait */}
          <motion.div
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-ink/8 shadow-sm -mt-6 mb-6 relative z-20"
            initial={{ opacity: 0, y: 8 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-[10px] font-mono tracking-[0.06em] uppercase text-ink/60">{status || "Available"}</span>
          </motion.div>

          {/* Content — centered below portrait */}
          <div className="w-full">
            {/* Eyebrow */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-vermilion font-semibold">{location}</span>
              <span className="w-6 h-px bg-ink/20" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-ink/30">Portfolio · 2026</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="font-display font-normal text-[clamp(3.5rem,8vw,8rem)] leading-[0.92] tracking-[-0.03em] text-ink"
              initial={{ opacity: 0, y: 16 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              {name.split(" ")[0]}<br />
              <span className="text-vermilion">{name.split(" ").slice(1).join(" ")}</span>
            </motion.h1>

            {/* Rotating specialization */}
            <motion.div
              className="mt-4 font-mono text-[clamp(0.85rem,1.2vw,1rem)] tracking-[0.04em] text-ink/50"
              initial={{ opacity: 0 }}
              animate={entered ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Specializing in{" "}
              <span className="text-ink font-medium">{roleCarousel(roles)}</span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-5 max-w-[38ch] font-display text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.35] text-ink/65"
              initial={{ opacity: 0, y: 8 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              dangerouslySetInnerHTML={{ __html: tagline }}
            />

            {/* Skills pills */}
            <motion.div
              className="mt-6 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {skills.map((s: string) => (
                <span key={s} className="px-4 py-2 rounded-full text-[10.5px] font-mono tracking-[0.04em] border border-ink/12 text-ink/55 hover:border-vermilion/40 hover:text-vermilion hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                  {s}
                </span>
              ))}
            </motion.div>

            {/* Metrics */}
            <motion.div
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.5 }}
            >
              {heroMeta.map((m: any, i: number) => (
                <motion.div
                  key={m.label}
                  className="rounded-xl border border-ink/8 bg-white/50 backdrop-blur-sm p-4 hover:border-ink/15 hover:-translate-y-0.5 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-none text-vermilion">{m.value}</div>
                  <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-ink/40 mt-1">{m.label}</div>
                  <div className="text-[10px] text-ink/35 mt-0.5">{m.sub}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Companies */}
            <motion.div
              className="mt-6 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              {companies.map((c: any) => (
                <div key={c.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-ink/8 bg-white/40 backdrop-blur-sm">
                  <span className="text-[9px] uppercase tracking-[0.15em] font-mono text-ink/35">{c.current ? "Current" : "Previous"}</span>
                  <span className="w-1 h-1 rounded-full bg-ink/20" />
                  <span className="text-[11px] font-medium text-ink/70">{c.name}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              {ctas.map((cta: any) => (
                <motion.a
                  key={cta.label}
                  href={cta.href}
                  download={cta.download}
                  className={`px-6 py-3 rounded-full text-[11px] font-mono tracking-[0.08em] uppercase transition-all duration-300 ${
                    cta.type === "primary"
                      ? "bg-ink text-bone hover:bg-ink/90 hover:shadow-lg hover:shadow-ink/10 hover:-translate-y-0.5"
                      : "border border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink hover:-translate-y-0.5"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cta.label}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
