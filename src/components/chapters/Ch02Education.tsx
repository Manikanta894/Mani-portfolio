"use client";
import { useEffect, useRef, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";

export function Ch02Education() {
  const { education, sectionContent } = usePortfolio();
  const entries = education?.length ? education : [];
  const sc = sectionContent.education || {};

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

  const sectionNumber = sc.number || "02";
  const sectionKicker = sc.kicker || "Academic Archive";
  const sectionTitle = sc.title || "The Academic Archive.";
  const sectionIntro = sc.intro || "An analytics-meets-people thesis, built one degree at a time.";

  return (
    <section id="education" data-mood="ink" className="mr-edu chapter-pad">
      <div className="mr-edu__shell">
        <header className="mr-edu__header">
          <div className="mr-edu__eyebrow">
            /{sectionNumber} — {sectionKicker}
          </div>
          <h2 className="mr-edu__title">{sectionTitle}</h2>
          <p className="mr-edu__intro">{sectionIntro}</p>
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
                  className={`mr-edu__item ${activeIdx === i ? "is-active" : "is-faded"}`}
                >
                  <div className="mr-edu__card">
                    <div className="mr-edu__meta">
                      <span className="mr-edu__num">{num}</span>
                      <span className={`mr-edu__state ${isCurrent ? "is-current" : ""}`}>
                        {isCurrent && <span className="mr-edu__pulse" />}
                        {e.state}
                      </span>
                    </div>
                    <div className="mr-edu__body">
                      <span className="mr-edu__span">{e.span}</span>
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
  color: var(--bone);
  background-color: var(--ink);
  background-image:
    radial-gradient(900px 600px at 12% -10%, color-mix(in oklab, var(--vermilion) 6%, transparent), transparent 60%),
    radial-gradient(700px 500px at 100% 110%, color-mix(in oklab, var(--bone) 7%, transparent), transparent 60%);
}
.mr-edu::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--bone) 5%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--bone) 5%, transparent) 1px, transparent 1px);
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
.mr-edu__header { max-width: 980px; margin-bottom: clamp(48px, 8vw, 96px); }
.mr-edu__eyebrow {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 55%, transparent);
}
.mr-edu__title {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(48px, 8.4vw, 132px);
  line-height: 0.96;
  letter-spacing: -0.02em;
  margin: 18px 0 22px;
}
.mr-edu__intro {
  font-family: var(--font-serif, "Instrument Serif", serif);
  font-style: italic;
  font-size: clamp(18px, 1.6vw, 24px);
  line-height: 1.55;
  max-width: 64ch;
  color: color-mix(in oklab, currentColor 78%, transparent);
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
  width: 2px;
  background: color-mix(in oklab, currentColor 14%, transparent);
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
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 36%, transparent);
  transition: color .4s ease, opacity .4s ease, transform .4s ease;
}
.mr-edu__rail-dot {
  position: absolute;
  left: 6px; top: 16px;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--bone);
  border: 2px solid color-mix(in oklab, currentColor 22%, transparent);
  transition: border-color .35s ease, box-shadow .35s ease, transform .35s ease;
}
.mr-edu__rail-item.is-past .mr-edu__rail-dot {
  border-color: color-mix(in oklab, var(--vermilion) 70%, transparent);
}
.mr-edu__rail-item.is-active {
  color: var(--bone);
  transform: translateX(2px);
}
.mr-edu__rail-item.is-active .mr-edu__rail-dot {
  border-color: var(--vermilion);
  background: var(--vermilion);
  box-shadow: 0 0 0 6px color-mix(in oklab, var(--vermilion) 18%, transparent);
}
.mr-edu__rail-year { display: block; }
.mr-edu__rail-label {
  display: block;
  margin-top: 4px;
  font-family: var(--font-display, "Instrument Serif", serif);
  font-style: italic;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0;
  text-transform: none;
  color: inherit;
  opacity: .9;
}

/* List */
.mr-edu__list {
  list-style: none;
  margin: 0; padding: 0;
  display: flex; flex-direction: column;
  gap: clamp(24px, 3.5vw, 48px);
}
.mr-edu__item {
  border-top: 1px solid color-mix(in oklab, currentColor 14%, transparent);
  padding-top: clamp(20px, 2.5vw, 32px);
  transition: opacity .5s ease, filter .5s ease;
}
.mr-edu__item.is-faded { opacity: .45; }
.mr-edu__item.is-active { opacity: 1; }

/* Card */
.mr-edu__card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: clamp(16px, 2vw, 32px);
  align-items: start;
}
@media (max-width: 640px) {
  .mr-edu__card { grid-template-columns: 1fr; }
}

.mr-edu__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.mr-edu__num {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(36px, 4vw, 64px);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: color-mix(in oklab, currentColor 70%, transparent);
  font-variant-numeric: tabular-nums;
}
.mr-edu__state {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, currentColor 18%, transparent);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 70%, transparent);
}
.mr-edu__state.is-current {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 50%, transparent);
  background: color-mix(in oklab, var(--vermilion) 8%, transparent);
}
.mr-edu__pulse {
  display: inline-block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--vermilion);
  box-shadow: 0 0 0 0 color-mix(in oklab, var(--vermilion) 60%, transparent);
  animation: mr-edu-pulse 2.1s ease-in-out infinite;
}
@keyframes mr-edu-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--vermilion) 55%, transparent); }
  50%      { box-shadow: 0 0 0 8px color-mix(in oklab, var(--vermilion) 0%, transparent); }
}

.mr-edu__body { min-width: 0; }
.mr-edu__span {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 55%, transparent);
  margin-bottom: 10px;
  display: block;
}
.mr-edu__degree {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-weight: 400;
  font-size: clamp(26px, 3.2vw, 44px);
  line-height: 1.05;
  letter-spacing: -0.012em;
  margin: 0;
}
.mr-edu__school {
  margin-top: 8px;
  font-family: var(--font-serif, "Instrument Serif", serif);
  font-style: italic;
  font-size: clamp(15px, 1.2vw, 18px);
  color: color-mix(in oklab, currentColor 70%, transparent);
}

.mr-edu__points {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.65;
  color: color-mix(in oklab, currentColor 88%, transparent);
}
.mr-edu__points li {
  position: relative;
  padding-left: 18px;
}
.mr-edu__points li::before {
  content: "—";
  position: absolute; left: 0; top: 0;
  color: var(--vermilion);
}
`;