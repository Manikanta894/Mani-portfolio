"use client";
/**
 * Ch13BeyondMe — the final chapter. A long-form, editorial narrative
 * that introduces the person behind the portfolio. Not a card grid.
 * Not a card. A piece of writing meant to be read.
 */
import { Reveal, MaskReveal } from "@/components/motion/primitives";
import usePortfolio from "@/hooks/usePortfolio";

export function Ch13BeyondMe() {
  const { profile } = usePortfolio();
  const beyondData = profile?.beyond || {
    number: "11",
    kicker: "Final Chapter",
    title: "Beyond My Portfolio",
    lede: "If you've read this far, you already know what I've done. This chapter is the quieter one — about why I keep doing it, and the person who shows up when no one is watching.",
    movements: [
      { heading: "Who I really am", body: ["I'm a curious kid who never grew out of asking why. I grew up in a household where ambition wasn't loud, but discipline was. The work always came before the reward. I'm still wired that way.", "Strip away the degrees, the certifications, the papers — what's left is someone who likes sitting with a hard question longer than most people are comfortable with."] },
      { heading: "What motivates me", body: ["I'm not motivated by titles. I'm motivated by the small click of understanding — that quiet moment when a dataset, a person, or a problem finally makes sense. Most days, that's enough.", "I want to do work that outlives the quarter. Work that compounds. Work I'd be proud to put my name on twenty years from now."] },
      { heading: "Why I love research", body: ["Because research is the most honest form of thinking I know. You can't bluff your way through a literature review. The footnotes don't lie. The data either supports the claim or it doesn't.", "Research taught me that being wrong on paper is cheaper than being wrong in production. So I rehearse my arguments here first, where the cost of being mistaken is only my own ego."] },
      { heading: "Why I chose analytics", body: ["Because people are the most under-measured variable in business. We measure machines, transactions and revenue with surgical precision, then make decisions about humans on gut and folklore. That asymmetry bothers me.", "Analytics is my way of giving people the same care and rigor we give to inventory."] },
      { heading: "What keeps me learning", body: ["The certainty that I'm wrong about something today, and I haven't found it yet. That sentence used to scare me. Now it's the thing that gets me out of bed."] },
      { heading: "My biggest ambitions", body: ["To build something durable in the people-and-data space. A practice, a product, a body of research — I don't know yet which one. What I do know is that I want to leave the field a little more rigorous than I found it."] },
      { heading: "My biggest fears", body: ["Becoming the kind of person who stops learning because he started getting praised. Confident, comfortable, and quietly mediocre. I'd rather stay a little uncertain forever."] },
      { heading: "What success means to me", body: ["Doing work I respect, with people I respect, for problems that matter. That's the whole definition. Anything else is decoration."] },
      { heading: "What I want to build over the next decade", body: ["A body of work at the seam between people and AI — research, products, and frameworks that make organizations more humane and more honest about what their data actually says.", "And, quietly: a life that compounds. Health, family, a few deep friendships, and a craft I'm still excited about at fifty."] },
    ],
    moments: [
      { k: "Currently reading", v: "Range — David Epstein" },
      { k: "Currently learning", v: "Causal inference for HR" },
      { k: "Favourite quote", v: "\u201CThe expert in anything was once a beginner.\u201D \u2014 Helen Hayes" },
      { k: "Dream destinations", v: "Kyoto \u00B7 Reykjav\u00EDk \u00B7 Cape Town" },
      { k: "Life principles", v: "Compound. Be early. Be kind. Ship." },
      { k: "Currently exploring", v: "Algorithmic HRM \u00B7 ethics of people data" },
      { k: "Things that inspire me", v: "Long-form writing \u00B7 craftspeople \u00B7 quiet ambition" },
      { k: "Future goals", v: "A research lab \u00B7 a published book \u00B7 a practice of my own" },
    ],
    closing: "This portfolio tells the story of what I've done. The next chapter is what we'll build together.",
    closingNote: "Continue, if you'd like, to Contact \u2193",
  };

  return (
    <section id="beyond-me" data-mood="ink" className="relative chapter-pad grain overflow-hidden" aria-labelledby="beyond-me-title">
      <div aria-hidden className="mr-beyond__ambient" />
      <div className="relative mx-auto max-w-3xl">
        <div className="text-mono text-meta text-ink/55">/{beyondData.number} \u2014 {beyondData.kicker}</div>
        <h2 id="beyond-me-title" className="text-display mt-5 leading-[0.95] text-[clamp(2.6rem,7vw,5.6rem)]">
          <MaskReveal><span className="italic">Beyond</span></MaskReveal>
          <MaskReveal><span> My Portfolio</span></MaskReveal>
        </h2>
        <Reveal>
          <p className="mt-10 text-display text-[clamp(1.25rem,2vw,1.65rem)] leading-[1.45] text-ink/85">{beyondData.lede}</p>
        </Reveal>
        <div className="mr-beyond__rule mt-14" aria-hidden />
        <div className="mt-14 space-y-20">
          {(beyondData.movements || []).map((m: any, i: number) => (
            <Reveal key={m.heading} delay={i * 0.04}>
              <article className="mr-beyond__movement">
                <h3 className="mr-beyond__heading"><span className="mr-beyond__heading-num tabular-nums">{String(i + 1).padStart(2, "0")}</span><span>{m.heading}</span></h3>
                <div className="mr-beyond__prose">{(m.body || []).map((p: string, j: number) => <p key={j}>{p}</p>)}</div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mr-beyond__rule mt-24" aria-hidden />
        <Reveal>
          <div className="mt-16">
            <div className="text-mono text-meta uppercase tracking-[0.22em] text-ink/55">Marginalia \u00B7 small personal moments</div>
            <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
              {(beyondData.moments || []).map((m: any) => (
                <div key={m.k} className="mr-beyond__moment"><dt>{m.k}</dt><dd>{m.v}</dd></div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-28 text-center">
            <p className="text-display italic text-[clamp(1.6rem,3.6vw,3.1rem)] leading-[1.2] text-ink/95">
              <span className="mr-beyond__pull">\u201C</span>{beyondData.closing}<span className="mr-beyond__pull">\u201D</span>
            </p>
            <p className="mt-8 text-mono text-meta uppercase tracking-[0.32em] text-ink/45">{beyondData.closingNote}</p>
          </div>
        </Reveal>
      </div>
      <style>{css}</style>
    </section>
  );
}

const css = `
.mr-beyond__ambient { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(60% 40% at 22% 18%, color-mix(in oklab, var(--vermilion) 8%, transparent), transparent 70%), radial-gradient(50% 35% at 82% 78%, color-mix(in oklab, var(--vermilion) 6%, transparent), transparent 72%), radial-gradient(70% 50% at 50% 100%, color-mix(in oklab, var(--ink) 10%, transparent), transparent 75%); mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%); }
.mr-beyond__rule { height: 1px; background: linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--ink) 26%, transparent) 50%, transparent 100%); }
.mr-beyond__movement { display: grid; grid-template-columns: minmax(0, 1fr); gap: 18px; }
.mr-beyond__heading { display: flex; align-items: baseline; gap: 18px; font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: clamp(1.5rem, 2.6vw, 2.1rem); line-height: 1.15; color: var(--ink); }
.mr-beyond__heading-num { font-family: var(--font-mono); font-style: normal; font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--vermilion); padding-top: 0.4em; }
.mr-beyond__prose p { font-family: var(--font-display); font-size: clamp(1.05rem, 1.45vw, 1.22rem); line-height: 1.7; color: color-mix(in oklab, var(--ink) 88%, transparent); margin: 0; }
.mr-beyond__prose p + p { margin-top: 1.1em; }
.mr-beyond__prose p::first-letter { font-family: var(--font-display); font-style: italic; }
.mr-beyond__moment { display: grid; grid-template-columns: 1fr; gap: 4px; padding-bottom: 14px; border-bottom: 1px dashed color-mix(in oklab, var(--ink) 16%, transparent); }
.mr-beyond__moment dt { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, var(--ink) 55%, transparent); }
.mr-beyond__moment dd { margin: 0; font-family: var(--font-display); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.45; color: var(--ink); }
.mr-beyond__pull { color: var(--vermilion); font-style: normal; padding: 0 0.15em; opacity: 0.85; }
`;
