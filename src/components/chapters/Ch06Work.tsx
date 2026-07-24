"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";
import { SectionWelcome } from "@/components/motion/SectionWelcome";

/* ---------- library row (expandable) ---------- */
function LibraryRow({ project, index }: { project: any; index: number }) {
  const [open, setOpen] = useState(false);
  const related = project.related ?? {};

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
                  <div className="text-mono mt-2 text-eyebrow text-bone/75">{(project.stack || []).join(" · ")}</div>
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
                {project.reportUrl && (
                  <a href={project.reportUrl} target="_blank" rel="noreferrer" className="text-mono inline-block border border-bone/25 px-2 py-1 text-eyebrow text-bone/80 hover:border-vermilion hover:text-vermilion">
                    ↓ Download report
                  </a>
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
  const { projects } = usePortfolio();
  const [showAll, setShowAll] = useState(false);

  // featured first, then rest by year desc
  const ordered = [...(projects || [])].sort((a: any, b: any) => {
    if (!!b.featured !== !!a.featured) return Number(!!b.featured) - Number(!!a.featured);
    return Number(b.year) - Number(a.year);
  });

  const visible = showAll ? ordered : ordered.slice(0, 4);
  const hiddenCount = ordered.length - visible.length;

  return (
    <section id="work" data-mood="ink" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl">
        <SectionWelcome text="Welcome to my portfolio." className="mb-10" />
        <header className="mb-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-mono text-meta text-bone/55">/06 — Featured · Library · Case-driven</div>
            <h2 className="text-display mt-4 text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.96] text-bone">
              <MaskReveal>Strategic Projects & Innovation</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <Reveal>
              <p className="text-[1.05rem] leading-relaxed text-bone/75">Three case studies upfront — the full project library sits beneath, fully searchable. Built to scale from six projects to sixty without a redesign.</p>
              <div className="text-mono mt-4 text-eyebrow text-bone/45">
                {ordered.length} projects · tap any row to expand
              </div>
            </Reveal>
          </div>
        </header>

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
            {showAll ? "Show less ←" : `Read more →`}
          </button>
          <span className="text-mono text-eyebrow text-bone/45">
            {showAll
              ? `Showing all ${ordered.length} projects`
              : `Showing 4 of ${ordered.length} · tap Read more to view all`}
          </span>
        </div>
      </div>
    </section>
  );
}