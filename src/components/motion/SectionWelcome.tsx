import { useEffect, useRef, useState } from "react";

interface Props {
  text?: string;
  className?: string;
  /** Override the dev-only perf logging (defaults to import.meta.env.DEV). */
  debugPerf?: boolean;
}

/**
 * SectionWelcome — single-line "Welcome to my portfolio" morph.
 * Uses transform/opacity only, plays once when scrolled into view.
 *
 * Dev-only perf instrumentation around the morph window:
 *  • performance.mark / performance.measure → "section-welcome:morph"
 *  • PerformanceObserver('layout-shift')        → any CLS the morph causes
 *  • PerformanceObserver('long-animation-frame')→ flags >50ms frames
 *  • requestAnimationFrame sampling             → frame count + worst gap
 * Output is grouped under console.groupCollapsed('[SectionWelcome perf]').
 */
export function SectionWelcome({
  text = "Welcome to my portfolio.",
  className = "",
  debugPerf,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"idle" | "in" | "settled">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setPhase("settled");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPhase("in");
            window.setTimeout(() => setPhase("settled"), 1400);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Dev-only perf instrumentation ─────────────────────────────
  useEffect(() => {
    const enabled =
      debugPerf ??
      (typeof import.meta !== "undefined" &&
        (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true);
    if (!enabled || phase !== "in" || typeof performance === "undefined") return;

    const MARK_START = "section-welcome:start";
    const MARK_END = "section-welcome:end";
    const MEASURE = "section-welcome:morph";

    try {
      performance.mark(MARK_START);
    } catch {
      /* noop */
    }

    type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };
    let cls = 0;
    let lsObserver: PerformanceObserver | undefined;
    try {
      lsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShift[]) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
      });
      lsObserver.observe({ type: "layout-shift", buffered: false });
    } catch {
      /* unsupported in this browser */
    }

    type LongAF = PerformanceEntry & { duration: number; renderStart: number };
    const longFrames: LongAF[] = [];
    let loafObserver: PerformanceObserver | undefined;
    try {
      loafObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LongAF[]) longFrames.push(entry);
      });
      loafObserver.observe({ type: "long-animation-frame", buffered: false });
    } catch {
      /* unsupported in this browser */
    }

    let frames = 0;
    let worst = 0;
    let last = performance.now();
    let raf = 0;
    let stopped = false;
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      frames++;
      if (dt > worst) worst = dt;
      if (!stopped) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const span = spanRef.current;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      stopped = true;
      cancelAnimationFrame(raf);
      try {
        performance.mark(MARK_END);
        performance.measure(MEASURE, MARK_START, MARK_END);
      } catch {
        /* noop */
      }
      const measure = performance.getEntriesByName(MEASURE).pop();
      const dur = measure?.duration ?? 0;
      const expectedFrames = Math.round((dur / 1000) * 60);
      const dropped = Math.max(0, expectedFrames - frames);

      /* eslint-disable no-console */
      console.groupCollapsed(
        `%c[SectionWelcome perf]%c morph=${dur.toFixed(1)}ms · frames=${frames}/${expectedFrames} · worst=${worst.toFixed(1)}ms · CLS+=${cls.toFixed(4)} · LoAF=${longFrames.length}`,
        "color:#b89068;font-weight:600",
        "color:inherit",
      );
      console.log("duration (ms):", dur.toFixed(2));
      console.log("frames observed:", frames, "/ expected ≈", expectedFrames, "@60fps");
      console.log("dropped frames (approx):", dropped);
      console.log("worst frame gap (ms):", worst.toFixed(2));
      console.log("layout-shift contribution:", cls.toFixed(5));
      if (longFrames.length) {
        console.warn(
          "long-animation-frames during morph:",
          longFrames.map((f) => ({
            duration: +f.duration.toFixed(1),
            renderStart: +f.renderStart.toFixed(1),
          })),
        );
      }
      if (cls > 0.001) {
        console.warn(
          "Layout shift detected during morph. Confirm only transform/opacity changed and that ancestors aren't reflowing.",
        );
      }
      console.groupEnd();
      /* eslint-enable no-console */

      lsObserver?.disconnect();
      loafObserver?.disconnect();
      span?.removeEventListener("transitionend", finish);
    };

    span?.addEventListener("transitionend", finish);
    // Safety net in case transitionend never fires
    const safety = window.setTimeout(finish, 1600);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      lsObserver?.disconnect();
      loafObserver?.disconnect();
      span?.removeEventListener("transitionend", finish);
    };
  }, [phase, debugPerf]);

  const active = phase !== "idle";

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        contain: "layout paint",
      }}
    >
      <span
        ref={spanRef}
        style={{
          fontFamily: 'var(--font-display, "Instrument Serif", serif)',
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(22px, 2.6vw, 32px)",
          lineHeight: 1.4,
          letterSpacing: "0.005em",
          color: "var(--hero-ink, #f1ebe1)",
          opacity: active ? 1 : 0,
          transform: active ? "translate3d(0,0,0) scale(1)" : "translate3d(0,14px,0) scale(0.985)",
          transition:
            "transform 760ms cubic-bezier(.22,.7,.2,1), opacity 760ms cubic-bezier(.22,.7,.2,1)",
          willChange: phase === "in" ? "transform, opacity" : "auto",
          backfaceVisibility: "hidden",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </div>
  );
}
