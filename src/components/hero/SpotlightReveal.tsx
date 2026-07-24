import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";

/**
 * SpotlightReveal — Camera-focus unveil.
 *
 * Timeline (~4.6s)
 *  0.0 – 1.2s  spotlight sweeps from off-left to the portrait
 *  1.2 – 1.6s  portrait holds in focus (onPortraitFocus)
 *  1.6 – 2.3s  spotlight glides to screen-center, MR monogram fades in
 *  2.3 – 3.0s  monogram holds
 *  3.0 – 3.6s  spotlight glides to name position, monogram dissolves,
 *              DOM name un-blurs (onNameReveal)
 *  3.6 – 4.4s  hold for "Welcome to My Portfolio" beat
 *  4.4 – 5.0s  spotlight widens to full frame, veil dissolves (onDone)
 */

interface Props {
  portraitRef: React.RefObject<HTMLElement | null>;
  row1Ref: React.RefObject<HTMLElement | null>;
  onPortraitFocus: () => void;
  onNameReveal: () => void;
  onDone: () => void;
}

export function SpotlightReveal({
  portraitRef,
  row1Ref,
  onPortraitFocus,
  onNameReveal,
  onDone,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const ghostMRef = useRef<HTMLSpanElement>(null);
  const ghostRRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onPortraitFocus();
      onNameReveal();
      onDone();
      setDone(true);
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    void portraitRef.current?.getBoundingClientRect();
    const cX = W / 2;
    const cY = H / 2;

    // Exact DOM targets: the leading "M" of "Manikanta" and the standalone "R".
    const mEl = document.querySelector<HTMLElement>(".hero-letter-anchor");
    const rEl = document.querySelector<HTMLElement>(".hero-letter--R");
    const mRect = mEl?.getBoundingClientRect();
    const rRect = rEl?.getBoundingClientRect();
    // Approx width of a single capital glyph at the hero size — use line height.
    const glyphHalfM = mRect ? mRect.height * 0.32 : 80;
    const mCx = mRect ? mRect.left + glyphHalfM : cX - 260;
    const mCy = mRect ? mRect.top + mRect.height / 2 : cY + 120;
    const rCx = rRect ? rRect.left + rRect.width / 2 : cX + 260;
    const rCy = rRect ? rRect.top + rRect.height / 2 : cY + 280;
    const targetMX = mCx - cX;
    const targetMY = mCy - cY;
    const targetRX = rCx - cX;
    const targetRY = rCy - cY;


    const ease = (t: number) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let raf = 0;
    let portraitFired = false;
    let nameFired = false;
    let widenFired = false;
    const start = performance.now();

    // Premium tempo (~5.6s)
    const T = {
      emerge:      700,   // MR fades up
      holdLogo:    1300,   // logo holds + "Welcome to Portfolio" caption fades in
      transform:   2200,   // MR splits — M flies left toward name start, R flies right toward name end
      holdReveal:  2700,   // name visible, brief welcome beat
      widen:       3300,   // spotlight widens, veil dissolves
    };

    const apply = (
      x: number, y: number, r: number,
      monoOp: number, monoScale: number,
      capOp: number,
      splitK: number, splitFade: number,
    ) => {
      if (overlayRef.current) {
        overlayRef.current.style.background = `radial-gradient(circle ${r}px at ${x}px ${y}px, rgba(10,9,8,0) 0%, rgba(10,9,8,0.05) 38%, rgba(10,9,8,0.92)' 78%, rgba(10,9,8,0.97) 100%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle ${r * 0.7}px at ${x}px ${y}px, rgba(255,228,180,0.22) 0%, rgba(255,228,180,0.08) 38%, rgba(255,228,180,0) 72%)`;
      }
      if (monoRef.current) {
        monoRef.current.style.opacity = String(monoOp * (1 - splitFade));
        monoRef.current.style.transform = `translate(-50%,-50%) scale(${monoScale})`;
      }
      if (captionRef.current) {
        captionRef.current.style.opacity = String(capOp * (1 - splitFade));
      }
      if (ghostMRef.current && ghostRRef.current) {
        const op = splitK > 0 ? Math.min(1, splitK * 1.6) * (1 - Math.max(0, (splitK - 0.7) / 0.3)) : 0;
        const dxM = targetMX * splitK;
        const dyM = targetMY * splitK;
        const dxR = targetRX * splitK;
        const dyR = targetRY * splitK;
        const sc  = 1 - splitK * 0.45;
        ghostMRef.current.style.opacity = String(op);
        ghostMRef.current.style.transform = `translate(calc(-50% + ${dxM}px), calc(-50% + ${dyM}px)) scale(${sc})`;
        ghostRRef.current.style.opacity = String(op);
        ghostRRef.current.style.transform = `translate(calc(-50% + ${dxR}px), calc(-50% + ${dyR}px)) scale(${sc})`;
      }

    };

    const tick = (now: number) => {
      const t = now - start;
      let x = cX, y = cY, r = 60;
      let monoOp = 0, monoScale = 0.82;
      let capOp = 0;
      let splitK = 0, splitFade = 0;

      if (t < T.emerge) {
        const k = ease(t / T.emerge);
        r = 60 + k * 320;
        monoOp = k;
        monoScale = 0.82 + k * 0.18;
      } else if (t < T.holdLogo) {
        r = 240;
        monoOp = 1; monoScale = 1;
        capOp = ease((t - T.emerge) / (T.holdLogo - T.emerge));
      } else if (t < T.transform) {
        const k = ease((t - T.holdLogo) / (T.transform - T.holdLogo));
        r = 420 + k * 360;
        monoOp = 1 - k * 0.4;
        monoScale = 1 + k * 0.06;
        capOp = 1;
        splitK = k;
        splitFade = k;
        if (!portraitFired && k > 0.20) { portraitFired = true; onPortraitFocus(); }
        if (!nameFired && k > 0.45)     { nameFired = true; onNameReveal(); }
      } else if (t < T.holdReveal) {
        r = 380;
        monoOp = 0; splitK = 1; splitFade = 1;
      } else if (t < T.widen) {
        const k = (t - T.holdReveal) / (T.widen - T.holdReveal);
        r = 380 + k * 600;
        splitFade = 1;
        if (overlayRef.current) overlayRef.current.style.opacity = String(1 - k);
        if (glowRef.current)    glowRef.current.style.opacity    = String(1 - k);
      } else {
        if (!widenFired) {
          widenFired = true;
          onDone();
          setDone(true);
        }
        return;
      }

      apply(x, y, r, monoOp, monoScale, capOp, splitK, splitFade);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const skip = () => {
      cancelAnimationFrame(raf);
      if (!portraitFired) onPortraitFocus();
      if (!nameFired) onNameReveal();
      if (!widenFired) onDone();
      setDone(true);
    };
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none" }}
    >
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle 60px at 50% 50%, rgba(10,9,8,0) 0%, rgba(10,9,8,0.98) 100%)",
          willChange: "background, opacity",
        }}
      />
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "normal",
          willChange: "background, opacity",
        }}
      />
      {/* Main monogram */}
      <div
        ref={monoRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%) scale(0.82)",
          opacity: 0,
          willChange: "opacity, transform",
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
        }}
      >
        <MRMonogram size={180} />
      </div>

      {/* Welcome caption — sits below the monogram */}
      <div
        ref={captionRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(50% + 120px)",
          transform: "translate(-50%, 0)",
          opacity: 0,
          willChange: "opacity",
          color: "#F5F5F5",
          fontFamily: "'Fraunces', ui-serif, Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(14px, 1.6vw, 20px)",
          letterSpacing: "0.08em",
textTransform: "none",
          textShadow: "0 2px 14px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        Research • Analytics • Intelligence

      </div>

      {/* Split letter ghosts — fly from MR toward the hero name */}
      <span
        ref={ghostMRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0,
          willChange: "opacity, transform",
          color: "#F5F5F5",
          fontFamily: "'Fraunces', ui-serif, Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(80px, 14vw, 220px)",
          lineHeight: 1,
          textShadow: "0 10px 40px rgba(0,0,0,0.55)",
          pointerEvents: "none",
        }}
      >
        M
      </span>
      <span
        ref={ghostRRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0,
          willChange: "opacity, transform",
          color: "#f1dfae",
          fontFamily: "'Fraunces', ui-serif, Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(80px, 14vw, 220px)",
          lineHeight: 1,
          textShadow: "0 10px 40px rgba(0,0,0,0.55)",
          pointerEvents: "none",
        }}
      >
        R
      </span>
    </div>
  );
}

export function MRMonogram({ size = 240, tone = "gold" }: { size?: number; tone?: "gold" | "ink" }) {
  // Permanent brand identity — geometric M+R+uptrend monogram.
  // `gold` uses warm champagne for dark intro, `ink` for light surfaces.
  const color = tone === "gold" ? "#e8cf9c" : "#0d0d0d";
  return (
    <div style={{ color, display: "inline-flex", lineHeight: 0 }}>
      <BrandMark size={size} strokeWidth={6} />
    </div>
  );
}
