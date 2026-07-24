"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ArrowUp, Mail, Linkedin, Github, Instagram, Facebook } from "lucide-react";
import usePortfolio from "@/hooks/usePortfolio";

/**
 * SiteFooter — editorial closing chapter. Final page of the book:
 * a large closing line, profile card, two link columns, a quiet
 * newsletter, and a back-to-top control. Inherits theme tokens.
 * All data comes from Supabase via usePortfolio.
 */

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Linkedin, Github, Instagram, Facebook, Mail,
};

export function SiteFooter() {
  const { profile, socialLinks, siteSettings } = usePortfolio();

  // Get footer data from profile
  const blurb = profile?.blurb || "Building the future of work — one model, one paper, one decision at a time.";
  const name = profile?.name || "Manikanta R";
  const role = profile?.role || "MBA — HR & Business Analytics";
  const location = profile?.location || "Bengaluru, India";
  const status = profile?.availability_status || "Available for opportunities";
  const tagline = profile?.tagline || "Building the future of work";
  const copyright = profile?.copyright || "© 2026 Manikanta R";

  // Social links from Supabase
  const socialIcons = (socialLinks || []).filter((s: any) => s.category === "social" && s.visible !== false);
  const quickLinks = (socialLinks || []).filter((s: any) => s.category === "quick" && s.visible !== false);
  const professionalLinks = (socialLinks || []).filter((s: any) => s.category === "professional" && s.visible !== false);

  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [sub, setSub] = useState<"idle" | "ok">("idle");
  const [email, setEmail] = useState("");

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

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSub("ok");
    setEmail("");
    window.setTimeout(() => setSub("idle"), 3200);
  };

  const onTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      aria-labelledby="site-footer-heading"
      className={`mr-footer ${visible ? "is-in" : ""}`}
    >
      <h2 id="site-footer-heading" className="sr-only">Site footer</h2>

      <div className="mr-footer__inner">
        {/* Closing statement */}
        <p className="mr-footer__closing">
          {blurb}
        </p>

        <div className="mr-footer__rule" aria-hidden />

        {/* Main grid */}
        <div className="mr-footer__grid">
          {/* Identity */}
          <section className="mr-footer__col mr-footer__identity">
            <div className="mr-footer__name">{name}</div>
            <div className="mr-footer__line">{role}</div>
            <div className="mr-footer__line">{location}</div>
            <div className="mr-footer__status">
              <span className="mr-footer__dot" aria-hidden />
              {status}
            </div>
            <div className="mr-footer__social" aria-label="Social media">
              {socialIcons.map((s: any) => {
                const Icon = ICON_MAP[s.icon_name] || null;
                if (!Icon && !s.icon_name) return null;
                return Icon ? (
                  <a
                    key={s.id || s.platform}
                    href={s.url}
                    aria-label={s.label}
                    className="mr-footer__social-icon"
                    {...(s.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon aria-hidden className="mr-footer__social-svg" />
                  </a>
                ) : null;
              })}
            </div>
          </section>

          {/* Quick links */}
          {quickLinks.length > 0 && (
            <nav className="mr-footer__col" aria-label="Quick links">
              <div className="mr-footer__kicker">Quick links</div>
              <ul className="mr-footer__list">
                {quickLinks.map((l: any) => (
                  <li key={l.id || l.platform}>
                    <a href={l.url} className="mr-footer__link">{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Professional links */}
          {professionalLinks.length > 0 && (
            <nav className="mr-footer__col" aria-label="Professional links">
              <div className="mr-footer__kicker">Elsewhere</div>
              <ul className="mr-footer__list">
                {professionalLinks.map((l: any) => (
                  <li key={l.id || l.platform}>
                    <a
                      href={l.url}
                      className="mr-footer__link mr-footer__link--ext"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{l.label}</span>
                      <ArrowUpRight aria-hidden className="mr-footer__ext-icon" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Newsletter */}
          <section className="mr-footer__col mr-footer__news" aria-labelledby="news-h">
            <div id="news-h" className="mr-footer__kicker">The dispatch</div>
            <p className="mr-footer__news-copy">
              Occasional notes on research, analytics and the work in progress.
            </p>
            <form className="mr-footer__form" onSubmit={onSubscribe} noValidate>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="mr-footer__field">
                <Mail aria-hidden className="mr-footer__field-icon" />
                <input
                  id="footer-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mr-footer__input"
                />
                <button type="submit" className="mr-footer__submit" aria-label="Subscribe">
                  Subscribe
                </button>
              </div>
              <div
                aria-live="polite"
                className={`mr-footer__hint ${sub === "ok" ? "is-ok" : ""}`}
              >
                {sub === "ok" ? "Thank you — you're on the list." : "No spam. Unsubscribe anytime."}
              </div>
            </form>
          </section>
        </div>

        <div className="mr-footer__rule" aria-hidden />

        {/* Bottom */}
        <div className="mr-footer__bottom">
          <div className="mr-footer__copy">{copyright}</div>
          <div className="mr-footer__craft">
            {tagline}
          </div>
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
  margin-top: 96px;
  padding: 0;
  background:
    radial-gradient(120% 80% at 50% 0%,
      color-mix(in oklab, var(--vermilion) 6%, transparent) 0%,
      transparent 65%),
    color-mix(in oklab, var(--bone) 92%, var(--ink) 8%);
  color: var(--ink);
  border-top: 1px solid color-mix(in oklab, var(--ink) 10%, transparent);
  font-family: var(--font-sans, system-ui, sans-serif);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1);
}
.mr-footer.is-in { opacity: 1; transform: translateY(0); }
.dark .mr-footer {
  background:
    radial-gradient(120% 80% at 50% 0%,
      color-mix(in oklab, var(--vermilion) 9%, transparent) 0%,
      transparent 65%),
    color-mix(in oklab, var(--bone) 96%, transparent);
}

.mr-footer__inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(64px, 9vw, 120px) clamp(24px, 5vw, 64px) clamp(36px, 5vw, 56px);
}

.mr-footer__closing {
  margin: 0 0 clamp(48px, 7vw, 84px);
  max-width: 28ch;
  font-family: var(--font-serif, "Instrument Serif", Georgia, serif);
  font-weight: 400;
  font-size: clamp(2rem, 4.6vw, 3.6rem);
  line-height: 1.08;
  letter-spacing: -0.015em;
  color: var(--ink);
}
.mr-footer__closing em {
  font-style: italic;
  color: var(--vermilion);
}

.mr-footer__rule {
  height: 1px;
  background: color-mix(in oklab, var(--ink) 12%, transparent);
}

.mr-footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
  gap: clamp(28px, 4vw, 56px);
  padding: clamp(40px, 5vw, 64px) 0;
}
@media (max-width: 960px) {
  .mr-footer__grid { grid-template-columns: 1fr 1fr; }
  .mr-footer__news { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .mr-footer__grid { grid-template-columns: 1fr; gap: 36px; }
}

.mr-footer__col { min-width: 0; }

.mr-footer__name {
  font-family: var(--font-serif, "Instrument Serif", Georgia, serif);
  font-size: clamp(1.5rem, 2.2vw, 1.85rem);
  letter-spacing: -0.01em;
  line-height: 1.05;
  margin-bottom: 14px;
}
.mr-footer__line {
  font-size: 0.92rem;
  line-height: 1.55;
  color: color-mix(in oklab, var(--ink) 70%, transparent);
}
.mr-footer__status {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 18px;
  padding: 7px 14px;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink);
  background: color-mix(in oklab, var(--vermilion) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--vermilion) 28%, transparent);
}
.mr-footer__dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #2bb673;
  box-shadow: 0 0 10px rgba(43,182,115,.6);
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
  margin-top: 16px;
  flex-wrap: wrap;
}
.mr-footer__social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid color-mix(in oklab, var(--ink) 18%, transparent);
  color: color-mix(in oklab, var(--ink) 70%, transparent);
  transition: color .25s ease, border-color .25s ease, background .25s ease, transform .25s ease;
}
.mr-footer__social-icon:hover {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 55%, transparent);
  background: color-mix(in oklab, var(--vermilion) 8%, transparent);
  transform: translateY(-1px);
}
.mr-footer__social-icon:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 3px;
}
.mr-footer__social-svg { width: 15px; height: 15px; }

.mr-footer__kicker {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 55%, transparent);
  margin-bottom: 18px;
}

.mr-footer__list {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 10px;
}
.mr-footer__link {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: color-mix(in oklab, var(--ink) 78%, transparent);
  text-decoration: none;
  transition: color .25s ease, transform .25s ease;
}
.mr-footer__link:hover { color: var(--vermilion); transform: translateX(2px); }
.mr-footer__link:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 4px;
  border-radius: 4px;
}
.mr-footer__ext-icon {
  width: 13px; height: 13px;
  opacity: 0; transform: translate(-2px, 2px);
  transition: opacity .25s ease, transform .25s ease;
}
.mr-footer__link--ext:hover .mr-footer__ext-icon {
  opacity: .9; transform: translate(0, 0);
}

