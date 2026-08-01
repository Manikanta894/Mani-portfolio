"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

function normalize(raw: any) {
  return {
    ...raw,
    span: raw.span || (raw.start_date ? `${raw.start_date} — ${raw.current ? "Present" : raw.end_date || ""}` : raw.duration),
    city: raw.city || raw.location,
    context: raw.context || raw.description,
    achievements: (raw.achievements?.length ? raw.achievements : (Array.isArray(raw.highlights) ? raw.highlights : [])),
    lesson: raw.lesson || null,
  };
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const num = parseInt(value) || 0;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = () => {
      start += 16;
      const p = Math.min(start / duration, 1);
      setDisplay(Math.round(num * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, num]);
  return <span ref={ref}>{display}</span>;
}

function MetricCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <motion.div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center backdrop-blur-sm hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="font-display text-[clamp(2rem,2.6vw,2.4rem)] leading-none text-vermilion">
        <AnimatedNumber value={value} />{suffix}
      </div>
      <div className="text-[11px] uppercase tracking-[0.12em] font-mono text-white/50 mt-1.5">{label}</div>
    </motion.div>
  );
}

function ChapterCard({ r, index }: { r: any; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  const chapterNames = ["The Foundation", "Leading Operations"];
  const chapterName = chapterNames[index] || `Chapter ${num}`;

  return (
    <motion.article className="relative group"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.22, 0.8, 0.22, 1] }}>
      
      {/* Watermark number */}
      <span className="absolute -left-2 -top-4 text-[clamp(6rem,10vw,10rem)] leading-none text-white/[0.025] select-none pointer-events-none font-display transition-all duration-700 group-hover:text-white/[0.04]">{num}</span>

      <div className="relative border-t border-white/10 pt-12 group-hover:border-white/18 transition-all duration-500">
        {/* Chapter header */}
        <div className="flex items-center gap-4 mb-10">
          <div>
            <span className="font-mono text-[0.9rem] uppercase tracking-[0.12em] text-vermilion font-semibold">{chapterName}</span>
            <div className="text-[0.7rem] font-mono tracking-[0.1em] text-white/40 mt-0.5 uppercase">Chapter {num}</div>
          </div>
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[0.9rem] tracking-[0.08em] text-white/55 font-medium tabular-nums">{r.span}</span>
        </div>

        <div className="grid grid-cols-12 gap-x-10 gap-y-10">
          {/* Left: Role + context */}
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[0.9rem] uppercase tracking-[0.08em] text-white/55 font-medium">{r.company}</span>
              {r.city && <><span className="text-white/20">·</span><span className="font-mono text-[0.8rem] text-white/45">{r.city}</span></>}
            </div>
            <h3 className="font-display text-[clamp(2.6rem,4.5vw,4.4rem)] leading-[1.04] text-white font-normal group-hover:text-vermilion transition-colors duration-500">
              <MaskReveal>{r.role}</MaskReveal>
            </h3>
            <p className="mt-6 text-[1.1rem] leading-[1.75] text-white/80 max-w-[50ch]">{r.context}</p>
          </div>

          {/* Right: Impact */}
          <div className="col-span-12 md:col-span-7 md:pl-10 md:border-l md:border-white/8">
            {r.achievements.length > 0 && (
              <>
                <div className="font-mono mb-6 text-[0.9rem] uppercase tracking-[0.14em] text-vermilion font-semibold">What I built here</div>
                <ul className="space-y-4">
                  {r.achievements.map((a: string, j: number) => (
                    <motion.li key={j} className="flex gap-3 text-[1.1rem] leading-[1.7] text-white/80"
                      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + j * 0.08 }}>
                      <span className="text-vermilion shrink-0 mt-[0.2em] text-base">+</span>
                      <span>{a}</span>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}

            {r.lesson && (
              <div className="mt-10 rounded-xl border border-white/8 bg-white/[0.03] px-6 py-5">
                <div className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-vermilion/80 font-semibold mb-2">Lesson learned</div>
                <p className="text-[1rem] italic leading-relaxed text-white/80">{"\u201C"}{r.lesson}{"\u201D"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Ch03Experience() {
  const { experience, profile } = usePortfolio();
  const roles = (experience?.length ? experience : []).map(normalize);

  return (
    <section id="experience" className="relative chapter-pad bg-[#14110F] text-[#F5F1EB]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="font-mono text-[0.85rem] uppercase tracking-[0.14em] text-white/55 font-medium mb-5">/03 — From the retail floor to research</div>
            <h2 className="font-display text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.94] text-white font-normal"><MaskReveal>The Journey That Built Me</MaskReveal></h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:pt-2">
            <Reveal>
              <p className="text-[clamp(1.1rem,1.6vw,1.4rem)] italic leading-relaxed text-white/80 max-w-[52ch]">
                Everything I know about analytics started long before dashboards. It started on the retail floor — where every customer interaction became a lesson in human behavior, every stockout a lesson in systems, and every shift a quiet seminar in business.
              </p>
            </Reveal>
          </div>
        </header>

        {/* Career metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20">
          <MetricCard label="Years Experience" value="3" suffix="+" />
          <MetricCard label="Organizations" value="2" />
          <MetricCard label="Career Progression" value="2" />
          <MetricCard label="Leadership Roles" value="2" />
        </div>

        {/* Chapters */}
        <div className="space-y-20">
          {roles.map((r: any, i: number) => (<ChapterCard key={r.company || i} r={r} index={i} />))}
        </div>

        {/* Ending transition */}
        <div className="mt-32 border-t border-white/10 pt-16 text-center">
          <Reveal>
            <p className="font-display text-balance text-[clamp(1.4rem,2.2vw,2rem)] italic leading-snug text-white/85 max-w-[48ch] mx-auto">
              Every experience shaped the way I solve problems today.
            </p>
            <motion.a href="#work" className="font-mono mt-8 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[0.9rem] uppercase tracking-[0.12em] text-white/70 hover:text-vermilion hover:border-vermilion font-medium transition-colors duration-300"
              whileHover={{ x: 4 }}>
              Continue to Projects
              <span className="text-vermilion">→</span>
            </motion.a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
