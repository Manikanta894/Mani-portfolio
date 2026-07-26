"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";
import { SectionWelcome } from "@/components/motion/SectionWelcome";

/* ---------- link resolvers ----------
   Different Supabase migrations in this project have used different column
   names for the same thing (githubUrl / github_url / repo / links.github).
   These helpers check every variant so the button shows up no matter which
   one is actually populated in the live table. */
function getGithubUrl(project: any): string | null {
  return (
    project.githubUrl ||
    project.github_url ||
    project.repo ||
    project.repoUrl ||
    project.links?.github ||
    project.links?.repo ||
    null
  );
}
function getLiveDemoUrl(project: any): string | null {
  return (
    project.liveUrl ||
    project.live_demo_url ||
    project.liveDemoUrl ||
    project.demoUrl ||
    project.links?.demo ||
    project.links?.live ||
    (project.url && project.url !== getGithubUrl(project) ? project.url : null) ||
    null
  );
}

/* ---------- tech-stack colors ----------
   Small curated palette so stack tags aren't just flat mono text — each
   known tool/language gets its own accent dot. Unrecognized ones fall
   back to the site's vermilion accent so nothing ever looks broken. */
const TECH_COLORS: Record<string, string> = {
  "python": "#3776AB", "javascript": "#F0DB4F", "typescript": "#3178C6",
  "react": "#61DAFB", "node": "#3C873A", "node.js": "#3C873A",
  "sql": "#F29111", "postgresql": "#336791", "mysql": "#4479A1",
  "power bi": "#F2C811", "excel": "#217346", "tableau": "#E97627",
  "figma": "#A259FF", "aws": "#FF9900", "docker": "#2496ED",
  "git": "#F05032", "github": "#8B8B8B", "html": "#E34F26", "css": "#264DE4",
  "java": "#E76F00", "c++": "#00599C", "mongodb": "#47A248",
  "claude": "#D97757", "vlookup": "#217346", "pivot tables": "#217346",
  "strategic frameworks": "#BF91F3", "research methodology": "#38BDAE",
};
function getTechColor(tech: string): string {
  return TECH_COLORS[tech?.toLowerCase()?.trim()] || "var(--vermilion)";
}

