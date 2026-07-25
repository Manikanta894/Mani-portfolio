"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal, SplitWords } from "@/components/motion/primitives";
import { CHAPTER_NUMBERS } from "@/lib/chapterNumbers";

/* ─────────────────────────────────────────────────────────────
   Ch01 — "The Story Behind the Work"
   An editorial, four-act narrative:
     I.   The Beginning
     II.  The Turning Point
     III. Today
     IV.  The Future
   With a sticky journey rail, a reading-spotlight on the active
   chapter, animated counters, and quiet editorial marginalia.
   ───────────────────────────────────────────────────────────── */

type Beat = {
  no: string;
  era: string;
  title: string;
  lede: string;
  body: string;
  pull?: string;
};

/* Animated counter — counts up once when it enters the viewport. */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          setN(Math.round(to * ease(t)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      <span className="about-metric__suffix">{suffix}</span>
    </span>
  );
}

export function Ch01About() {
  const { profile, aboutBeats, aboutMilestones, aboutMetrics } = usePortfolio();

  const BEATS: Beat[] = (aboutBeats?.length ? aboutBeats : [
    { no: "I", era: "Childhood · Karnataka", title: "The Beginning", lede: "Curiosity came before language for the work.", body: "I didn't start with a plan. I started with a notebook full of questions about why businesses worked the way they did — and a slow, stubborn refusal to take answers at face value.", pull: "I collected questions the way other kids collected stickers." },
    { no: "II", era: "2019 — 2024 · The retail floor & the first dataset", title: "The Turning Point", lede: "Where curiosity met evidence.", body: "The discipline came from necessity. On the retail floor, every inventory call and customer interaction quietly revealed how data shapes business outcomes.", pull: "The first chart that proved me wrong became the most honest mentor I ever had." },
    { no: "III", era: "2025 — Now · Bengaluru", title: "Today", lede: "At the seam between people, process and prediction.", body: "Today I'm an MBA candidate in HR & Business Analytics at Nagarjuna Degree College, Bengaluru." },
    { no: "IV", era: "2026 → 2036 · The horizon", title: "The Future", lede: "A decade-long bet on human-centered AI.", body: "Over the next decade I want to help write the playbook for human-centered AI inside organizations.", pull: "Build for the team you'll have in three years." },
  ]);

  const MILESTONES: string[] = (aboutMilestones?.length ? aboutMilestones.map((m: any) => m.label || m) : [
    "Curiosity", "Learning", "Research", "Analytics", "Innovation", "Impact",
  ]);

  const METRICS = (aboutMetrics?.length ? aboutMetrics : [
    { label: "Research Papers", value: 4, suffix: "", target: "research" },
    { label: "Certifications", value: 10, suffix: "+", target: "credentials" },
    { label: "Projects", value: 12, suffix: "+", target: "work" },
    { label: "Publications", value: 2, suffix: "", target: "research" },
  ]);

  const aboutData = {
    number: CHAPTER_NUMBERS.about,
    kicker: "Origin / Position",
    epigraph: profile?.about_epigraph || "I didn't start with a plan. I started with curiosity about why businesses worked the way they did — and a notebook full of questions.",
    footnote: profile?.about_footnote || "signal over noise",
    tags: (profile?.about_tags as string[]) || ["MBA Candidate", "Researcher", "Power BI", "AI Strategy", "Algorithmic HRM", "Bengaluru"],
  };

  const beatRefs = useRef<Array<HTMLElement | null>>([]);
  const paraRefs = useRef<Array<HTMLElement | null>>([]);
  const railRef  = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [activePara, setActivePara] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 across the section

  /* Spotlight: which chapter is the reader on? */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        let best: { i: number; ratio: number } | null = null;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.beat);
          if (best === null || e.intersectionRatio > best.ratio) {
            best = { i, ratio: e.intersectionRatio };
          }
        });
        if (best !== null) setActive((best as { i: number }).i);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    beatRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Paragraph-level reading spotlight */
  useEffect(() => {
    const compute = () => {
      const eye = window.innerHeight * 0.42;
      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const el of paraRefs.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - eye);
        if (d < bestDist) { bestDist = d; bestId = el.dataset.para ?? null; }
      }
      setActivePara(bestId);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  /* Section-scoped scroll progress for the journey rail. */
  useEffect(() => {
    const onScroll = () => {
      const node = railRef.current?.closest("section");
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const activeMilestone = useMemo(
    () => Math.min(MILESTONES.length - 1, Math.floor(progress * MILESTONES.length)),
    [progress]
  );

  const onJump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="about"
      data-mood="ink"
      className="about-stage relative chapter-pad grain"
    >
      {/* quiet editorial wash */}
      <div aria-hidden className="about-wash" />
      <div aria-hidden className="about-watermark">WHO · I · AM</div>

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ── Editorial masthead ───────────────────────────── */}
        <header className="about-masthead">
          <div className="about-eyebrow">
            <span>Chapter {aboutData.number}</span>
            <span className="about-eyebrow__dot" />
            <span>{aboutData.kicker}</span>
          </div>
          <h2 className="about-title">
            <MaskReveal>The Story</MaskReveal>
            <MaskReveal>
              <em>Behind the Work</em>
            </MaskReveal>
          </h2>
          <Reveal delay={0.15}>
            <p className="about-deck">
              Not a biography. A short field guide to the questions that won't leave me alone —
              and the practice I've built around them.
            </p>
          </Reveal>
        </header>

        {/* ── Dominant epigraph ────────────────────────────── */}
        <Reveal>
          <figure className="about-epigraph">
            <span aria-hidden className="about-epigraph__quote">{"\u201C"}</span>
            <blockquote>{aboutData.epigraph}</blockquote>
            <figcaption>— a note to my younger self</figcaption>
          </figure>
        </Reveal>

        {/* ── Two-column: narrative + sticky journey rail ──── */}
        <div className="about-grid">
          {/* LEFT — sticky journey rail */}
          <aside className="about-rail-col">
            <div ref={railRef} className="about-rail">
              <div className="about-rail__label">The Evolution</div>
              <ol className="about-rail__list">
                {MILESTONES.map((m: string, i: number) => (
                  <li
                    key={m}
                    className={`about-rail__item ${i === activeMilestone ? "is-active" : ""} ${i < activeMilestone ? "is-passed" : ""}`}
                  >
                    <span className="about-rail__dot" />
                    <span className="about-rail__name">{m}</span>
                  </li>
                ))}
              </ol>
              <div className="about-rail__track" aria-hidden>
                <span
                  className="about-rail__progress"
                  style={{ transform: `scaleY(${progress})` }}
                />
              </div>
            </div>
          </aside>

          {/* RIGHT — the four acts */}
          <div className="about-beats">
            {(() => { paraRefs.current = []; return null; })()}
            {BEATS.map((b, i) => {
              const ledeId = `b${i}-lede`;
              const bodyId = `b${i}-body`;
              const pullId = `b${i}-pull`;
              const cls = (id: string) =>
                `about-para ${activePara === id ? "is-lit" : activePara ? "is-shade" : ""}`;
              return (
              <article
                key={b.no}
                ref={(el) => { beatRefs.current[i] = el; }}
                data-beat={i}
                className={`about-beat ${active === i ? "is-active" : "is-dim"}`}
              >
                <header className="about-beat__head">
                  <span className="about-beat__no">{b.no}</span>
                  <span className="about-beat__era">{b.era}</span>
                </header>
                <h3 className="about-beat__title">
                  <SplitWords text={b.title} />
                </h3>
                <p
                  ref={(el) => { if (el) paraRefs.current.push(el); }}
                  data-para={ledeId}
                  className={`about-beat__lede ${cls(ledeId)}`}
                >{b.lede}</p>
                <p
                  ref={(el) => { if (el) paraRefs.current.push(el); }}
                  data-para={bodyId}
                  className={`about-beat__body ${cls(bodyId)}`}
                >{b.body}</p>
                {b.pull && (
                  <aside
                    ref={(el) => { if (el) paraRefs.current.push(el as unknown as HTMLElement); }}
                    data-para={pullId}
                    className={`about-beat__pull ${cls(pullId)}`}
                  >
                    <span aria-hidden>{"\u201C"}</span>
                    {b.pull}
                  </aside>
                )}
              </article>
              );
            })}


            {/* Tag cloud — quietly placed at the end of the story */}
            <Reveal delay={0.1}>
              <ul className="about-tags">
                {aboutData.tags.map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* ── Animated counters (clickable → jump) ─────────── */}
        <div className="about-metrics" role="list">
          {METRICS.map((m: any) => (
            <a
              key={m.label}
              role="listitem"
              href={`#${m.target || m.target_anchor || ""}`}
              onClick={onJump(m.target || m.target_anchor)}
              className="about-metric"
            >
              <span className="about-metric__value">
                <Counter to={m.value} suffix={m.suffix || ""} />
              </span>
              <span className="about-metric__label">{m.label}</span>
              <span className="about-metric__cue" aria-hidden>↗ view</span>
            </a>
          ))}
        </div>

        <div className="about-footnote">// {aboutData.footnote}</div>



      </div>

      <style>{`
        .about-stage {
          position: relative;
          background-color: var(--ink);
          background-image:
            radial-gradient(80% 60% at 80% 0%, color-mix(in oklab, var(--vermilion, #D46A2E) 7%, transparent), transparent 60%),
            radial-gradient(60% 40% at 0% 100%, color-mix(in oklab, var(--bone) 6%, transparent), transparent 60%);
        }
        .about-wash {
          position: absolute; inset: 0; pointer-events: none;
          background:
            repeating-linear-gradient(0deg,
              color-mix(in oklab, var(--bone) 4%, transparent) 0 1px,
              transparent 1px 96px);
          mask-image: radial-gradient(60% 80% at 50% 30%, #000 60%, transparent 100%);
          opacity: .35;
        }
        .about-watermark {
          position: absolute;
          top: 14vh; right: -4vw;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: clamp(140px, 22vw, 360px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: color-mix(in oklab, var(--bone) 5%, transparent);
          user-select: none; pointer-events: none;
          white-space: nowrap;
          transform: rotate(-4deg);
        }

        /* ── Masthead ───────────────────────────────────── */
        .about-masthead { max-width: 1100px; }
        .about-eyebrow {
          display: inline-flex; align-items: center; gap: 14px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 55%, transparent);
        }
        .about-eyebrow__dot {
          width: 4px; height: 4px; border-radius: 99px;
          background: var(--vermilion, #D46A2E);
        }
        .about-title {
          margin: 24px 0 0;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-weight: 400;
          font-size: clamp(48px, 8.4vw, 132px);
          line-height: 0.92;
          letter-spacing: -0.025em;
          color: var(--bone);
        }
        .about-title em {
          font-style: italic;
          color: color-mix(in oklab, var(--bone) 92%, var(--vermilion, #D46A2E));
        }
        .about-deck {
          margin: 32px 0 0;
          max-width: 720px;
          font-size: clamp(18px, 1.6vw, 22px);
          line-height: 1.55;
          color: color-mix(in oklab, var(--bone) 72%, transparent);
        }

        /* ── Epigraph ───────────────────────────────────── */
        .about-epigraph {
          margin: 96px 0 64px;
          padding: 0 0 0 clamp(40px, 6vw, 96px);
          position: relative;
          max-width: 1100px;
        }
        .about-epigraph__quote {
          position: absolute; left: -4px; top: -56px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-size: clamp(160px, 18vw, 280px);
          line-height: 1;
          color: color-mix(in oklab, var(--vermilion, #D46A2E) 24%, transparent);
          pointer-events: none;
        }
        .about-epigraph blockquote {
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: clamp(28px, 4.4vw, 64px);
          line-height: 1.08;
          letter-spacing: -0.012em;
          color: var(--bone);
        }
        .about-epigraph figcaption {
          margin-top: 18px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 55%, transparent);
        }

        /* ── Two-column layout ──────────────────────────── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          margin-top: 24px;
        }
        @media (min-width: 980px) {
          .about-grid { grid-template-columns: 220px 1fr; gap: 80px; }
        }

        /* ── Journey rail (sticky) ──────────────────────── */
        .about-rail-col { position: relative; }
        .about-rail {
          position: sticky; top: 120px;
          display: flex; flex-direction: column; gap: 18px;
          padding-right: 8px;
        }
        .about-rail__label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 50%, transparent);
        }
        .about-rail__list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 22px;
          position: relative;
        }
        .about-rail__item {
          display: flex; align-items: center; gap: 14px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-size: 19px;
          letter-spacing: -0.005em;
          color: color-mix(in oklab, var(--bone) 38%, transparent);
          transition: color .45s ease, transform .45s ease;
        }
        .about-rail__dot {
          width: 8px; height: 8px; border-radius: 99px;
          background: color-mix(in oklab, var(--bone) 22%, transparent);
          transition: background .35s ease, transform .35s ease, box-shadow .35s ease;
        }
        .about-rail__item.is-passed { color: color-mix(in oklab, var(--bone) 65%, transparent); }
        .about-rail__item.is-passed .about-rail__dot {
          background: color-mix(in oklab, var(--vermilion, #D46A2E) 60%, var(--bone));
        }
        .about-rail__item.is-active {
          color: var(--bone); transform: translateX(2px);
        }
        .about-rail__item.is-active .about-rail__dot {
          background: var(--vermilion, #D46A2E);
          transform: scale(1.45);
          box-shadow: 0 0 0 6px color-mix(in oklab, var(--vermilion, #D46A2E) 18%, transparent);
        }
        .about-rail__track {
          position: absolute; left: 3px; top: 38px; bottom: 0; width: 2px;
          background: color-mix(in oklab, var(--bone) 12%, transparent);
          overflow: hidden;
        }
        .about-rail__progress {
          display: block; width: 100%; height: 100%;
          background: linear-gradient(180deg, var(--vermilion, #D46A2E), color-mix(in oklab, var(--vermilion, #D46A2E) 30%, transparent));
          transform-origin: top;
          transform: scaleY(0);
          transition: transform .25s linear;
        }

        /* ── Narrative beats ────────────────────────────── */
        .about-beats { display: flex; flex-direction: column; gap: 96px; max-width: 760px; }
        .about-beat {
          transition: opacity .55s ease, filter .55s ease, transform .55s ease;
          will-change: opacity, filter;
        }
        .about-beat.is-dim {
          opacity: 0.32;
          filter: saturate(0.7);
        }
        .about-beat.is-active { opacity: 1; }

        /* Paragraph-level reading spotlight */
        .about-para {
          transition: opacity .5s ease, filter .5s ease, color .5s ease, border-color .5s ease, transform .5s ease;
        }
        .about-para.is-shade {
          opacity: 0.28;
          filter: blur(0.2px) saturate(0.6);
        }
        .about-para.is-lit {
          opacity: 1;
          color: var(--bone);
          transform: translateZ(0);
        }
        .about-beat__body.is-lit {
          color: color-mix(in oklab, var(--bone) 96%, transparent);
        }
        .about-beat__lede.is-lit {
          color: var(--bone);
        }
        .about-beat__pull.is-lit {
          box-shadow: -2px 0 0 0 var(--vermilion, #D46A2E);
        }
        @media (prefers-reduced-motion: reduce) {
          .about-para, .about-para.is-shade, .about-para.is-lit {
            opacity: 1 !important; filter: none !important;
          }
        }

        .about-beat__head {
          display: flex; align-items: baseline; gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid color-mix(in oklab, var(--bone) 12%, transparent);
        }
        .about-beat__no {
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: 34px; line-height: 1;
          color: var(--vermilion, #D46A2E);
        }
        .about-beat__era {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 55%, transparent);
        }
        .about-beat__title {
          margin: 26px 0 14px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-weight: 400;
          font-size: clamp(40px, 5.2vw, 76px);
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: var(--bone);
        }
        .about-beat__lede {
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: clamp(20px, 2vw, 26px);
          line-height: 1.35;
          color: color-mix(in oklab, var(--bone) 80%, transparent);
          margin: 0 0 22px;
        }
        .about-beat__body {
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: clamp(18px, 1.45vw, 21px);
          line-height: 1.7;
          color: color-mix(in oklab, var(--bone) 78%, transparent);
        }
        .about-beat__pull {
          margin: 28px 0 0;
          padding: 18px 0 18px 22px;
          border-left: 2px solid var(--vermilion, #D46A2E);
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.25;
          color: var(--bone);
        }
        .about-beat__pull span {
          font-size: 1.2em; color: var(--vermilion, #D46A2E);
          margin-right: 4px;
        }

        .about-tags {
          list-style: none; padding: 0; margin: 56px 0 0;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .about-tags li {
          padding: 6px 12px;
          border: 1px solid color-mix(in oklab, var(--bone) 22%, transparent);
          border-radius: 999px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 70%, transparent);
        }

        /* ── Metrics ─────────────────────────────────────── */
        .about-metrics {
          margin-top: 120px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: color-mix(in oklab, var(--bone) 14%, transparent);
          border: 1px solid color-mix(in oklab, var(--bone) 14%, transparent);
        }
        @media (min-width: 880px) {
          .about-metrics { grid-template-columns: repeat(4, 1fr); }
        }
        .about-metric {
          position: relative;
          display: flex; flex-direction: column; gap: 14px;
          padding: 32px 28px 28px;
          background: color-mix(in oklab, var(--ink, #14110F) 50%, transparent);
          text-decoration: none; color: inherit;
          transition: background .35s ease, transform .35s ease;
          overflow: hidden;
        }
        .about-metric::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent, color-mix(in oklab, var(--vermilion, #D46A2E) 12%, transparent));
          opacity: 0; transition: opacity .35s ease;
        }
        .about-metric:hover { background: color-mix(in oklab, var(--ink, #14110F) 70%, transparent); }
        .about-metric:hover::before { opacity: 1; }
        .about-metric__value {
          position: relative; z-index: 1;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-size: clamp(56px, 6.4vw, 96px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--bone);
        }
        .about-metric__suffix { color: var(--vermilion, #D46A2E); margin-left: 2px; }
        .about-metric__label {
          position: relative; z-index: 1;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 65%, transparent);
        }
        .about-metric__cue {
          position: relative; z-index: 1;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 45%, transparent);
          opacity: 0; transform: translateY(4px);
          transition: opacity .3s ease, transform .3s ease;
        }
        .about-metric:hover .about-metric__cue { opacity: 1; transform: translateY(0); }

        .about-footnote {
          margin-top: 18px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10.5px; letter-spacing: 0.18em;
          color: color-mix(in oklab, var(--bone) 45%, transparent);
        }

        /* ── Coda (Beyond Ed & Work) ─────────────────────── */
        .about-coda {
          margin-top: 160px;
          padding-top: 80px;
          border-top: 1px solid color-mix(in oklab, var(--bone) 12%, transparent);
        }
        .about-coda__head { max-width: 1100px; }
        .about-coda__title {
          margin: 24px 0 0;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-weight: 400;
          font-size: clamp(36px, 6vw, 84px);
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: var(--bone);
        }
        .about-coda__lede {
          margin: 28px 0 0;
          max-width: 760px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: clamp(20px, 2vw, 28px);
          line-height: 1.35;
          color: color-mix(in oklab, var(--bone) 78%, transparent);
        }
        .about-pillars {
          margin-top: 64px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }
        @media (min-width: 760px) {
          .about-pillars { grid-template-columns: repeat(2, 1fr); }
        }
        .about-pillar {
          padding: 28px 28px 30px;
          background: color-mix(in oklab, var(--bone, #F8F5EF) 70%, transparent);
          border: 1px solid color-mix(in oklab, var(--bone) 10%, transparent);
          border-radius: 4px;
        }
        .about-pillar__no {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10px; letter-spacing: 0.22em;
          color: var(--vermilion, #D46A2E);
        }
        .about-pillar__label {
          margin-top: 6px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-size: clamp(24px, 2.4vw, 32px);
          line-height: 1;
          color: var(--bone);
        }
        .about-pillar__body {
          margin-top: 14px;
          font-size: 17px;
          line-height: 1.6;
          color: color-mix(in oklab, var(--bone) 75%, transparent);
        }
        .about-values {
          list-style: none; padding: 0; margin: 72px 0 0;
          display: grid; grid-template-columns: 1fr; gap: 28px;
        }
        @media (min-width: 760px) {
          .about-values { grid-template-columns: repeat(2, 1fr); gap: 32px 56px; }
        }
        .about-values li {
          position: relative; padding-left: 30px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-style: italic;
          font-size: clamp(20px, 2vw, 26px);
          line-height: 1.3;
          color: var(--bone);
        }
        .about-values__quote {
          position: absolute; left: 0; top: -8px;
          font-size: 1.6em; line-height: 1;
          color: var(--vermilion, #D46A2E);
        }
        .about-horizon {
          margin-top: 96px;
          padding: 28px 0 8px 28px;
          border-left: 2px solid var(--vermilion, #D46A2E);
        }
        .about-horizon__era {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 55%, transparent);
        }
        .about-horizon p {
          margin-top: 12px;
          font-family: var(--font-serif, "Instrument Serif", serif);
          font-size: clamp(22px, 2.6vw, 36px);
          line-height: 1.2;
          color: var(--bone);
        }

        @media (prefers-reduced-motion: reduce) {
          .about-beat { opacity: 1 !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}