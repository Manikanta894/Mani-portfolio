"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Linkedin, Github, Instagram, Facebook } from "lucide-react";
import usePortfolio from "@/hooks/usePortfolio";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Linkedin, Github, Instagram, Facebook,
};

function FooterClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="tabular-nums">{time || "—"} IST</span>;
}

export function SiteFooter() {
  const { profile, socialLinks } = usePortfolio();

  const blurb = profile?.blurb || "Building the future of work — one model, one paper, one decision at a time.";
  const name = profile?.name || "Manikanta R";
  const role = profile?.role || "MBA — HR & Business Analytics";
  const location = profile?.location || "Bengaluru, India";
  const status = profile?.availability_status || "Available for opportunities";
  const tagline = profile?.tagline || "Building the future of work";
  const copyright = profile?.copyright || "© 2026 Manikanta R";

  const socialIcons = (socialLinks || []).filter((s: any) => s.category === "social" && s.visible !== false);
  const quickLinks = (socialLinks || []).filter((s: any) => s.category === "quick" && s.visible !== false);
  const professionalLinks = (socialLinks || []).filter((s: any) => s.category === "professional" && s.visible !== false);

  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer ref={rootRef} className={`mr-footer ${visible ? "is-in" : ""}`}>
      <div className="mr-footer-canvas" aria-hidden />
      <div className="mr-footer__inner">
        <p className="mr-footer__closing">{blurb}</p>

        <div className="mr-footer__grid">
          <section className="mr-footer__card mr-footer__identity">
            <div className="mr-footer__card-glow" aria-hidden />
            <div className="mr-footer__card-body">
              <div className="mr-footer__name">{name}</div>
              <div className="mr-footer__line">{role}</div>
              <div className="mr-footer__line">{location}</div>
              <div className="mr-footer__status">
                <span className="mr-footer__dot" aria-hidden />
                {status}
              </div>
              {socialIcons.length > 0 && (
                <div className="mr-footer__social" aria-label="Social media">
                  {socialIcons.map((s: any) => {
                    const Icon = ICON_MAP[s.icon_name];
                    if (!Icon) return null;
                    return (
                      <a key={s.id || s.platform} href={s.url} aria-label={s.label}
                        className="mr-footer__social-icon"
                        {...(s.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        <Icon aria-hidden className="mr-footer__social-svg" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {quickLinks.length > 0 && (
            <nav className="mr-footer__card mr-footer__col" aria-label="Quick links">
              <div className="mr-footer__card-body">
                <div className="mr-footer__kicker">Quick links</div>
                <ul className="mr-footer__list">
                  {quickLinks.map((l: any) => (
                    <li key={l.id || l.platform}>
                      <a href={l.url} className="mr-footer__link">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}

          {professionalLinks.length > 0 && (
            <nav className="mr-footer__card mr-footer__col" aria-label="Professional links">
              <div className="mr-footer__card-body">
                <div className="mr-footer__kicker">Elsewhere</div>
                <ul className="mr-footer__list">
                  {professionalLinks.map((l: any) => (
                    <li key={l.id || l.platform}>
                      <a href={l.url} className="mr-footer__link mr-footer__link--ext"
                        target="_blank" rel="noopener noreferrer">
                        <span>{l.label}</span>
                        <ArrowUpRight aria-hidden className="mr-footer__ext-icon" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}
        </div>

        <div className="mr-footer__bottom">
          <div className="mr-footer__copy">{copyright} · <FooterClock /> · replies within 24h</div>
          <div className="mr-footer__craft">{tagline}</div>
          <button type="button" onClick={onTop} className="mr-footer__top">
            <ArrowUp aria-hidden className="mr-footer__top-icon" />
            <span>Back to top</span>
          </button>
        </div>
      </div>

      <style>{css}</style>
    </footer>
  );
}

const css = `
.mr-footer {
  position: relative;
  margin-top: 120px;
  padding: 0;
  background: color-mix(in oklab, var(--bone) 96%, var(--ink) 4%);
  color: var(--ink);
  font-family: var(--font-sans, system-ui, sans-serif);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1);
  overflow: hidden;
}
.mr-footer.is-in { opacity: 1; transform: translateY(0); }

.dark .mr-footer {
  background: #0a0a0c;
}

/* Animated canvas gradient */
.mr-footer-canvas {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(110% 70% at 20% 10%, rgba(212,106,46,0.05), transparent 60%),
    radial-gradient(80% 60% at 90% 80%, rgba(212,106,46,0.03), transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.mr-footer__inner {
  position: relative;
  z-index: 1;
  max-width: 1480px;
  margin: 0 auto;
  padding: clamp(72px, 10vw, 128px) clamp(16px, 3vw, 40px) clamp(32px, 4vw, 48px);
}

.mr-footer__closing {
  margin: 0 0 clamp(48px, 6vw, 72px);
  max-width: 30ch;
  font-family: var(--font-serif, "Instrument Serif", Georgia, serif);
  font-weight: 400;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.06;
  letter-spacing: -0.018em;
  color: var(--ink);
  background: linear-gradient(135deg, var(--ink) 50%, color-mix(in oklab, var(--vermilion) 70%, var(--ink) 30%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mr-footer__grid {
  display: grid;
  grid-template-columns: 1.3fr 0.85fr 0.85fr;
  gap: clamp(20px, 3vw, 40px);
  padding: 0;
}

@media (max-width: 960px) {
  .mr-footer__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .mr-footer__grid { grid-template-columns: 1fr; gap: 20px; }
}

/* Glass card */
.mr-footer__card {
  position: relative;
  border-radius: 16px;
  background: color-mix(in oklab, var(--bone) 55%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 8%, transparent);
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: border-color .4s ease, box-shadow .4s ease;
}
.mr-footer__card:hover {
  border-color: color-mix(in oklab, var(--vermilion) 20%, transparent);
  box-shadow: 0 8px 32px -12px rgba(212,106,46,0.15);
}

.dark .mr-footer__card {
  background: color-mix(in oklab, white 4%, transparent);
  border-color: color-mix(in oklab, white 6%, transparent);
}
.dark .mr-footer__card:hover {
  border-color: color-mix(in oklab, var(--vermilion) 25%, transparent);
  box-shadow: 0 8px 32px -12px rgba(212,106,46,0.2);
}

.mr-footer__card-glow {
  position: absolute;
  top: -50%;
  right: -30%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212,106,46,0.08), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity .6s ease;
}
.mr-footer__card:hover .mr-footer__card-glow { opacity: 1; }

.mr-footer__card-body {
  position: relative;
  padding: clamp(22px, 2.4vw, 30px);
}

.mr-footer__name {
  font-family: var(--font-serif, "Instrument Serif", Georgia, serif);
  font-size: clamp(1.4rem, 2vw, 1.7rem);
  letter-spacing: -0.01em;
  line-height: 1.05;
  margin-bottom: 12px;
  color: var(--ink);
}
.mr-footer__line {
  font-size: 0.88rem;
  line-height: 1.55;
  color: color-mix(in oklab, var(--ink) 65%, transparent);
}
.mr-footer__status {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 16px;
  padding: 6px 13px;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink);
  background: color-mix(in oklab, var(--vermilion) 8%, transparent);
  border: 1px solid color-mix(in oklab, var(--vermilion) 22%, transparent);
}
.mr-footer__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #2bb673;
  box-shadow: 0 0 8px rgba(43,182,115,.6);
  animation: mr-footer-pulse 2.4s ease-in-out infinite;
}
@keyframes mr-footer-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .55; transform: scale(1.25); }
}

.mr-footer__social {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  flex-wrap: wrap;
}
.mr-footer__social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid color-mix(in oklab, var(--ink) 16%, transparent);
  color: color-mix(in oklab, var(--ink) 65%, transparent);
  transition: color .25s ease, border-color .25s ease, background .25s ease, transform .25s ease, box-shadow .25s ease;
}
.mr-footer__social-icon:hover {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 55%, transparent);
  background: color-mix(in oklab, var(--vermilion) 8%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -8px rgba(212,106,46,0.25);
}
.mr-footer__social-icon:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 3px;
}
.mr-footer__social-svg { width: 15px; height: 15px; }

.mr-footer__kicker {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 50%, transparent);
  margin-bottom: 18px;
}

.mr-footer__list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 10px;
}
.mr-footer__link {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.92rem;
  line-height: 1.4;
  color: color-mix(in oklab, var(--ink) 75%, transparent);
  text-decoration: none;
  transition: color .25s ease, transform .25s ease;
  position: relative;
}
.mr-footer__link::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0;
  height: 1px;
  background: var(--vermilion);
  transition: width .35s cubic-bezier(.2,.8,.2,1);
}
.mr-footer__link:hover { color: var(--vermilion); transform: translateX(4px); }
.mr-footer__link:hover::before { width: 100%; }
.mr-footer__link:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 4px;
  border-radius: 4px;
}
.mr-footer__ext-icon {
  width: 12px; height: 12px;
  opacity: 0; transform: translate(-2px, 2px);
  transition: opacity .25s ease, transform .25s ease;
}
.mr-footer__link--ext:hover .mr-footer__ext-icon {
  opacity: .9; transform: translate(0, 0);
}

.mr-footer__bottom {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(16px, 3vw, 32px);
  margin-top: clamp(40px, 5vw, 56px);
  padding-top: clamp(24px, 3vw, 32px);
  border-top: 1px solid color-mix(in oklab, var(--ink) 10%, transparent);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 50%, transparent);
}
@media (max-width: 720px) {
  .mr-footer__bottom { grid-template-columns: 1fr; text-align: left; gap: 14px; }
}
.mr-footer__craft {
  text-transform: none; letter-spacing: 0.02em;
  font-family: var(--font-sans, system-ui, sans-serif);
  font-size: 0.8rem;
  color: color-mix(in oklab, var(--ink) 45%, transparent);
}

.mr-footer__top {
  display: inline-flex; align-items: center; gap: 8px;
  appearance: none;
  padding: 8px 14px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 6%, transparent);
  color: color-mix(in oklab, var(--ink) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  cursor: pointer;
  transition: color .25s ease, border-color .25s ease, transform .25s ease, background .25s ease, box-shadow .25s ease;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.mr-footer__top:hover {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 50%, transparent);
  background: color-mix(in oklab, var(--vermilion) 6%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -8px rgba(212,106,46,0.2);
}
.mr-footer__top:focus-visible { outline: 2px solid var(--vermilion); outline-offset: 3px; }
.mr-footer__top-icon { width: 12px; height: 12px; }

@media (prefers-reduced-motion: reduce) {
  .mr-footer, .mr-footer__link, .mr-footer__top, .mr-footer__dot, .mr-footer__social-icon,
  .mr-footer__card, .mr-footer__card-glow { transition: none; animation: none; }
  .mr-footer__link::before { display: none; }
}
`;
