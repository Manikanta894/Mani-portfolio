"use client";
import { useMemo } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const ORCID_URL = "https://orcid.org/0009-0005-2576-8731";
const SSRN_URL = "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=9646252";

function OrcidLogo() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z" fill="currentColor"/></svg>); }
function SsrnLogo() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h8M7 17h6"/></svg>); }
function DoiLogo() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>); }
function PdfIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-4h4v4M9 13h4"/></svg>); }

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
    <section id="research" className="relative bg-[#0C0B0A] text-[#D6D1C9] chapter-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT — Info + Stats */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#A39A90] mb-2">
                <span className="text-[#D97A32] font-bold">06</span>
                Research Lab
              </div>
              <h2 className="font-display italic text-[clamp(2rem,4vw,3rem)] leading-[0.94] text-[#F7F4EF] mb-4">Publications</h2>
              <p className="text-[0.9rem] leading-relaxed text-[#A39A90] mb-8 max-w-[32ch]">
                Published research across AI in HR, workforce analytics, organizational behavior, and business strategy.
              </p>

              {/* Profile links */}
              <div className="flex flex-col gap-2 mb-8">
                <a href={ORCID_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#A6CE39]/30 hover:bg-white/[0.04] transition-all duration-300 group">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#A6CE3920", color: "#7DA128" }}><OrcidLogo /></span>
                  <span className="text-[0.8rem] font-mono text-[#A39A90] group-hover:text-[#D6D1C9] transition-colors">0009-0005-2576-8731</span>
                </a>
                <a href={SSRN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#154A7A]/30 hover:bg-white/[0.04] transition-all duration-300 group">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#154A7A15", color: "#154A7A" }}><SsrnLogo /></span>
                  <span className="text-[0.8rem] font-mono text-[#A39A90] group-hover:text-[#D6D1C9] transition-colors">SSRN Author</span>
                </a>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-8">
                {[
                  { label: "Published Research", value: stats.total },
                  { label: "DOI Indexed", value: stats.withDOI },
                  { label: "Journal Publications", value: stats.journals },
                  { label: "Research Domains", value: stats.domains },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between border-b border-white/[0.04] pb-2.5">
                    <span className="text-[0.75rem] font-mono tracking-[0.06em] text-[#7E756B]">{s.label}</span>
                    <span className="font-display text-[1.2rem] text-[#D6D1C9]">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Year timeline */}
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <span key={y} className="px-3 py-1 rounded-full border border-white/[0.06] text-[0.7rem] font-mono tracking-[0.08em] text-[#7E756B]">{y}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Publications */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {papers.map((p: any, i: number) => {
                const isFeatured = i === 0;
                return (
                  <motion.article
                    key={p.id}
                    className={`group rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-[#D97A32]/20 hover:bg-white/[0.025] hover:-translate-y-1 transition-all duration-400 overflow-hidden
                      ${isFeatured ? "shadow-lg shadow-black/20" : ""}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <div className={`p-5 sm:p-6 ${isFeatured ? "sm:p-7" : ""}`}>
                      {isFeatured && (
                        <span className="inline-block px-2.5 py-1 rounded-full bg-[#D97A32]/10 border border-[#D97A32]/20 text-[0.6rem] font-mono uppercase tracking-[0.1em] text-[#D97A32] mb-3 font-semibold">Featured</span>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-[0.7rem] font-mono tracking-[0.1em] uppercase px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[#A39A90]">{p.year}</span>
                        <span className="text-[0.7rem] font-mono tracking-[0.04em] text-[#7E756B]">{p.journal}</span>
                        {p.doi && (
                          <span className="inline-flex items-center gap-1 text-[0.65rem] font-mono text-[#7E756B]">
                            <DoiLogo /> {p.doi.slice(0, 25)}...
                          </span>
                        )}
                      </div>

                      <h3 className={`font-display italic text-[#F7F4EF] leading-[1.08] mb-2 transition-colors duration-300 group-hover:text-[#D97A32]
                        ${isFeatured ? "text-[clamp(1.2rem,1.6vw,1.5rem)]" : "text-[1.1rem]"}`}>
                        {p.title}
                      </h3>

                      <div className="text-[0.75rem] font-mono text-[#A39A90] mb-3">{p.authors || "Manikanta R"}</div>

                      <p className={`text-[0.88rem] leading-relaxed text-[#A39A90]/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-500`}>
                        {p.abstract}
                      </p>

                      {p.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {p.keywords.slice(0, 4).map((k: string) => (
                            <span key={k} className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[0.65rem] font-mono tracking-[0.04em] text-[#7E756B] hover:border-[#D97A32]/25 hover:text-[#D97A32] transition-all duration-200 cursor-pointer">{k}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 mt-5 pt-3 border-t border-white/[0.04]">
                        {p.url && (
                          <motion.a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.7rem] font-mono tracking-[0.04em] text-[#D97A32] hover:underline transition-all duration-200" whileHover={{ x: 2 }}>
                            <PdfIcon /> Read Paper →
                          </motion.a>
                        )}
                        {p.doi && (
                          <motion.a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.7rem] font-mono tracking-[0.04em] text-[#A39A90] hover:text-[#D6D1C9] hover:underline transition-all duration-200" whileHover={{ x: 2 }}>
                            <DoiLogo /> DOI →
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
