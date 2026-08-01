"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

function normalize(raw: any) {
  return {
    ...raw,
    name: raw.title || raw.name,
    desc: raw.tagline || "",
    tech: Array.isArray(raw.tech) ? raw.tech : [],
    github: raw.github_url || raw.repo || null,
    demo: raw.live_demo_url || raw.url || null,
    cover: raw.cover || null,
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
  };
}

const FILTERS = ["All", "Analytics", "Strategy", "Research"] as const;

export function Ch06Work() {
  const { projects } = usePortfolio();
  const all = (projects?.length ? projects : []).map(normalize);
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? all : all.filter((p) => p.category?.includes(filter));

  return (
    <section id="work" className="relative bg-[#F7F4EC] text-[#1E1E1E] chapter-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 font-mono text-[0.8rem] uppercase tracking-[0.18em] text-[#8A8578]/60 mb-5">
            <span className="text-[#D9782E] font-bold">04</span>
            <span className="w-6 h-px bg-[#8A8578]/25" />
            Selected Works
          </div>
          <div className="grid grid-cols-12 gap-6">
            <h2 className="col-span-12 lg:col-span-7 font-display font-normal text-[clamp(3.2rem,7vw,6.4rem)] leading-[0.92] tracking-[-0.02em] italic">
              Ideas Into<br />Impact
            </h2>
            <p className="col-span-12 lg:col-span-5 lg:pt-4 text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-[#8A8578]">
              Each project represents a real problem solved through analysis, strategy, and execution — not just theory.
            </p>
          </div>
        </header>

        {/* Minimal filter */}
        <div className="flex gap-1 mb-20 p-0.5 rounded-full bg-[#1E1E1E]/4 w-fit">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-[11px] font-mono tracking-[0.06em] uppercase transition-all duration-300
                ${filter === f ? "bg-[#1E1E1E] text-[#F7F4EC]" : "text-[#8A8578] hover:text-[#1E1E1E]"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Project showcase */}
        <div className="flex flex-col">
          {filtered.slice(0, 3).map((p, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.article
                key={p.id}
                className="group min-h-[70vh] flex items-center py-16 border-t border-[#1E1E1E]/6 first:border-t-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.22, 0.8, 0.22, 1] }}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full ${!isEven ? "lg:direction-rtl" : ""}`}>
                  {/* Image */}
                  <motion.div
                    className={`lg:col-span-6 ${!isEven ? "lg:order-2" : ""}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6 }}
                  >
                    {p.cover ? (
                      <img src={p.cover} alt={p.name} className="w-full rounded-2xl shadow-lg" loading="lazy" />
                    ) : (
                      <div className="w-full aspect-[4/3] rounded-2xl bg-[#1E1E1E]/3 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D9782E]/8 via-transparent to-[#1E1E1E]/5" />
                        <span className="font-display text-[clamp(3rem,8vw,8rem)] text-[#1E1E1E]/[0.04] select-none">{p.name.charAt(0)}</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className={`lg:col-span-6 ${!isEven ? "lg:order-1" : ""}`}>
                    <div className="flex items-center gap-4 mb-5">
                      <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-[#D9782E] font-bold">0{i + 1}</span>
                      <span className="h-px flex-1 bg-[#1E1E1E]/10" />
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#8A8578]">{p.category}</span>
                    </div>

                    <h3 className="font-display italic text-[clamp(2.2rem,3.5vw,3.4rem)] leading-[1.06] mb-5 group-hover:text-[#D9782E] transition-colors duration-500">
                      {p.name}
                    </h3>

                    <div className="space-y-5 text-[1rem] leading-relaxed text-[#8A8578]">
                      {p.problem && (
                        <div>
                          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#1E1E1E]/40 font-semibold block mb-1">Challenge</span>
                          <p className="text-[#1E1E1E]/70">{p.problem}</p>
                        </div>
                      )}
                      {p.approach && (
                        <div>
                          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#1E1E1E]/40 font-semibold block mb-1">Approach</span>
                          <p className="text-[#1E1E1E]/70">{p.approach}</p>
                        </div>
                      )}
                      {p.outcome && (
                        <div>
                          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#1E1E1E]/40 font-semibold block mb-1">Impact</span>
                          <p className="text-[#1E1E1E]/70">{p.outcome}</p>
                        </div>
                      )}
                    </div>

                    {p.tech.length > 0 && (
                      <div className="flex gap-2 mt-7 flex-wrap">
                        {p.tech.slice(0, 4).map((t: string) => (
                          <span key={t} className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[0.05em] border border-[#1E1E1E]/12 text-[#1E1E1E]/50">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 mt-7">
                      {p.demo && (
                        <motion.a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-[#D9782E] border-b border-[#D9782E]/30 pb-1 hover:border-[#D9782E] transition-all duration-300" whileHover={{ x: 3 }}>
                          View Project <span>→</span>
                        </motion.a>
                      )}
                      {p.github && (
                        <motion.a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-[#1E1E1E]/50 border-b border-[#1E1E1E]/20 pb-1 hover:text-[#1E1E1E] hover:border-[#1E1E1E]/40 transition-all duration-300" whileHover={{ x: 3 }}>
                          GitHub <span>→</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-24 text-center text-[#8A8578] font-mono text-sm">No projects in this category yet.</div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 pt-12 border-t border-[#1E1E1E]/6 text-center">
          <p className="font-display italic text-[clamp(1.3rem,2vw,1.8rem)] text-[#8A8578] mb-6">Interested in more?</p>
          <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#1E1E1E]/15 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-[#1E1E1E]/60 hover:border-[#1E1E1E]/40 hover:text-[#1E1E1E] transition-all duration-300">
            View All Projects →
          </a>
        </div>
      </div>
    </section>
  );
}
