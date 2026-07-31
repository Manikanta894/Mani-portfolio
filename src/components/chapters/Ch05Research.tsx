"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

function apaCite(p: any) {
  const authors = (p.authors || "Manikanta R").split(",").map((a: string) => a.trim());
  const last = authors.length > 1 ? `& ${authors.pop()}` : authors[0];
  const authorStr = authors.length > 1 ? `${authors.join(", ")}, ${last}` : last;
  const year = p.year || "2026";
  const journal = p.journal ? ` ${p.journal}` : "";
  const vol = p.volume ? `, ${p.volume}` : "";
  const issue = p.issue ? `(${p.issue})` : "";
  const pages = p.pages ? `, ${p.pages}` : "";
  const doi = p.doi ? `. https://doi.org/${p.doi}` : "";
  return `${authorStr} (${year}). ${p.title}.${journal}${vol}${issue}${pages}${doi}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text);
}

const ORCID_URL = "https://orcid.org/0009-0005-2576-8731";
const SSRN_URL = "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=9646252";

function OrcidIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 8h2.2c1.8 0 3 .8 3 2.5s-1.2 2.5-3 2.5H8V8zm2.2 3.8c1 0 1.6-.5 1.6-1.3S11.2 9.2 10.2 9.2H9.3v2.6h.9zM8 14.5h2.5l1.5 2.5h1.5l-1.6-2.6c.9-.3 1.5-1.1 1.5-2 0-1.5-1-2.4-2.8-2.4H8v6.5z" fill="currentColor"/></svg>); }
function SsrnIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h8M7 17h6"/></svg>); }
function DocIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>); }

function CopyCitationBtn({ paper }: { paper: any }) {
  const [copied, setCopied] = useState(false);
  const cite = useMemo(() => apaCite(paper), [paper]);
  return (
    <button
      onClick={() => { copyToClipboard(cite); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-[0.04em] border border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink transition-colors"
    >
      {copied ? "Copied!" : "Copy APA"}
    </button>
  );
}

export function Ch05Research() {
  const { research } = usePortfolio();
  const papers = (research?.length ? research : []).sort((a: any, b: any) => Number(b.year) - Number(a.year));
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: papers.length,
    withDOI: papers.filter((p: any) => p.doi).length,
    journals: [...new Set(papers.map((p: any) => p.journal).filter(Boolean))].length,
  }), [papers]);

  return (
    <section id="research" data-mood="ink" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-14">
          <div className="flex items-center gap-3 text-mono text-[0.75rem] uppercase tracking-[0.2em] text-ink/40 mb-4">
            <span className="text-vermilion font-medium">06</span>
            <span className="w-8 h-px bg-ink/20" />
            Research & Innovation
          </div>
          <h2 className="font-display font-normal text-[clamp(3.2rem,7vw,6rem)] leading-[0.92] tracking-[-0.02em]">
            Research Lab
          </h2>
          <p className="mt-5 text-[1.05rem] text-ink/55 max-w-[52ch]">
            Published research across AI in HR, workforce analytics, and organizational behavior.
          </p>
        </header>

        {/* Profile badges */}
        <div className="flex flex-wrap gap-3 mb-12">
          <a href={ORCID_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-ink/10 bg-white/50 backdrop-blur-sm hover:border-[#A6CE39]/40 transition-colors group">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#A6CE3920", color: "#7DA128" }}>
              <OrcidIcon />
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] font-mono text-ink/40">ORCID</div>
              <div className="text-sm font-medium group-hover:text-[#7DA128] transition-colors">0009-0005-2576-8731</div>
            </div>
          </a>
          <a href={SSRN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-ink/10 bg-white/50 backdrop-blur-sm hover:border-[#154A7A]/40 transition-colors group">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#154A7A15", color: "#154A7A" }}>
              <SsrnIcon />
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] font-mono text-ink/40">SSRN</div>
              <div className="text-sm font-medium group-hover:text-[#154A7A] transition-colors">Author Page</div>
            </div>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          {[
            { label: "Papers", value: stats.total },
            { label: "DOI Indexed", value: stats.withDOI },
            { label: "Journals", value: stats.journals },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-5 text-center">
              <div className="font-display text-[clamp(2.4rem,4vw,3.2rem)] leading-none text-vermilion">{s.value}</div>
              <div className="text-[11px] uppercase tracking-[0.14em] font-mono text-ink/40 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Papers list */}
        <div className="space-y-3">
          {papers.map((p: any, i: number) => {
            const isOpen = expanded === p.id;
            return (
              <motion.article
                key={p.id}
                className={`rounded-2xl border bg-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300 ${isOpen ? "border-vermilion/30 shadow-md shadow-vermilion/5" : "border-ink/8 hover:border-ink/15"}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="w-full p-5 sm:p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[11px] uppercase tracking-[0.12em] font-mono px-3 py-1 rounded-full bg-vermilion/10 border border-vermilion/20 text-vermilion">{p.year}</span>
                        <span className="text-xs font-mono text-ink/40">{p.journal}</span>
                        {p.doi && <span className="text-[11px] font-mono text-ink/30">DOI: {p.doi}</span>}
                        {p.status && <span className={`text-[10px] uppercase tracking-[0.1em] font-mono px-2 py-0.5 rounded-full ${p.status === "Published" ? "bg-[#63c4a8]/10 border border-[#63c4a8]/30 text-[#63c4a8]" : "bg-amber-500/10 border border-amber-500/30 text-amber-500"}`}>{p.status}</span>}
                      </div>
                      <h3 className="font-display text-[1.3rem] leading-tight">{p.title}</h3>
                      <p className="text-sm text-ink/40 mt-1">{p.authors}</p>
                    </div>
                    <span className="text-ink/20 text-lg shrink-0 mt-1">{isOpen ? "−" : "+"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-ink/5">
                        <p className="text-[0.95rem] text-ink/65 leading-relaxed mb-5">{p.abstract}</p>
                        {p.keywords?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-5">
                            {p.keywords.map((k: string) => (
                              <span key={k} className="px-3 py-1.5 rounded-full text-[11px] font-mono tracking-[0.03em] bg-ink/5 border border-ink/8 text-ink/55">{k}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-[0.04em] bg-ink/90 text-bone hover:bg-ink transition-colors">
                              <DocIcon /> Read Paper
                            </a>
                          )}
                          {p.doi && (
                            <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono tracking-[0.04em] border border-ink/15 text-ink hover:border-ink/40 transition-colors">
                              DOI
                            </a>
                          )}
                          <CopyCitationBtn paper={p} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        {papers.length === 0 && (
          <p className="text-center py-16 text-ink/30 text-sm">Research papers coming soon.</p>
        )}
      </div>
    </section>
  );
}
