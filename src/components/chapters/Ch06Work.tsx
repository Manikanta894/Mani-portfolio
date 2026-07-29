"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import { Reveal } from "@/components/motion/primitives";

const FILTERS = ["All", "AI Strategy", "Analytics", "Business Strategy", "Research", "Web"];

function normalize(raw: any) {
  return {
    ...raw,
    name: raw.title || raw.name,
    desc: raw.tagline || raw.description || "",
    tech: Array.isArray(raw.tech) ? raw.tech : [],
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    github: raw.github_url || raw.repo || null,
    demo: raw.live_demo_url || raw.url || null,
    cover: raw.cover || null,
  };
}

function ProjectCard({ p, i, featured, onClick }: { p: ReturnType<typeof normalize>; i: number; featured?: boolean; onClick: () => void }) {
  return (
    <motion.article
      onClick={onClick}
      className={`proj-card ${featured ? "proj-card--featured" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 0.8, 0.22, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="proj-card__media">
        {p.cover ? (
          <img src={p.cover} alt={p.name} className="proj-card__img" loading="lazy" />
        ) : (
          <div className="proj-card__placeholder">
            <span className="proj-card__placeholder-text">{p.name.charAt(0)}</span>
            <div className="proj-card__placeholder-grad" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="proj-card__media-overlay" />

        {/* Status badge */}
        <span className={`proj-card__status proj-card__status--${p.status?.toLowerCase().replace(/\s/g, "-") || "default"}`}>
          {p.status}
        </span>

        {/* Hover actions */}
        <div className="proj-card__actions">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="proj-card__action">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.82-.26.82-.58v-2.02c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.22.08 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.54 1 .1-.78.42-1.32.76-1.62-2.7-.3-5.54-1.35-5.54-6 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.54.12-3.2 0 0 1.02-.32 3.34 1.24a11.6 11.6 0 016.08 0c2.32-1.56 3.34-1.24 3.34-1.24.66 1.66.24 2.9.12 3.2.78.85 1.24 1.93 1.24 3.25 0 4.66-2.84 5.7-5.55 6 .44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Code
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="proj-card__action proj-card__action--primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Demo
            </a>
          )}
          <span className="proj-card__action proj-card__action--ghost" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            Details →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="proj-card__info">
        <span className="proj-card__category">{p.category}</span>
        <h3 className="proj-card__name">{p.name}</h3>
        <p className="proj-card__desc">{p.desc}</p>
        <div className="proj-card__tech">
          {p.tech.slice(0, 4).map((t: string) => (
            <span key={t} className="proj-card__tech-tag">{t}</span>
          ))}
          {p.tech.length > 4 && <span className="proj-card__tech-more">+{p.tech.length - 4}</span>}
        </div>
      </div>
    </motion.article>
  );
}

function DetailModal({ p, onClose }: { p: ReturnType<typeof normalize>; onClose: () => void }) {
  return (
    <motion.div
      className="proj-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="proj-detail__panel"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 0.8, 0.22, 1] }}
        onClick={(e) => e.stopPropagation()}
        layout
      >
        <button onClick={onClose} className="proj-detail__close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Hero */}
        <div className="proj-detail__hero">
          <span className="proj-detail__category">{p.category}</span>
          <h2 className="proj-detail__title">{p.name}</h2>
          <p className="proj-detail__tagline">{p.desc}</p>
          <div className="proj-detail__meta">
            <span>{p.role}</span>
            <span className="proj-detail__meta-sep" />
            <span>{p.year}</span>
            <span className="proj-detail__meta-sep" />
            <span className={`proj-detail__status proj-detail__status--${p.status?.toLowerCase().replace(/\s/g, "-") || "default"}`}>{p.status}</span>
          </div>
          <div className="proj-detail__actions">
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer" className="proj-detail__btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.12.82-.26.82-.58v-2.02c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.73.08-.73 1.22.08 1.86 1.25 1.86 1.25 1.08 1.86 2.84 1.32 3.54 1 .1-.78.42-1.32.76-1.62-2.7-.3-5.54-1.35-5.54-6 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.54.12-3.2 0 0 1.02-.32 3.34 1.24a11.6 11.6 0 016.08 0c2.32-1.56 3.34-1.24 3.34-1.24.66 1.66.24 2.9.12 3.2.78.85 1.24 1.93 1.24 3.25 0 4.66-2.84 5.7-5.55 6 .44.38.82 1.12.82 2.26v3.35c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub Repository
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer" className="proj-detail__btn proj-detail__btn--primary">
                Live Demo →
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="proj-detail__body">
          <section className="proj-detail__section">
            <h4>Overview</h4>
            <p>{p.description || p.desc}</p>
          </section>

          {p.problem && (
            <section className="proj-detail__section">
              <h4>Problem</h4>
              <p>{p.problem}</p>
            </section>
          )}

          {p.approach && (
            <section className="proj-detail__section">
              <h4>Approach</h4>
              <p>{p.approach}</p>
            </section>
          )}

          {p.highlights.length > 0 && (
            <section className="proj-detail__section">
              <h4>Features & Highlights</h4>
              <ul className="proj-detail__list">
                {p.highlights.map((h: string, idx: number) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </section>
          )}

          {p.outcome && (
            <section className="proj-detail__section">
              <h4>Outcome</h4>
              <p>{p.outcome}</p>
            </section>
          )}

          {p.impact && (
            <section className="proj-detail__section">
              <h4>Impact</h4>
              <p>{p.impact}</p>
            </section>
          )}

          {p.tech.length > 0 && (
            <section className="proj-detail__section">
              <h4>Technology Stack</h4>
              <div className="proj-detail__tags">
                {p.tech.map((t: string) => (
                  <span key={t} className="proj-detail__tag">{t}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>

      <style>{detailCSS}</style>
    </motion.div>
  );
}

export function Ch06Work() {
  const { projects } = usePortfolio();
  const all = (projects?.length ? projects : []).map(normalize);
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<ReturnType<typeof normalize> | null>(null);

  const filtered = useMemo(() => {
    const pool = [...featured, ...rest];
    if (filter === "All") return pool;
    return pool.filter((p) => p.category === filter);
  }, [filter, featured, rest]);

  return (
    <section id="work" className="proj chapter-pad">
      <div className="proj__shell">
        <header className="proj__header">
          <div className="proj__eyebrow">/04 — Product Showcase</div>
          <h2 className="proj__title">Projects &<br />Case Studies</h2>
          <p className="proj__intro">Research, analytics, and strategy projects — built with curiosity and shipped with care.</p>
        </header>

        {/* Filter chips */}
        <div className="proj__filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`proj__filter ${filter === f ? "is-active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Featured */}
        {filter === "All" && featured.length > 0 && (
          <div className="proj__section">
            <h3 className="proj__section-title">Featured</h3>
            <div className="proj__featured-grid">
              {featured.map((p, i) => (
                <ProjectCard key={p.id} p={p} i={i} featured onClick={() => setSelected(p)} />
              ))}
            </div>
          </div>
        )}

        {/* All projects grid */}
        <div className="proj__section">
          {filter !== "All" && <h3 className="proj__section-title">{filter}</h3>}
          <div className="proj__grid">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} featured={p.featured && filter === "All"} onClick={() => setSelected(p)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="proj__empty">
              <p>No projects in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <DetailModal p={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <style>{cardCSS}</style>
    </section>
  );
}

const cardCSS = `
.proj { position: relative; color: var(--ink); }
.proj__shell { margin: 0 auto; max-width: 1200px; padding: 0 clamp(20px, 4vw, 48px); }

.proj__header { margin-bottom: clamp(48px, 7vw, 80px); }
.proj__eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 45%, transparent); margin-bottom: 18px; }
.proj__title { font-family: var(--font-display, "Instrument Serif", serif); font-weight: 400; font-size: clamp(48px, 8vw, 120px); line-height: 0.93; letter-spacing: -0.025em; margin: 0; }
.proj__title::after { content: ""; display: block; width: 64px; height: 3px; margin-top: 24px; background: var(--vermilion); }
.proj__intro { margin-top: 20px; font-size: clamp(16px, 1.3vw, 20px); color: color-mix(in oklab, currentColor 62%, transparent); max-width: 52ch; }

.proj__filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: clamp(40px, 6vw, 64px); }
.proj__filter {
  padding: 7px 16px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
  border: 1px solid color-mix(in oklab, currentColor 14%, transparent);
  background: transparent; color: color-mix(in oklab, currentColor 55%, transparent);
  cursor: pointer; transition: all 0.25s ease;
}
.proj__filter:hover { border-color: color-mix(in oklab, currentColor 30%, transparent); color: var(--ink); }
.proj__filter.is-active { background: var(--ink); color: var(--bone); border-color: var(--ink); }

.proj__section { margin-bottom: clamp(48px, 7vw, 80px); }
.proj__section-title {
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--vermilion); margin-bottom: 24px;
}

.proj__featured-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; }
.proj__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

.proj__empty { text-align: center; padding: 48px 0; color: color-mix(in oklab, currentColor 40%, transparent); }

/* Card */
.proj-card {
  position: relative; border-radius: 18px; overflow: hidden;
  background: color-mix(in oklab, var(--ink) 3%, transparent);
  border: 1px solid color-mix(in oklab, currentColor 8%, transparent);
  cursor: pointer; transition: all 0.4s ease;
  display: flex; flex-direction: column;
}
.proj-card:hover {
  border-color: color-mix(in oklab, var(--vermilion) 20%, transparent);
  box-shadow: 0 12px 48px -20px color-mix(in oklab, var(--ink) 20%, transparent), 0 0 0 1px color-mix(in oklab, var(--vermilion) 8%, transparent) inset;
}
.proj-card--featured { grid-column: span 2; }
@media (max-width: 768px) {
  .proj-card--featured { grid-column: span 1; }
  .proj__featured-grid { grid-template-columns: 1fr; }
  .proj__grid { grid-template-columns: 1fr; }
}

.proj-card__media {
  position: relative; overflow: hidden;
  aspect-ratio: 16/10; background: color-mix(in oklab, var(--ink) 8%, transparent);
}
.proj-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.proj-card:hover .proj-card__img { transform: scale(1.04); }

.proj-card__placeholder {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;
}
.proj-card__placeholder-text {
  font-family: var(--font-display, "Instrument Serif", serif);
  font-size: clamp(48px, 8vw, 80px); color: color-mix(in oklab, var(--ink) 10%, transparent);
  position: relative; z-index: 1;
}
.proj-card__placeholder-grad {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, color-mix(in oklab, var(--vermilion) 5%, transparent), transparent 50%, color-mix(in oklab, var(--ink) 8%, transparent));
}
.proj-card__media-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%);
  opacity: 0; transition: opacity 0.4s ease;
}
.proj-card:hover .proj-card__media-overlay { opacity: 1; }

.proj-card__status {
  position: absolute; top: 12px; right: 12px;
  padding: 4px 10px; border-radius: 999px;
  font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  color: var(--bone); border: 1px solid rgba(255,255,255,0.1);
}
.proj-card__status--completed { color: #8cc084; border-color: rgba(140,192,132,0.3); }
.proj-card__status--in-progress { color: #d4a844; border-color: rgba(212,168,68,0.3); }

.proj-card__actions {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  display: flex; gap: 8px; flex-wrap: wrap;
  opacity: 0; transform: translateY(8px);
  transition: all 0.3s ease;
}
.proj-card:hover .proj-card__actions { opacity: 1; transform: translateY(0); }
.proj-card__action {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em;
  background: rgba(255,255,255,0.12); backdrop-filter: blur(12px);
  color: var(--bone); border: 1px solid rgba(255,255,255,0.1);
  text-decoration: none; cursor: pointer; transition: all 0.2s ease;
}
.proj-card__action:hover { background: rgba(255,255,255,0.22); }
.proj-card__action--primary { background: var(--vermilion); border-color: var(--vermilion); color: var(--bone); }
.proj-card__action--primary:hover { background: color-mix(in oklab, var(--vermilion) 85%, #000); }
.proj-card__action--ghost { background: transparent; border: none; }

.proj-card__info { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.proj-card__category {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--vermilion); margin-bottom: 8px;
}
.proj-card__name {
  font-family: var(--font-display, "Instrument Serif", serif); font-weight: 400;
  font-size: clamp(18px, 1.4vw, 22px); line-height: 1.15; letter-spacing: -0.01em; margin: 0;
}
.proj-card__desc {
  margin-top: 8px; font-size: 13.5px; line-height: 1.5;
  color: color-mix(in oklab, currentColor 60%, transparent);
  flex: 1;
}
.proj-card__tech { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
.proj-card__tech-tag {
  padding: 3px 8px; border-radius: 999px; font-family: var(--font-mono);
  font-size: 10px; letter-spacing: 0.04em;
  background: color-mix(in oklab, var(--ink) 6%, transparent);
  border: 1px solid color-mix(in oklab, currentColor 10%, transparent);
}
.proj-card__tech-more {
  font-family: var(--font-mono); font-size: 10px; color: color-mix(in oklab, currentColor 40%, transparent);
  display: inline-flex; align-items: center;
}
`;

const detailCSS = `
.proj-detail {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: flex-start; justify-content: center;
  padding: clamp(16px, 4vw, 40px);
  background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
  overflow-y: auto; -webkit-overflow-scrolling: touch;
}
.proj-detail__panel {
  position: relative; width: 100%; max-width: 780px;
  background: var(--bone);
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 24px 80px -20px rgba(0,0,0,0.4);
}
.proj-detail__close {
  position: absolute; top: 16px; right: 16px; z-index: 10;
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15); color: white; cursor: pointer;
  transition: background 0.2s ease;
}
.proj-detail__close:hover { background: rgba(0,0,0,0.6); }

.proj-detail__hero {
  padding: clamp(32px, 5vw, 56px) clamp(24px, 5vw, 48px);
  background: var(--ink); color: var(--bone);
}
.proj-detail__category {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--vermilion);
}
.proj-detail__title {
  font-family: var(--font-display, "Instrument Serif", serif); font-weight: 400;
  font-size: clamp(28px, 4.5vw, 48px); line-height: 1.06; letter-spacing: -0.015em;
  margin: 12px 0 14px;
}
.proj-detail__tagline { font-size: 16px; color: color-mix(in oklab, currentColor 72%, transparent); max-width: 52ch; }
.proj-detail__meta {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 18px;
  font-family: var(--font-mono); font-size: 11px; color: color-mix(in oklab, currentColor 55%, transparent);
}
.proj-detail__meta-sep { width: 1px; height: 12px; background: color-mix(in oklab, currentColor 20%, transparent); }
.proj-detail__status { padding: 3px 10px; border-radius: 999px; border: 1px solid; }
.proj-detail__status--completed { color: #8cc084; border-color: rgba(140,192,132,0.3); }
.proj-detail__status--in-progress { color: #d4a844; border-color: rgba(212,168,68,0.3); }

.proj-detail__actions { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
.proj-detail__btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em;
  background: color-mix(in oklab, var(--bone) 12%, transparent);
  color: var(--bone); border: 1px solid rgba(255,255,255,0.12);
  text-decoration: none; transition: all 0.25s ease;
}
.proj-detail__btn:hover { background: color-mix(in oklab, var(--bone) 22%, transparent); }
.proj-detail__btn--primary { background: var(--vermilion); border-color: var(--vermilion); }
.proj-detail__btn--primary:hover { background: color-mix(in oklab, var(--vermilion) 85%, #000); }

.proj-detail__body { padding: clamp(24px, 4vw, 48px) clamp(24px, 5vw, 48px); }
.proj-detail__section { margin-bottom: 36px; }
.proj-detail__section h4 {
  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--vermilion); margin-bottom: 12px;
}
.proj-detail__section p { font-size: 15px; line-height: 1.7; color: color-mix(in oklab, var(--ink) 78%, transparent); }

.proj-detail__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.proj-detail__list li { position: relative; padding-left: 18px; font-size: 14.5px; line-height: 1.6; color: color-mix(in oklab, var(--ink) 78%, transparent); }
.proj-detail__list li::before { content: "+"; position: absolute; left: 0; color: var(--vermilion); font-family: var(--font-mono); font-size: 10px; }

.proj-detail__tags { display: flex; flex-wrap: wrap; gap: 8px; }
.proj-detail__tag {
  padding: 6px 14px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em;
  background: color-mix(in oklab, var(--ink) 6%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 12%, transparent);
}
`;
