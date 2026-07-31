"use client";
/**
 * Ch14BeyondNotes — "Things My Resume Will Never Tell You."
 * A hand-annotated field-note infographic. Sits at the very end of the
 * site, after Contact — the last word before the footer.
 *
 * Every piece of text here is editable from Supabase: it all comes from
 * the `field_notes` JSONB column on the `profiles` table.
 * If that column is empty/missing, the component falls back to the same
 * content locally so the section never breaks.
 */
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "motion/react";
import { Reveal, SplitWords } from "@/components/motion/primitives";
import { CHAPTER_NUMBERS } from "@/lib/chapterNumbers";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";

/* ── Icon set — keyed so Supabase only needs to store a short string ───── */
const ICONS: Record<string, React.ReactNode> = {
  compass: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <circle cx="24" cy="10" r="4" />
      <path d="M24 14v14M24 22l-8 10M24 22l8 10" />
      <path d="M6 34c6-4 30-4 36 0" />
    </svg>
  ),
  loneliness: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <path d="M17 10a9 9 0 1 1-3 17.5M17 10a9 9 0 1 0 0 12" />
      <circle cx="17" cy="34" r="5" />
      <path d="M12 44c1-6 4-9 5-9s4 3 5 9" />
    </svg>
  ),
  betrayal: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <path d="M24 40C10 30 5 22 5 15a8 8 0 0 1 15-4l4 4 4-4a8 8 0 0 1 15 4c0 7-5 15-19 25z" />
      <path d="M22 16l-4 6 5 4-4 8" />
    </svg>
  ),
  everyone: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <circle cx="14" cy="12" r="5" />
      <path d="M6 30c1-7 5-11 8-11s7 4 8 11" />
      <circle cx="36" cy="16" r="4" />
      <path d="M28 32c1-6 4-9 8-9s6 3 7 9" />
      <path d="M20 20l6 3" />
    </svg>
  ),
  silence: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <path d="M4 24c6-9 14-13 20-13s14 4 20 13c-6 9-14 13-20 13S10 33 4 24z" />
      <circle cx="24" cy="24" r="5" />
      <path d="M6 6l36 36" />
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <path d="M4 40 18 14l7 10 6-8 13 24z" />
      <path d="M32 14l10-6-2 11z" />
    </svg>
  ),
  checkmark: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <path d="M6 14l16 20 20-26" />
      <path d="M34 22l8 2" />
    </svg>
  ),
  discipline: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <rect x="10" y="8" width="28" height="34" rx="2" />
      <path d="M17 4h14v8H17z" />
      <path d="M16 22l5 5 11-11M16 32l5 5 11-11" opacity="0.55" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <circle cx="24" cy="24" r="18" />
      <path d="M24 14v10l7 5" />
    </svg>
  ),
  stairs: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <path d="M4 40h8v-8h8v-8h8v-8h8v-8" />
      <circle cx="38" cy="6" r="3" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="mr-notes__svg">
      <circle cx="24" cy="24" r="4" />
    </svg>
  ),
};

function parseLine(text: string): React.ReactNode {
  const pattern = /__([^_]+)__|\[\[([^\]]+)\]\]|\(\(([^)]+)\)\)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<u key={key++}>{m[1]}</u>);
    else if (m[2] !== undefined) out.push(<span key={key++} className="mr-notes__box">{m[2]}</span>);
    else if (m[3] !== undefined) out.push(<span key={key++} className="mr-notes__circle">{m[3]}</span>);
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type NoteData = { line: string; body: string[]; icon?: string };

