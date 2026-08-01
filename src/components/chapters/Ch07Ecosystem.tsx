"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

type Cap = { id: string; name: string; domain: string };

const CARDS = [
  { id: "Analytics", label: "Analytics", icon: "📊", color: "#E0533D" },
  { id: "Artificial Intelligence", label: "AI & ML", icon: "🤖", color: "#7C5CFF" },
  { id: "Business", label: "Business", icon: "💼", color: "#F2B33D" },
  { id: "People & HR", label: "People & HR", icon: "👥", color: "#3DA9FC" },
  { id: "Research", label: "Research", icon: "📚", color: "#7C5CFF" },
  { id: "Leadership", label: "Leadership", icon: "⚡", color: "#E0533D" },
];

function PowerBILogo() { return (<svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="12" width="5" height="8" rx="1" fill="#F2C811"/><rect x="9.5" y="6" width="5" height="14" rx="1" fill="#F2C811"/><rect x="16" y="2" width="5" height="18" rx="1" fill="#F2C811"/></svg>); }
function ExcelLogo() { return (<svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="2" width="18" height="20" rx="2" fill="#217346"/><path d="M7 8h4l2 2.5L15 8h4v8h-4l-2 2.5L11 16H7V8z" fill="#fff"/></svg>); }
function SQLLogo() { return (<svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="2" width="18" height="20" rx="2" fill="#0072C6"/><path d="M7 7h10M7 10h8M7 13h10M7 16h6" stroke="#fff" strokeWidth="1.8" fill="none"/></svg>); }
function PythonLogo() { return (<svg width="18" height="18" viewBox="0 0 24 24"><defs><linearGradient id="py1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#387EB8"/><stop offset="100%" stopColor="#366994"/></linearGradient><linearGradient id="py2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FFE052"/><stop offset="100%" stopColor="#FFC331"/></linearGradient></defs><path d="M12 2C8.5 2 8 3.5 8 5v3h4.5v1H7c-2 0-3.5 1.2-3.5 4S5 17 7 17h1.5v-3c0-2 1-3.5 3-3.5H15c1.5 0 3-1.3 3-3.5S16.5 2 12 2z" fill="url(#py1)"/><path d="M12 22c3.5 0 4-1.5 4-3v-3h-4.5v-1H17c2 0 3.5-1.2 3.5-4S19 7 17 7h-1.5v3c0 2-1 3.5-3 3.5H9c-1.5 0-3 1.3-3 3.5S7.5 22 12 22z" fill="url(#py2)"/></svg>); }

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "Power BI": <PowerBILogo />,
  "Excel": <ExcelLogo />,
  "SQL": <SQLLogo />,
  "Python": <PythonLogo />,
  "Microsoft Excel": <ExcelLogo />,
  "Microsoft Excel (Advanced)": <ExcelLogo />,
};

export function Ch07Ecosystem() {
  const { capabilities: apiCaps, projects, research, certifications } = usePortfolio();
  const caps = (apiCaps?.length ? apiCaps : []) as Cap[];
  const projCount = (projects?.length || 0);
  const researchCount = (research?.length || 0);
  const certCount = (certifications?.length || 0);
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
    <section id="ecosystem" className="relative bg-[#14110F] text-[#F5F1EB] overflow-hidden" style={{ minHeight: "60vh" }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 font-mono text-[0.8rem] uppercase tracking-[0.16em] text-white/40 mb-3">
              <span className="text-[#D9782E] font-bold">05</span>
              <span className="w-4 h-px bg-white/15" />
              Core Expertise
            </div>
            <h2 className="font-display italic text-[clamp(2.4rem,5vw,3.8rem)] leading-[0.94] tracking-[-0.02em]">Capabilities</h2>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-right font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/30">
            <span>{caps.length} skills</span>
            <span>{projCount} projects</span>
            <span>{researchCount} papers</span>
            <span>{certCount} certs</span>
          </div>
        </div>

        {/* Helper text */}
        <div className="text-center mb-5">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/20">Click any capability to explore</span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CARDS.map((card, i) => {
            const items = byDomain.get(card.id) || [];
            const isOpen = expanded === card.id;
            const top3 = items.slice(0, 3).map((c) => c.name);

            return (
              <motion.div key={card.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                <motion.button
                  onClick={() => setExpanded(isOpen ? null : card.id)}
                  className={`w-full rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 group
                    ${isOpen
                      ? "border-[#D9782E]/50 bg-[#D9782E]/8 shadow-lg shadow-[#D9782E]/10"
                      : "border-white/8 bg-white/[0.02] hover:border-[#D9782E]/25 hover:bg-[#D9782E]/4 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D9782E]/5"}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                  <h3 className="font-display text-[1.05rem] sm:text-[1.15rem] leading-tight mb-1 group-hover:text-[#D9782E] transition-colors duration-300">{card.label}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {top3.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 text-[10px] font-mono text-white/40 truncate max-w-full">
                        {TOOL_ICONS[t] && <span className="shrink-0">{TOOL_ICONS[t]}</span>}
                        <span className="truncate">{t.length > 12 ? t.slice(0, 12) + "…" : t}</span>
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-[0.08em] uppercase text-white/25">{items.length} skills</span>
                    {isOpen ? (
                      <span className="text-[10px] font-mono tracking-[0.06em] text-[#D9782E]">✓ Active</span>
                    ) : (
                      <span className="text-[10px] font-mono tracking-[0.06em] text-white/15 group-hover:text-[#D9782E]/60 transition-colors duration-300">
                        Explore <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                      </span>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key={expanded}
              className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.8, 0.22, 1] }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/30 font-semibold mb-2">Technologies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(byDomain.get(expanded) || []).slice(0, 8).map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[11px] font-mono text-white/60">
                        {TOOL_ICONS[c.name]}
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/30 font-semibold mb-2">Projects</div>
                  <div className="text-[13px] text-white/50">{projCount} projects across {CARDS.length} domains</div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/30 font-semibold mb-2">Research</div>
                  <div className="text-[13px] text-white/50">{researchCount} published papers</div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/30 font-semibold mb-2">Certifications</div>
                  <div className="text-[13px] text-white/50">{certCount} verified credentials</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
