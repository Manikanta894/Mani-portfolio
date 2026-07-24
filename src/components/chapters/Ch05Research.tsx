"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

function copy(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(text);
}

/* ---------- compact paper row ---------- */
function PaperRow({ paper, index }: { paper: any; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={index * 0.04}>
      <div className="border-b border-ink/12">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid w-full grid-cols-12 items-baseline gap-4 py-5 text-left transition-colors hover:bg-ink/[0.03]"
        >
          <span className="col-span-2 md:col-span-1 text-mono text-meta tabular-nums text-graphite/65">
            {paper.year}
          </span>
          <span className="col-span-10 md:col-span-7 text-[1rem] leading-snug md:text-[1.05rem]">
            {paper.title}
          </span>
          <span className="hidden md:col-span-3 md:block text-mono text-eyebrow text-graphite/55 truncate">
            {paper.journal}
          </span>
          <span className="col-span-12 md:col-span-1 text-right md:text-right">
            <span
              className={`inline-block border px-1.5 py-0.5 text-mono text-eyebrow ${
                paper.status === "Published"
                  ? "border-vermilion/50 text-vermilion"
                  : "border-ink/25 text-graphite"
              }`}
            >
              {paper.status}
            </span>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-8 pt-2 md:pb-10">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-8 space-y-4">
                    <p className="text-[0.95rem] leading-relaxed text-graphite">
                      {paper.abstract}
                    </p>
                    {paper.findings?.length > 0 && (
                      <div>
                        <div className="text-mono text-eyebrow text-graphite/55 mb-2">
                          KEY FINDINGS
                        </div>
                        <ul className="space-y-1.5">
                          {paper.findings.slice(0, 3).map((f: string, i: number) => (
                            <li key={i} className="text-[0.9rem] leading-relaxed">
                              <span className="text-vermilion mr-2">—</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <aside className="col-span-12 md:col-span-4 space-y-4 border-l border-ink/10 md:pl-6">
                    <div className="flex flex-wrap gap-2 text-mono text-eyebrow">
                      {paper.url && (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-ink/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                        >
                          ↗ Publication
                        </a>
                      )}
                      {paper.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="border border-ink/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                        >
                          DOI
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => copy(paper.citation?.apa || "")}
                        className="border border-ink/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                      >
                        Copy APA
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(paper.keywords || []).slice(0, 5).map((k: string) => (
                        <span
                          key={k}
                          className="border border-ink/20 px-2 py-0.5 text-mono text-eyebrow"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                    <div className="text-mono text-eyebrow text-graphite/55 space-y-1">
                      <div className="flex justify-between gap-2">
                        <span>Read</span>
                        <span>{paper.readTime || paper.reading_time || ""}</span>
                      </div>
                      {paper.references !== undefined && (
                        <div className="flex justify-between gap-2">
                          <span>Refs</span>
                          <span>{paper.references}</span>
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/* ---------- main ---------- */
export function Ch05Research() {
  const { research, researchThemes } = usePortfolio();
  const [showAll, setShowAll] = useState(false);

  const ordered = useMemo(
    () =>
      [...(research || [])].sort((a: any, b: any) => {
        if (!!b.featured !== !!a.featured) return Number(!!b.featured) - Number(!!a.featured);
        return Number(b.year) - Number(a.year);
      }),
    [research],
  );

  const visible = showAll ? ordered : ordered.slice(0, 5);

  return (
    <section id="research" data-mood="warm" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-mono text-meta text-graphite/60">
              /05 — Working papers · Frontier topics
            </div>
            <h2 className="text-display mt-4 text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.96]">
              <MaskReveal>Research & Innovation Lab</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <Reveal>
              <p className="text-[1.05rem] leading-relaxed text-graphite">
                A working research lab, not a list. Featured studies below open in place — the full archive sits beneath, fully searchable.
              </p>
            </Reveal>
          </div>
        </header>

        {/* compact paper list */}
        <div className="border-t border-ink/15">
          {visible.map((p: any, i: number) => (
            <PaperRow key={p.id || i} paper={p} index={i} />
          ))}
        </div>

        {/* read more */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-mono inline-flex items-center gap-2 border border-ink/30 px-4 py-2 text-meta uppercase tracking-[0.16em] text-ink hover:border-vermilion hover:text-vermilion"
            >
              Read more papers →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="text-mono inline-flex items-center gap-2 border border-ink/30 px-4 py-2 text-meta uppercase tracking-[0.16em] text-ink hover:border-vermilion hover:text-vermilion"
            >
              Show less ↑
            </button>
          )}
          <span className="text-mono text-eyebrow text-graphite/55">
            {showAll
              ? `Showing all ${ordered.length} papers`
              : `Showing 5 of ${ordered.length} papers`}
            {" "}· full archive on{" "}
            <a
              href="https://orcid.org/0009-0005-2576-8731"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-vermilion"
            >
              ORCID
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}