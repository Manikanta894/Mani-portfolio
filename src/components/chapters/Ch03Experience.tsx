"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

function normalizeExperience(raw: any) {
  return {
    ...raw,
    span: raw.span || (raw.start_date ? `${raw.start_date} — ${raw.current ? "Present" : (raw.end_date || "")}` : raw.duration),
    city: raw.city || raw.location,
    context: raw.context || raw.description,
    achievements: (raw.achievements && raw.achievements.length) ? raw.achievements : (Array.isArray(raw.highlights) ? raw.highlights : []),
    lesson: raw.lesson || null,
  };
}

function EvolutionStep({
  scrollYProgress,
  i,
  total,
  label,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  i: number;
  total: number;
  label: string;
}) {
  const a = i / Math.max(1, total - 1);
  const opacity = useTransform(scrollYProgress, [a - 0.06, a + 0.02], [0.3, 1]);
  const x = useTransform(scrollYProgress, [a - 0.06, a + 0.02], [4, 0]);
  return (
    <motion.li
      style={{ opacity, x }}
      className="flex items-baseline gap-3 text-bone/80"
    >
      <span className="text-mono text-[0.7rem] font-medium tabular-nums text-vermilion w-5 shrink-0 text-right">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="text-[0.95rem] leading-snug">{label}</span>
    </motion.li>
  );
}

function EvolutionRail({ evolution }: { evolution: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });
  const fillH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="relative">
      <div className="text-mono mb-6 text-[0.7rem] uppercase tracking-[0.24em] text-bone/40">
        Career Evolution
      </div>
      <div className="relative pl-7">
        <div className="absolute left-[9px] top-1.5 bottom-1.5 w-px bg-bone/12 rounded-full" />
        <motion.div
          style={{ height: fillH }}
          className="absolute left-[9px] top-1.5 w-px rounded-full bg-gradient-to-b from-vermilion to-vermilion/30 shadow-[0_0_8px_var(--vermilion)]"
        />
        <ul className="flex flex-col gap-4">
          {evolution.map((step, i) => (
            <EvolutionStep
              key={step}
              scrollYProgress={scrollYProgress}
              i={i}
              total={evolution.length}
              label={step}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoleSpread({ r, index }: { r: any; index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const num = String(index + 1).padStart(2, "0");

  return (
    <article ref={ref} className="relative group">
      {/* Large editorial number */}
      <span
        aria-hidden
        className="absolute -left-3 -top-6 text-[clamp(6rem,10vw,10rem)] leading-none text-bone/[0.025] select-none pointer-events-none transition-colors duration-500 group-hover:text-bone/[0.05]"
        style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
      >
        {num}
      </span>

      <div className="relative border-t border-bone/10 pt-12 transition-colors duration-500 group-hover:border-bone/20">
        {/* Chapter header row */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-mono text-[0.7rem] uppercase tracking-[0.22em] text-vermilion font-medium">
            Chapter {num}
          </span>
          <span className="h-px flex-1 bg-bone/10" />
          <span className="text-mono text-[0.7rem] tracking-[0.18em] text-bone/40 uppercase">
            {r.span}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          <header className="col-span-12 md:col-span-5">
            <div className="text-mono text-[0.75rem] uppercase tracking-[0.18em] text-bone/45 mb-4">
              {r.company}{r.city ? ` · ${r.city}` : ""}
            </div>
            <h3 className="text-display text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.04] text-bone">
              <MaskReveal>{r.role}</MaskReveal>
            </h3>
            <p className="mt-6 text-[1.15rem] leading-relaxed text-bone/65 max-w-[52ch]">
              {r.context}
            </p>
          </header>

          <div className="col-span-12 md:col-span-7 md:pl-8 md:border-l md:border-bone/8">
            <div className="text-mono mb-5 text-[0.75rem] uppercase tracking-[0.2em] text-vermilion/80">
              Impact & contributions
            </div>
            <ul className="space-y-4 text-[1.12rem] leading-relaxed text-bone/75">
              {(r.achievements || []).map((a: string, j: number) => (
                <li key={j} className="flex gap-3">
                  <span className="text-vermilion shrink-0 mt-[0.15em]">+</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>

            {r.lesson && (
              <div className="mt-8 rounded-lg border border-bone/8 bg-bone/[0.03] px-6 py-5">
                <div className="text-mono text-[0.7rem] uppercase tracking-[0.2em] text-vermilion/60 mb-2">
                  What I learned
                </div>
                <p className="text-[1.02rem] italic leading-relaxed text-bone/70">
                  {"\u201C"}{r.lesson}{"\u201D"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Ch03Experience() {
  const { experience } = usePortfolio();
  const roles = (experience?.length ? experience : []).map(normalizeExperience);
  const evolution: string[] = [
    "Operations", "Customer Experience", "Leadership", "Business Thinking",
    "Analytics", "Research", "AI & Business Strategy",
  ];

  return (
    <section id="experience" data-mood="ink" className="relative chapter-pad">
      <div className="mx-auto max-w-7xl">
        <header className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="text-mono text-[0.75rem] uppercase tracking-[0.22em] text-bone/40 mb-5">
              /03 — From the retail floor to research
            </div>
            <h2 className="text-display text-[clamp(3rem,6.5vw,5.8rem)] leading-[0.94] text-bone">
              <MaskReveal>The Journey That Built Me</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:pt-2">
            <Reveal>
              <p className="text-[clamp(1.1rem,1.6vw,1.4rem)] italic leading-relaxed text-bone/70 max-w-[52ch]">
                Everything I know about analytics started long before dashboards. It started on the retail floor — where every customer interaction became a lesson in human behavior, every stockout a lesson in systems, and every shift a quiet seminar in business.
              </p>
            </Reveal>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-x-10 gap-y-12">
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-28">
              <EvolutionRail evolution={evolution} />
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9">
            <div className="space-y-16">
              {roles.map((r: any, i: number) => (
                <RoleSpread key={r.company || i} r={r} index={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-28 border-t border-bone/10 pt-14">
          <Reveal>
            <p className="text-display text-balance text-[clamp(1.4rem,2.4vw,2.2rem)] italic leading-snug text-bone/80 max-w-[48ch]">
              {"\u201C"}The questions I asked on the retail floor eventually became research questions. That is how this chapter ends — and how the next one begins.{"\u201D"}
            </p>
            <a
              href="#research"
              className="text-mono mt-8 inline-flex items-center gap-2 border-b border-bone/25 pb-1 text-[0.7rem] uppercase tracking-[0.22em] text-bone/60 hover:text-vermilion hover:border-vermilion/50 transition-colors duration-300"
            >
              Continue to research
              <span className="text-vermilion">↓</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
