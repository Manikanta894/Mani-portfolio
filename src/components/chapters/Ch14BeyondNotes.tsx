"use client";
/**
 * Ch14BeyondNotes — "Things My Resume Will Never Tell You."
 * A ten-line, hand-annotated field-note infographic. Sits at the very
 * end of the site, after Contact — the last word before the footer.
 */
import { Reveal, MaskReveal } from "@/components/motion/primitives";
import portrait from "@/assets/portrait.jpg";

type Note = {
  line: React.ReactNode;
  body: string[];
  icon: React.ReactNode;
};

const NOTES: Note[] = [
  {
    line: <>No support since <u>10th grade</u>.</>,
    body: ["No one stood behind me.", "I learned to stand for myself."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="24" cy="10" r="4" />
        <path d="M24 14v14M24 22l-8 10M24 22l8 10" />
        <path d="M6 34c6-4 30-4 36 0" />
      </svg>
    ),
  },
  {
    line: <>Felt <span className="mr-notes__circle">alone</span> when I needed <u>people</u> the most.</>,
    body: ["Loneliness became my teacher.", "It made me self-aware."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M17 10a9 9 0 1 1-3 17.5M17 10a9 9 0 1 0 0 12" />
        <circle cx="17" cy="34" r="5" />
        <path d="M12 44c1-6 4-9 5-9s4 3 5 9" />
      </svg>
    ),
  },
  {
    line: <>Betrayal taught me <u>brutal</u> lessons.</>,
    body: ["I trusted the wrong people.", "But I stopped trusting blindly."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M24 40C10 30 5 22 5 15a8 8 0 0 1 15-4l4 4 4-4a8 8 0 0 1 15 4c0 7-5 15-19 25z" />
        <path d="M22 16l-4 6 5 4-4 8" />
      </svg>
    ),
  },
  {
    line: <>I was there for <span className="mr-notes__box">everyone</span>.</>,
    body: ["Listened, helped, supported, cared.", "But when I needed someone, no one was there."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="14" cy="12" r="5" />
        <path d="M6 30c1-7 5-11 8-11s7 4 8 11" />
        <circle cx="36" cy="16" r="4" />
        <path d="M28 32c1-6 4-9 8-9s6 3 7 9" />
        <path d="M20 20l6 3" />
      </svg>
    ),
  },
  {
    line: <>I built in <u>silence</u>.</>,
    body: ["No audience. No validation.", "Just me, my goals, and my time."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 24c6-9 14-13 20-13s14 4 20 13c-6 9-14 13-20 13S10 33 4 24z" />
        <circle cx="24" cy="24" r="5" />
        <path d="M6 6l36 36" />
      </svg>
    ),
  },
  {
    line: <>Struggles became my <u>competitive advantage</u>.</>,
    body: ["While others had shortcuts,", "I had long nights and hard choices."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 40 18 14l7 10 6-8 13 24z" />
        <path d="M32 14l10-6-2 11z" />
      </svg>
    ),
  },
  {
    line: <>Rejection became <u>normal</u>.</>,
    body: ["It stopped hurting.", "It started guiding."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 14l16 20 20-26" />
        <path d="M34 22l8 2" />
      </svg>
    ),
  },
  {
    line: <>I chose <span className="mr-notes__box">discipline</span> over motivation.</>,
    body: ["Motivation comes and goes.", "Discipline stays and builds."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="10" y="8" width="28" height="34" rx="2" />
        <path d="M17 4h14v8H17z" />
        <path d="M16 22l5 5 11-11M16 32l5 5 11-11" opacity="0.55" />
      </svg>
    ),
  },
  {
    line: <>I stopped waiting for the <u>'right time'</u>.</>,
    body: ["There is no perfect time.", "I started with what I had."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="24" cy="24" r="18" />
        <path d="M24 14v10l7 5" />
      </svg>
    ),
  },
  {
    line: <>I'm still <u>becoming</u>.</>,
    body: ["This is not the end.", "This is my beginning."],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 40h8v-8h8v-8h8v-8h8v-8" />
        <circle cx="38" cy="6" r="3" />
      </svg>
    ),
  },
];

