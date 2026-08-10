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
    <section id="work" className="relative bg-[#F7F4EC] text-[#1E1E1E] chapter-pad section-reveal">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header — compressed */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 font-mono text-[0.8rem] uppercase tracking-[0.16em] text-[#8A8578]/60 mb-2">
              <span className="text-[#D9782E] font-bold">04</span>
              <span className="w-4 h-px bg-[#8A8578]/25" />
              Selected Works — Refined
            </div>
            <h2 className="font-display italic text-[clamp(2.8rem,6vw,5rem)] leading-[0.94] tracking-[-0.02em]">Ideas Into Impact</h2>
          </div>
          <p className="lg:max-w-[32ch] text-[0.95rem] leading-relaxed text-[#8A8578] lg:text-right lg:pb-1">
            Every project represents real-world business problems solved through analytics, strategy and research.
          </p>
        </div>

        {/* Filter + header divider */}
        <div className="flex gap-1 mb-8 p-0.5 rounded-full bg-[#1E1E1E]/4 w-fit">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-[0.06em] uppercase transition-all duration-300
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
                className="group min-h-[50vh] flex items-center py-12 border-t border-[#1E1E1E]/6 first:border-t-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.22, 0.8, 0.22, 1] }}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full ${!isEven ? "lg:direction-rtl" : ""}`}>
                  {/* Image */}
                  <motion.div
                    className={`lg:col-span-6 ${!isEven ? "lg:order-2" : ""}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6 }}
                  >
                    {p.cover ? (
                      <img src={p.cover} alt={p.name} className="w-full rounded-2xl shadow-lg" loading="lazy" />
                    ) : (
                      <div className="w-full aspect-[4/3] rounded-2xl border border-[#1E1E1E]/8 bg-gradient-to-br from-[#F7F4EC] to-[#F0EAD9] flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(217,120,46,0.06)_0%,_transparent_60%)]" />
                        <div className="flex flex-col items-center gap-3 relative z-10">
                          <div className="w-16 h-16 rounded-2xl bg-white/60 border border-[#1E1E1E]/8 flex items-center justify-center shadow-sm">
                            <span className="font-display italic text-2xl text-[#D9782E]">{p.name.charAt(0)}</span>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A8578]/60">{p.category}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className={`lg:col-span-6 ${!isEven ? "lg:order-1" : ""}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-[0.85rem] uppercase tracking-[0.12em] text-[#D9782E] font-bold">0{i + 1}</span>
                      <span className="h-px flex-1 bg-[#1E1E1E]/10" />
                      <span className="font-mono text-[0.85rem] uppercase tracking-[0.12em] text-[#8A8578]">{p.category}</span>
                    </div>

                    <h3 className="font-display italic text-[clamp(2.2rem,3.5vw,3.4rem)] leading-[1.06] mb-4 group-hover:text-[#D9782E] transition-colors duration-500">
                      {p.name}
                    </h3>

                    <div className="space-y-4 text-[1.1rem] leading-[1.7] text-[#8A8578]">
                      {p.problem && (
                        <div>
                          <span className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-[#1E1E1E]/45 font-semibold block mb-1">Challenge</span>
                          <p className="text-[#1E1E1E]/75">{p.problem}</p>
                        </div>
                      )}
                      {p.approach && (
                        <div>
                          <span className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-[#1E1E1E]/45 font-semibold block mb-1">Approach</span>
                          <p className="text-[#1E1E1E]/75">{p.approach}</p>
                        </div>
                      )}
                      {p.outcome && (
                        <div>
                          <span className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-[#1E1E1E]/45 font-semibold block mb-1">Impact</span>
                          <p className="text-[#1E1E1E]/75">{p.outcome}</p>
                        </div>
                      )}
                    </div>

                    {p.tech.length > 0 && (
                      <div className="flex gap-2 mt-6 flex-wrap">
                        {p.tech.slice(0, 4).map((t: string) => (
                          <span key={t} className="px-3.5 py-2 rounded-full text-[13px] font-mono tracking-[0.04em] border border-[#1E1E1E]/12 text-[#1E1E1E]/55">{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-5 mt-5">
                      {p.github && (
                        <motion.a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.85rem] tracking-[0.06em] text-[#1E1E1E]/60 border-b border-transparent pb-1 hover:text-[#1E1E1E] hover:border-[#1E1E1E]/40 transition-all duration-300 group" whileHover={{ x: 2 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="opacity-65 group-hover:opacity-100 transition-opacity"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.82-.26.82-.58v-2.02c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.22.08 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.54 1 .1-.78.42-1.32.76-1.62-2.7-.3-5.54-1.35-5.54-6 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.54.12-3.2 0 0 1.02-.32 3.34 1.24a11.6 11.6 0 016.08 0c2.32-1.56 3.34-1.24 3.34-1.24.66 1.66.24 2.9.12 3.2.78.85 1.24 1.93 1.24 3.25 0 4.66-2.84 5.7-5.55 6 .44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                          GitHub Repository <span className="ml-0.5 transition-transform group-hover:translate-x-0.5">→</span>
                        </motion.a>
                      )}
                      {p.demo && (
                        <motion.a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.85rem] tracking-[0.06em] text-[#D9782E] border-b border-transparent pb-1 hover:border-[#D9782E] transition-all duration-300 group" whileHover={{ x: 2 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          Live Demo <span className="ml-0.5 transition-transform group-hover:translate-x-0.5">→</span>
                        </motion.a>
                      )}
                      {p.url && !p.demo && !p.github && (
                        <motion.a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.85rem] tracking-[0.06em] text-[#D9782E] border-b border-transparent pb-1 hover:border-[#D9782E] transition-all duration-300 group" whileHover={{ x: 2 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          View Case Study <span className="ml-0.5 transition-transform group-hover:translate-x-0.5">→</span>
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
        <div className="mt-12 pt-8 border-t border-[#1E1E1E]/6 text-center">
          <p className="font-display italic text-[clamp(1.2rem,1.8vw,1.5rem)] text-[#8A8578] mb-4">Interested in more?</p>
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1E1E1E]/15 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-[#1E1E1E]/60 hover:border-[#1E1E1E]/40 hover:text-[#1E1E1E] transition-all duration-300">
            View All Projects →
          </a>
        </div>
      </div>
    </section>
  );
}
