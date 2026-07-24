import { useEffect, useRef, useState } from "react";

const WELCOME = "Welcome to My Portfolio";

interface Props {
  onEnter: () => void;
  taglineRef: React.RefObject<HTMLElement | null>;
}

/**
 * Minimal welcome beat: one elegant line beneath the name, held ~1s,
 * then fades to hand the stage to the hero. No morph, no rotation.
 */
export function WelcomeRotator({ onEnter, taglineRef }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [anchor, setAnchor] = useState<{ left: number; top: number; width: number } | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const letters = Array.from(WELCOME);

  useEffect(() => {
    let raf = 0;
    function measure() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = taglineRef.current?.getBoundingClientRect();
        if (!t) return;
        const vw = window.innerWidth;
        const offset = vw < 640 ? 6 : vw < 1024 ? 10 : 14;
        setAnchor({ left: t.left, top: t.top - offset, width: t.width });
      });
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.addEventListener("scroll", measure, { passive: true });
    (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    if (taglineRef.current) ro.observe(taglineRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [taglineRef]);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { onEnter(); return; }

    // in (700ms cascade) → hold (1000ms) → out (500ms) → onEnter
    const t1 = window.setTimeout(() => setPhase("hold"), 700);
    const t2 = window.setTimeout(() => setPhase("out"), 1700);
    const t3 = window.setTimeout(onEnter, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onEnter]);

  const leaving = phase === "out";

  if (!anchor) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: anchor.left,
        top: anchor.top,
        width: anchor.width,
        zIndex: 55,
        pointerEvents: "none",
        contain: "layout paint",
      }}
    >
      <div
        ref={textRef}
        style={{
          position: "relative",
          maxWidth: "min(720px, 96vw)",
          fontFamily:
            'var(--font-display, "Fraunces Variable", "Instrument Serif", "Cormorant Garamond", Georgia, serif)',
          fontStyle: "italic",
          fontWeight: 380,
          fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
          fontSize: "clamp(20px, 4.2vw, 50px)",
          lineHeight: 1.08,
          letterSpacing: "-0.022em",
          background:
            "linear-gradient(96deg, #b14a1f 0%, #d97a2b 22%, #2a1f1a 52%, #5b3a86 82%, #8a5cc4 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: leaving ? 0 : 1,
          transform: leaving ? "translate3d(0,-4px,0)" : "translate3d(0,0,0)",
          transition:
            "opacity 480ms cubic-bezier(.22,.7,.2,1), transform 480ms cubic-bezier(.22,.7,.2,1)",
          willChange: "transform, opacity",
        }}
      >
        <span style={{ position: "relative", display: "inline-block" }}>
          {letters.map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: phase === "in" ? 0 : 1,
                transform:
                  phase === "in"
                    ? "translate3d(0, 0.4em, 0)"
                    : "translate3d(0,0,0)",
                filter: phase === "in" ? "blur(8px)" : "blur(0px)",
                transition: `opacity 540ms cubic-bezier(.22,.7,.2,1) ${i * 22}ms, transform 620ms cubic-bezier(.22,.7,.2,1) ${i * 22}ms, filter 540ms ease ${i * 22}ms`,
                willChange: "opacity, transform, filter",
              }}
            >
              {ch}
            </span>
          ))}
        </span>

        <span
          aria-hidden
          style={{
            display: "block",
            height: 1,
            marginTop: 12,
            width: phase === "in" ? "0%" : leaving ? "0%" : "38%",
            background:
              "linear-gradient(90deg, #d97a2b 0%, #b14a1f 35%, #5b3a86 75%, #8a5cc4 100%)",
            borderRadius: 2,
            transition: "width 800ms cubic-bezier(.22,.7,.2,1) 150ms, opacity 400ms ease",
            opacity: leaving ? 0 : 0.9,
          }}
        />
      </div>
    </div>
  );
}
