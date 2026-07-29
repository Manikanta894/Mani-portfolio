import { useEffect, useRef, useState } from "react";
import portraitCutout from "@/assets/portrait-cutout.png";
import usePortfolio from "@/hooks/usePortfolio";

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const isNumeric = !isNaN(num);

  useEffect(() => {
    if (!isNumeric || !ref.current) { setDisplay(value); return; }
    let start = 0;
    const duration = 1200;
    const step = 16;
    const totalSteps = duration / step;
    const increment = num / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) { setDisplay(value + suffix); clearInterval(timer); }
      else setDisplay(Math.floor(start).toString() + suffix);
    }, step);
    return () => clearInterval(timer);
  }, [value, suffix, isNumeric, num]);

  return <span ref={ref}>{display}</span>;
}

function RoleCarousel() {
  const roles = ["HR Analytics", "People Analytics", "AI Strategy", "Data-Driven HR"];
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(roles[0]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setFading(false);
      }, 300);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!fading) setDisplay(roles[index]);
  }, [index, fading]);

  return (
    <span className={`hero-role ${fading ? "is-fading" : ""}`}>
      {display}
    </span>
  );
}

const METRIC_ICONS: Record<string, React.ReactNode> = {
  experience: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="hero-metric-icon">
      <circle cx="10" cy="5" r="3" />
      <path d="M4 18c1-5 3-8 6-8s5 3 6 8" />
    </svg>
  ),
  mba: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="hero-metric-icon">
      <path d="M10 2L2 6l8 4 8-4-8-4z" />
      <path d="M2 10l8 4 8-4" />
      <path d="M2 14l8 4 8-4" />
    </svg>
  ),
  certifications: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="hero-metric-icon">
      <circle cx="10" cy="10" r="7" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  ),
  availability: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="hero-metric-icon">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 3" />
    </svg>
  ),
};

function getIconKey(label: string): string {
  if (/experience/i.test(label)) return "experience";
  if (/mba/i.test(label)) return "mba";
  if (/cert/i.test(label)) return "certifications";
  return "availability";
}

function HeroGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    const step = 48;
    let dots: { x: number; y: number; phase: number }[] = [];
    const rebuild = () => {
      dots = [];
      for (let x = 0; x < W; x += step)
        for (let y = 0; y < H; y += step)
          dots.push({ x, y, phase: Math.random() * Math.PI * 2 });
    };
    rebuild();

    let raf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      const isDark = document.querySelector(".dark") !== null;
      const baseColor = isDark ? "245,241,235" : "20,17,15";

      for (const d of dots) {
        const pulse = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.0006 + d.phase));
        const size = 1.0 * pulse;
        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor},${0.04 * pulse})`;
        ctx.fill();
      }

      const midX = Math.floor(W / step / 2) * step;
      const midY = Math.floor(H / step / 2) * step;
      for (const d of dots) {
        const dx = d.x - midX;
        const dy = d.y - midY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) continue;
        for (const e of dots) {
          if (e === d) continue;
          const ex = e.x - d.x;
          const ey = e.y - d.y;
          const ed = Math.sqrt(ex * ex + ey * ey);
          if (ed < step * 1.1 && ed > 0) {
            const o = 0.08 * (1 - ed / (step * 1.1));
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(e.x, e.y);
            ctx.strokeStyle = `rgba(${baseColor},${o})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", () => { resize(); rebuild(); });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />;
}

