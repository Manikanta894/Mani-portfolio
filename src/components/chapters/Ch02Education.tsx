"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import usePortfolio from "@/hooks/usePortfolio";

function normalizeEducation(raw: any) {
  return {
    ...raw,
    span: raw.span || (raw.start_date || raw.end_date ? `${raw.start_date || ""} — ${raw.end_date || raw.current ? "Present" : (raw.end_date || "")}` : ""),
    state: raw.state || raw.status,
    degree: raw.degree ? (raw.field ? `${raw.degree}, ${raw.field}` : raw.degree) : raw.degree,
    school: raw.school || raw.institution,
    points: (raw.points && raw.points.length) ? raw.points : (Array.isArray(raw.highlights) ? raw.highlights : []),
  };
}

export function Ch02Education() {
  const { education } = usePortfolio();
  const entries = (education?.length ? education : []).map(normalizeEducation);

  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Track which card is most visible
  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (!best || e.intersectionRatio > best.ratio) best = { idx, ratio: e.intersectionRatio };
        }
        if (best) setActiveIdx(best.idx);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Click timeline dot to scroll to card
  const scrollTo = useCallback((idx: number) => {
    const el = itemRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <section ref={sectionRef} id="education" className="mr-edu chapter-pad">
      <div className="mr-edu__shell">
        {/* Header */}
        <header className="mr-edu__header">
          <div className="mr-edu__eyebrow">
            <span className="text-vermilion">02</span>
            <span className="mr-edu__eyebrow-line" />
            Academic Archive
          </div>
          <h2 className="mr-edu__title">
            The Academic<br />Archive.
          </h2>
          <p className="mr-edu__intro">
            An analytics-meets-people thesis, built one degree at a time.
          </p>
        </header>

        <div className="mr-edu__layout">
          {/* Sticky timeline rail */}
          <nav className="mr-edu__rail" aria-label="Education timeline">
            <ol className="mr-edu__rail-list">
              {entries.map((e: any, i: number) => {
                const active = i === activeIdx;
                const past = i < activeIdx;
                const year = e.span?.split("—")[0]?.trim() || "";
                const deg = e.degree?.split("·")[0]?.trim() || "";
                return (
                  <li key={i}>
                    <button
                      onClick={() => scrollTo(i)}
                      className={`mr-edu__rail-btn ${active ? "is-active" : ""} ${past ? "is-past" : ""}`}
                    >
                      <span className="mr-edu__rail-dot-wrap">
                        <span className="mr-edu__rail-dot" />
                      </span>
                      <span className="mr-edu__rail-year">{year}</span>
                      <span className="mr-edu__rail-degree">{deg}</span>
                    </button>
                  </li>
                );
              })}
              {/* Fill line */}
              <div className="mr-edu__rail-track">
                <div
                  className="mr-edu__rail-track-fill"
                  style={{
                    height: entries.length > 1
                      ? `${(activeIdx / (entries.length - 1)) * 100}%`
                      : "100%",
                  }}
                />
              </div>
            </ol>
          </nav>

          {/* Cards */}
          <ol className="mr-edu__cards">
            {entries.map((e: any, i: number) => {
              const num = String(entries.length - i).padStart(2, "0");
              const isCurrent = e.state === "Current" || e.state === "current";
              const active = i === activeIdx;
              return (
                <li
                  key={i}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  data-idx={i}
                  className={`mr-edu__card ${active ? "is-active" : ""}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Giant watermark number */}
                  <span className="mr-edu__card-num" aria-hidden>{num}</span>

                  {/* Content */}
                  <div className="mr-edu__card-body">
                    {/* Meta row */}
                    <div className="mr-edu__card-meta">
                      <span className="mr-edu__card-span">{e.span}</span>
                      <span className={`mr-edu__card-badge ${isCurrent ? "is-live" : ""}`}>
                        {isCurrent && <span className="mr-edu__card-pulse" />}
                        {e.state}
                      </span>
                    </div>

                    {/* Degree title */}
                    <h3 className="mr-edu__card-degree">{e.degree}</h3>
                    <div className="mr-edu__card-school">{e.school}</div>

                    {/* Points */}
                    {e.points && e.points.length > 0 && (
                      <ul className="mr-edu__card-points">
                        {(e.points as string[]).map((p: string, idx: number) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.mr-edu {
  position: relative;
  color: var(--ink);
  overflow: hidden;
}
.mr-edu::before {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(700px 500px at 5% 0%, color-mix(in oklab, var(--vermilion) 5%, transparent), transparent 70%),
    radial-gradient(600px 400px at 95% 100%, color-mix(in oklab, var(--ink) 5%, transparent), transparent 70%);
  pointer-events: none;
}
.mr-edu__shell {
  position: relative;
  margin: 0 auto;
  max-width: 1320px;
  padding: 0 clamp(20px, 4vw, 48px);
}

/* ── Header ── */
.mr-edu__header { margin-bottom: clamp(64px, 9vw, 100px); }
.mr-edu__eyebrow {
  display: flex; align-items: center; gap: 14px;
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--ink);
  opacity: 0.5;
  margin-bottom: 20px;
}
.mr-edu__eyebrow-line {
  display: inline-block; width: 32px; height: 1px;
  background: var(--ink); opacity: 0.2;
}
.mr-edu__title {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(52px, 9vw, 140px);
  line-height: 0.9;
  letter-spacing: -0.03em;
  margin: 0;
}
.mr-edu__title::after {
  content: ""; display: block;
  width: 80px; height: 3px;
  margin-top: 28px;
  background: var(--vermilion);
}
.mr-edu__intro {
  margin-top: 24px;
  font-family: var(--font-serif, "Instrument Serif", serif);
  font-style: italic;
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.6;
  max-width: 48ch;
  color: color-mix(in oklab, var(--ink) 65%, transparent);
}

/* ── Layout ── */
.mr-edu__layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}
@media (max-width: 860px) {
  .mr-edu__layout { grid-template-columns: 1fr; }
  .mr-edu__rail { display: none; }
}

/* ── Timeline Rail ── */
.mr-edu__rail {
  position: sticky; top: 120px;
}
.mr-edu__rail-list {
  position: relative;
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 6px;
}
.mr-edu__rail-track {
  position: absolute;
  left: 21px; top: 18px; bottom: 18px;
  width: 2px;
  background: color-mix(in oklab, var(--ink) 12%, transparent);
  border-radius: 2px;
  overflow: hidden;
  z-index: 0; pointer-events: none;
}
.mr-edu__rail-track-fill {
  width: 100%;
  background: linear-gradient(to bottom, var(--vermilion), color-mix(in oklab, var(--vermilion) 50%, transparent));
  transition: height 0.6s cubic-bezier(0.22,0.8,0.22,1);
}

.mr-edu__rail-btn {
  position: relative; z-index: 1;
  display: block; width: 100%;
  text-align: left; padding: 10px 0 10px 40px;
  background: none; border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 30%, transparent);
  transition: color 0.35s ease, transform 0.35s ease;
}
.mr-edu__rail-btn:hover { color: var(--ink); }
.mr-edu__rail-btn.is-past { color: color-mix(in oklab, var(--vermilion) 55%, transparent); }
.mr-edu__rail-btn.is-active {
  color: var(--ink);
  transform: translateX(3px);
}

.mr-edu__rail-dot-wrap {
  position: absolute; left: 16px; top: 50%;
  width: 12px; height: 12px; margin-top: -6px;
  display: flex; align-items: center; justify-content: center;
}
.mr-edu__rail-dot {
  display: block; width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--bone);
  border: 2px solid color-mix(in oklab, var(--ink) 14%, transparent);
  transition: all 0.35s ease;
}
.mr-edu__rail-btn:hover .mr-edu__rail-dot { border-color: var(--vermilion); }
.mr-edu__rail-btn.is-past .mr-edu__rail-dot { background: var(--vermilion); border-color: var(--vermilion); }
.mr-edu__rail-btn.is-active .mr-edu__rail-dot {
  width: 12px; height: 12px;
  background: var(--vermilion); border-color: var(--vermilion);
  box-shadow: 0 0 0 6px color-mix(in oklab, var(--vermilion) 12%, transparent);
}

.mr-edu__rail-year {
  display: block; line-height: 1;
}
.mr-edu__rail-degree {
  display: block; margin-top: 3px;
  font-family: var(--font-display, "Instrument Serif", serif);
  font-style: italic; font-weight: 400;
  font-size: 12px; letter-spacing: 0;
  text-transform: none; opacity: 0.8;
}

/* ── Cards ── */
.mr-edu__cards {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column;
}

.mr-edu__card {
  position: relative;
  padding: clamp(32px, 4vw, 48px) 0;
  border-top: 1px solid color-mix(in oklab, var(--ink) 8%, transparent);
  opacity: 0;
  animation: edu-enter 0.6s cubic-bezier(0.22,0.8,0.22,1) forwards;
  transition: background 0.5s ease;
  overflow: hidden;
}
@keyframes edu-enter {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mr-edu__card:hover {
  background: color-mix(in oklab, var(--ink) 1.5%, transparent);
}
.mr-edu__card.is-active {
  border-top-color: color-mix(in oklab, var(--vermilion) 30%, transparent);
}

/* Active left bar */
.mr-edu__card.is-active::before {
  content: "";
  position: absolute; left: -2px; top: 0; bottom: 0;
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(to bottom, var(--vermilion), color-mix(in oklab, var(--vermilion) 30%, transparent));
  animation: edu-bar 0.5s 0.1s cubic-bezier(0.22,0.8,0.22,1) forwards;
  transform-origin: top;
  transform: scaleY(0);
}
@keyframes edu-bar { to { transform: scaleY(1); } }

/* Watermark number */
.mr-edu__card-num {
  position: absolute;
  right: 0; top: clamp(16px, 2vw, 28px);
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(72px, 10vw, 140px);
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: color-mix(in oklab, var(--vermilion) 8%, transparent);
  pointer-events: none;
  transition: color 0.5s ease, transform 0.5s ease;
}
.mr-edu__card.is-active .mr-edu__card-num {
  color: color-mix(in oklab, var(--vermilion) 16%, transparent);
}
.mr-edu__card:hover .mr-edu__card-num {
  transform: scale(1.03);
}
@media (max-width: 640px) {
  .mr-edu__card-num { font-size: clamp(48px, 14vw, 80px); }
}

/* Card body */
.mr-edu__card-body { position: relative; z-index: 1; }

.mr-edu__card-meta {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  margin-bottom: 16px;
}
.mr-edu__card-span {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 45%, transparent);
}
.mr-edu__card-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 55%, transparent);
}
.mr-edu__card-badge.is-live {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 40%, transparent);
  background: color-mix(in oklab, var(--vermilion) 6%, transparent);
}
.mr-edu__card-pulse {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  background: var(--vermilion);
  box-shadow: 0 0 0 0 color-mix(in oklab, var(--vermilion) 50%, transparent);
  animation: edu-pulse 2.4s ease-in-out infinite;
}
@keyframes edu-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--vermilion) 50%, transparent); }
  50%      { box-shadow: 0 0 0 6px color-mix(in oklab, var(--vermilion) 0%, transparent); }
}

.mr-edu__card-degree {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  margin: 0;
}
.mr-edu__card-school {
  margin-top: 8px;
  font-family: var(--font-serif, "Instrument Serif", serif);
  font-style: italic;
  font-size: clamp(16px, 1.2vw, 20px);
  color: color-mix(in oklab, var(--ink) 60%, transparent);
}

.mr-edu__card-points {
  list-style: none; margin: 22px 0 0; padding: 0;
  display: flex; flex-direction: column; gap: 10px;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.65;
  color: color-mix(in oklab, var(--ink) 78%, transparent);
}
.mr-edu__card-points li {
  position: relative;
  padding-left: 16px;
}
.mr-edu__card-points li::before {
  content: "+";
  position: absolute; left: 0; top: 0;
  color: var(--vermilion);
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: inherit;
}
`;
