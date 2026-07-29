"use client";
import { useEffect, useRef, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";

export function Ch02Education() {
  const { education } = usePortfolio();
  const entries = education?.length ? education : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

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
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const sectionNumber = "02";
  const sectionKicker = "Academic Archive";

  return (
    <section id="education" data-mood="ink" className="mr-edu chapter-pad">
      <div className="mr-edu__shell">
        <header className="mr-edu__header">
          <div className="mr-edu__eyebrow">
            /{sectionNumber} — {sectionKicker}
          </div>
          <h2 className="mr-edu__title">The Academic Archive.</h2>
          <p className="mr-edu__intro">An analytics-meets-people thesis, built one degree at a time.</p>
        </header>

        <div className="mr-edu__grid">
          <aside className="mr-edu__rail" aria-hidden>
            <div className="mr-edu__rail-line">
              <span
                className="mr-edu__rail-fill"
                style={{
                  height: `${
                    entries.length > 1
                      ? (activeIdx / (entries.length - 1)) * 100
                      : 100
                  }%`,
                }}
              />
            </div>
            <ol className="mr-edu__rail-list">
              {entries.map((e: any, i: number) => (
                <li
                  key={i}
                  className={`mr-edu__rail-item ${i === activeIdx ? "is-active" : ""} ${
                    i < activeIdx ? "is-past" : ""
                  }`}
                >
                  <span className="mr-edu__rail-dot" />
                  <span className="mr-edu__rail-year">{e.span?.split("—")[0]?.trim() || ""}</span>
                  <span className="mr-edu__rail-label">{e.degree?.split("·")[0]?.trim() || ""}</span>
                </li>
              ))}
            </ol>
          </aside>

          <ol className="mr-edu__list">
            {entries.map((e: any, i: number) => {
              const num = String(entries.length - i).padStart(2, "0");
              const isCurrent = e.state === "Current" || e.state === "current";
              return (
                <li
                  key={i}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  data-idx={i}
                  className={`mr-edu__item ${activeIdx === i ? "is-active" : ""}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="mr-edu__big-num">{num}</span>
                  <div className="mr-edu__card">
                    <div className="mr-edu__body">
                      <div className="mr-edu__top-row">
                        <span className="mr-edu__span">{e.span}</span>
                        <span className={`mr-edu__state ${isCurrent ? "is-current" : ""}`}>
                          {isCurrent && <span className="mr-edu__pulse" />}
                          {e.state}
                        </span>
                      </div>
                      <h3 className="mr-edu__degree">{e.degree}</h3>
                      <div className="mr-edu__school">{e.school}</div>
                      {e.points && (
                        <ul className="mr-edu__points">
                          {(e.points as string[]).map((p: string, idx: number) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
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
  background:
    radial-gradient(900px 600px at 12% -10%, color-mix(in oklab, var(--vermilion) 6%, transparent), transparent 60%),
    radial-gradient(700px 500px at 100% 110%, color-mix(in oklab, var(--ink) 7%, transparent), transparent 60%);
}
.mr-edu::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--ink) 4%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--ink) 4%, transparent) 1px, transparent 1px);
  background-size: 56px 56px;
  pointer-events: none;
  mask-image: radial-gradient(ellipse at 50% 30%, #000 35%, transparent 80%);
}
.mr-edu__shell {
  position: relative;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 clamp(16px, 4vw, 48px);
}

/* Header */
.mr-edu__header { max-width: 900px; margin-bottom: clamp(56px, 8vw, 88px); }
.mr-edu__eyebrow {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 45%, transparent);
}
.mr-edu__title {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(48px, 8.4vw, 132px);
  line-height: 0.94;
  letter-spacing: -0.025em;
  margin: 16px 0 20px;
}
.mr-edu__title::after {
  content: ""; display: block;
  width: 64px; height: 2px;
  margin-top: 24px;
  background: var(--vermilion);
}
.mr-edu__intro {
  font-family: var(--font-serif, "Instrument Serif", serif);
  font-style: italic;
  font-size: clamp(17px, 1.5vw, 22px);
  line-height: 1.55;
  max-width: 56ch;
  color: color-mix(in oklab, currentColor 72%, transparent);
}

/* Grid */
.mr-edu__grid {
  display: grid;
  grid-template-columns: 168px 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
}
@media (max-width: 900px) {
  .mr-edu__grid { grid-template-columns: 1fr; }
  .mr-edu__rail { display: none; }
}

/* Rail */
.mr-edu__rail {
  position: sticky;
  top: 120px;
  align-self: start;
}
.mr-edu__rail-line {
  position: absolute;
  left: 11px;
  top: 8px;
  bottom: 8px;
  width: 1.5px;
  background: color-mix(in oklab, currentColor 12%, transparent);
  border-radius: 2px;
  overflow: hidden;
}
.mr-edu__rail-fill {
  display: block;
  width: 100%;
  background: linear-gradient(to bottom, var(--vermilion), color-mix(in oklab, var(--vermilion) 40%, transparent));
  transition: height .6s cubic-bezier(.2,.7,.2,1);
}
.mr-edu__rail-list { list-style: none; margin: 0; padding: 0; }
.mr-edu__rail-item {
  position: relative;
  padding: 12px 0 30px 30px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 32%, transparent);
  transition: color .4s ease, transform .4s ease;
}
.mr-edu__rail-dot {
  position: absolute;
  left: 6.25px; top: 15px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--bone);
  border: 2px solid color-mix(in oklab, currentColor 18%, transparent);
  transition: border-color .35s ease, box-shadow .35s ease, transform .35s ease;
}
.mr-edu__rail-item.is-past .mr-edu__rail-dot {
  border-color: color-mix(in oklab, var(--vermilion) 70%, transparent);
}
.mr-edu__rail-item.is-active {
  color: var(--ink);
  transform: translateX(2px);
}
.mr-edu__rail-item.is-active .mr-edu__rail-dot {
  border-color: var(--vermilion);
  background: var(--vermilion);
  box-shadow: 0 0 0 5px color-mix(in oklab, var(--vermilion) 14%, transparent);
}
.mr-edu__rail-year { display: block; }
.mr-edu__rail-label {
  display: block;
  margin-top: 3px;
  font-family: var(--font-display, "Instrument Serif", serif);
  font-style: italic;
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
  color: inherit;
  opacity: .85;
}

/* List */
.mr-edu__list {
  list-style: none;
  margin: 0; padding: 0;
  display: flex; flex-direction: column;
  gap: 1px;
}

/* Item */
.mr-edu__item {
  position: relative;
  border-top: 1px solid color-mix(in oklab, currentColor 10%, transparent);
  padding: clamp(28px, 3.5vw, 44px) 0 clamp(28px, 3.5vw, 44px) clamp(56px, 8vw, 100px);
  transition: border-color .5s ease, background .5s ease;
  opacity: 0;
  animation: mr-edu-enter .7s cubic-bezier(.22,.8,.22,1) forwards;
}
@keyframes mr-edu-enter {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mr-edu__item:hover {
  background: color-mix(in oklab, var(--ink) 2%, transparent);
}
.mr-edu__item.is-active {
  border-top-color: color-mix(in oklab, var(--vermilion) 35%, transparent);
}
.mr-edu__item.is-active::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--vermilion);
  transform: scaleY(0);
  transform-origin: top;
  animation: mr-edu-bar .5s .15s cubic-bezier(.22,.8,.22,1) forwards;
}
@keyframes mr-edu-bar {
  to { transform: scaleY(1); }
}
@media (max-width: 640px) {
  .mr-edu__item { padding-left: 0; }
}

/* Big number */
.mr-edu__big-num {
  position: absolute;
  left: 0; top: clamp(20px, 3vw, 36px);
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(48px, 6.5vw, 96px);
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: color-mix(in oklab, var(--vermilion) 35%, transparent);
  transition: color .5s ease, transform .5s ease;
  pointer-events: none;
}
.mr-edu__item.is-active .mr-edu__big-num {
  color: color-mix(in oklab, var(--vermilion) 65%, transparent);
}
.mr-edu__item:hover .mr-edu__big-num {
  transform: scale(1.04);
}
@media (max-width: 640px) {
  .mr-edu__big-num {
    position: relative; left: auto; top: auto;
    font-size: clamp(36px, 8vw, 56px);
    margin-bottom: 8px;
  }
}

/* Card */
.mr-edu__card {
  display: block;
}

/* Top row: span + status */
.mr-edu__top-row {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  margin-bottom: 14px;
}
.mr-edu__span {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 50%, transparent);
}
.mr-edu__state {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, currentColor 16%, transparent);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 60%, transparent);
}
.mr-edu__state.is-current {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 45%, transparent);
  background: color-mix(in oklab, var(--vermilion) 7%, transparent);
}
.mr-edu__pulse {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--vermilion);
  box-shadow: 0 0 0 0 color-mix(in oklab, var(--vermilion) 50%, transparent);
  animation: mr-edu-pulse 2.4s ease-in-out infinite;
}
@keyframes mr-edu-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--vermilion) 50%, transparent); }
  50%      { box-shadow: 0 0 0 6px color-mix(in oklab, var(--vermilion) 0%, transparent); }
}

.mr-edu__body { min-width: 0; }
.mr-edu__degree {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(24px, 2.8vw, 38px);
  line-height: 1.08;
  letter-spacing: -0.012em;
  margin: 0;
}
.mr-edu__school {
  margin-top: 8px;
  font-family: var(--font-serif, "Instrument Serif", serif);
  font-style: italic;
  font-size: clamp(14px, 1.1vw, 17px);
  color: color-mix(in oklab, currentColor 65%, transparent);
}

.mr-edu__points {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: clamp(14px, 1vw, 16px);
  line-height: 1.6;
  color: color-mix(in oklab, currentColor 82%, transparent);
}
.mr-edu__points li {
  position: relative;
  padding-left: 16px;
}
.mr-edu__points li::before {
  content: "+";
  position: absolute; left: 0; top: 0;
  color: var(--vermilion);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  line-height: 1.6;
}
`;