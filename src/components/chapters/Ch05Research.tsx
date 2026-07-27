"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

function copy(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(text);
}

/* Same palette as the Ecosystem domain wheel, so a paper's category
   ties visually back to where that skill lives on the site. */
const CATEGORY_COLORS: Record<string, string> = {
  "analytics": "#E0533D",
  "ai": "#7C5CFF",
  "artificial intelligence": "#7C5CFF",
  "people & hr": "#3DA9FC",
  "hr": "#3DA9FC",
  "business": "#F2B33D",
  "research": "#7C5CFF",
};
function categoryColor(cat?: string) {
  return CATEGORY_COLORS[(cat || "").toLowerCase().trim()] || "var(--vermilion)";
}

/* ---------- compact paper row ---------- */
function PaperRow({ paper, index }: { paper: any; index: number }) {
  const [open, setOpen] = useState(false);
  const accent = categoryColor(paper.category);

  return (
    <Reveal delay={index * 0.04}>
      <div className="group relative border-b border-bone/12 transition-colors" style={{ "--row-accent": accent } as any}>
        <span aria-hidden className="absolute left-0 top-0 h-full w-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: accent }} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid w-full grid-cols-12 items-baseline gap-4 py-5 pl-4 text-left transition-colors hover:bg-bone/[0.05]"
        >
          <span className="col-span-2 md:col-span-1 text-mono text-meta tabular-nums text-bone/65">
            {paper.year}
          </span>
          <span className="col-span-10 md:col-span-6 text-[1rem] leading-snug md:text-[1.05rem]">
            <span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: accent }} />
            {paper.title}
          </span>
          <span className="hidden md:col-span-2 md:block text-mono text-eyebrow text-bone/55 truncate">
            {paper.journal}
          </span>
          <span className="col-span-8 md:col-span-2 text-mono text-eyebrow text-bone/40 truncate">
            {paper.category}
          </span>
          <span className="col-span-4 md:col-span-1 text-right md:text-right">
            {paper.status === "Published" ? (
              <span className="inline-block border border-vermilion bg-vermilion/15 px-1.5 py-0.5 text-mono text-eyebrow text-vermilion shadow-[0_0_12px_-4px_var(--vermilion)]">
                Published
              </span>
            ) : (
              <span className="inline-block border border-dashed border-bone/30 px-1.5 py-0.5 text-mono text-eyebrow text-bone/60">
                Pending
              </span>
            )}
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
                    <p className="text-[0.95rem] leading-relaxed text-bone/85">
                      {paper.abstract}
                    </p>
                    {paper.findings?.length > 0 && (
                      <div>
                        <div className="text-mono text-eyebrow text-bone/55 mb-2">
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
                    <aside className="col-span-12 md:col-span-4 space-y-4 border-l border-bone/10 md:pl-6">
                      <div className="flex flex-wrap gap-2 text-mono text-eyebrow">
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-bone/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                          >
                            ↗ Publication
                          </a>
                        )}
                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-bone/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                          >
                            DOI
                          </a>
                        )}
                        {paper.ssrn_url && (
                          <a
                            href={paper.ssrn_url}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-bone/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                          >
                            ⧉ SSRN
                          </a>
                        )}
                        {paper.pdf_url && (
                          <a
                            href={paper.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-bone/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                          >
                            ⬇ PDF
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => copy(paper.citation?.apa || "")}
                          className="border border-bone/25 px-2 py-1 hover:border-vermilion hover:text-vermilion"
                        >
                          Copy APA
                        </button>
                      </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(paper.keywords || []).slice(0, 5).map((k: string) => (
                        <span
                          key={k}
                          className="border border-bone/20 px-2 py-0.5 text-mono text-eyebrow"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                    <div className="text-mono text-eyebrow text-bone/55 space-y-1">
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
  const { research, researchThemes, sectionContent } = usePortfolio();
  const [showAll, setShowAll] = useState(false);
  const sc = sectionContent.research || {};

  const ordered = useMemo(
    () =>
      [...(research || [])].sort((a: any, b: any) => {
        if (!!b.featured !== !!a.featured) return Number(!!b.featured) - Number(!!a.featured);
        return Number(b.year) - Number(a.year);
      }),
    [research],
  );

  const visible = showAll ? ordered : ordered.slice(0, 5);
  const sectionNumber = sc.number || "06";
  const sectionLabel = sc.label || "Working papers · Frontier topics";
  const sectionTitle = sc.title || "Research & Innovation Lab";
  const sectionLede = sc.lede || "A working research lab, not a list. Featured studies below open in place — the full archive sits beneath, fully searchable.";
  const orcidUrl = sc.orcid_url || "https://orcid.org/0009-0005-2576-8731";
  const orcidLabel = sc.orcid_label || "ORCID";
  const readMoreLabel = sc.read_more_label || "Read more papers →";
  const showLessLabel = sc.show_less_label || "Show less ↑";
  const archivePrefix = sc.archive_prefix || "full archive on";
  const archiveLabel = sc.archive_label || "ORCID";

  return (
    <section id="research" data-mood="ink" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-mono text-meta text-bone/60">
              /{sectionNumber} — {sectionLabel}
            </div>
            <h2 className="text-display mt-4 text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.96]">
              <MaskReveal>{sectionTitle}</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <Reveal>
              <p className="text-[1.05rem] leading-relaxed text-bone/85">
                {sectionLede}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-5 flex gap-px overflow-hidden border border-bone/15 bg-bone/10">
                {[
                  { label: "Published", value: ordered.filter((p: any) => p.status === "Published").length, color: "#D46A2E" },
                  { label: "Pending", value: ordered.filter((p: any) => p.status !== "Published").length, color: "#8F887F" },
                  { label: "Total", value: ordered.length, color: "var(--vermilion)" },
                ].map((s) => (
                  <div key={s.label} className="flex-1 bg-ink px-4 py-3">
                    <div className="text-display text-2xl leading-none" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-mono mt-1 text-eyebrow uppercase tracking-[0.12em] text-bone/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <a
                href={orcidUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded border border-bone/25 px-3 py-1.5 text-mono text-eyebrow text-bone/70 hover:border-vermilion hover:text-vermilion"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                  <path fill="currentColor" d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-3.903-3.722h-2.416z"/>
                </svg>
                {orcidLabel}
              </a>
            </Reveal>
          </div>
        </header>

        {/* compact paper list */}
        <div className="border-t border-bone/15">
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
              className="text-mono inline-flex items-center gap-2 border border-bone/30 px-4 py-2 text-meta uppercase tracking-[0.16em] text-bone hover:border-vermilion hover:text-vermilion"
            >
              {readMoreLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="text-mono inline-flex items-center gap-2 border border-bone/30 px-4 py-2 text-meta uppercase tracking-[0.16em] text-bone hover:border-vermilion hover:text-vermilion"
            >
              {showLessLabel}
            </button>
          )}
          <span className="text-mono text-eyebrow text-bone/55">
            {showAll
              ? `Showing all ${ordered.length} papers`
              : `Showing 5 of ${ordered.length} papers`}
            {" "}· {archivePrefix}{" "}
            <a
              href={orcidUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-vermilion"
            >
              {archiveLabel}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