/* ---------- library row (expandable) ---------- */
function LibraryRow({ project, index }: { project: any; index: number }) {
  const [open, setOpen] = useState(false);
  const related = project.related ?? {};
  const githubUrl = getGithubUrl(project);
  const liveUrl = getLiveDemoUrl(project);

  return (
    <motion.div layout className="border-b border-bone/12">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="grid w-full grid-cols-12 items-center gap-4 py-5 text-left text-bone transition-colors hover:bg-bone/[0.04]"
      >
        <div className="col-span-2 md:col-span-1 text-mono text-eyebrow tabular-nums text-bone/55">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="col-span-10 md:col-span-7">
          <div className="flex items-baseline gap-3">
            <h4 className="text-[1.05rem] leading-snug md:text-[1.18rem]">{project.name}</h4>
            {project.featured && (
              <span className="text-mono text-eyebrow uppercase tracking-[0.2em] text-vermilion">Featured</span>
            )}
          </div>
          <div className="text-mono mt-1 text-eyebrow text-bone/50">
            {project.client} · {project.year}
          </div>
        </div>
        <div className="hidden md:col-span-2 md:block text-mono text-eyebrow text-bone/60">{project.category}</div>
        <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2 text-mono text-eyebrow">
          <span className={`border px-1.5 py-0.5 ${project.status === "Completed" ? "border-vermilion/50 text-vermilion" : "border-bone/30 text-bone/70"}`}>
            {project.status}
          </span>
          <span className={`text-bone/45 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
        </div>
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
            <div className="grid grid-cols-12 gap-6 pb-10 text-bone">
              <div className="col-span-12 md:col-span-8 space-y-5">
                <p className="text-[1rem] leading-relaxed text-bone/80">{project.lede}</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Mini k="Problem" v={project.problem} />
                  <Mini k="Approach" v={project.approach} />
                </div>
                {project.insights && <Mini k="Insights" v={project.insights.map((i: string) => `· ${i}`).join("\n")} />}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Mini k="Outcome" v={project.outcome} />
                  <Mini k="Impact" v={project.impact} />
                </div>
                {project.lessons && (
                  <div className="border-l-2 border-vermilion pl-3">
                    <div className="text-mono text-eyebrow text-bone/50">LESSONS</div>
                    <p className="text-display mt-1 text-[1rem] italic leading-snug text-bone/90">{project.lessons}</p>
                  </div>
                )}
              </div>

              <aside className="col-span-12 space-y-5 border-l-0 border-bone/10 md:col-span-4 md:border-l md:pl-6">
                <div>
                  <div className="text-mono text-eyebrow text-bone/45">STACK</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(project.stack || []).map((t: string) => (
                      <span
                        key={t}
                        className="text-mono inline-flex items-center gap-1.5 border border-bone/20 px-2 py-1 text-eyebrow text-bone/85"
                      >
                        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: getTechColor(t) }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-mono text-eyebrow text-bone/45">SKILLS</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(project.skills || []).slice(0, 6).map((s: string) => (
                      <span key={s} className="border border-bone/25 px-2 py-0.5 text-mono text-eyebrow text-bone/80">{s}</span>
                    ))}
                  </div>
                </div>
                {(related.research?.length || related.certifications?.length || related.experience?.length) ? (
                  <div>
                    <div className="text-mono text-eyebrow text-bone/45">RELATED</div>
                    <div className="mt-2 space-y-1 text-[0.78rem]">
                      {related.research?.map((r: string) => <a key={r} href="#research" className="block text-bone/75 hover:text-vermilion">→ Paper {r.toUpperCase()}</a>)}
                      {related.certifications?.map((c: string) => <a key={c} href="#credentials" className="block text-bone/75 hover:text-vermilion">→ {c}</a>)}
                      {related.experience?.map((e: string) => <a key={e} href="#experience" className="block text-bone/75 hover:text-vermilion">→ {e}</a>)}
                    </div>
                  </div>
                ) : null}
                {(githubUrl || liveUrl || project.reportUrl) && (
                  <div className="flex flex-wrap gap-2">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-mono inline-flex items-center gap-1.5 border border-bone/25 px-2 py-1 text-eyebrow text-bone/80 hover:border-vermilion hover:text-vermilion"
                      >
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                        </svg>
                        View code
                      </a>
                    )}
                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-mono inline-block border border-bone/25 px-2 py-1 text-eyebrow text-bone/80 hover:border-vermilion hover:text-vermilion"
                      >
                        ↗ Live demo
                      </a>
                    )}
                    {project.reportUrl && (
                      <a
                        href={project.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-mono inline-block border border-bone/25 px-2 py-1 text-eyebrow text-bone/80 hover:border-vermilion hover:text-vermilion"
                      >
                        ↓ Download report
                      </a>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-mono text-eyebrow text-bone/45">{k.toUpperCase()}</div>
      <p className="mt-1.5 whitespace-pre-line text-[0.9rem] leading-relaxed text-bone/80">{v}</p>
    </div>
  );
}

/* ---------- main ---------- */
export function Ch06Work() {
  const { projects, sectionContent } = usePortfolio();
  const [showAll, setShowAll] = useState(false);
  const [tab, setTab] = useState<"case_study" | "practice">("case_study");
  const sc = sectionContent.work || {};

  // Which track a project belongs to. Anything without project_type/track
  // set defaults to "case_study" so existing data keeps working untouched.
  const trackOf = (p: any) => p.project_type || p.track || "case_study";

  // featured first, then rest by year desc
  const allOrdered = [...(projects || [])].sort((a: any, b: any) => {
    if (!!b.featured !== !!a.featured) return Number(!!b.featured) - Number(!!a.featured);
    return Number(b.year) - Number(a.year);
  });

  const caseStudies = allOrdered.filter((p: any) => trackOf(p) === "case_study");
  const practice = allOrdered.filter((p: any) => trackOf(p) === "practice");
  const ordered = tab === "case_study" ? caseStudies : practice;

  const visible = showAll ? ordered : ordered.slice(0, 4);
  const hiddenCount = ordered.length - visible.length;
  const sectionNumber = sc.number || "04";
  const sectionLabel = sc.label || "Featured · Library · Case-driven";
  const sectionTitle = sc.title || "Strategic Projects & Innovation";
  const sectionLede = sc.lede || "Three case studies upfront — the full project library sits beneath, fully searchable. Built to scale from six projects to sixty without a redesign.";
  const sectionHint = sc.hint || "projects · tap any row to expand";
  const readMoreLabel = sc.read_more_label || "Read more →";
  const showLessLabel = sc.show_less_label || "Show less ←";

  return (
    <section id="work" data-mood="ink" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl">
        <SectionWelcome text="Welcome to my portfolio." className="mb-10" />
        <header className="mb-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-mono text-meta text-bone/55">/{sectionNumber} — {sectionLabel}</div>
            <h2 className="text-display mt-4 text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.96] text-bone">
              <MaskReveal>{sectionTitle}</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <Reveal>
              <p className="text-[1.05rem] leading-relaxed text-bone/75">{sectionLede}</p>
              <div className="text-mono mt-4 text-eyebrow text-bone/45">
                {allOrdered.length} {sectionHint}
              </div>
            </Reveal>
          </div>
        </header>

        {practice.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div role="tablist" aria-label="Project track" className="inline-flex border border-bone/15 bg-bone/[0.03] p-1">
              {([
                { id: "case_study" as const, label: `Case Studies · ${caseStudies.length}` },
                { id: "practice" as const, label: `Practice & Learning · ${practice.length}` },
              ]).map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => { setTab(t.id); setShowAll(false); }}
                    className={`text-mono relative px-4 py-2 text-eyebrow uppercase tracking-[0.18em] transition-colors ${
                      active ? "bg-bone text-ink" : "text-bone/65 hover:text-bone"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t border-bone/20">
          {visible.map((p: any, i: number) => (
            <LibraryRow key={p.id || i} project={p} index={i} />
          ))}
        </div>

        <AnimatePresence>
          {showAll && hiddenCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-bone/20"
            >
              {ordered.slice(4).map((p: any, i: number) => (
                <LibraryRow key={p.id || i} project={p} index={i + 4} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex flex-col items-start gap-4">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-mono inline-flex items-center gap-2 border border-bone/30 px-5 py-2.5 text-meta uppercase tracking-[0.16em] text-bone transition-colors hover:border-vermilion hover:text-vermilion"
          >
            {showAll ? showLessLabel : readMoreLabel}
          </button>
          <span className="text-mono text-eyebrow text-bone/45">
            {showAll
              ? `Showing all ${ordered.length} projects`
              : `Showing ${Math.min(4, ordered.length)} of ${ordered.length} · tap Read more to view all`}
          </span>
        </div>
      </div>
    </section>
  );
}
