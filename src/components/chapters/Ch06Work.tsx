"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const FILTERS = ["All", "AI Strategy", "Analytics", "Business Strategy", "Research"];

function normalize(raw: any) {
  return {
    ...raw,
    name: raw.title || raw.name,
    desc: raw.tagline || raw.description || "",
    tech: Array.isArray(raw.tech) ? raw.tech : [],
    github: raw.github_url || raw.repo || null,
    demo: raw.live_demo_url || raw.url || null,
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
  };
}

function GitIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.82-.26.82-.58v-2.02c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.22.08 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.54 1 .1-.78.42-1.32.76-1.62-2.7-.3-5.54-1.35-5.54-6 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.54.12-3.2 0 0 1.02-.32 3.34 1.24a11.6 11.6 0 016.08 0c2.32-1.56 3.34-1.24 3.34-1.24.66 1.66.24 2.9.12 3.2.78.85 1.24 1.93 1.24 3.25 0 4.66-2.84 5.7-5.55 6 .44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>); }
function DemoIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>); }
function CloseIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>); }

function colors(cat: string) {
  const m: Record<string, string> = { "AI Strategy": "#7b8fff", "Analytics": "#63c4a8", "Business Strategy": "#d4a844", "Research": "#b88cf0" };
  return m[cat] || "#888";
}

type Project = ReturnType<typeof normalize>;

