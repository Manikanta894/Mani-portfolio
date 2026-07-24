"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

const STAT_TARGETS: Record<string, string> = {
  "Awards": "#awards",
  "Certifications": "#credentials",
  "Research Papers": "#research",
  "Conference Presentations": "#awards",
  "Journal Publications": "#publications",
  "Programs Completed": "#credentials",
  "Learning Hours": "#credentials",
  "Skills Acquired": "#ecosystem",
};

function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useCountUp(target: number, durationMs = 1400, start = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return value;
}

function StatTile({ label, value, delay, onSelect }: { label: string; value: number; delay: number; onSelect?: (label: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(false);
  const v = useCountUp(value, 1600, inView);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const target = STAT_TARGETS[label];
  return (
    <Reveal delay={delay}>
      <button
        ref={ref}
        type="button"
        onClick={() => {
          onSelect?.(label);
          if (target) scrollToHash(target);
        }}
        className="group relative flex h-full w-full flex-col justify-between rounded-xl border border-bone/10 bg-bone/[0.02] p-6 text-left transition-all duration-500 hover:-translate-y-0.5 hover:border-vermilion/40 hover:bg-bone/[0.04]"
      >
        <div className="text-mono text-eyebrow uppercase tracking-[0.24em] text-bone/50 transition-colors group-hover:text-bone/75">
          {label}
        </div>
        <div className="mt-8 flex items-end justify-between gap-2">
          <div className="text-display text-[clamp(2.4rem,4.4vw,3.6rem)] font-light leading-[0.9] tracking-[-0.02em] text-bone">
            {v}
            {value >= 100 ? <span className="text-vermilion">+</span> : ""}
          </div>
          <span className="text-mono translate-y-[-2px] text-eyebrow uppercase tracking-[0.2em] text-bone/30 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-vermilion group-hover:opacity-100">
            ↗
          </span>
        </div>
      </button>
    </Reveal>
  );
}

export function Ch08Credentials() {
  const { certifications, awards } = usePortfolio();
  const [open, setOpen] = useState<any>(null);
  const [openAward, setOpenAward] = useState<any>(null);
  const [tab, setTab] = useState<"certs" | "honors">("certs");
  const [showAllCerts, setShowAllCerts] = useState(false);

  const list = useMemo(
    () => (certifications || []).slice().sort((a: any, b: any) => Number(b.year) - Number(a.year)),
    [certifications],
  );

  const awardsList = awards || [];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const stats = [
    { label: "Awards", value: awardsList.length || 6 },
    { label: "Certifications", value: list.length || 14 },
    { label: "Research Papers", value: 10 },
    { label: "Conference Presentations", value: 3 },
    { label: "Journal Publications", value: 4 },
    { label: "Programs Completed", value: 8 },
    { label: "Learning Hours", value: 420 },
    { label: "Skills Acquired", value: 38 },
  ];

  return (
    <section id="credentials" data-mood="graphite" className="relative chapter-pad grain">
      <div className="mx-auto max-w-6xl">
        <header className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="text-mono text-meta text-bone/55">
              /08 — Curated · Verified · Continuous
            </div>
            <h2 className="text-display mt-5 text-[clamp(2.8rem,7vw,5.8rem)] leading-[0.95] text-bone">
              <MaskReveal>Professional Certifications</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 flex items-end justify-start md:col-span-4 md:justify-end">
            <Reveal>
              <div className="text-mono text-eyebrow uppercase tracking-[0.22em] text-bone/45">
                Showing all certifications · {list.length} credentials
              </div>
            </Reveal>
          </div>
        </header>

        {/* Achievement Dashboard */}
        <div className="mt-24 grid grid-cols-2 gap-3 md:mt-32 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatTile
              key={s.label}
              label={s.label}
              value={s.value}
              delay={i * 0.06}
              onSelect={(label) => {
                if (label === "Awards" || label === "Conference Presentations") setTab("honors");
                else setTab("certs");
              }}
            />
          ))}
        </div>

        <div className="mb-10 mt-20 h-px w-full bg-gradient-to-r from-transparent via-bone/15 to-transparent" />

        {/* Tabs */}
        <div id="awards" className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" aria-label="Credentials tabs" className="inline-flex rounded-full border border-bone/15 bg-bone/[0.03] p-1">
            {([
              { id: "certs", label: `Certifications · ${list.length}` },
              { id: "honors", label: `Honors & Recognition · ${awardsList.length}` },
            ] as const).map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`text-mono relative rounded-full px-4 py-2 text-eyebrow uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-ink" : "text-bone/65 hover:text-bone"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cred-tab-bg"
                      className="absolute inset-0 rounded-full bg-bone"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
          <span className="text-mono text-eyebrow uppercase tracking-[0.18em] text-bone/45">
            {tab === "certs" ? "Verified on LinkedIn" : `${awardsList.length} recognitions`}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {tab === "certs" ? (
            <motion.div
              key="certs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="divide-y divide-bone/15 border-y border-bone/15">
                {(showAllCerts ? list : list.slice(0, 6)).map((c: any) => (
                  <li key={c.credentialId || c.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(c)}
                      className="group grid w-full grid-cols-12 items-baseline gap-4 py-4 text-left transition-colors hover:bg-bone/[0.04]"
                    >
                      <span className="col-span-2 md:col-span-1 text-mono text-eyebrow tabular-nums text-bone/55">{c.year}</span>
                      <span className="col-span-10 md:col-span-7 text-[0.98rem] leading-snug text-bone group-hover:text-vermilion">{c.name}</span>
                      <span className="hidden md:col-span-3 md:block text-mono text-eyebrow uppercase tracking-[0.16em] text-bone/55">{c.issuer}</span>
                      <span className="hidden md:col-span-1 md:block text-mono text-right text-eyebrow uppercase tracking-[0.16em] text-bone/45 group-hover:text-vermilion">open →</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {list.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCerts((v) => !v)}
                    className="text-mono inline-flex items-center gap-2 border border-bone/30 px-4 py-2 text-meta uppercase tracking-[0.16em] text-bone hover:border-vermilion hover:text-vermilion"
                  >
                    {showAllCerts ? "Show less ↑" : `Read more (${list.length - 6}) →`}
                  </button>
                )}
                <a href="https://linkedin.com/in/manikanta894/details/certifications/" target="_blank" rel="noreferrer" className="text-mono inline-flex items-center gap-2 text-eyebrow uppercase tracking-[0.16em] text-bone/65 hover:text-vermilion">
                  Verify on LinkedIn ↗
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="honors"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="divide-y divide-bone/15 border-y border-bone/15">
                {awardsList.map((a: any) => (
                  <li key={a.title || a.id}>
                    <button
                      type="button"
                      onClick={() => setOpenAward(a)}
                      className="group grid w-full grid-cols-12 items-baseline gap-4 py-4 text-left transition-colors hover:bg-bone/[0.04]"
                    >
                      <span className="col-span-2 md:col-span-1 text-mono text-eyebrow tabular-nums text-bone/55">{a.year}</span>
                      <span className="col-span-10 md:col-span-7 text-[0.98rem] leading-snug text-bone group-hover:text-vermilion">{a.title}</span>
                      <span className="hidden md:col-span-3 md:block text-mono text-eyebrow uppercase tracking-[0.16em] text-bone/55">{a.org}</span>
                      <span className="hidden md:col-span-1 md:block text-mono text-right text-eyebrow uppercase tracking-[0.16em] text-bone/45 group-hover:text-vermilion">open →</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/45">
                // curated · selective · the milestones worth pinning
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cert Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setOpen(null)}
          >
            <span aria-hidden className="absolute inset-0 bg-ink/82" style={{ backdropFilter: "blur(18px) saturate(140%)" }} />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 grid max-h-[88vh] w-full max-w-3xl grid-rows-[auto_1fr] overflow-hidden rounded-2xl border border-bone/15 bg-graphite shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-bone/12 bg-bone/[0.03] px-6 py-4">
                <div className="text-mono flex items-center gap-3 text-eyebrow uppercase tracking-[0.18em] text-bone/65">
                  <span className="text-vermilion">{open.tag}</span>
                  <span className="text-bone/35">·</span>
                  <span>{open.year}</span>
                  <span className="text-bone/35">·</span>
                  <span>{open.level}</span>
                </div>
                <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="text-mono rounded-full border border-bone/20 px-3 py-1 text-eyebrow uppercase tracking-[0.18em] text-bone/75 transition-colors hover:border-bone hover:text-bone">Close · esc</button>
              </div>
              <div className="overflow-y-auto px-6 py-7 sm:px-9 sm:py-10">
                <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/55">{open.issuer}</div>
                <h3 className="text-display mt-3 text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.1] text-bone">{open.name}</h3>
                <div className="text-mono mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-eyebrow uppercase tracking-[0.16em] text-bone/65">
                  <span className="inline-flex items-center gap-1.5 text-emerald-300/95">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/95" />
                    {open.verified ? "Verified credential" : "Pending verification"}
                  </span>
                  <span>ID · {open.credentialId}</span>
                  <span>{open.hours} learning hours</span>
                </div>
                <p className="text-serif mt-7 text-[clamp(1.02rem,1.35vw,1.18rem)] leading-[1.6] text-bone/82">{open.description}</p>
                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-bone/15 bg-gradient-to-br from-bone/[0.04] to-transparent p-5">
                    <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/55">Certificate preview</div>
                    <div className="mt-3 flex h-[calc(100%-1.5rem)] flex-col items-center justify-center text-center">
                      <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-vermilion">{open.issuer}</div>
                      <div className="text-display mt-3 text-[1.3rem] leading-[1.1] text-bone/90">{open.name}</div>
                      <div className="text-mono mt-3 text-eyebrow uppercase tracking-[0.18em] text-bone/45">{open.credentialId}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a href={open.verifyHref} target="_blank" rel="noreferrer noopener" className="text-mono flex items-center justify-between rounded-lg border border-vermilion/60 bg-vermilion/10 px-4 py-3 text-eyebrow uppercase tracking-[0.18em] text-bone transition-colors hover:bg-vermilion/20">
                      Official verification ↗ <span className="text-bone/65">external</span>
                    </a>
                    <div className="rounded-lg border border-bone/12 bg-bone/[0.02] p-4">
                      <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/55">Technology stack</div>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {(open.stack || []).map((s: string) => (
                          <li key={s} className="text-mono border border-bone/20 px-2 py-1 text-eyebrow uppercase tracking-[0.14em] text-bone/85">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="rounded-lg border border-bone/12 bg-bone/[0.02] p-5">
                    <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-vermilion">Learning outcomes</div>
                    <ul className="mt-3 space-y-2 text-[0.92rem] leading-[1.55] text-bone/82">
                      {(open.outcomes || []).map((o: string) => (
                        <li key={o} className="flex gap-2"><span className="mt-2 inline-block h-1 w-1 rounded-full bg-vermilion" /><span>{o}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-bone/12 bg-bone/[0.02] p-5">
                    <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-vermilion">Skills developed</div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {(open.skills || []).map((s: string) => (
                        <li key={s} className="text-mono border border-bone/20 px-2.5 py-1 text-eyebrow uppercase tracking-[0.14em] text-bone/85">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-7 grid grid-cols-1 gap-2 border-t border-bone/12 pt-5 sm:grid-cols-3">
                  {[
                    { label: "Projects", items: open.related?.projects ?? [], href: "#work" },
                    { label: "Research", items: open.related?.research ?? [], href: "#research" },
                    { label: "Experience", items: open.related?.experience ?? [], href: "#experience" },
                  ].map((g) => (
                    <a key={g.label} href={g.href} onClick={() => setOpen(null)} className="block rounded-lg border border-bone/12 bg-bone/[0.02] p-4 transition-colors hover:border-vermilion/60">
                      <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/55">Related {g.label}</div>
                      <div className="mt-2 text-[0.85rem] leading-[1.4] text-bone/85">{g.items.length ? g.items.join(" · ") : "Explore section →"}</div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Award Modal */}
      <AnimatePresence>
        {openAward && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setOpenAward(null)}
          >
            <span aria-hidden className="absolute inset-0 bg-ink/82" style={{ backdropFilter: "blur(18px) saturate(140%)" }} />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 grid max-h-[88vh] w-full max-w-3xl grid-rows-[auto_1fr] overflow-hidden rounded-2xl border border-bone/15 bg-graphite shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-bone/12 bg-bone/[0.03] px-6 py-4">
                <div className="flex items-center gap-3 text-mono text-eyebrow uppercase tracking-[0.18em] text-bone/65">
                  <span className="text-vermilion">{openAward.kind}</span>
                  <span className="text-bone/35">·</span>
                  <span>{openAward.year}</span>
                  <span className="text-bone/35">·</span>
                  <span>{openAward.location}</span>
                </div>
                <button type="button" aria-label="Close" onClick={() => setOpenAward(null)} className="text-mono rounded-full border border-bone/20 px-3 py-1 text-eyebrow uppercase tracking-[0.18em] text-bone/75 transition-colors hover:border-bone hover:text-bone">Close · esc</button>
              </div>
              <div className="overflow-y-auto px-6 py-7 sm:px-9 sm:py-10">
                <h3 className="text-display text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.08] text-bone">{openAward.title}</h3>
                <div className="text-mono mt-3 text-meta uppercase tracking-[0.18em] text-bone/65">{openAward.org} · {openAward.category}</div>
                <p className="text-serif mt-7 text-[clamp(1.05rem,1.4vw,1.2rem)] leading-[1.6] text-bone/80">{openAward.story}</p>
                <div className="mt-7 rounded-lg border border-bone/12 bg-bone/[0.02] p-5">
                  <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-vermilion">Why it mattered</div>
                  <p className="mt-3 text-[0.98rem] leading-[1.6] text-bone/82">{openAward.why}</p>
                </div>
                {openAward.skills?.length ? (
                  <div className="mt-7">
                    <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/55">Skills gained</div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {openAward.skills.map((s: string) => (
                        <li key={s} className="text-mono border border-bone/20 px-2.5 py-1 text-eyebrow uppercase tracking-[0.14em] text-bone/80">{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-7 grid grid-cols-1 gap-2 border-t border-bone/12 pt-5 sm:grid-cols-3">
                  {[
                    { label: "Research", items: openAward.related?.research ?? [], href: "#research" },
                    { label: "Projects", items: openAward.related?.projects ?? [], href: "#work" },
                    { label: "Experience", items: openAward.related?.experience ?? [], href: "#experience" },
                  ].map((g) => (
                    <a key={g.label} href={g.href} onClick={() => setOpenAward(null)} className="block rounded-lg border border-bone/12 bg-bone/[0.02] p-4 transition-colors hover:border-vermilion/60">
                      <div className="text-mono text-eyebrow uppercase tracking-[0.2em] text-bone/55">Related {g.label}</div>
                      <div className="mt-2 text-[0.85rem] leading-[1.4] text-bone/85">{g.items.length ? g.items.join(" · ") : "Explore section →"}</div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}