export function Ch14BeyondNotes() {
  return (
    <section
      id="beyond-me"
      data-mood="ink"
      className="relative chapter-pad grain overflow-hidden"
      aria-labelledby="field-notes-title"
    >
      <div aria-hidden className="mr-notes__ambient" />
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

        <div className="text-mono text-meta text-bone/55">/14 — Beyond My Portfolio</div>
        <h2 id="field-notes-title" className="text-display mt-5 leading-[0.95] text-[clamp(2.4rem,6vw,4.6rem)]">
          <MaskReveal><span className="italic">Things</span></MaskReveal>{" "}
          <MaskReveal><span>My Resume</span></MaskReveal>{" "}
          <MaskReveal><span className="italic">Will Never Tell You.</span></MaskReveal>
        </h2>
        <Reveal>
          <p className="mt-6 max-w-xl text-display text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.55] text-bone/75">
            Not achievements. Not milestones. Just the thoughts, lessons, and beliefs
            that shaped me quietly.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[300px_1fr]">
          {/* Left — taped portrait card */}
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="mr-notes__photo">
              <span className="mr-notes__tape" aria-hidden />
              <img
                src={portrait}
                alt="Manikanta R."
                width={640}
                height={800}
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(85%) contrast(1.05)" }}
              />
            </div>
            <div className="mr-notes__sig">
              <span>Manikanta R.</span>
              <svg viewBox="0 0 220 20" className="mr-notes__sig-underline" aria-hidden>
                <path d="M2 12c30-10 50-10 60-2 8 6 14 6 22-2 10-10 20-10 30 0 8 8 16 8 26 0 8-7 18-9 30-4 10 4 20 4 28-2" />
              </svg>
            </div>
            <div className="mt-3 text-mono text-meta uppercase tracking-[0.2em] text-bone/55">
              Bangalore · India
              <br />
              Still learning. Always building.
            </div>
            <div className="mt-4 text-mono text-meta uppercase tracking-[0.2em] text-bone/35">
              Last updated: July 2026
            </div>
            <div className="mt-5 flex items-start gap-2 text-bone/70">
              <span className="mt-0.5">♡</span>
              <span className="font-hand text-[1.3rem] leading-snug text-bone/80">
                Grateful for every struggle.
                <br />
                It wrote the strongest chapters.
              </span>
            </div>
          </Reveal>

          {/* Right — numbered field notes */}
          <div>
            {NOTES.map((n, i) => (
              <Reveal key={i} delay={i * 0.03}>
                <div className="mr-notes__row">
                  <div className="mr-notes__num tabular-nums">{String(i + 1).padStart(2, "0")}.</div>
                  <div className="mr-notes__text">
                    <p className="mr-notes__line font-hand">{n.line}</p>
                    {n.body.map((b, j) => (
                      <p key={j} className="mr-notes__sub">{b}</p>
                    ))}
                  </div>
                  <div className="mr-notes__icon">{n.icon}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mr-beyond__rule mt-20" aria-hidden />

        <Reveal>
          <div className="mt-16 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <p className="max-w-2xl text-display italic text-[clamp(1.3rem,2.4vw,1.9rem)] leading-[1.4] text-bone/95">
              <span className="mr-beyond__pull">“</span>
              From 10th grade till now — no support, no one to lean on. I was alone.
              Betrayed. But I survived, I learned, I built. Today, I stand for the
              version of me that never gave up.
              <span className="mr-beyond__pull">”</span>
            </p>
            <div className="font-hand shrink-0 text-right text-[1.6rem] leading-tight text-bone/70">
              Still Learning.
              <br />
              Forever Curious.
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

.mr-notes__ambient { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(55% 38% at 20% 12%, color-mix(in oklab, var(--vermilion) 7%, transparent), transparent 70%), radial-gradient(50% 35% at 85% 85%, color-mix(in oklab, var(--vermilion) 6%, transparent), transparent 72%); mask-image: linear-gradient(180deg, transparent 0%, #000 16%, #000 84%, transparent 100%); }

.font-hand { font-family: "Caveat", "Segoe Script", cursive; }

.mr-notes__sig { position: relative; display: inline-block; margin-top: 26px; }
.mr-notes__sig span { font-family: "Caveat", "Segoe Script", cursive; font-weight: 600; font-size: 2.4rem; line-height: 1; color: var(--vermilion); }
.mr-notes__sig-underline { display: block; width: 100%; height: 14px; margin-top: 2px; overflow: visible; }
.mr-notes__sig-underline path { fill: none; stroke: var(--vermilion); stroke-width: 1.6; stroke-linecap: round; opacity: 0.75; }

.mr-notes__stamp { position: absolute; top: 0; right: 0; width: 108px; height: 108px; color: color-mix(in oklab, var(--bone) 55%, transparent); opacity: 0.8; }
.mr-notes__stamp-text { font-family: var(--font-mono); font-size: 6.6px; letter-spacing: 0.14em; fill: currentColor; text-transform: uppercase; }

.mr-notes__photo { position: relative; aspect-ratio: 4/5; width: 100%; max-width: 300px; overflow: hidden; border: 1px solid color-mix(in oklab, var(--bone) 30%, transparent); box-shadow: 0 30px 80px -30px rgba(0,0,0,0.7); }
.mr-notes__tape { position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-3deg); width: 96px; height: 26px; background: linear-gradient(180deg, rgba(212,180,131,0.55), rgba(212,180,131,0.35)); border: 1px solid rgba(255,255,255,0.15); z-index: 2; }

.mr-notes__row { display: grid; grid-template-columns: 44px 1fr 44px; align-items: start; gap: 18px; padding: 22px 0; border-bottom: 1px solid color-mix(in oklab, var(--bone) 12%, transparent); }
.mr-notes__num { font-family: var(--font-mono); font-size: 0.85rem; color: var(--vermilion); padding-top: 0.35em; }
.mr-notes__line { font-size: clamp(1.35rem, 2.4vw, 1.9rem); line-height: 1.25; color: var(--bone); }
.mr-notes__line u { text-decoration-color: var(--vermilion); text-underline-offset: 4px; }
.mr-notes__circle { position: relative; }
.mr-notes__circle::after { content: ""; position: absolute; inset: -6px -10px; border: 1.4px solid var(--vermilion); border-radius: 50%; }
.mr-notes__box { border: 1.4px solid var(--vermilion); padding: 0 6px; border-radius: 2px; }
.mr-notes__sub { margin: 0.35em 0 0; font-family: var(--font-mono); font-size: 0.82rem; letter-spacing: 0.01em; color: color-mix(in oklab, var(--bone) 62%, transparent); }
.mr-notes__icon { color: color-mix(in oklab, var(--vermilion) 80%, var(--bone) 20%); opacity: 0.85; padding-top: 0.2em; }
.mr-notes__icon svg { width: 34px; height: 34px; }

@media (max-width: 640px) {
  .mr-notes__row { grid-template-columns: 34px 1fr; }
  .mr-notes__icon { display: none; }
  .mr-notes__stamp { width: 84px; height: 84px; }
}
`;
