"use client";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

export function Ch11Philosophy() {
  const { profile } = usePortfolio();
  const philosophyData = profile?.philosophy || {
    number: "08",
    title: "Personal Philosophy",
    quote: "I didn't start with a plan. I started with curiosity about why businesses worked the way they did — and a notebook full of questions. The analytics came later. The discipline came from necessity. The direction came from paying attention.",
    pillars: [
      { n: "01", name: "Self-Built", body: "Balanced full-time work alongside every academic and research milestone — no shortcuts, no inheritance of access." },
      { n: "02", name: "Disciplined", body: "Studied after shifts. Researched on weekends. Built the habit before the credentials caught up." },
      { n: "03", name: "Long-Term", body: "Building a five-year foundation, not chasing a quarter. Compounding over performing." },
    ],
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);

  return (
    <section id="philosophy" data-mood="ink" className="relative chapter-pad" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="text-mono text-meta text-bone/55">
          /{philosophyData.number} · Personal Philosophy
        </div>
        <h2 className="sr-only">Personal Philosophy</h2>

        <Reveal>
          <blockquote className="mt-12 max-w-4xl text-display text-[clamp(1.6rem,3.4vw,2.8rem)] italic leading-[1.18] text-bone">
            <span className="text-vermilion">{"\u201C"}</span>
            <MaskReveal>{philosophyData.quote}</MaskReveal>
            <span className="text-vermilion">{"\u201D"}</span>
          </blockquote>
        </Reveal>

        <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {philosophyData.pillars.map((p: any, i: number) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 22 }} className="group relative overflow-hidden rounded-[2px] border border-bone/10 bg-gradient-to-b from-bone/[0.04] to-transparent p-8 pt-10 backdrop-blur-sm">
                <span className="absolute left-0 top-0 h-px w-12 bg-vermilion transition-all duration-500 group-hover:w-full" />
                <svg viewBox="0 0 60 180" className="pointer-events-none absolute right-4 top-6 h-40 w-12 opacity-25 transition-opacity duration-500 group-hover:opacity-60" aria-hidden>
                  <motion.rect x="4" y="4" width="52" height="8" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-bone" style={{ pathLength: draw }} />
                  <motion.rect x="16" y="16" width="28" height="140" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-bone" style={{ pathLength: draw }} />
                  {[22, 28, 34, 40].map((x) => (
                    <motion.line key={x} x1={x} y1="20" x2={x} y2="152" stroke="currentColor" strokeWidth="0.4" className="text-bone/60" style={{ pathLength: draw }} />
                  ))}
                  <motion.rect x="2" y="160" width="56" height="10" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-bone" style={{ pathLength: draw }} />
                </svg>
                <div className="text-mono text-eyebrow tracking-[0.25em] text-bone/45">PILLAR · {p.n}</div>
                <div className="relative mt-6">
                  <span className="text-display block text-[5.5rem] leading-none text-vermilion">{p.n}</span>
                  <span className="pointer-events-none absolute inset-0 -z-10 select-none text-[5.5rem] leading-none text-vermilion/20 blur-2xl">{p.n}</span>
                </div>
                <h3 className="text-display mt-4 text-[1.9rem] italic leading-tight text-bone">{p.name}</h3>
                <div className="mt-5 h-px w-10 bg-bone/25 transition-all duration-500 group-hover:w-20 group-hover:bg-vermilion" />
                <p className="mt-5 text-[0.95rem] leading-relaxed text-bone/70">{p.body}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}