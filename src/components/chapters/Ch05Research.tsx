"use client";
import { useMemo } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const ORCID_URL = "https://orcid.org/0009-0005-2576-8731";
const SSRN_URL = "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=9646252";

function OrcidLogo() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z"/></svg>); }
function SsrnLogo() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h8M7 17h6"/></svg>); }
function DoiIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>); }
function ReadIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>); }

export function Ch05Research() {
  const { research } = usePortfolio();
  const papers = (research?.length ? research : []).sort((a: any, b: any) => Number(b.year) - Number(a.year));

  const stats = useMemo(() => ({
    total: papers.length,
    withDOI: papers.filter((p: any) => p.doi).length,
    journals: [...new Set(papers.map((p: any) => p.journal).filter(Boolean))].length,
    domains: [...new Set(papers.flatMap((p: any) => p.keywords || []).filter(Boolean))].length,
  }), [papers]);

  const years = [...new Set(papers.map((p: any) => p.year).filter(Boolean))].sort((a: string, b: string) => Number(b) - Number(a));

  return (
    <section id="research" className="relative bg-[#0C0B0A] text-[#D6D1C9] chapter-pad section-reveal">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT SIDEBAR — Editorial Identity Panel */}
          <div className="lg:col-span-4 relative">
            {/* Background watermark */}
            <span className="absolute -top-8 -right-4 font-display italic text-[clamp(10rem,18vw,16rem)] leading-none text-[#F7F4EF]/[0.015] select-none pointer-events-none">06</span>

            <div className="lg:sticky lg:top-24 relative z-10">
              <div className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#A39A90] mb-3">
                <span className="text-[#D97A32] font-bold">06</span>
                Research Lab
              </div>
              <h2 className="font-display italic text-[clamp(2.4rem,4.5vw,3.4rem)] leading-[0.92] text-[#F7F4EF] mb-5">Publications</h2>
              <p className="text-[0.95rem] leading-[1.7] text-[#A39A90] mb-10 max-w-[20ch]">
                Published research across AI in HR, workforce analytics, and business strategy.
              </p>

              {/* ORCID & SSRN Profile Cards */}
              <div className="flex flex-col gap-2.5 mb-8">
                <a href={ORCID_URL} target="_blank" rel="noreferrer" className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.015] hover:border-[#A6CE39]/25 hover:-translate-y-1 transition-all duration-300">
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#A6CE3920", color: "#7DA128" }}><OrcidLogo /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.75rem] font-mono tracking-[0.08em] text-[#F7F4EF]">ORCID</div>
                    <div className="text-[0.68rem] font-mono text-[#7E756B] truncate">0009-0005-2576-8731</div>
                  </div>
                  <span className="text-[0.6rem] text-[#7E756B] group-hover:text-[#A6CE39] group-hover:translate-x-0.5 transition-all duration-300 shrink-0">→</span>
                </a>
                <a href={SSRN_URL} target="_blank" rel="noreferrer" className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.015] hover:border-[#154A7A]/25 hover:-translate-y-1 transition-all duration-300">
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#154A7A15", color: "#154A7A" }}><SsrnLogo /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.75rem] font-mono tracking-[0.08em] text-[#F7F4EF]">SSRN</div>
                    <div className="text-[0.68rem] font-mono text-[#7E756B]">Author Profile</div>
                  </div>
                  <span className="text-[0.6rem] text-[#7E756B] group-hover:text-[#154A7A] group-hover:translate-x-0.5 transition-all duration-300 shrink-0">→</span>
                </a>
              </div>

              <div className="h-px bg-white/[0.04] mb-8" />

              {/* Research Metrics */}
              <div className="space-y-4 mb-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#7E756B] font-semibold mb-4">Research Metrics</div>
                {[
                  { label: "Published Research", value: stats.total },
                  { label: "DOI Indexed", value: stats.withDOI },
                  { label: "Journal Publications", value: stats.journals },
                  { label: "Research Domains", value: stats.domains, suffix: "+" },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between">
                    <span className="text-[0.78rem] font-mono tracking-[0.04em] text-[#A39A90]">{s.label}</span>
                    <span className="font-display text-[1.8rem] leading-none text-[#D97A32]">{s.value}{s.suffix || ""}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.04] mb-8" />

              {/* Year Filter */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                <span className="w-full font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#7E756B] font-semibold mb-1">Year</span>
                {["All", ...years].map((y) => (
                  <button key={y} className={`px-3 py-1.5 rounded-full text-[0.7rem] font-mono tracking-[0.06em] transition-all duration-200
                    ${y === "All" ? "bg-[#D97A32]/10 border border-[#D97A32]/25 text-[#D97A32]" : "border border-white/[0.06] text-[#7E756B] hover:border-[#D97A32]/20 hover:text-[#A39A90]"}`}>
                    {y}
                  </button>
                ))}
              </div>

              {/* Research Areas */}
              <div>
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#7E756B] font-semibold mb-3">Research Areas</div>
                <div className="flex flex-wrap gap-1.5">
                  {["AI in HR", "People Analytics", "Business Strategy", "Organizational Behaviour", "Operations", "Consumer Behaviour"].map((a) => (
                    <span key={a} className="px-2.5 py-1.5 rounded-full border border-white/[0.06] text-[0.65rem] font-mono tracking-[0.04em] text-[#7E756B] hover:border-[#D97A32]/20 hover:text-[#D97A32] transition-all duration-200 cursor-pointer">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Publication Cards */}
          <div className="lg:col-span-8">
            <div className="space-y-5">
              {papers.map((p: any, i: number) => {
                const isFeatured = i === 0;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <motion.article
                    key={p.id}
                    className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-[280ms]
                      ${isFeatured
                        ? "border-[#E5DDD2]/60 shadow-lg shadow-black/10 bg-gradient-to-br from-[#F8F6F2] via-[#F8F6F2] to-[#F3EFE8]"
                        : "border-[#E5DDD2]/40 shadow-sm shadow-black/5 bg-[#F8F6F2]"}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                  >
                    {/* Watermark number */}
                    <span className="absolute top-4 right-6 font-display text-[clamp(5rem,8vw,8rem)] leading-none text-[#1B1B1B]/[0.03] select-none pointer-events-none">{num}</span>

                    <div className={`relative p-6 sm:p-8 ${isFeatured ? "sm:p-9" : ""}`}>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97A32]/8 border border-[#D97A32]/15 text-[0.65rem] font-mono uppercase tracking-[0.12em] text-[#D97A32] mb-4 font-semibold">
                          <span className="w-1 h-1 rounded-full bg-[#D97A32]" />
                          Featured
                        </span>
                      )}

                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="text-[0.7rem] font-mono tracking-[0.1em] uppercase px-2.5 py-1 rounded-full bg-[#F3EFE8] border border-[#E5DDD2] text-[#555555]">{p.year}</span>
                        <span className="text-[0.72rem] font-mono uppercase tracking-[0.14em] text-[#D97A32] font-semibold">{p.journal}</span>
                      </div>

                      <h3 className={`font-display text-[#1B1B1B] leading-[1.06] mb-3 transition-colors duration-300 group-hover:text-[#D97A32] font-medium tracking-[-0.01em]
                        ${isFeatured ? "text-[clamp(1.6rem,2vw,2.2rem)]" : "text-[clamp(1.3rem,1.6vw,1.8rem)]"}`}>
                        {p.title}
                      </h3>

                      <div className="text-[0.9rem] text-[#555555] mb-4 font-medium">{p.authors || "Manikanta R"}</div>

                      <p className="text-[0.95rem] leading-[1.7] text-[#444444] line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                        {p.abstract}
                      </p>

                      {p.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5">
                          {p.keywords.slice(0, 4).map((k: string) => (
                            <span key={k} className="h-[34px] inline-flex items-center px-3.5 rounded-full bg-[#F3EFE8] border border-[#E5DDD2] text-[0.7rem] font-mono tracking-[0.04em] text-[#555555] hover:border-[#D97A32]/40 hover:text-[#D97A32] hover:bg-[#D97A32]/5 transition-all duration-200 cursor-pointer">{k}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 mt-5 pt-4 border-t border-[#E5DDD2]/60">
                        {p.url && (
                          <motion.a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.75rem] font-mono tracking-[0.04em] text-[#1B1B1B] hover:text-[#D97A32] transition-colors duration-200 group/link" whileHover={{ x: 2 }}>
                            <ReadIcon /> Read Paper <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                          </motion.a>
                        )}
                        {p.doi && (
                          <motion.a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.75rem] font-mono tracking-[0.04em] text-[#555555] hover:text-[#1B1B1B] transition-colors duration-200 group/link" whileHover={{ x: 2 }}>
                            <DoiIcon /> DOI <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