const DEFAULT_DATA = {
  kicker: "Beyond My Portfolio",
  number: "14",
  title: "Things My Resume Will Never Tell You.",
  subtitle: "Not achievements. Not milestones. Just the habits and beliefs that shaped how I work.",
  photo: {
    name: "Manikanta R.",
    location: "Bangalore · India",
    tagline: "Still learning. Always building.",
    lastUpdated: "July 2026",
    note: "Grateful for every hard lesson.\nEach one built something I still use.",
  },
  notes: [
    { line: "Built my own path since __10th grade__.", body: ["No mentor showed me the way.", "So I learned to read the map myself."], icon: "compass" },
    { line: "Learned to work well ((alone)).", body: ["Quiet hours taught me focus.", "I got comfortable with my own company."], icon: "loneliness" },
    { line: "I'm careful about __trust__ now.", body: ["Some lessons cost more than others.", "I just got more selective, not bitter."], icon: "betrayal" },
    { line: "I show up for [[people]] who show up too.", body: ["Support works both ways.", "I learned to notice who reciprocates."], icon: "everyone" },
    { line: "I built in __silence__ before anyone noticed.", body: ["No audience, no validation.", "Just me, my goals, and my time."], icon: "silence" },
    { line: "Hard choices became my __competitive advantage__.", body: ["While others had shortcuts,", "I had long nights and steady effort."], icon: "mountain" },
    { line: "Rejection became __routine__, not painful.", body: ["It stopped being personal.", "It started being useful feedback."], icon: "checkmark" },
    { line: "I chose [[discipline]] over motivation.", body: ["Motivation comes and goes.", "Discipline stays and builds."], icon: "discipline" },
    { line: "I stopped waiting for the __'right time.'__", body: ["There's no perfect moment to start.", "I began with what I had."], icon: "clock" },
    { line: "I'm still __becoming__.", body: ["This is not the end.", "This is just the beginning."], icon: "stairs" },
  ] as NoteData[],
  quote: "I didn't have a shortcut, a mentor, or a safety net handed to me. I built this — one certification, one project, one quiet decision at a time. I'm proud of the version of me that kept going.",
  signOff: "Still Learning.\nForever Curious.",
};

function TiltPhoto({ src, alt }: { src: string; alt: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [8, -8]);
  const ry = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className="mr-notes__photo" style={{ perspective: 1000 }}>
      <span className="mr-notes__tape" aria-hidden />
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }} className="relative h-full w-full">
        <img src={src} alt={alt} width={640} height={800} className="h-full w-full object-cover" style={{ filter: "grayscale(85%) contrast(1.05)" }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/35 via-transparent to-bone/10" />
      </motion.div>
    </div>
  );
}

