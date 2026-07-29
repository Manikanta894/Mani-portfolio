"use client";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
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
  };
}

function GitIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.82-.26.82-.58v-2.02c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.22.08 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.54 1 .1-.78.42-1.32.76-1.62-2.7-.3-5.54-1.35-5.54-6 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.54.12-3.2 0 0 1.02-.32 3.34 1.24a11.6 11.6 0 016.08 0c2.32-1.56 3.34-1.24 3.34-1.24.66 1.66.24 2.9.12 3.2.78.85 1.24 1.93 1.24 3.25 0 4.66-2.84 5.7-5.55 6 .44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>); }
function DemoIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>); }

function colors(cat: string) {
  const m: Record<string, string> = { "AI Strategy": "#7b8fff", "Analytics": "#63c4a8", "Business Strategy": "#d4a844", "Research": "#b88cf0" };
  return m[cat] || "#888";
}

export function Ch06Work() {
  const { projects } = usePortfolio();
  const all = (projects?.length ? projects : []).map(normalize);
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return all;
    return all.filter((p) => p.category === filter);
  }, [filter, all]);

  return (
    <section id="work" className="relative chapter-pad text-ink">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="mb-14">
          <div className="flex items-center gap-3 text-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink/40 mb-4">
            <span className="text-vermilion font-medium">04</span>
            <span className="w-6 h-px bg-ink/20" />
            Product Showcase
          </div>
          <h2 className="font-display font-normal text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.94] tracking-[-0.02em]">
            Projects &amp;<br />Case Studies
          </h2>
          <p className="mt-4 text-[0.95rem] text-ink/55 max-w-[42ch]">
            Research, analytics, and strategy — built with curiosity and shipped with care.
          </p>
        </header>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[10px] tracking-[0.1em] uppercase font-medium border transition-colors duration-200
                ${filter === f ? "bg-ink text-bone border-ink" : "bg-transparent text-ink/50 border-ink/15 hover:border-ink/30 hover:text-ink"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => {
            const accent = colors(p.category);
            return (
              <motion.article
                key={p.id}
                className="group relative rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-6 flex flex-col gap-4 transition-all duration-300 hover:border-ink/20 hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {/* Accent bar + initial */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-display text-lg"
                    style={{ background: accent }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.15em] font-mono text-ink/35 mb-1">{p.category} · {p.year}</span>
                    <h3 className="font-display text-[1.05rem] leading-tight">{p.name}</h3>
                    <p className="text-[0.8rem] text-ink/50 mt-1.5 line-clamp-2">{p.desc}</p>
                  </div>
                </div>

                {/* Tech tags */}
                {p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 3).map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-[0.03em] bg-ink/5 border border-ink/8 text-ink/55">{t}</span>
                    ))}
                    {p.tech.length > 3 && <span className="text-[9px] font-mono text-ink/30 self-center">+{p.tech.length - 3}</span>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2 border-t border-ink/5">
                  {p.github ? (
                    <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[0.04em] bg-ink/90 text-bone hover:bg-ink transition-colors">
                      <GitIcon /> GitHub
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[0.04em] bg-ink/5 text-ink/25 cursor-not-allowed">
                      <GitIcon /> Private
                    </span>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[0.04em] bg-vermilion text-bone hover:bg-vermilion/90 transition-colors">
                      <DemoIcon /> Demo
                    </a>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] uppercase tracking-[0.1em] font-mono border border-ink/10 text-ink/40">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.status === "Completed" ? "#63c4a8" : "#d4a844" }} />
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
      </div>
    </section>
  );
}
