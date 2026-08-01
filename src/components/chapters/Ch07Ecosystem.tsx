"use client";
import { useState, useMemo } from "react";
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

function BarChartIcon() { return (<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="18" width="6" height="13" rx="1.5"/><rect x="15" y="9" width="6" height="22" rx="1.5"/><rect x="25" y="13" width="6" height="18" rx="1.5"/></svg>); }
function CircuitIcon() { return (<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="18" r="3.5"/><path d="M18 4v6M18 26v6M4 18h6M26 18h6"/><circle cx="18" cy="18" r="14" strokeDasharray="2 3" opacity="0.4"/></svg>); }
function BriefcaseIcon() { return (<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="7" y="22" width="22" height="9" rx="2"/><path d="M12 22v-4a6 6 0 0112 0v4" strokeLinecap="round"/><circle cx="18" cy="16" r="3.5"/></svg>); }
function UsersIcon() { return (<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="14" cy="12" r="4.5"/><circle cx="25" cy="12" r="3.5"/><path d="M5 29c0-5 4-9 9-9s9 3.6 9 9"/><path d="M20 24c0-2.5 2.5-5 6-5h1c3.5 0 5.5 2.5 5.5 6"/></svg>); }
function BookIcon() { return (<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="8" width="26" height="22" rx="2.5"/><path d="M13 8V5a2.5 2.5 0 012.5-2.5h5A2.5 2.5 0 0123 5v3"/><path d="M9 18h18M9 13h18" opacity="0.4"/></svg>); }
function StarIcon() { return (<svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 3l4 9 10 1-7 6 2 10-9-5-9 5 2-10-7-6 10-1z"/></svg>); }

const ICONS: Record<string, React.ReactNode> = {
  "Analytics": <BarChartIcon />, "Artificial Intelligence": <CircuitIcon />, "Business": <BriefcaseIcon />,
  "People & HR": <UsersIcon />, "Research": <BookIcon />, "Leadership": <StarIcon />,
};

export function Ch07Ecosystem() {
  const { capabilities: apiCaps, projects, research, certifications } = usePortfolio();
  const caps = (apiCaps?.length ? apiCaps : []) as Cap[];
  const projCount = projects?.length || 0;
  const researchCount = research?.length || 0;
  const certCount = certifications?.length || 0;
  const [expanded, setExpanded] = useState<string | null>(null);

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
    <section id="ecosystem" className="relative bg-[#0C0B0A] text-[#D6D1C9] overflow-hidden" style={{ minHeight: "65vh" }}>
      {/* Ambient glow behind active card */}
      {expanded && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(217,122,50,0.04)_0%,_transparent_70%)]" />
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#A39A90] mb-2">
              <span className="text-[#D97A32] font-bold">05</span>
              Core Expertise
            </div>
            <h2 className="font-display italic text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[0.92] tracking-[-0.02em] text-[#F7F4EF]">Capabilities</h2>
          </div>
          <div className="hidden sm:flex items-center gap-4 font-mono text-[0.75rem] tracking-[0.06em] text-[#A39A90]">
            <span className="text-[#D6D1C9] font-medium">{caps.length}</span> Skills
            <span className="text-[#7E756B]">·</span>
            <span className="text-[#D6D1C9] font-medium">{projCount}</span> Projects
            <span className="text-[#7E756B]">·</span>
            <span className="text-[#D6D1C9] font-medium">{researchCount}</span> Papers
            <span className="text-[#7E756B]">·</span>
            <span className="text-[#D6D1C9] font-medium">{certCount}</span> Certs
          </div>
        </div>

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
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className={isOpen ? "lg:col-span-2 lg:row-span-2 z-10" : ""}
              >
                <motion.button
                  onClick={() => setExpanded(isOpen ? null : card.id)}
                  layout="position"
                  className={`w-full rounded-[20px] border p-5 sm:p-6 text-left transition-all duration-400 group cursor-pointer
                    ${isOpen
                      ? "border-[#D97A32]/35 bg-gradient-to-br from-[#D97A32]/6 via-transparent to-transparent shadow-xl shadow-[#D97A32]/6"
                      : "border-white/[0.06] bg-white/[0.015] hover:border-[#D97A32]/20 hover:bg-white/[0.03] hover:-translate-y-2 hover:shadow-xl hover:shadow-black/25"}`}
                  whileHover={!isOpen ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Row 1: Icon + Title + Action */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-400 group-hover:scale-105"
                        style={{ background: `${card.color}12`, color: isOpen ? card.color : `${card.color}85` }}>
                        {ICONS[card.id]}
                      </div>
                      <div>
                        <h3 className="font-display text-[1.4rem] leading-tight text-[#F7F4EF] font-medium tracking-[-0.01em] group-hover:text-[#D97A32] transition-colors duration-300">{card.label}</h3>
                        <div className="text-[0.8rem] font-mono tracking-[0.04em] text-[#A39A90] mt-0.5">{items.length} skills</div>
                      </div>
                    </div>
                    <span className={`text-[0.75rem] font-mono tracking-[0.06em] transition-all duration-300 shrink-0 mt-1
                      ${isOpen ? "text-[#D97A32] flex items-center gap-1.5" : "text-white/[0.12] group-hover:text-[#D97A32]/50"}`}>
                      {isOpen ? (
                        <><span className="w-1.5 h-1.5 rounded-full bg-[#D97A32] animate-pulse" /> Selected</>
                      ) : (
                        <>Explore <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span></>
                      )}
                    </span>
                  </div>

                  {/* Quick preview */}
                  {!isOpen && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {top4.map((t) => (
                        <span key={t} className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[12px] font-mono text-[#D6D1C9]/70 hover:border-[#D97A32]/30 hover:text-[#D97A32] transition-all duration-200 cursor-pointer truncate max-w-[150px]">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.22, 0.8, 0.22, 1] }} className="overflow-hidden">
                        <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#D97A32] font-semibold mb-2.5">Core Technologies</div>
                            <div className="flex flex-wrap gap-2">
                              {items.slice(0, 8).map((c) => (
                                <span key={c.id} className="px-3 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] text-[13px] font-mono text-[#D6D1C9] hover:border-[#D97A32]/30 hover:text-[#D97A32] transition-all duration-200 cursor-pointer">{c.name}</span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#7E756B] font-semibold mb-1">Projects</div>
                              <div className="text-[15px] text-[#D6D1C9]">{projCount} projects across all domains</div>
                            </div>
                            <div>
                              <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#7E756B] font-semibold mb-1">Research</div>
                              <div className="text-[15px] text-[#D6D1C9]">{researchCount} published papers</div>
                            </div>
                            <div>
                              <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#7E756B] font-semibold mb-1">Certifications</div>
                              <div className="text-[15px] text-[#D6D1C9]">{certCount} verified credentials</div>
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
