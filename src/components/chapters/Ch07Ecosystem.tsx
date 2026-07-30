"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const DOMAINS: { id: string; label: string; accent: string; icon: string }[] = [
  { id: "Analytics", label: "Analytics", accent: "#E0533D", icon: "📊" },
  { id: "AI & ML", label: "AI & ML", accent: "#7C5CFF", icon: "🤖" },
  { id: "People & HR", label: "People & HR", accent: "#3DA9FC", icon: "👥" },
  { id: "Business", label: "Business", accent: "#F2B33D", icon: "💼" },
  { id: "Leadership", label: "Leadership", accent: "#E0533D", icon: "🎯" },
  { id: "Research", label: "Research", accent: "#7C5CFF", icon: "🔬" },
  { id: "Technology", label: "Technology", accent: "#3DA9FC", icon: "⚙️" },
  { id: "Visualization", label: "Visualization", accent: "#F2B33D", icon: "📈" },
];

const STAGES = ["Learning", "Practicing", "Applying", "Researching", "Teaching", "Leading"];

type Cap = { id: string; name: string; domain: string; stage: string; overview?: string; tools?: string[] };

export function Ch07Ecosystem() {
  const { capabilities: apiCaps } = usePortfolio();
  const caps = (apiCaps?.length ? apiCaps : []) as Cap[];

  const byDomain = useMemo(() => {
    const m = new Map<string, Cap[]>();
    DOMAINS.forEach((d) => m.set(d.id, []));
    caps.forEach((c) => m.get(c.domain)?.push(c));
    return m;
  }, [caps]);

  const [selected, setSelected] = useState<Cap | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const stageCounts = useMemo(() => {
    const m = new Map<string, number>();
    caps.forEach((c) => m.set(c.stage, (m.get(c.stage) || 0) + 1));
    return m;
  }, [caps]);

  return (
    <section id="ecosystem" className="relative chapter-pad text-ink">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* Header */}
        <header className="mb-14">
          <div className="flex items-center gap-3 text-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink/40 mb-4">
            <span className="text-vermilion font-medium">05</span>
            <span className="w-6 h-px bg-ink/20" />
            Capabilities
          </div>
          <h2 className="font-display font-normal text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.94] tracking-[-0.02em]">
            Professional<br />Operating System
          </h2>
          <p className="mt-4 text-[0.95rem] text-ink/55 max-w-[48ch]">
            Every capability tracked — where learned, where applied — connected across research, projects, certifications and experience.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {[
            { label: "Capabilities", value: caps.length, hint: "tracked & evolving" },
            { label: "Domains", value: DOMAINS.length, hint: "interconnected" },
            { label: "Leading", value: stageCounts.get("Leading") || 0, hint: "at expert level" },
            { label: "Learning", value: stageCounts.get("Learning") || 0, hint: "actively growing" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <div className="text-[10px] uppercase tracking-[0.15em] font-mono text-ink/40 mb-1">{s.label}</div>
              <div className="font-display text-[clamp(2rem,3.5vw,2.8rem)] leading-none text-vermilion">{s.value}</div>
              <div className="text-[11px] text-ink/45 mt-1">{s.hint}</div>
            </motion.div>
          ))}
        </div>

        {/* Domain cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {DOMAINS.map((d) => {
            const items = byDomain.get(d.id) || [];
            const expanded = expandedDomain === d.id;
            return (
              <motion.div
                key={d.id}
                className={`rounded-2xl border bg-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300 ${expanded ? "border-ink/20 shadow-lg shadow-ink/5" : "border-ink/8 hover:border-ink/15"}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.random() * 0.15, duration: 0.4 }}
              >
                <button
                  onClick={() => setExpandedDomain(expanded ? null : d.id)}
                  className="w-full p-5 text-left flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background: `${d.accent}18`, color: d.accent }}>
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base leading-tight">{d.label}</h3>
                    <div className="text-[10px] uppercase tracking-[0.1em] font-mono text-ink/35 mt-0.5">
                      {items.length} skills · {[...new Set(items.map((c) => c.stage))].length} stages
                    </div>
                  </div>
                  <span className="ml-auto text-ink/25 text-sm">{expanded ? "−" : "+"}</span>
                </button>

                {/* Stage bar */}
                <div className="px-5 pb-3 flex gap-1">
                  {STAGES.map((s) => {
                    const has = items.some((c) => c.stage === s);
                    return (
                      <div
                        key={s}
                        className="flex-1 h-1 rounded-full transition-colors duration-300"
                        style={{ background: has ? d.accent : "color-mix(in oklab, currentColor 8%, transparent)" }}
                        title={`${s}: ${items.filter((c) => c.stage === s).length}`}
                      />
                    );
                  })}
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-ink/5 flex flex-wrap gap-1.5">
                        {items.map((c) => (
                          <button
                            key={c.id}
                            onClick={(e) => { e.stopPropagation(); setSelected(c); }}
                            className="px-2.5 py-1.5 rounded-full text-[10px] font-mono tracking-[0.03em] border transition-colors hover:border-ink/30 text-ink/65 border-ink/10"
                            style={selected?.id === c.id ? { borderColor: d.accent, color: d.accent, background: `${d.accent}10` } : {}}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Detail card */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              className="rounded-2xl border border-vermilion/30 bg-white/60 backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 0.8, 0.22, 1] }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] uppercase tracking-[0.14em] font-mono px-2 py-0.5 rounded-full border border-ink/15 text-ink/45">{selected.domain}</span>
                    <span className="text-[9px] uppercase tracking-[0.14em] font-mono px-2 py-0.5 rounded-full bg-vermilion/10 border border-vermilion/30 text-vermilion">{selected.stage}</span>
                  </div>
                  <h3 className="font-display text-xl leading-tight">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center bg-ink/5 hover:bg-ink/10 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {selected.overview && (
                <p className="text-sm text-ink/65 leading-relaxed mb-5 max-w-[64ch]">{selected.overview}</p>
              )}

              {/* Stage progress */}
              <div className="mb-5">
                <div className="text-[10px] uppercase tracking-[0.12em] font-mono text-ink/35 mb-2">Mastery stage</div>
                <div className="flex gap-1">
                  {STAGES.map((s, i) => {
                    const at = STAGES.indexOf(selected.stage);
                    const reached = i <= at;
                    return (
                      <div key={s} className="flex-1 text-center">
                        <div className="h-1.5 rounded-full" style={{ background: reached ? "var(--vermilion)" : "color-mix(in oklab, currentColor 10%, transparent)" }} />
                        <div className={`mt-1 text-[8px] uppercase tracking-[0.08em] leading-tight ${reached ? "text-ink/60" : "text-ink/25"}`}>{s.split("").slice(0, 4).join("")}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selected.tools && selected.tools.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-[0.12em] font-mono text-ink/35 mb-2">Tools & technologies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tools.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-[0.03em] bg-ink/5 border border-ink/10 text-ink/60">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage distribution */}
        <div className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-6">
          <h3 className="font-display text-lg mb-5">Stage Distribution</h3>
          <div className="flex gap-2 items-end h-20">
            {STAGES.map((s) => {
              const count = stageCounts.get(s) || 0;
              const max = Math.max(...Array.from(stageCounts.values()), 1);
              const h = (count / max) * 100;
              return (
                <div key={s} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono tabular-nums text-ink/50">{count}</span>
                  <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${h}%`, background: "var(--vermilion)", opacity: 0.1 + (count / max) * 0.7 }} />
                  <span className="text-[8px] uppercase tracking-[0.06em] text-ink/35 text-center leading-tight">{s.split("").slice(0, 4).join("")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
