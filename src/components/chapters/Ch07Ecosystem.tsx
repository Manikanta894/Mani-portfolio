"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const DOMAINS: { id: string; label: string; accent: string }[] = [
  { id: "Analytics", label: "Analytics", accent: "#E0533D" },
  { id: "Artificial Intelligence", label: "AI & ML", accent: "#7C5CFF" },
  { id: "People & HR", label: "People & HR", accent: "#3DA9FC" },
  { id: "Business", label: "Business", accent: "#F2B33D" },
  { id: "Leadership", label: "Leadership", accent: "#E0533D" },
  { id: "Technology", label: "Technology", accent: "#3DA9FC" },
  { id: "Research", label: "Research", accent: "#7C5CFF" },
  { id: "Visualization", label: "Visualization", accent: "#F2B33D" },
];

const STAGES: Record<string, { label: string; level: number }> = {
  "Learning": { label: "Learning", level: 1 },
  "Practicing": { label: "Practicing", level: 2 },
  "Applying": { label: "Applying", level: 3 },
  "Researching": { label: "Researching", level: 4 },
  "Teaching": { label: "Teaching", level: 5 },
  "Leading": { label: "Leading", level: 6 },
};

type Cap = { id: string; name: string; domain: string; stage: string };

export function Ch07Ecosystem() {
  const { capabilities: apiCaps } = usePortfolio();
  const caps = (apiCaps?.length ? apiCaps : []) as Cap[];

  const byDomain = useMemo(() => {
    const m = new Map<string, Cap[]>();
    DOMAINS.forEach((d) => m.set(d.id, []));
    caps.forEach((c) => {
      const domain = DOMAINS.find((d) => d.id === c.domain) ? c.domain : null;
      if (domain) m.get(domain)?.push(c);
    });
    return m;
  }, [caps]);

  const totalCaps = caps.length;
  const applyingPlus = caps.filter((c) => ["Applying", "Researching", "Teaching", "Leading"].includes(c.stage)).length;
  const domainsWithSkills = DOMAINS.filter((d) => (byDomain.get(d.id) || []).length > 0).length;

  return (
    <section id="ecosystem" className="relative chapter-pad text-ink">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-mono text-[0.8rem] uppercase tracking-[0.2em] text-ink/40 mb-5">
            <span className="text-vermilion font-medium">05</span>
            <span className="w-8 h-px bg-ink/20" />
            Capabilities
          </div>
          <h2 className="font-display font-normal text-[clamp(3.8rem,8vw,7rem)] leading-[0.9] tracking-[-0.02em]">
            Professional Operating System
          </h2>
          <p className="mt-6 text-[1.15rem] text-ink/55 max-w-[64ch]">
            Every capability tracked — where learned, where applied — connected across research, projects, certifications and experience.
          </p>
        </header>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          {[
            { label: "Skills", value: totalCaps },
            { label: "At Applying+", value: applyingPlus },
            { label: "Domains", value: domainsWithSkills },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-6 text-center hover:border-ink/15 hover:-translate-y-0.5 transition-all duration-300"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="font-display text-[clamp(2.8rem,4.5vw,3.8rem)] leading-none text-vermilion">{s.value}</div>
              <div className="text-xs uppercase tracking-[0.14em] font-mono text-ink/40 mt-2">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Domain grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOMAINS.map((d, di) => {
            const items = byDomain.get(d.id) || [];
            if (items.length === 0) return null;
            return (
              <motion.div
                key={d.id}
                className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-6 sm:p-7 hover:border-ink/20 hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: di * 0.06, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.accent }} />
                  <h3 className="font-display text-xl">{d.label}</h3>
                  <span className="text-xs font-mono text-ink/35 ml-auto">{items.length} skills</span>
                </div>

                {/* Stage dots */}
                <div className="flex gap-1 mb-5">
                  {Object.entries(STAGES).map(([stage, { level }]) => {
                    const has = items.some((c) => c.stage === stage);
                    return (
                      <div
                        key={stage}
                        className="flex-1 h-1.5 rounded-full"
                        style={{ background: has ? d.accent : "color-mix(in oklab, currentColor 6%, transparent)" }}
                        title={stage}
                      />
                    );
                  })}
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2">
                  {items.map((c) => (
                    <span
                      key={c.id}
                      className="px-3 py-1.5 rounded-full text-xs font-mono tracking-[0.02em] border transition-colors hover:border-ink/25 hover:text-ink/80 cursor-default text-ink/60 border-ink/10"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stage legend */}
        <div className="mt-12 flex items-center gap-5 text-[11px] font-mono uppercase tracking-[0.12em] text-ink/35">
          <span>Stages:</span>
          {Object.entries(STAGES).map(([stage, { level }]) => (
            <span key={stage} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: `color-mix(in oklab, var(--vermilion) ${level * 18}%, transparent)` }} />
              {stage}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
