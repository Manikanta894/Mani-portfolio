"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MaskReveal, Reveal } from "@/components/motion/primitives";
import usePortfolio from "@/hooks/usePortfolio";

type Capability = { [key: string]: any; id: string; name: string; domain: string; stage: string; overview?: string; tools?: string[]; related?: string[]; next?: string; projects?: string[]; papers?: string[]; certifications?: string[]; experience?: string[]; articles?: string[]; };
type Domain = string;

const FALLBACK_STAGES = ["Learning", "Practicing", "Applying", "Researching", "Teaching", "Leading"];
const FALLBACK_DOMAINS: any[] = [
  { id: "Analytics", label: "Analytics", accent: "#E0533D", angle: -90, sort_order: 0 },
  { id: "Artificial Intelligence", label: "AI & ML", accent: "#7C5CFF", angle: -18, sort_order: 1 },
  { id: "People & HR", label: "People & HR", accent: "#3DA9FC", angle: 54, sort_order: 2 },
  { id: "Business", label: "Business", accent: "#F2B33D", angle: 126, sort_order: 3 },
  { id: "Research", label: "Research", accent: "#7C5CFF", angle: 198, sort_order: 4 },
];
const FALLBACK_STATS: any[] = [
  { sort_order: 0, label: "Capabilities", value: 16, hint: "tracked" },
  { sort_order: 1, label: "Domains", value: 5, hint: "interconnected" },
];

const SECTION = {
  number: "05",
  kicker: "Capabilities · Connected · Live",
  title: "Professional Operating System",
  intro:
    "Not a skills list — an operating system. Every capability shows where it was learned, where it was applied, and how it connects across research, projects, certifications and experience.",
  source: "Mirrored from LinkedIn · single source of truth",
};

// SECTION will be overridden by sectionContent.ecosystem if available

// Cross-link anchors to other chapters
const LINKS: Record<string, string> = {
  projects: "#work",
  papers: "#research",
  certifications: "#credentials",
  experience: "#experience",
  articles: "#journal",
};

function stageIndex(s: string) {
  return FALLBACK_STAGES.indexOf(s);
}

