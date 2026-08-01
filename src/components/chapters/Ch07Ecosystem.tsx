"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

type Cap = { id: string; name: string; domain: string };

const CARDS = [
  { id: "Analytics", label: "Analytics", color: "#E0533D" },
  { id: "Artificial Intelligence", label: "AI & ML", color: "#7C5CFF" },
  { id: "Business", label: "Business", color: "#F2B33D" },
  { id: "People & HR", label: "People & HR", color: "#3DA9FC" },
  { id: "Research", label: "Research", color: "#7C5CFF" },
  { id: "Leadership", label: "Leadership", color: "#E0533D" },
];

/* ─── SVG Icons ─── */
function BarChartIcon() { return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="16" width="5" height="12" rx="1"/><rect x="13" y="8" width="5" height="20" rx="1"/><rect x="22" y="12" width="5" height="16" rx="1"/></svg>); }
function AIIcon() { return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="16" cy="16" r="3"/><path d="M16 4v6M16 22v6M4 16h6M22 16h6"/><circle cx="16" cy="16" r="12" strokeDasharray="3 3"/></svg>); }
function BizIcon() { return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="20" width="20" height="8" rx="1.5"/><path d="M10 20v-4a6 6 0 0112 0v4"/><circle cx="16" cy="14" r="3"/></svg>); }
function PeopleIcon() { return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="10" r="4"/><circle cx="22" cy="10" r="3"/><path d="M4 26c0-4.4 3.6-8 8-8h0c4.4 0 8 3.6 8 8"/><path d="M18 22c0-2.2 2-4 5-4h1c3 0 5 2 5 5"/></svg>); }
function ResearchIcon() { return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="6" width="24" height="20" rx="2"/><path d="M12 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M8 16h16M8 11h16"/></svg>); }
function LeaderIcon() { return (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 2l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z" fill="currentColor" opacity="0.15"/><path d="M16 2l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z"/></svg>); }

const ICONS: Record<string, React.ReactNode> = {
  "Analytics": <BarChartIcon />, "Artificial Intelligence": <AIIcon />, "Business": <BizIcon />,
  "People & HR": <PeopleIcon />, "Research": <ResearchIcon />, "Leadership": <LeaderIcon />,
};

export function Ch07Ecosystem() {
  const { capabilities: apiCaps, projects, research, certifications } = usePortfolio();
  const caps = (apiCaps?.length ? apiCaps : []) as Cap[];
  const projCount = projects?.length || 0;
  const researchCount = research?.length || 0;
  const certCount = certifications?.length || 0;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  const byDomain = useMemo(() => {
    const m = new Map<string, Cap[]>();
    CARDS.forEach((c) => m.set(c.id, []));
    caps.forEach((c) => {
      CARDS.forEach((card) => {
        if (c.domain?.toLowerCase().includes(card.id.toLowerCase()) || card.id.toLowerCase().includes(c.domain?.toLowerCase() || "")) {
          m.get(card.id)?.push(c);
        }
      });
    });
    return m;
  }, [caps]);

  return (
    <section id="ecosystem" className="relative bg-[#0E0E10] text-[#F5F1EB] overflow-hidden" style={{ minHeight: "65vh" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-18">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/35 mb-2">
              <span className="text-[#D9782E] font-bold">05</span>
              Core Expertise
            </div>
            <h2 className="font-display italic text-[clamp(2rem,4vw,3.2rem)] leading-[0.94] tracking-[-0.02em]">Capabilities</h2>
          </div>
          <div className="hidden sm:flex items-center gap-5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/25">
            <span>{caps.length} skills</span><span>{projCount} projects</span><span>{researchCount} papers</span><span>{certCount} certs</span>
          </div>
        </div>

        {/* Interaction hint */}
        <AnimatePresence>
          {hintVisible && (
            <motion.div className="text-center mb-4" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/15">Choose one to explore</span>
              <motion.span className="block text-white/10 mt-0.5" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>↓</motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3×2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card, i) => {
            const items = byDomain.get(card.id) || [];
            const isOpen = expanded === card.id;
            const top4 = items.slice(0, 4).map((c) => c.name);

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className={isOpen ? "sm:col-span-2 sm:row-span-2 z-10" : ""}
              >
                <motion.button
                  onClick={() => {
                    setExpanded(isOpen ? null : card.id);
                    if (hintVisible) setHintVisible(false);
                  }}
                  layout="position"
                  className={`w-full rounded-2xl border p-5 sm:p-6 text-left transition-all duration-500 group cursor-pointer
                    ${isOpen
                      ? "border-[#D9782E]/40 bg-gradient-to-br from-[#D9782E]/8 to-transparent shadow-xl shadow-[#D9782E]/8"
                      : "border-white/6 bg-white/[0.02] hover:border-[#D9782E]/20 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"}`}
                  whileHover={!isOpen ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                        style={{ background: `${card.color}15`, color: isOpen ? card.color : `${card.color}90` }}>
                        {ICONS[card.id]}
                      </div>
                      <div>
                        <h3 className="font-display text-[1.25rem] leading-tight group-hover:text-[#D9782E] transition-colors duration-300">{card.label}</h3>
                        <div className="text-[0.7rem] font-mono tracking-[0.08em] text-white/25 mt-0.5">{items.length} skills</div>
                      </div>
                    </div>
                    <span className={`text-[0.7rem] font-mono tracking-[0.06em] transition-all duration-300 shrink-0
                      ${isOpen ? "text-[#D9782E]" : "text-white/10 group-hover:text-[#D9782E]/50"}`}>
                      {isOpen ? "Active" : <span>Explore <span className="inline-block group-hover:translate-x-0.5 transition-transform">→</span></span>}
                    </span>
                  </div>

                  {/* Quick skills preview */}
                  {!isOpen && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {top4.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/6 text-[11px] font-mono text-white/40 truncate max-w-[140px]">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 0.8, 0.22, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-4 border-t border-white/6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Core Technologies */}
                          <div>
                            <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/25 font-semibold mb-2">Core Technologies</div>
                            <div className="flex flex-wrap gap-1.5">
                              {items.slice(0, 6).map((c) => (
                                <span key={c.id} className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/8 text-[12px] font-mono text-white/65">{c.name}</span>
                              ))}
                            </div>
                          </div>
                          {/* Projects & Links */}
                          <div className="space-y-3">
                            <div>
                              <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/25 font-semibold mb-1">Projects</div>
                              <div className="text-[13px] text-white/45">{projCount} projects across all domains</div>
                            </div>
                            <div>
                              <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/25 font-semibold mb-1">Research</div>
                              <div className="text-[13px] text-white/45">{researchCount} published papers</div>
                            </div>
                            <div>
                              <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/25 font-semibold mb-1">Certifications</div>
                              <div className="text-[13px] text-white/45">{certCount} verified credentials</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
