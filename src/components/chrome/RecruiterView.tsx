"use client";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

function Dot() { return <span className="w-1 h-1 rounded-full bg-vermilion shrink-0 mt-[0.6em]" />; }

export function RecruiterView({ onClose }: { onClose: () => void }) {
  const { profile, experience, education, certifications, research, capabilities } = usePortfolio();
  const p = profile || {};

  const exps = (experience || []).map((e: any) => ({
    role: e.role,
    company: e.company,
    span: e.start_date ? `${e.start_date} — ${e.current ? "Present" : e.end_date || ""}` : e.duration || "",
    points: Array.isArray(e.highlights) ? e.highlights : [],
  }));

  const edus = (education || []).map((e: any) => ({
    degree: e.field ? `${e.degree}, ${e.field}` : e.degree,
    school: e.institution || e.school,
    span: e.start_date ? `${e.start_date} — ${e.end_date || (e.status === "Current" ? "Present" : "")}` : e.era || "",
    points: Array.isArray(e.highlights) ? e.highlights : [],
  }));

  const certs = (certifications || []).slice(0, 8);
  const papers = (research || []).slice(0, 4);
  const skills = (capabilities || []).slice(0, 16);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-bone overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16 print:py-4 print:px-0">
        {/* Close */}
        <div className="flex items-center justify-between mb-10 print:hidden">
          <span className="text-mono text-[10px] uppercase tracking-[0.2em] text-ink/30">Recruiter View</span>
          <button onClick={onClose} className="text-mono text-xs tracking-[0.1em] uppercase border border-ink/20 px-4 py-2 rounded-full hover:bg-ink hover:text-bone transition-colors">
            ← Back to full site
          </button>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-[2.8rem] leading-[0.95] tracking-[-0.02em]">{p.name || "Manikanta R"}</h1>
          <p className="mt-2 text-lg text-ink/60">{p.tagline || p.role || ""}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-ink/45 font-mono">
            <span>{p.location || "Bengaluru"}</span>
            <span>{p.email || "hello@manikantar.in"}</span>
            <span>linkedin.com/in/manikanta894</span>
            {p.phone && <span>{p.phone}</span>}
          </div>
          {p.target_roles?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {p.target_roles.map((r: string) => (
                <span key={r} className="px-3 py-1 rounded-full text-[11px] font-mono tracking-[0.04em] bg-vermilion/10 border border-vermilion/20 text-vermilion">{r}</span>
              ))}
            </div>
          )}
        </div>

        {/* Experience */}
        <Section title="Experience">
          {exps.map((e: any, i: number) => (
            <div key={i} className="mb-6">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h3 className="font-semibold text-base">{e.role}</h3>
                <span className="text-xs font-mono text-ink/40">{e.span}</span>
              </div>
              <div className="text-sm text-ink/50 font-mono">{e.company}</div>
              {e.points.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {e.points.map((p: string, j: number) => (
                    <li key={j} className="flex gap-2 text-sm text-ink/70">
                      <Dot /> {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>

        {/* Education */}
        <Section title="Education">
          {edus.map((e: any, i: number) => (
            <div key={i} className="mb-4">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h3 className="font-semibold text-base">{e.degree}</h3>
                <span className="text-xs font-mono text-ink/40">{e.span}</span>
              </div>
              <div className="text-sm text-ink/50 font-mono">{e.school}</div>
              {e.points.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {e.points.slice(0, 2).map((p: string, j: number) => (
                    <li key={j} className="flex gap-2 text-sm text-ink/70"><Dot /> {p}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>

        {/* Research */}
        {papers.length > 0 && (
          <Section title="Research">
            {papers.map((r: any, i: number) => (
              <div key={i} className="mb-3 flex gap-3">
                <span className="text-xs font-mono text-ink/30 shrink-0">{r.year}</span>
                <div>
                  <h4 className="text-sm font-medium leading-snug">{r.title}</h4>
                  <div className="text-xs text-ink/45 font-mono mt-0.5">{r.journal}</div>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <Section title="Certifications">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {certs.map((c: any) => (
                <div key={c.id} className="flex justify-between text-sm">
                  <span className="text-ink/70 truncate">{c.title}</span>
                  <span className="text-xs font-mono text-ink/35 shrink-0 ml-2">{c.issuer}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Core Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((s: any) => (
                <span key={s.id} className="px-3 py-1 rounded-full text-[11px] font-mono tracking-[0.02em] bg-ink/5 border border-ink/10 text-ink/60">{s.name}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Print hint */}
        <div className="mt-8 pt-6 border-t border-ink/10 text-center text-xs font-mono text-ink/25 print:hidden">
          Press Ctrl+P to save as PDF · {p.name || "Manikanta R"} — {p.location || "Bengaluru"}
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-[11px] uppercase tracking-[0.2em] font-mono text-vermilion font-semibold mb-3 pb-2 border-b border-ink/10">{title}</h2>
      {children}
    </div>
  );
}