export function Ch07Ecosystem() {
  const { capabilities: apiCaps, capabilityDomains: apiDomains, ecosystemStats: apiStats, sectionContent } = usePortfolio();
  const sc = sectionContent.ecosystem || {};

  // Use API data if available, fall back to hardcoded fallbacks
  const effectiveCaps: Capability[] = (apiCaps?.length ? apiCaps : []) as Capability[];
  const effectiveDomains = apiDomains?.length ? apiDomains : FALLBACK_DOMAINS;
  const effectiveStats = apiStats?.length ? apiStats : FALLBACK_STATS;
  const STAGES = FALLBACK_STAGES;

  // Merge sectionContent overrides into SECTION
  const section = {
    ...SECTION,
    ...(sc.number ? { number: sc.number } : {}),
    ...(sc.kicker ? { kicker: sc.kicker } : {}),
    ...(sc.title ? { title: sc.title } : {}),
    ...(sc.intro ? { intro: sc.intro } : {}),
    ...(sc.source ? { source: sc.source } : {}),
  };

  const [active, setActive] = useState<Capability | null>(null);
  const [hoverDomain, setHoverDomain] = useState<Domain | null>(null);
  const [openCat, setOpenCat] = useState<Domain | null>(null);

  const byDomain = useMemo(() => {
    const m = new Map<Domain, Capability[]>();
    effectiveDomains.forEach((d: any) => m.set(d.id, []));
    effectiveCaps.forEach((c: any) => m.get(c.domain)?.push(c));
    return m;
  }, [effectiveCaps, effectiveDomains]);

  // ESC + scroll lock for side panel
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const W = 900;
  const H = 720;
  const cx = W / 2;
  const cy = H / 2;
  const R = 270;

  return (
    <section id="ecosystem" data-mood="ink" className="relative chapter-pad grain">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-mono text-meta text-bone/55">
              /{section.number} — {section.kicker}
            </div>
            <h2 className="text-display mt-4 text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.95] text-bone">
              <MaskReveal>{section.title}</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <Reveal>
              <p className="text-bone/75">{section.intro}</p>
              <p className="mt-4 text-mono text-eyebrow uppercase tracking-[0.15em] text-bone/45">
                {section.source}
              </p>
            </Reveal>
          </div>
        </header>

        {/* Live dashboard */}
        <div className="mb-16 grid grid-cols-2 gap-px overflow-hidden border border-bone/15 bg-bone/10 md:grid-cols-4">
          {effectiveStats.map((s: any, i: number) => (
            <DashTile key={s.label} {...s} delay={i * 60} />
          ))}
        </div>

        {/* Mobile: expandable category groups (no graph) */}
        <div className="md:hidden">
          <div className="border border-bone/15">
            {effectiveDomains.map((d: any) => {
              const items = byDomain.get(d.id) ?? [];
              const open = openCat === d.id;
              return (
                <div key={d.id} className="border-b border-bone/15 last:border-b-0">
                  <button onClick={() => setOpenCat(open ? null : d.id)} className="flex w-full items-center justify-between px-4 py-4 text-left">
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.accent }} />
                      <span className="text-display text-lg text-bone">{d.label}</span>
                    </span>
                    <span className="text-mono text-eyebrow text-bone/50">{items.length} · {open ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        {items.map((c: any) => (
                          <li key={c.id} className="border-t border-bone/10">
                            <button onClick={() => setActive(c as Capability)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                              <span className="text-bone/90">{c.name}</span>
                              <span className="text-mono text-eyebrow uppercase tracking-[0.12em] text-bone/45">{c.stage}</span>
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: capability groups grid below the architecture */}
        <div className="mt-20 hidden md:block">
          <header className="mb-6 flex items-end justify-between">
            <h3 className="text-display text-[clamp(1.5rem,3vw,2.4rem)] text-bone">Capability Groups</h3>
            <div className="text-mono text-eyebrow text-bone/50">{effectiveDomains.length} domains · {effectiveCaps.length} capabilities</div>
          </header>
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-bone/15 bg-bone/10 md:grid-cols-5">
            {effectiveDomains.map((d: any) => {
              const items = byDomain.get(d.id) ?? [];
              return (
                <div key={d.id} className="group bg-ink p-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.accent }} />
                    <h4 className="text-display text-lg text-bone">{d.label}</h4>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {items.map((c: any) => (
                      <li key={c.id}>
                        <button onClick={() => setActive(c as Capability)} className="flex w-full items-center justify-between gap-2 py-1 text-left text-sm text-bone/80 transition-colors hover:text-bone">
                          <span className="truncate">{c.name}</span>
                          <span className="shrink-0 text-mono text-eyebrow uppercase tracking-[0.1em] text-bone/40 group-hover:text-bone/60">{c.stage}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expertise stages — connected progression */}
        <div className="mt-20">
          <header className="mb-10 flex flex-col gap-1">
            <h3 className="text-display text-[clamp(1.8rem,3.6vw,3rem)] text-bone">Expertise Stages</h3>
            <p className="text-mono text-eyebrow tracking-[0.12em] text-bone/50">A progression, not a progress bar — each stage builds on the last</p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STAGES.filter((s) => effectiveCaps.some((c: any) => c.stage === s)).map((s, si, filteredStages) => {
              const items = effectiveCaps.filter((c: any) => c.stage === s);
              const colors = ["#E0533D", "#D46A2E", "#F2B33D", "#3DA9FC", "#7C5CFF", "#E0533D"];
              const color = colors[STAGES.indexOf(s) % colors.length];
              return (
                <div key={s} className="group relative">
                  {/* Connector line */}
                  {si < filteredStages.length - 1 && (
                    <div className="absolute -right-2 top-6 hidden h-px w-4 bg-gradient-to-r from-bone/30 to-transparent md:block" />
                  )}
                  <div className="relative rounded-sm border border-bone/12 bg-gradient-to-b from-bone/[0.03] to-transparent p-5 transition-all duration-300 hover:border-bone/30 hover:from-bone/[0.06]">
                    {/* Stage badge */}
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-mono text-xs font-bold tabular-nums"
                        style={{ background: `${color}22`, color }}
                      >
                        {String(STAGES.indexOf(s) + 1).padStart(2, "0")}
                      </span>
                      <span className="text-display text-xl tracking-tight text-bone">{s}</span>
                    </div>

                    {/* Divider */}
                    <div className="my-3 h-px w-full bg-gradient-to-r from-bone/15 to-transparent" />

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {items.slice(0, 5).map((c: any) => (
                        <button
                          key={c.id}
                          onClick={() => setActive(c as Capability)}
                          className="rounded-sm border border-bone/15 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-bone/70 transition-all duration-200 hover:border-vermilion/50 hover:text-vermilion hover:shadow-[0_0_12px_-4px_var(--vermilion)]"
                        >
                          {c.name}
                        </button>
                      ))}
                      {items.length > 5 && (
                        <span className="inline-flex items-center rounded-sm border border-dashed border-bone/20 px-2 py-1 text-[10px] text-bone/40">
                          +{items.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} className="fixed inset-0 z-[80] bg-ink/70 backdrop-blur-sm" />
            <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-bone/20 bg-ink text-bone">
              <CapabilityPanel cap={active} onClose={() => setActive(null)} onOpen={setActive} domains={effectiveDomains} caps={effectiveCaps} stages={STAGES} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─────────── Dashboard tile (count-up)
function DashTile({ label, value, hint, delay }: { label: string; value: number; hint: string; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now() + delay;
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - start) / dur));
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, delay]);
  return (
    <div className="bg-ink p-5">
      <div className="text-mono text-eyebrow uppercase tracking-[0.18em] text-bone/45">{label}</div>
      <div className="text-display mt-2 text-[clamp(2rem,3.6vw,3rem)] leading-none text-bone">{n}</div>
      <div className="mt-2 text-mono text-eyebrow text-bone/55">{hint}</div>
    </div>
  );
}

// ─────────── Side Panel
function CapabilityPanel({ cap, onClose, onOpen, domains, caps, stages }: { cap: Capability; onClose: () => void; onOpen: (c: Capability) => void; domains: any[]; caps: Capability[]; stages: string[] }) {
  const domain = (domains as any[]).find((d: any) => d.id === cap.domain)!;
  const related = (cap.related ?? [])
    .map((id) => (caps as any[]).find((c: any) => c.id === id))
    .filter(Boolean) as Capability[];

  const journey: { label: string; items?: string[]; href?: string }[] = [
    { label: "Experience", items: cap.experience, href: "#experience" },
    { label: "Certifications", items: cap.certifications, href: "#credentials" },
    { label: "Projects", items: cap.projects, href: "#work" },
    { label: "Research", items: cap.papers, href: "#research" },
    { label: "Articles", items: cap.articles, href: "#journal" },
  ].filter((s) => (s.items?.length ?? 0) > 0);

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-bone/15 bg-ink/95 px-6 py-5 backdrop-blur">
        <div>
          <div className="flex items-center gap-2 text-mono text-eyebrow uppercase tracking-[0.15em] text-bone/55">
            <span className="h-2 w-2 rounded-full" style={{ background: domain?.accent }} />
            {domain?.label}
            <span className="text-bone/30">·</span>
            <span style={{ color: domain?.accent }}>{cap.stage}</span>
          </div>
          <h3 className="text-display mt-2 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight text-bone">{cap.name}</h3>
        </div>
        <button onClick={onClose} className="rounded-full border border-bone/20 px-3 py-1 text-mono text-eyebrow uppercase tracking-[0.15em] text-bone/70 hover:border-bone/50 hover:text-bone">Close ✕</button>
      </div>
      <div className="space-y-8 px-6 py-8">
        <p className="text-lg leading-relaxed text-bone/85">{cap.overview}</p>
        <div>
          <SectionLabel>Stage</SectionLabel>
          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-1">
            {stages.map((s, i) => {
              const at = stageIndex(cap.stage);
              const reached = i <= at;
              return (
                <div key={s} className="text-center">
                  <div className="h-1.5 w-full" style={{ background: reached ? domain?.accent : "oklch(0.962 0.012 85 / 0.12)" }} />
                  <div className={`mt-1.5 text-eyebrow uppercase tracking-[0.12em] ${reached ? "text-bone/80" : "text-bone/35"}`}>{s}</div>
                </div>
              );
            })}
          </div>
        </div>
        {cap.tools && cap.tools.length > 0 && (
          <div>
            <SectionLabel>Tools & Technologies</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cap.tools.map((t) => <span key={t} className="border border-bone/20 px-2 py-1 text-xs text-bone/80">{t}</span>)}
            </div>
          </div>
        )}
        {journey.length > 0 && (
          <div>
            <SectionLabel>Where it was developed</SectionLabel>
            <ol className="mt-3 space-y-3">
              {journey.map((j) => (
                <li key={j.label} className="border-l border-bone/20 pl-4">
                  <a href={j.href} onClick={onClose} className="text-mono text-eyebrow uppercase tracking-[0.15em] text-bone/55 hover:text-bone">{j.label} →</a>
                  <ul className="mt-1 space-y-0.5 text-sm text-bone/85">{(j.items ?? []).map((it) => <li key={it}>{it}</li>)}</ul>
                </li>
              ))}
            </ol>
          </div>
        )}
        {cap.next && (
          <div>
            <SectionLabel>Next horizon</SectionLabel>
            <p className="mt-2 text-bone/80">{cap.next}</p>
          </div>
        )}
        {related.length > 0 && (
          <div>
            <SectionLabel>Related capabilities</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {related.map((r) => (
                <button key={r.id} onClick={() => onOpen(r)} className="border border-bone/20 px-2.5 py-1 text-xs text-bone/85 transition-colors hover:border-bone/50 hover:text-bone">{r.name} →</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-mono text-eyebrow uppercase tracking-[0.18em] text-bone/45">{children}</div>;
}