export function Ch06Work() {
  const { projects } = usePortfolio();
  const all = (projects?.length ? projects : []).map(normalize);
  const [filter, setFilter] = useState("All");
  const [stackFilter, setStackFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const allTechs = useMemo(() => {
    const t = new Set<string>();
    all.forEach((p) => p.tech.forEach((s: string) => t.add(s)));
    return Array.from(t).sort();
  }, [all]);

  const filtered = useMemo(() => {
    let pool = all;
    if (filter !== "All") pool = pool.filter((p) => p.category === filter);
    if (stackFilter) pool = pool.filter((p) => p.tech.includes(stackFilter));
    return pool;
  }, [filter, stackFilter, all]);

  return (
    <section id="work" data-mood="warm" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-14">
          <div className="flex items-center gap-3 text-mono text-[0.75rem] uppercase tracking-[0.2em] text-ink/40 mb-4">
            <span className="text-vermilion font-medium">04</span>
            <span className="w-8 h-px bg-ink/20" />
            Product Showcase
          </div>
          <h2 className="font-display font-normal text-[clamp(3.2rem,7vw,6rem)] leading-[0.92] tracking-[-0.02em]">
            Projects &amp; Case Studies
          </h2>
          <p className="mt-5 text-[1.05rem] text-ink/55 max-w-[52ch]">
            Research, analytics, and strategy — built with curiosity and shipped with care.
          </p>
        </header>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setStackFilter(null); }}
              className={`px-4 py-1.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-medium border transition-colors duration-200
                ${filter === f && !stackFilter ? "bg-ink text-bone border-ink" : "bg-transparent text-ink/50 border-ink/15 hover:border-ink/30 hover:text-ink"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stack filter */}
        <div className="flex gap-1.5 flex-wrap mb-10">
          {stackFilter && (
            <button onClick={() => setStackFilter(null)} className="px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.03em] bg-vermilion text-bone border border-vermilion">
              {stackFilter} ×
            </button>
          )}
          {allTechs.slice(0, 8).map((t) => (
            <button
              key={t}
              onClick={() => setStackFilter(stackFilter === t ? null : t)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.03em] border transition-colors ${stackFilter === t ? "border-vermilion bg-vermilion/10 text-vermilion" : "border-ink/10 bg-ink/5 text-ink/50 hover:border-ink/25 hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => {
            const accent = colors(p.category);
            const isSelected = selected?.id === p.id;
            return (
              <motion.article
                key={p.id}
                onClick={() => setSelected(isSelected ? null : p)}
                className={`group relative rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer
                  ${isSelected ? "border-vermilion/40 bg-white/70 shadow-md shadow-vermilion/5" : "border-ink/8 bg-white/40 backdrop-blur-sm hover:border-ink/20 hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-1"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white font-display text-2xl"
                    style={{ background: accent }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.14em] font-mono text-ink/35 mb-2">{p.category} · {p.year}</span>
                    <h3 className="font-display text-[1.2rem] leading-tight">{p.name}</h3>
                    <p className="text-sm text-ink/50 mt-2 line-clamp-2">{p.desc}</p>
                  </div>
                </div>

                {p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.tech.slice(0, 3).map((t: string) => (
                      <button key={t} onClick={(e) => { e.stopPropagation(); setStackFilter(stackFilter === t ? null : t); }} className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-[0.03em] border transition-colors cursor-pointer ${stackFilter === t ? "border-vermilion bg-vermilion/10 text-vermilion" : "bg-ink/5 border-ink/8 text-ink/55 hover:border-ink/20"}`}>{t}</button>
                    ))}
                    {p.tech.length > 3 && <span className="text-[11px] font-mono text-ink/30 self-center">+{p.tech.length - 3}</span>}
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-3 border-t border-ink/5">
                  {p.github ? (
                    <a href={p.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-[0.04em] bg-ink/90 text-bone hover:bg-ink transition-colors">
                      <GitIcon /> GitHub
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-[0.04em] bg-ink/5 text-ink/25 cursor-not-allowed">
                      <GitIcon /> Private
                    </span>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-[0.04em] bg-vermilion text-bone hover:bg-vermilion/90 transition-colors">
                      <DemoIcon /> Demo
                    </a>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.1em] font-mono border border-ink/10 text-ink/40">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.status === "Completed" ? "#63c4a8" : "#d4a844" }} />
                    {p.status}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-16 text-ink/30 text-sm">No projects in this category yet.</p>
        )}

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              className="mt-6 rounded-2xl border border-ink/10 bg-white/60 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 0.8, 0.22, 1] }}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-display text-base" style={{ background: colors(selected.category) }}>
                      {selected.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display text-lg leading-tight">{selected.name}</h3>
                      <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-ink/40">{selected.category} · {selected.role} · {selected.year}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center bg-ink/5 hover:bg-ink/10 transition-colors text-ink/40">
                    <CloseIcon />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                  {selected.problem && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.14em] font-mono text-vermilion mb-2">Problem</h4>
                      <p className="text-ink/70 leading-relaxed">{selected.problem}</p>
                    </div>
                  )}
                  {selected.approach && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.14em] font-mono text-vermilion mb-2">Approach</h4>
                      <p className="text-ink/70 leading-relaxed">{selected.approach}</p>
                    </div>
                  )}
                  {selected.outcome && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.14em] font-mono text-vermilion mb-2">Outcome</h4>
                      <p className="text-ink/70 leading-relaxed">{selected.outcome}</p>
                    </div>
                  )}
                  {selected.impact && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.14em] font-mono text-vermilion mb-2">Impact</h4>
                      <p className="text-ink/70 leading-relaxed">{selected.impact}</p>
                    </div>
                  )}
                </div>

                {selected.highlights.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-ink/6">
                    <h4 className="text-[10px] uppercase tracking-[0.14em] font-mono text-vermilion mb-2">Highlights</h4>
                    <ul className="flex flex-col gap-1.5">
                      {selected.highlights.map((h: string, idx: number) => (
                        <li key={idx} className="text-sm text-ink/70 flex gap-2">
                          <span className="text-vermilion shrink-0 mt-[0.15em]">+</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.tech.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-ink/6">
                    <h4 className="text-[10px] uppercase tracking-[0.14em] font-mono text-ink/40 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.tech.map((t: string) => (
                        <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.03em] bg-ink/5 border border-ink/10 text-ink/60">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 pt-5 border-t border-ink/6 flex gap-3">
                  {selected.github && (
                    <a href={selected.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono tracking-[0.04em] bg-ink text-bone hover:bg-ink/90 transition-colors">
                      <GitIcon /> View on GitHub
                    </a>
                  )}
                  {selected.demo && (
                    <a href={selected.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono tracking-[0.04em] bg-vermilion text-bone hover:bg-vermilion/90 transition-colors">
                      <DemoIcon /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