export function Ch00Cover() {
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);

  const { profile } = usePortfolio();

  const skills = (profile?.hero_skills as string[]) || [
    "HR Analytics", "Business Analytics", "AI Strategy", "Research", "Power BI", "People Analytics",
  ];
  const heroMeta = (profile?.hero_meta as any[]) || [
    { label: "Total Experience", value: "6+ Years", sub: "Analytics · Operations · Research", type: "cohort" },
    { label: "MBA", value: "MBA · '27", sub: "HR & Business Analytics", type: "cohort" },
    { label: "Certifications", value: "12+", sub: "HR · AI · Analytics", type: "text" },
    { label: "Availability", value: "Available", sub: "for opportunities", type: "status" },
  ];
  const tagline = profile?.tagline || "Building the future of work through <em>AI, analytics & human insight</em>.";
  const welcomeText = profile?.welcome_text || "Welcome to my Portfolio.";
  const ctas = (profile?.ctas as any[]) || [
    { label: "Explore Journey", href: "#about", type: "primary" },
    { label: "Let's Connect", href: "#contact", type: "ghost" },
    { label: "Download Resume", href: "https://manikantar.in/resume.pdf", type: "ghost", download: true },
  ];
  const location = profile?.location || "Bengaluru · India";
  const companies = (profile?.hero_companies as { name: string; role: string; current?: boolean }[]) || [
    { name: "Fizzy Goblet", role: "Senior Fashion Consultant", current: true },
    { name: "RCM", role: "Inventory Manager", current: false },
  ];

  const [entered] = useState(true);

  // Parallax
  useEffect(() => {
    if (!portraitWrapRef.current) return;
    const el = portraitWrapRef.current;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) * -0.03;
        el.style.setProperty("--parallax-y", `${offset}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!entered) return;
    window.dispatchEvent(new CustomEvent("mr-hero-entered"));
  }, [entered]);

  const metrics = heroMeta;

  return (
    <section
      id="cover"
      data-chapter="00"
      className="hero-stage relative min-h-screen w-full overflow-hidden"
    >
      <HeroGridBg />
      <div className="hero-bg" aria-hidden />

      {/* Status bar */}
      <div className="hero-status-bar" style={{ transitionDelay: entered ? "140ms" : "0ms" }}>
        <span className="hero-status-dot" />
        <span>Open to Opportunities</span>
        <svg className="hero-status-linkedin" viewBox="0 0 20 20" fill="currentColor" width="12" height="12" aria-hidden>
          <path d="M16 0H4C1.8 0 0 1.8 0 4v12c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zM6 17H3V8h3v9zM4.5 6.3c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8zM17 17h-3v-5.3c0-1.3-.5-2-1.5-2s-1.5.7-1.5 2V17H8V8h3v1.2c.5-.8 1.5-1.4 2.5-1.4 1.8 0 3.5 1.1 3.5 3.8V17z" />
        </svg>
        <span className="hero-status-sep" aria-hidden />
        <span className="hero-status-loc">{location}</span>
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1480px] grid-cols-12 items-center gap-6 px-4 sm:px-6 md:px-8 lg:px-16 py-10 lg:py-0 lg:h-screen">
        {/* LEFT · PORTRAIT */}
        <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center flex-col hero-left is-awake">
          <div aria-hidden className="hero-watermark is-awake">MR</div>
          <div className="hero-halo" aria-hidden />
          <div ref={portraitWrapRef} className="hero-portrait-wrap">
            <div className="hero-portrait-glow" aria-hidden />
            <div className="hero-portrait is-awake">
              <img src={portraitCutout} alt="Portrait of Manikanta R" draggable={false} />
            </div>
          </div>

          {/* Social proof */}
          <div className="hero-proof">
            <span className="hero-proof-mark" aria-hidden>&#10018;</span>
            <span className="hero-proof-text">"One of the sharpest analysts I've mentored — combines technical depth with real business instinct."</span>
          </div>

          {/* Metrics cards below portrait */}
          <div className="hero-metrics-strip">
            {metrics.slice(0, 4).map((m: any, i: number) => (
              <div key={i} className="hero-metric" style={{ transitionDelay: entered ? `${800 + i * 80}ms` : "0ms" }}>
                <span className="hero-metric-icon-wrap">
                  {METRIC_ICONS[getIconKey(m.label)] || METRIC_ICONS.availability}
                </span>
                <span className="hero-metric-value">
                  {m.type === "status" ? (
                    <span className="hero-metric-avail">{m.value}</span>
                  ) : (
                    <AnimatedCounter value={m.value} />
                  )}
                </span>
                <span className="hero-metric-label">
                  {m.type === "cohort" ? m.sub : m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT · NAME + HIERARCHY */}
        <div className={`col-span-12 lg:col-span-7 relative hero-right is-awake ${entered ? "is-entered" : ""}`}>
          <div className="hero-eyebrow" style={{ transitionDelay: entered ? "120ms" : "0ms" }}>
            <span className="hero-eyebrow-dot" />
            {location}
            <span className="hero-eyebrow-sep" />
            Edition · 2026
          </div>

          <h1 className="hero-name hero-name--inline" aria-label="Manikanta R">
            Manikanta<span className="hero-name-period">&nbsp;</span>R<span className="hero-name-period">.</span>
          </h1>

          <p className="hero-welcome" style={{ transitionDelay: entered ? "200ms" : "0ms" }}>
            {welcomeText}
          </p>

          {/* Role carousel */}
          <div className="hero-role-row" style={{ transitionDelay: entered ? "260ms" : "0ms" }}>
            <span className="hero-role-label">Specializing in </span>
            <RoleCarousel />
          </div>

          <div className="hero-rule" style={{ transitionDelay: entered ? "320ms" : "0ms" }} />

          <ul className="hero-skills">
            {skills.map((s: string, i: number) => (
              <li key={s} style={{ transitionDelay: entered ? `${380 + i * 55}ms` : "0ms" }}>
                {s}
              </li>
            ))}
          </ul>

          <p ref={taglineRef} className="hero-tagline" style={{ transitionDelay: entered ? "560ms" : "0ms" }}
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

          {/* Experience strip */}
          {companies.length > 0 && (
            <div className="hero-trust" style={{ transitionDelay: entered ? "1100ms" : "0ms" }}>
              <div className="hero-trust-track">
                {companies.map((c: { name: string; role: string; current?: boolean }, i: number) => (
                  <div key={c.name} className={`hero-trust-card ${c.current ? "is-current" : ""}`}>
                    <div className="hero-trust-card-inner">
                      <div className="hero-trust-card-badge">{c.current ? "Current" : "Previous"}</div>
                      <span className="hero-trust-card-name">{c.name}</span>
                      <span className="hero-trust-card-role">{c.role}</span>
                    </div>
                    {i < companies.length - 1 && <div className="hero-trust-card-connector" aria-hidden />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" aria-hidden>
        <span className="hero-scroll-label">Scroll</span>
        <svg className="hero-scroll-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
          <path d="M7 1v12M3 9l4 4 4-4" />
        </svg>
      </div>

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
    radial-gradient(900px 600px at 22% 38%, rgba(212,106,46,0.07), transparent 70%),
    radial-gradient(700px 500px at 88% 80%, rgba(20,17,15,0.04), transparent 70%);
  pointer-events: none;
  z-index: 1;
}

/* Status bar */
.hero-status-bar {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px 8px 16px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--hero-mute);
  background: color-mix(in oklab, var(--hero-paper) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--hero-ink) 10%, transparent);
  backdrop-filter: blur(12px);
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(.2,.7,.2,1), transform 0.7s cubic-bezier(.2,.7,.2,1);
  animation: hero-settle 1s ease forwards 0.15s;
  pointer-events: none;
}
@keyframes hero-settle {
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.hero-status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34,197,94,0.5);
  animation: hero-pulse-dot 2s ease-in-out infinite;
}
@keyframes hero-pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,0.5); }
  50% { opacity: 0.6; box-shadow: 0 0 14px rgba(34,197,94,0.3); }
}
.hero-status-linkedin {
  color: #0a66c2;
  margin-left: 2px;
}
.hero-status-linkedin-text {
  color: color-mix(in oklab, var(--hero-mute) 80%, transparent);
  font-size: 9px;
}
.hero-status-sep {
  width: 1px; height: 14px;
  background: color-mix(in oklab, var(--hero-ink) 14%, transparent);
}
.hero-status-loc {
  color: color-mix(in oklab, var(--hero-mute) 70%, transparent);
}

/* Fade-in on enter */
.hero-right .hero-eyebrow,
.hero-right .hero-welcome,
.hero-right .hero-role-row,
.hero-right .hero-rule,
.hero-right .hero-skills li,
.hero-right .hero-tagline,
.hero-right .hero-ctas,
.hero-right .hero-trust {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 700ms cubic-bezier(.2,.7,.2,1), transform 700ms cubic-bezier(.2,.7,.2,1);
}
.hero-right.is-entered .hero-eyebrow,
.hero-right.is-entered .hero-welcome,
.hero-right.is-entered .hero-role-row,
.hero-right.is-entered .hero-rule,
.hero-right.is-entered .hero-skills li,
.hero-right.is-entered .hero-tagline,
.hero-right.is-entered .hero-ctas,
.hero-right.is-entered .hero-trust {
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
  z-index: 0;
}
.hero-watermark.is-awake { opacity: 0.022; transform: translateY(0); }

.hero-halo {
  position: absolute;
  width: clamp(420px, 42vw, 620px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(212,106,46,0.08), rgba(212,106,46,0) 70%);
  filter: blur(30px);
  pointer-events: none;
  transform: translateY(-3%);
}

/* Portrait wrapper — enables glow ring behind image */
.hero-portrait-wrap {
  position: relative;
  width: clamp(320px, 34vw, 480px);
  aspect-ratio: 1;
  transform: translateY(-3%);
  --parallax-y: 0px;
}
.hero-portrait-glow {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: conic-gradient(from 0deg,
    transparent 0deg,
    rgba(212,106,46,0) 50deg,
    rgba(212,106,46,0.3) 110deg,
    rgba(212,106,46,0) 190deg,
    transparent 360deg);
  mask: radial-gradient(circle, transparent 46%, #000 47%, #000 53%, transparent 54%);
  -webkit-mask: radial-gradient(circle, transparent 46%, #000 47%, #000 53%, transparent 54%);
  pointer-events: none;
  animation: hero-glow-spin 10s linear infinite;
  z-index: 0;
}
@keyframes hero-glow-spin {
  to { transform: rotate(360deg); }
}

.hero-portrait {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 0 0 1px color-mix(in oklab, var(--hero-ink) 10%, transparent),
    0 0 0 5px color-mix(in oklab, var(--hero-paper) 90%, transparent),
    0 0 0 6px color-mix(in oklab, var(--hero-accent) 18%, transparent),
    0 1px 0 rgba(255,255,255,0.5) inset,
    0 30px 60px -20px rgba(20,17,15,0.35),
    0 80px 120px -40px rgba(20,17,15,0.25);
  animation: hero-float 9s ease-in-out 1300ms infinite;
  z-index: 1;
  transform: translateY(var(--parallax-y, 0px));
  transition: transform 0.1s linear;
}

/* Rim light */
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
    radial-gradient(60% 50% at 50% 18%, rgba(255,245,230,0.18), transparent 70%),
    linear-gradient(180deg, rgba(20,17,15,0) 60%, rgba(20,17,15,0.15) 100%);
  pointer-events: none;
  z-index: 1;
}
.hero-portrait img {
  width: 112%; height: 112%;
  object-fit: cover; object-position: 50% 18%;
  position: absolute; left: -6%; top: -6%;
  filter: grayscale(0.1) contrast(1.04);
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(calc(0% - 10px)); }
}

/* Social proof quote */
.hero-proof {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 18px;
  max-width: 300px;
  opacity: 0;
  animation: hero-settle 1s ease forwards 0.5s;
}
.hero-proof-mark {
  color: var(--hero-accent);
  font-size: 0.7rem;
  margin-top: 1px;
  flex-shrink: 0;
}
.hero-proof-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(0.78rem, 1vw, 0.88rem);
  line-height: 1.4;
  color: var(--hero-ink-2);
  opacity: 0.75;
}

/* Metrics strip below portrait */
.hero-metrics-strip {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 3;
  width: 100%;
  max-width: 380px;
  margin-top: 16px;
}
.hero-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 12px;
  min-width: 80px;
  border-radius: 10px;
  background: color-mix(in oklab, var(--hero-paper) 75%, transparent);
  border: 1px solid color-mix(in oklab, var(--hero-ink) 8%, transparent);
  backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(6px);
  animation: hero-metric-in 0.6s cubic-bezier(.2,.7,.2,1) forwards;
}
.hero-metric:nth-child(1) { animation-delay: 1.0s; }
.hero-metric:nth-child(2) { animation-delay: 1.1s; }
.hero-metric:nth-child(3) { animation-delay: 1.2s; }
.hero-metric:nth-child(4) { animation-delay: 1.3s; }
@keyframes hero-metric-in {
  to { opacity: 1; transform: translateY(0); }
}
.hero-metric-icon-wrap {
  color: var(--hero-accent);
  opacity: 0.7;
}
.hero-metric-icon { width: 18px; height: 18px; display: block; }
.hero-metric-value {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 600;
  font-size: clamp(1.1rem, 1.6vw, 1.3rem);
  line-height: 1;
  color: var(--hero-accent);
}
.hero-metric-avail {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  font-style: normal;
  letter-spacing: 0.08em;
  color: #22c55e;
}
.hero-metric-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--hero-mute);
  text-align: center;
  line-height: 1.2;
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
}
.hero-name--inline {
  white-space: nowrap;
  display: inline;
}
.hero-name-period { color: var(--hero-accent); font-style: italic; }

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

/* Role carousel */
.hero-role-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: clamp(0.8rem, 1.1vw, 0.95rem);
  letter-spacing: 0.06em;
  color: var(--hero-mute);
}
.hero-role-label {
  color: var(--hero-mute);
}
.hero-role {
  color: var(--hero-accent);
  font-weight: 500;
  transition: opacity 0.3s ease;
  position: relative;
}
.hero-role::after {
  content: "";
  display: inline-block;
  width: 4px; height: 1.1em;
  margin-left: 3px;
  background: var(--hero-accent);
  vertical-align: text-bottom;
  animation: hero-caret 0.9s steps(1) infinite;
}
@keyframes hero-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.hero-role.is-fading {
  opacity: 0;
  transform: translateY(-2px);
}

.hero-rule {
  margin-top: 22px;
  height: 1px;
  background: linear-gradient(90deg, var(--hero-accent) 0%, var(--hero-accent) 60px, var(--hero-rule) 60px, var(--hero-rule) 100%);
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
  border: 1px solid var(--hero-accent);
  background: linear-gradient(135deg, var(--hero-accent), #c05a20);
  box-shadow: 0 12px 24px -16px color-mix(in oklab, var(--hero-accent) 80%, transparent);
}
.hero-cta--primary::before {
  background: linear-gradient(135deg, #c05a20, #a84d18);
  transform: translateY(101%);
  opacity: 0;
}
.hero-cta--primary:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -18px color-mix(in oklab, var(--hero-accent) 90%, transparent); }
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

/* Trust bar — Experience strip */
.hero-trust {
  margin-top: 32px;
  padding-top: 22px;
  border-top: 1px solid var(--hero-rule);
}
.hero-trust-track {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: stretch;
}
.hero-trust-card {
  position: relative;
  flex: 1 1 180px;
  max-width: 240px;
}
.hero-trust-card-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--hero-paper) 50%, transparent);
  border: 1px solid color-mix(in oklab, var(--hero-ink) 8%, transparent);
  backdrop-filter: blur(8px);
  transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease, background .35s ease;
  cursor: default;
}
.hero-trust-card-inner:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -16px rgba(20,17,15,0.25);
  border-color: color-mix(in oklab, var(--hero-accent) 25%, transparent);
  background: color-mix(in oklab, var(--hero-paper) 70%, transparent);
}
.hero-trust-card.is-current .hero-trust-card-inner {
  border-color: color-mix(in oklab, var(--hero-accent) 18%, transparent);
  background: color-mix(in oklab, var(--hero-accent) 4%, var(--hero-paper));
}
.hero-trust-card.is-current .hero-trust-card-inner:hover {
  border-color: color-mix(in oklab, var(--hero-accent) 40%, transparent);
  box-shadow: 0 12px 28px -16px color-mix(in oklab, var(--hero-accent) 60%, transparent);
}
.hero-trust-card-badge {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  align-self: flex-start;
  line-height: 1;
  background: color-mix(in oklab, var(--hero-ink) 8%, transparent);
  color: color-mix(in oklab, var(--hero-ink) 50%, transparent);
  transition: background .3s ease, color .3s ease;
}
.hero-trust-card.is-current .hero-trust-card-badge {
  background: color-mix(in oklab, var(--hero-accent) 15%, transparent);
  color: var(--hero-accent);
}
.hero-trust-card-name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(1rem, 1.1vw, 1.15rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--hero-ink);
}
.hero-trust-card-role {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: color-mix(in oklab, var(--hero-ink) 50%, transparent);
  line-height: 1.3;
}
.hero-trust-card-connector {
  display: none;
}

@media (min-width: 640px) {
  .hero-trust-card-connector {
    display: block;
    position: absolute;
    right: -16px;
    top: 50%;
    width: 16px;
    height: 1px;
    background: linear-gradient(90deg, color-mix(in oklab, var(--hero-ink) 12%, transparent), transparent);
    transform: translateY(-50%);
  }
}

/* Scroll indicator */
.hero-scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0;
  animation: hero-scroll-in 1s ease forwards 2s;
  pointer-events: none;
}
@keyframes hero-scroll-in {
  to { opacity: 1; }
}
.hero-scroll-label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--hero-mute);
}
.hero-scroll-chevron {
  color: var(--hero-mute);
  animation: hero-scroll-bounce 2s ease-in-out infinite;
}
@keyframes hero-scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(6px); opacity: 1; }
}

/* Dark mode */
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
.dark .hero-status-bar {
  background: color-mix(in oklab, var(--hero-ink) 10%, transparent);
  border-color: color-mix(in oklab, var(--hero-ink) 12%, transparent);
}
.dark .hero-metric {
  background: color-mix(in oklab, var(--hero-ink) 8%, transparent);
  border-color: color-mix(in oklab, var(--hero-ink) 10%, transparent);
}
.dark .hero-proof-text { color: var(--hero-ink-2); }

@media (max-width: 1024px) {
  .hero-name { font-size: clamp(54px, 13vw, 108px); }
  .hero-watermark { font-size: 40vw; }
  .hero-metrics-strip { position: relative; bottom: auto; }
  .hero-trust { flex-direction: column; align-items: flex-start; gap: 10px; }
}
@media (max-width: 640px) {
  .hero-name { font-size: clamp(46px, 14vw, 80px); }
  .hero-tagline { font-size: 17px; }
  .hero-welcome { font-size: 19px; }
  .hero-status-bar { font-size: 9px; padding: 6px 14px 6px 12px; top: 16px; gap: 8px; }
  .hero-metrics-strip { gap: 4px; }
  .hero-metric { min-width: 68px; padding: 8px 10px; }
  .hero-proof { display: none; }
  .hero-trust { margin-top: 22px; }
}
`;
