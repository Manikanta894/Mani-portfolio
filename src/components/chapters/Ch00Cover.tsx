import { useEffect, useRef, useState } from "react";
import portraitCutout from "@/assets/portrait-cutout.png";
import usePortfolio from "@/hooks/usePortfolio";

export function Ch00Cover() {
  const row1Ref = useRef<HTMLSpanElement>(null);
  const row2Ref = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const { profile } = usePortfolio();

  const skills = (profile?.hero_skills as string[]) || [
    "HR Analytics", "Business Analytics", "AI Strategy", "Research", "Power BI", "People Analytics",
  ];
  const heroMeta = (profile?.hero_meta as any[]) || [
    { label: "Published Papers", value: "04", type: "text" },
    { label: "MBA", value: "MBA · '27", sub: "HR & Business Analytics", type: "cohort" },
    { label: "Availability", value: "Available", sub: "for collaborations", type: "status" },
  ];
  const tagline = profile?.tagline || "Building the future of work through <em>AI, analytics & human insight</em>.";
  const welcomeText = profile?.welcome_text || "Welcome to my Portfolio.";
  const ctas = (profile?.ctas as any[]) || [
    { label: "Explore Journey", href: "#about", type: "primary" },
    { label: "Let's Connect", href: "#contact", type: "ghost" },
    { label: "Download Resume", href: "https://manikantar.in/resume.pdf", type: "ghost", download: true },
  ];
  const location = profile?.location || "Bengaluru · India";

const [portraitAwake] = useState(true);
const [awake] = useState(true);
const [entered] = useState(true);

  // Broadcast "hero ready" so global chrome (nav) can fade in only after the intro.
  useEffect(() => {
    if (!entered) return;
    window.dispatchEvent(new CustomEvent("mr-hero-entered"));
  }, [entered]);


  return (
    <section
      id="cover"
      data-chapter="00"
      className="hero-stage relative min-h-screen w-full overflow-hidden"
    >
      <div className="hero-bg" aria-hidden />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1480px] grid-cols-12 items-center gap-6 px-4 sm:px-6 md:px-8 lg:px-16 py-10 lg:py-0 lg:h-screen">
        {/* LEFT · PORTRAIT */}
        <div className={`col-span-12 lg:col-span-5 relative flex items-center justify-center hero-left ${portraitAwake ? "is-awake" : ""}`}>
          <div aria-hidden className={`hero-watermark ${portraitAwake ? "is-awake" : ""}`}>MR</div>
          <div className="hero-halo" aria-hidden />
          <div ref={portraitRef} className="hero-portrait">
            <img src={portraitCutout} alt="Portrait of Manikanta R" draggable={false} />
          </div>
        </div>

        {/* RIGHT · NAME + HIERARCHY */}
        <div className={`col-span-12 lg:col-span-7 relative hero-right ${awake ? "is-awake" : ""} ${entered ? "is-entered" : ""}`}>
          <div className="hero-eyebrow" style={{ transitionDelay: entered ? "120ms" : "0ms" }}>
            <span className="hero-eyebrow-dot" />
            {location}
            <span className="hero-eyebrow-sep" />
            Edition · 2026
          </div>

          <h1 className="hero-name" aria-label="Manikanta R">
            <span ref={row1Ref} className="hero-name-row">
              <span className="hero-letter-anchor">Manikanta</span>
            </span>
            <span ref={row2Ref} className="hero-name-row hero-name-row--two">
              <span className="hero-letter-anchor hero-letter--R">R</span>
              <span className="hero-name-period" aria-hidden>.</span>
            </span>
          </h1>

          <p className="hero-welcome" style={{ transitionDelay: entered ? "200ms" : "0ms" }}>
            {welcomeText}
          </p>


          <div className="hero-rule" style={{ transitionDelay: entered ? "320ms" : "0ms" }} />

          <ul className="hero-skills">
            {skills.map((s: string, i: number) => (
              <li key={s} style={{ transitionDelay: entered ? `${380 + i * 55}ms` : "0ms" }}>
                {s}
              </li>
            ))}
          </ul>

          <p ref={taglineRef} className="hero-tagline" style={{ transitionDelay: entered ? "0ms" : "0ms" }}
            dangerouslySetInnerHTML={{ __html: tagline }}
          />


          <div className="hero-ctas" style={{ transitionDelay: entered ? "900ms" : "0ms" }}>
            {ctas.map((cta: any, i: number) => (
              <a
                key={i}
                href={cta.href}
                target={cta.href?.startsWith("http") ? "_blank" : undefined}
                rel={cta.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                download={cta.download || undefined}
                className={`hero-cta ${cta.type === "primary" ? "hero-cta--primary" : "hero-cta--ghost"}`}
              >
                <span>{cta.label}</span>
                {cta.type === "primary" && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                  </svg>
                )}
                {cta.download && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M7 1v9m0 0L3 6m4 4l4-4M1 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          <div className="hero-meta" style={{ transitionDelay: entered ? "1040ms" : "0ms" }}>
            {heroMeta.map((m: any, i: number) => (
              <span key={i}>
                {m.type === "cohort" ? (
                  <><b>{m.value}</b> {m.sub}</>
                ) : m.type === "status" ? (
                  <><b>{m.value}</b> {m.sub}</>
                ) : (
                  <><b>{m.value}</b> {m.label}</>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Camera-focus spotlight reveal */}

      {/* Welcome rotator — appears after name settles, dismisses into the hero */}

      <style>{css}</style>
    </section>
  );
}

const css = `
.hero-stage {
  --hero-ink: #181818;
  --hero-ink-2: #555555;
  --hero-paper: #F8F5EF;
  --hero-paper-2: #FFFFFF;
  --hero-mute: #777777;
  --hero-rule: rgba(24,24,24,0.12);
  --hero-accent: #D46A2E;
  background: linear-gradient(180deg, var(--hero-paper) 0%, var(--hero-paper-2) 100%);
  color: var(--hero-ink);
  font-family: var(--font-sans);
}

.hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(900px 600px at 22% 38%, rgba(20,17,15,0.06), transparent 70%),
    radial-gradient(700px 500px at 88% 80%, rgba(20,17,15,0.04), transparent 70%);
  pointer-events: none;
}

/* Veil during intro */
.hero-left,
.hero-right {
  filter: blur(14px) saturate(0.6);
  opacity: 0.45;
  transition: filter 900ms cubic-bezier(.2,.7,.2,1) 80ms,
              opacity 900ms cubic-bezier(.2,.7,.2,1) 80ms;
}
.hero-left.is-awake,
.hero-right.is-awake {
  filter: blur(0) saturate(1);
  opacity: 1;
}

/* Hide secondary UI until visitor "enters" */
.hero-right .hero-eyebrow,
.hero-right .hero-welcome,
.hero-right .hero-rule,
.hero-right .hero-skills li,
.hero-right .hero-tagline,
.hero-right .hero-ctas,
.hero-right .hero-meta {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1);
}
.hero-right.is-entered .hero-eyebrow,
.hero-right.is-entered .hero-welcome,
.hero-right.is-entered .hero-rule,
.hero-right.is-entered .hero-skills li,
.hero-right.is-entered .hero-tagline,
.hero-right.is-entered .hero-ctas,
.hero-right.is-entered .hero-meta {
  opacity: 1;
  transform: translateY(0);
}
.hero-right .hero-ctas { pointer-events: none; }
.hero-right.is-entered .hero-ctas { pointer-events: auto; }

/* Portrait column */
.hero-watermark {
  position: absolute;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(280px, 36vw, 520px);
  letter-spacing: -0.04em;
  line-height: 0.82;
  color: var(--hero-ink);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 1.4s ease, transform 1.4s ease;
  user-select: none;
  pointer-events: none;
  mix-blend-mode: multiply;
}
.hero-watermark.is-awake { opacity: 0.022; transform: translateY(0); }

.hero-halo {
  position: absolute;
  width: clamp(420px, 42vw, 620px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(20,17,15,0.10), rgba(20,17,15,0) 70%);
  filter: blur(20px);
  pointer-events: none;
  transform: translateY(-3%);
}

/* Portrait iris reveal — opens during the morph so the portrait
   feels born from the same transformation as the monogram. */
.hero-portrait {
  position: relative;
  width: clamp(360px, 36vw, 520px);
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  isolation: isolate;
  transform: translateY(-3%);
  box-shadow:
    0 0 0 1px color-mix(in oklab, var(--hero-ink) 12%, transparent),
    0 0 0 6px color-mix(in oklab, var(--hero-paper) 88%, transparent),
    0 0 0 7px color-mix(in oklab, var(--hero-ink) 10%, transparent),
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 30px 60px -20px rgba(20,17,15,0.35),
    0 80px 120px -40px rgba(20,17,15,0.25);
  clip-path: circle(0% at 50% 50%);
  transition:
    clip-path 1100ms cubic-bezier(.22,.7,.2,1) 120ms,
    transform 1200ms cubic-bezier(.22,.7,.2,1) 120ms;
}
.hero-left.is-awake .hero-portrait {
  clip-path: circle(52% at 50% 50%);
  transform: translateY(-3%) scale(1);
  animation: hero-float 9s ease-in-out 1300ms infinite;
}

/* Subtle rim light — a thin highlight ring on the upper-left */
.hero-portrait::before {
  content: "";
  position: absolute; inset: -1px;
  border-radius: 50%;
  background:
    conic-gradient(from 210deg at 50% 50%,
      rgba(255,245,230,0) 0deg,
      rgba(255,245,230,0.55) 60deg,
      rgba(255,245,230,0.0) 140deg,
      rgba(255,245,230,0) 360deg);
  mask: radial-gradient(circle, transparent 49%, #000 50%, #000 51%, transparent 52%);
  -webkit-mask: radial-gradient(circle, transparent 49%, #000 50%, #000 51%, transparent 52%);
  pointer-events: none;
  z-index: 2;
  opacity: 0.85;
}

.hero-portrait::after {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 50% at 50% 18%, rgba(255,245,230,0.22), transparent 70%),
    linear-gradient(180deg, rgba(20,17,15,0) 60%, rgba(20,17,15,0.18) 100%);
  pointer-events: none;
}

.hero-portrait img {
  width: 112%; height: 112%;
  object-fit: cover; object-position: 50% 18%;
  position: absolute; left: -6%; top: -6%;
  filter: grayscale(0.15) contrast(1.02);
}

@keyframes hero-float {
  0%, 100% { transform: translateY(-3%); }
  50%      { transform: translateY(calc(-3% - 10px)); }
}

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--hero-mute);
  margin-bottom: 22px;
}
.hero-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--hero-accent);
  box-shadow: 0 0 0 4px rgba(107,102,96,0.15);
}
.hero-eyebrow-sep { width: 22px; height: 1px; background: var(--hero-rule); }

.hero-name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(64px, 9.6vw, 152px);
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--hero-ink);
  margin: 0;
  display: flex;
  flex-direction: column;
}
.hero-name-row { display: inline-flex; align-items: baseline; white-space: nowrap; }
.hero-name-row--two { margin-top: -0.14em; padding-left: 0.04em; }
.hero-letter-anchor { display: inline-block; }
.hero-letter--R { font-size: 1.02em; }
.hero-name-period { color: var(--hero-accent); margin-left: 0.06em; font-style: italic; }

.hero-welcome {
  margin: 28px 0 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(22px, 2.1vw, 32px);
  line-height: 1.2;
  letter-spacing: -0.005em;
  color: var(--hero-ink);
  max-width: 38ch;
}
.hero-welcome em { color: var(--hero-ink); font-style: italic; }


.hero-rule {
  margin-top: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--hero-ink) 0%, var(--hero-ink) 60px, var(--hero-rule) 60px, var(--hero-rule) 100%);
}

.hero-skills { display: flex; flex-wrap: wrap; gap: 10px 12px; margin: 22px 0 0; padding: 0; list-style: none; }
.hero-skills li {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 10px 16px;
  line-height: 1;
  border: 1px solid var(--hero-rule);
  border-radius: 999px;
  color: var(--hero-ink-2);
  background: color-mix(in oklab, var(--hero-paper) 60%, transparent);
  backdrop-filter: blur(4px);
  transition: border-color .35s ease, color .35s ease, background .35s ease, transform .35s ease, box-shadow .35s ease;
}
.hero-skills li:hover {
  border-color: var(--hero-ink);
  color: var(--hero-ink);
  background: color-mix(in oklab, var(--hero-paper) 92%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -16px color-mix(in oklab, var(--hero-ink) 60%, transparent);
}


.hero-tagline {
  margin: 22px 0 0;
  max-width: 30ch;
  font-family: var(--font-display);
  font-style: normal;
  font-size: clamp(20px, 1.8vw, 28px);
  line-height: 1.4;
  letter-spacing: -0.005em;
  color: var(--hero-ink-2);
}
.hero-tagline em { font-style: italic; color: var(--hero-ink); }

.hero-ctas { display: inline-flex; flex-wrap: wrap; gap: 12px 14px; margin-top: 30px; align-items: stretch; }
.hero-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  height: 48px;
  padding: 0 24px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-radius: 999px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transition: color .35s ease, border-color .35s ease, transform .35s ease, box-shadow .35s ease;
}
.hero-cta svg { transition: transform .45s cubic-bezier(.2,.8,.2,1); }
.hero-cta:hover svg { transform: translateX(4px); }
.hero-cta::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  z-index: -1;
  transition: transform .55s cubic-bezier(.2,.8,.2,1), opacity .35s ease;
}
.hero-cta--primary {
  color: var(--hero-paper);
  border: 1px solid var(--hero-ink);
  background: var(--hero-ink);
  box-shadow: 0 12px 24px -16px color-mix(in oklab, var(--hero-ink) 80%, transparent);
}
.hero-cta--primary::before {
  background: linear-gradient(120deg, var(--hero-ink) 0%, var(--hero-ink-2) 100%);
  transform: translateY(101%);
  opacity: 0;
}
.hero-cta--primary:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -18px color-mix(in oklab, var(--hero-ink) 90%, transparent); }
.hero-cta--primary:hover::before { transform: translateY(0); opacity: 1; }

.hero-cta--ghost {
  background: transparent;
  color: var(--hero-ink);
  border: 1px solid color-mix(in oklab, var(--hero-ink) 28%, transparent);
}
.hero-cta--ghost::before {
  background: color-mix(in oklab, var(--hero-ink) 8%, transparent);
  transform: translateY(101%);
  opacity: 0;
}
.hero-cta--ghost:hover {
  border-color: var(--hero-ink);
  transform: translateY(-2px);
}
.hero-cta--ghost:hover::before { transform: translateY(0); opacity: 1; }

.hero-meta {
  display: flex; flex-wrap: wrap; gap: 18px 26px;
  margin-top: 32px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--hero-mute);
}
.hero-meta b { color: var(--hero-ink); font-weight: 500; }


.dark .hero-stage {
  --hero-ink: #F5F1EB;
  --hero-ink-2: #C8C2B8;
  --hero-paper: #0E0E10;
  --hero-paper-2: #17171A;
  --hero-mute: #8F887F;
  --hero-rule: rgba(245,241,235,0.10);
  --hero-accent: #D46A2E;
}
.dark .hero-portrait img { filter: grayscale(0.15) contrast(1.05) brightness(1.05); }
.dark .hero-watermark { mix-blend-mode: screen; }
.dark .hero-watermark.is-awake { opacity: 0.03; }

@media (max-width: 1024px) {
  .hero-name { font-size: clamp(54px, 13vw, 108px); }
  .hero-watermark { font-size: 40vw; }
}
@media (max-width: 640px) {
  .hero-name { font-size: clamp(46px, 14vw, 80px); }
  .hero-tagline { font-size: 17px; }
  .hero-welcome { font-size: 19px; }
}

`;