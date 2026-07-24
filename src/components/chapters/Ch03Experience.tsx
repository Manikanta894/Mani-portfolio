"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

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
  const opacity = useTransform(scrollYProgress, [a - 0.08, a + 0.02], [0.35, 1]);
  return (
    <motion.li
      style={{ opacity }}
      className="text-display text-[clamp(1.15rem,1.7vw,1.45rem)] leading-tight text-bone"
    >
      <span className="text-mono mr-3 text-meta text-vermilion">
        {String(i + 1).padStart(2, "0")}
      </span>
      {label}
    </motion.li>
  );
}

function EvolutionRail({ evolution }: { evolution: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const fillH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="relative">
      <div className="text-mono mb-5 text-[0.8rem] uppercase tracking-[0.22em] text-bone/50">
        Evolution
      </div>
      <div className="relative grid grid-cols-[12px_1fr] gap-x-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-bone/15" />
          <motion.div
            style={{ height: fillH }}
            className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-vermilion"
          />
        </div>
        <ul className="flex flex-col gap-5">
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 25%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0.4, 1, 1, 0.5]);

  return (
    <motion.article
      ref={ref}
      style={{ opacity }}
      className="relative border-t border-bone/15 pt-12"
    >
      <div className="text-mono mb-8 flex items-center gap-3 text-[0.8rem] text-vermilion">
        <span>Chapter {String(index + 1).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-bone/15" />
        <span className="text-bone/50">{r.span}</span>
      </div>

      <div className="grid grid-cols-12 gap-x-6 gap-y-8">
        <header className="col-span-12 md:col-span-5">
          <div className="text-mono text-[0.85rem] uppercase tracking-[0.22em] text-bone/55">
            {r.company} · {r.city}
          </div>
          <h3 className="text-display mt-3 text-[clamp(2.4rem,4.2vw,3.8rem)] leading-[1.04] text-bone">
            <MaskReveal>{r.role}</MaskReveal>
          </h3>
          <p className="mt-6 text-[1.15rem] leading-relaxed text-bone/75">
            {r.context}
          </p>
        </header>

        <div className="col-span-12 md:col-span-7 md:border-l md:border-bone/10 md:pl-10">
          <div className="text-mono mb-4 text-[0.8rem] uppercase tracking-[0.22em] text-vermilion">
            What I built here
          </div>
          <ul className="space-y-3 text-[1.05rem] leading-relaxed text-bone/80">
            {(r.achievements || []).map((a: string, j: number) => (
              <li key={j} className="flex gap-3">
                <span className="text-bone/30">·</span>
                {a}
              </li>
            ))}
          </ul>

          {r.lesson && (
            <div className="mt-8 border-l-2 border-vermilion/70 pl-5">
              <p className="text-display text-[clamp(1.15rem,1.8vw,1.45rem)] italic leading-snug text-bone">
                {"\u201C"}{r.lesson}{"\u201D"}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Ch03Experience() {
  const { experience } = usePortfolio();
  const roles = experience?.length ? experience : [];
  const evolution: string[] = [
    "Operations", "Customer Experience", "Leadership", "Business Thinking",
    "Analytics", "Research", "AI & Business Strategy",
  ];

  return (
    <section id="experience" data-mood="ink" className="relative chapter-pad grain">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="text-mono text-[0.85rem] text-bone/55">
              /03 — From the retail floor to research
            </div>
            <h2 className="text-display mt-4 text-[clamp(3rem,6.5vw,5.8rem)] leading-[0.96] text-bone">
              <MaskReveal>The Journey That Built Me</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7">
            <Reveal>
              <p className="text-display text-balance text-[clamp(1.25rem,2vw,1.75rem)] italic leading-snug text-bone/85">
                Everything I know about analytics started long before dashboards. It started on the retail floor — where every customer interaction became a lesson in human behavior, every stockout a lesson in systems, and every shift a quiet seminar in business.
              </p>
            </Reveal>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-x-10 gap-y-16">
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-28">
              <EvolutionRail evolution={evolution} />
            </div>
          </aside>

          <div className="col-span-12 space-y-20 md:col-span-9">
            {roles.map((r: any, i: number) => (
              <RoleSpread key={r.company || i} r={r} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-24 border-t border-bone/15 pt-12">
          <Reveal>
            <p className="text-display text-balance text-[clamp(1.5rem,2.8vw,2.6rem)] italic leading-snug text-bone">
              {"\u201C"}The questions I asked on the retail floor eventually became research questions. That is how this chapter ends — and how the next one begins.{"\u201D"}
            </p>
            <a
              href="#research"
              className="text-mono mt-8 inline-flex items-center gap-2 border-b border-bone/40 pb-1 text-[0.8rem] uppercase tracking-[0.22em] text-bone hover:text-vermilion"
            >
              Continue to research ↓
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}