.mr-footer__news-copy {
  margin: 0 0 16px;
  font-size: 0.92rem;
  line-height: 1.55;
  color: color-mix(in oklab, var(--ink) 68%, transparent);
  max-width: 32ch;
}
.mr-footer__form { display: flex; flex-direction: column; gap: 10px; }
.mr-footer__field {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 14px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--bone) 70%, var(--ink) 6%);
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  transition: border-color .25s ease, background .25s ease;
}
.mr-footer__field:focus-within {
  border-color: color-mix(in oklab, var(--vermilion) 55%, transparent);
  background: color-mix(in oklab, var(--bone) 86%, transparent);
}
.mr-footer__field-icon {
  width: 15px; height: 15px;
  color: color-mix(in oklab, var(--ink) 55%, transparent);
}
.mr-footer__input {
  background: transparent;
  border: 0; outline: 0;
  font: inherit;
  font-size: 0.92rem;
  color: var(--ink);
  min-width: 0;
}
.mr-footer__input::placeholder { color: color-mix(in oklab, var(--ink) 40%, transparent); }
.mr-footer__submit {
  appearance: none; border: 0;
  padding: 9px 16px;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bone);
  background: var(--ink);
  cursor: pointer;
  transition: background .25s ease, transform .25s ease;
}
.mr-footer__submit:hover { background: var(--vermilion); transform: translateY(-1px); }
.mr-footer__submit:focus-visible { outline: 2px solid var(--vermilion); outline-offset: 3px; }
.mr-footer__hint {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 50%, transparent);
  padding-left: 4px;
  transition: color .25s ease;
}
.mr-footer__hint.is-ok { color: #2bb673; }

.mr-footer__bottom {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(16px, 3vw, 32px);
  padding-top: clamp(28px, 4vw, 40px);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--ink) 55%, transparent);
}
@media (max-width: 720px) {
  .mr-footer__bottom { grid-template-columns: 1fr; text-align: left; }
}
.mr-footer__craft { text-transform: none; letter-spacing: 0.02em; font-family: var(--font-sans, system-ui, sans-serif); font-size: 0.82rem; }

.mr-footer__top {
  display: inline-flex; align-items: center; gap: 8px;
  appearance: none;
  padding: 9px 14px;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  border: 1px solid color-mix(in oklab, var(--ink) 18%, transparent);
  cursor: pointer;
  transition: color .25s ease, border-color .25s ease, transform .25s ease, background .25s ease;
}
.mr-footer__top:hover {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 55%, transparent);
  transform: translateY(-1px);
}
.mr-footer__top:focus-visible { outline: 2px solid var(--vermilion); outline-offset: 3px; }
.mr-footer__top-icon { width: 13px; height: 13px; }

@media (prefers-reduced-motion: reduce) {
  .mr-footer, .mr-footer__link, .mr-footer__submit, .mr-footer__top, .mr-footer__dot { transition: none; animation: none; }
}
`;