/* ── Staggered reveal for a list of items ────────────────────────────── */
function StaggerReveal({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
      animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : undefined}
      transition={{ duration: 0.7, delay: Math.min(index, 8) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Accordion container with smooth max-height transition ──────────── */
function Accordion({ open, children }: { open: boolean; children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (innerRef.current) setHeight(innerRef.current.scrollHeight);
  }, [open, children]);

  return (
    <div style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0, overflow: "hidden", transition: "max-height 0.6s cubic-bezier(.22,1,.36,1), opacity 0.5s ease" }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

const VISIBLE_BY_DEFAULT = 6;

export function Ch14BeyondNotes() {
  const { profile } = usePortfolio();
  const d = { ...DEFAULT_DATA, ...(profile?.field_notes || {}) };
  const photo = { ...DEFAULT_DATA.photo, ...(d.photo || {}) };
  const notes: NoteData[] = Array.isArray(d.notes) && d.notes.length > 0 ? d.notes : DEFAULT_DATA.notes;

  const [expanded, setExpanded] = useState(false);
  const hasMore = notes.length > VISIBLE_BY_DEFAULT;
  const visibleNotes = notes.slice(0, VISIBLE_BY_DEFAULT);
  const hiddenNotes = notes.slice(VISIBLE_BY_DEFAULT);

  return (
    <section id="beyond-notes" data-mood="ink" className="relative chapter-pad overflow-hidden" aria-labelledby="field-notes-title">
      <div aria-hidden className="mr-notes__ambient" />
      <div aria-hidden className="mr-notes__paper-lines" />

      <div className="relative mx-auto max-w-6xl">
        {/* Stamp badge */}
        <div className="mr-notes__stamp" aria-hidden>
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <path id="mrStampCircle" fill="none" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
            <text className="mr-notes__stamp-text">
              <textPath href="#mrStampCircle" startOffset="2%">STILL LEARNING · FOREVER CURIOUS · </textPath>
            </text>
            <line x1="46" y1="70" x2="74" y2="50" strokeWidth="1.4" stroke="currentColor" />
          </svg>
        </div>

        <div className="text-mono text-meta text-bone/55">/{CHAPTER_NUMBERS["beyond-me"]} — {d.kicker}</div>
        <h2 id="field-notes-title" className="text-display italic mt-5 leading-[1.05] text-[clamp(2.2rem,5.6vw,4.2rem)]">
          <SplitWords text={d.title} />
        </h2>
        <Reveal>
          <p className="mt-6 max-w-xl text-display text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.55] text-bone/75">
            {d.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[300px_1fr]">
          {/* Left — taped portrait card */}
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <TiltPhoto src={portrait} alt={photo.name} />
            <div className="mr-notes__sig">
              <span>{photo.name}</span>
              <svg viewBox="0 0 220 20" className="mr-notes__sig-underline" aria-hidden>
                <path d="M2 12c30-10 50-10 60-2 8 6 14 6 22-2 10-10 20-10 30 0 8 8 16 8 26 0 8-7 18-9 30-4 10 4 20 4 28-2" />
              </svg>
            </div>
            <div className="mt-3 text-mono text-meta uppercase tracking-[0.2em] text-bone/55">
              {photo.location}<br />{photo.tagline}
            </div>
            <div className="mt-4 text-mono text-meta uppercase tracking-[0.2em] text-bone/35">
              Last updated: {photo.lastUpdated}
            </div>
            <div className="mt-5 flex items-start gap-2 text-bone/70">
              <span className="mt-0.5">♡</span>
              <span className="font-hand text-[1.3rem] leading-snug text-bone/80">
                {photo.note.split("\n").map((l: string, i: number) => (<span key={i}>{l}<br /></span>))}
              </span>
            </div>
          </Reveal>

          {/* Right — numbered field notes */}
          <div>
            {visibleNotes.map((n, i) => (
              <StaggerReveal key={i} index={i}>
                <div className="mr-notes__row group relative">
                  <span aria-hidden className="absolute -left-4 top-0 h-full w-[2px] bg-vermilion opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="mr-notes__num tabular-nums">{String(i + 1).padStart(2, "0")}.</div>
                  <div className="mr-notes__text">
                    <p className="mr-notes__line font-hand">{parseLine(n.line)}</p>
                    {(n.body || []).map((b, j) => (<p key={j} className="mr-notes__sub">{b}</p>))}
                  </div>
                  <div className="mr-notes__icon group-hover:animate-svg-icon">{ICONS[n.icon || "default"] || ICONS.default}</div>
                </div>
              </StaggerReveal>
            ))}

            {/* Accordion for hidden notes */}
            <Accordion open={expanded}>
              {hiddenNotes.map((n, i) => (
                <StaggerReveal key={i + VISIBLE_BY_DEFAULT} index={i + VISIBLE_BY_DEFAULT}>
                  <div className="mr-notes__row group relative">
                    <span aria-hidden className="absolute -left-4 top-0 h-full w-[2px] bg-vermilion opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="mr-notes__num tabular-nums">{String(i + VISIBLE_BY_DEFAULT + 1).padStart(2, "0")}.</div>
                    <div className="mr-notes__text">
                      <p className="mr-notes__line font-hand">{parseLine(n.line)}</p>
                      {(n.body || []).map((b, j) => (<p key={j} className="mr-notes__sub">{b}</p>))}
                    </div>
                    <div className="mr-notes__icon group-hover:animate-svg-icon">{ICONS[n.icon || "default"] || ICONS.default}</div>
                  </div>
                </StaggerReveal>
              ))}
            </Accordion>

            {hasMore && (
              <div className="mt-8 flex justify-start">
                <button type="button" onClick={() => setExpanded((v) => !v)} className="mr-notes__more">
                  {expanded ? "Show less" : `Read more · ${notes.length - VISIBLE_BY_DEFAULT} more`}
                  <span className={`mr-notes__more-arrow ${expanded ? "is-open" : ""}`} aria-hidden>↓</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Perforated tear-off edge */}
        <div className="mr-notes__tear" aria-hidden />

        {/* Quote as handwritten letter */}
        <Reveal>
          <div className="mr-notes__letter">
            <div className="mr-notes__letter-envelope" aria-hidden>
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.08" className="w-full h-full">
                <rect x="4" y="8" width="40" height="32" rx="2" />
                <path d="M4 12l20 14 20-14" />
              </svg>
            </div>
            <span className="mr-notes__letter-salute">Dear Reader,</span>
            <p className="mr-notes__letter-body">{d.quote}</p>
            <div className="mr-notes__letter-signoff">
              <span className="font-hand text-[1.8rem] leading-none text-vermilion">
                {d.signOff.split("\n").map((l: string, i: number) => (<span key={i}>{l}<br /></span>))}
              </span>
              <svg viewBox="0 0 120 16" className="mr-notes__letter-swig" aria-hidden>
                <path d="M2 10c14-6 28-2 36 4 6 5 12 5 18-2 6-7 14-10 24-4 8 5 16 5 22-2 4-5 8-6 16-2" />
              </svg>
            </div>
          </div>
        </Reveal>

      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&display=swap');

/* ── Ambient + paper texture ──────────────────────────────────────── */
.mr-notes__ambient {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(55% 38% at 20% 12%, color-mix(in oklab, var(--vermilion) 7%, transparent), transparent 70%),
    radial-gradient(50% 35% at 85% 85%, color-mix(in oklab, var(--vermilion) 6%, transparent), transparent 72%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%);
}
.mr-notes__paper-lines {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: repeating-linear-gradient(
    transparent 0px, transparent 23px,
    color-mix(in oklab, var(--bone) 6%, transparent) 23px,
    color-mix(in oklab, var(--bone) 6%, transparent) 24px
  );
  mask-image: linear-gradient(180deg, transparent 0%, #000 20%, #000 80%, transparent 100%);
}

.font-hand { font-family: "Caveat", "Segoe Script", cursive; }

.mr-notes__sig { position: relative; display: inline-block; margin-top: 26px; }
.mr-notes__sig span { font-family: "Caveat", "Segoe Script", cursive; font-weight: 600; font-size: 2.4rem; line-height: 1; color: var(--vermilion); }
.mr-notes__sig-underline { display: block; width: 100%; height: 14px; margin-top: 2px; overflow: visible; }
.mr-notes__sig-underline path { fill: none; stroke: var(--vermilion); stroke-width: 1.6; stroke-linecap: round; opacity: 0.75; }

.mr-notes__stamp { position: absolute; top: 0; right: 0; width: 108px; height: 108px; color: color-mix(in oklab, var(--bone) 55%, transparent); opacity: 0.8; }
.mr-notes__stamp-text { font-family: var(--font-mono); font-size: 6.6px; letter-spacing: 0.14em; fill: currentColor; text-transform: uppercase; }

.mr-notes__photo { position: relative; aspect-ratio: 4/5; width: 100%; max-width: 300px; overflow: hidden; border: 1px solid color-mix(in oklab, var(--bone) 30%, transparent); box-shadow: 0 30px 80px -30px rgba(0,0,0,0.7); }
.mr-notes__tape { position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-3deg); width: 96px; height: 26px; background: linear-gradient(180deg, rgba(212,180,131,0.55), rgba(212,180,131,0.35)); border: 1px solid rgba(255,255,255,0.15); z-index: 2; }

/* ── Note rows ────────────────────────────────────────────────────── */
.mr-notes__row { display: grid; grid-template-columns: 44px 1fr 44px; align-items: start; gap: 18px; padding: 22px 0; border-bottom: 1px solid color-mix(in oklab, var(--bone) 12%, transparent); }
.mr-notes__num { font-family: var(--font-mono); font-size: 0.85rem; color: var(--vermilion); padding-top: 0.35em; }
.mr-notes__line { font-size: clamp(1.35rem, 2.4vw, 1.9rem); line-height: 1.25; color: var(--bone); }
.mr-notes__line u { text-decoration-color: var(--vermilion); text-underline-offset: 4px; }
.mr-notes__circle { position: relative; }
.mr-notes__circle::after { content: ""; position: absolute; inset: -6px -10px; border: 1.4px solid var(--vermilion); border-radius: 50%; }
.mr-notes__box { border: 1.4px solid var(--vermilion); padding: 0 6px; border-radius: 2px; }
.mr-notes__sub { margin: 0.35em 0 0; font-family: var(--font-mono); font-size: 0.82rem; letter-spacing: 0.01em; color: color-mix(in oklab, var(--bone) 62%, transparent); }

/* ── Animated SVG icons ────────────────────────────────────────────── */
.mr-notes__icon { color: color-mix(in oklab, var(--vermilion) 80%, var(--bone) 20%); opacity: 0.85; padding-top: 0.2em; }
.mr-notes__svg { width: 34px; height: 34px; display: block; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
.mr-notes__icon:hover .mr-notes__svg {
  transform: scale(1.15);
  filter: drop-shadow(0 0 10px rgba(212,106,46,0.5));
}
@keyframes mr-svg-pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
  50% { transform: scale(1.1); filter: drop-shadow(0 0 10px rgba(212,106,46,0.4)); }
}
.group:hover .mr-notes__svg {
  animation: mr-svg-pulse 1.8s ease-in-out infinite;
}

/* ── Read more button ─────────────────────────────────────────────── */
.mr-notes__more { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone); background: transparent; border: 1px solid color-mix(in oklab, var(--bone) 30%, transparent); border-radius: 999px; padding: 10px 18px; cursor: pointer; transition: border-color 200ms ease, color 200ms ease, background 200ms ease; }
.mr-notes__more:hover { border-color: var(--vermilion); color: var(--vermilion); background: color-mix(in oklab, var(--vermilion) 8%, transparent); }
.mr-notes__more-arrow { display: inline-block; transition: transform 250ms ease; }
.mr-notes__more-arrow.is-open { transform: rotate(180deg); }

/* ── Perforated tear edge ──────────────────────────────────────────── */
.mr-notes__tear {
  margin-top: 72px;
  height: 20px;
  position: relative;
  background-image: radial-gradient(circle at 4px 10px, var(--ink) 2px, transparent 2px);
  background-size: 10px 20px;
  opacity: 0.06;
}
.mr-notes__tear::before {
  content: "";
  position: absolute; top: 50%; left: 0; right: 0;
  height: 1px;
  background: color-mix(in oklab, var(--bone) 10%, transparent);
}
.dark .mr-notes__tear { opacity: 0.08; }

/* ── Handwritten letter ────────────────────────────────────────────── */
.mr-notes__letter {
  position: relative;
  margin-top: 48px;
  padding: clamp(32px, 4vw, 48px) clamp(28px, 3.6vw, 40px);
  border-radius: 2px;
  background: color-mix(in oklab, var(--bone) 8%, transparent);
  border: 1px solid color-mix(in oklab, var(--vermilion) 12%, transparent);
  transform: rotate(-0.3deg);
  transition: transform .4s ease, box-shadow .4s ease;
  overflow: hidden;
}
.mr-notes__letter:hover {
  transform: rotate(0deg);
  box-shadow: 0 16px 48px -24px rgba(212,106,46,0.15);
}
.dark .mr-notes__letter {
  background: color-mix(in oklab, white 3%, transparent);
  border-color: color-mix(in oklab, var(--vermilion) 10%, transparent);
}
.mr-notes__letter-envelope {
  position: absolute; bottom: 16px; right: 20px;
  width: 80px; height: 80px;
  color: var(--vermilion);
  pointer-events: none;
}
.mr-notes__letter-salute {
  display: block;
  font-family: "Caveat", "Segoe Script", cursive;
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  color: var(--vermilion);
  margin-bottom: 18px;
}
.mr-notes__letter-body {
  font-family: "Caveat", "Segoe Script", cursive;
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  line-height: 1.5;
  color: var(--bone);
  max-width: 48ch;
}
.mr-notes__letter-signoff {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.mr-notes__letter-swig {
  width: 120px; height: 16px;
  fill: none; stroke: var(--vermilion); stroke-width: 1.4; stroke-linecap: round;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .mr-notes__row { grid-template-columns: 34px 1fr; }
  .mr-notes__icon { display: none; }
  .mr-notes__stamp { width: 84px; height: 84px; }
  .mr-notes__letter { transform: none; }
  .mr-notes__letter-envelope { display: none; }
}
`;
