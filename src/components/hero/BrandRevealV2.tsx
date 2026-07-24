import { useEffect, useRef } from "react";

/**
 * BrandRevealV2 — Custom MR monogram → portrait halo + "Manikanta R"
 *
 * Phases
 * 1. veil        — particles awaken from a faint center spark
 * 2. assemble    — particles draw a custom luxury MR monogram (vector,
 *                  no font) inside a hairline ring with serifed terminals
 * 3. hold        — quiet beat, monogram breathes
 * 4. fracture    — particles split with intent:
 *                    · ~32% migrate to the portrait perimeter, drawing
 *                      a circular halo of light (the portrait is born
 *                      from these fragments via an iris reveal)
 *                    · ~68% migrate to the exact final glyph positions
 *                      of "Manikanta R" sampled from the live DOM
 * 5. handoff     — particles dissolve while the hero un-veils. Final
 *                  frame of the reveal == first frame of the hero. No
 *                  layout shift, no snap.
 *
 * Parent owns the portrait iris (clip-path) and the hero blur — those
 * are released on `onWake` so the birth of the portrait and the morph
 * of the name happen as one synchronized transformation.
 */

interface Props {
  row1Ref: React.RefObject<HTMLElement | null>;
  row2Ref: React.RefObject<HTMLElement | null>;
  portraitRef: React.RefObject<HTMLElement | null>;
  onWake: () => void;
  onDone: () => void;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  ox: number; oy: number;
  mrX: number; mrY: number;
  finalX: number; finalY: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  shade: number;
  warm: number; // 0..1 — chooses between cool ivory and warm gold for richness
}

const PARTICLE_COUNT = 2800;
const PORTRAIT_RATIO = 0.32; // 32% of particles sculpt the portrait halo

function samplePoints(
  draw: (ctx: CanvasRenderingContext2D) => void,
  W: number,
  H: number,
  step: number,
): { x: number; y: number }[] {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  draw(ctx);
  const data = ctx.getImageData(0, 0, W, H).data;
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 120) pts.push({ x, y });
    }
  }
  return pts;
}

function distribute(targets: { x: number; y: number }[], count: number) {
  if (targets.length === 0) {
    return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  }
  const out: { x: number; y: number }[] = new Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = targets[Math.floor((i * targets.length) / count)];
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Custom luxury MR monogram. Pure vector — no font.
 *
 * Anatomy: a hairline diamond hallmark frames a thin double-ring. Inside
 * the ring, M and R are drawn as an interlocking ligature: the M's right
 * stem is shared with the R's spine. Serifs are tapered Didone tics.
 * Bracketed counters and a tiny anchor mark below complete the wordmark.
 */
function drawMonogram(c: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  c.save();
  c.strokeStyle = "#fff";
  c.fillStyle = "#fff";
  c.lineCap = "round";
  c.lineJoin = "round";

  // Outer diamond hallmark
  c.lineWidth = Math.max(1, size * 0.004);
  c.beginPath();
  c.moveTo(cx, cy - size * 0.62);
  c.lineTo(cx + size * 0.62, cy);
  c.lineTo(cx, cy + size * 0.62);
  c.lineTo(cx - size * 0.62, cy);
  c.closePath();
  c.stroke();

  // Outer ring
  c.lineWidth = Math.max(2, size * 0.010);
  c.beginPath();
  c.arc(cx, cy, size * 0.50, 0, Math.PI * 2);
  c.stroke();

  // Inner hairline ring
  c.lineWidth = Math.max(1, size * 0.003);
  c.beginPath();
  c.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  c.stroke();

  // Cardinal serif ticks on the ring
  c.lineWidth = Math.max(1, size * 0.005);
  for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const x1 = cx + Math.cos(a) * size * 0.50;
    const y1 = cy + Math.sin(a) * size * 0.50;
    const x2 = cx + Math.cos(a) * size * 0.54;
    const y2 = cy + Math.sin(a) * size * 0.54;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }

  // ── MR ligature ─────────────────────────────────────────────
  c.translate(cx, cy);
  const h = size * 0.30;              // letter half-height
  const stem = Math.max(3, size * 0.024);

  // M — left stem (tapered Didone)
  c.beginPath();
  c.moveTo(-size * 0.32 - stem * 0.55, -h);
  c.lineTo(-size * 0.32 + stem * 0.55, -h);
  c.lineTo(-size * 0.32 + stem * 0.35,  h);
  c.lineTo(-size * 0.32 - stem * 0.35,  h);
  c.closePath();
  c.fill();

  // M — left diagonal (tapered)
  c.beginPath();
  c.moveTo(-size * 0.32 + stem * 0.55, -h);
  c.lineTo(-size * 0.32 + stem * 1.15, -h);
  c.lineTo(-size * 0.030,  h * 0.34);
  c.lineTo(-size * 0.075,  h * 0.34);
  c.closePath();
  c.fill();

  // M — right diagonal (tapered)
  c.beginPath();
  c.moveTo( size * 0.075,  h * 0.34);
  c.lineTo( size * 0.030,  h * 0.34);
  c.lineTo( size * 0.02 - stem * 1.15, -h);
  c.lineTo( size * 0.02 - stem * 0.55, -h);
  c.closePath();
  c.fill();
  // mirror to right side
  c.beginPath();
  c.moveTo( size * 0.030,  h * 0.34);
  c.lineTo( size * 0.075,  h * 0.34);
  c.lineTo( size * 0.32 - stem * 0.55, -h);
  c.lineTo( size * 0.32 - stem * 1.15, -h);
  c.closePath();
  c.fill();

  // Shared stem — M's right / R's spine
  c.beginPath();
  c.moveTo( size * 0.32 - stem * 0.55, -h);
  c.lineTo( size * 0.32 + stem * 0.55, -h);
  c.lineTo( size * 0.32 + stem * 0.35,  h);
  c.lineTo( size * 0.32 - stem * 0.35,  h);
  c.closePath();
  c.fill();

  // R — bowl as a stroked semicircle hugging the shared spine
  c.lineWidth = Math.max(3, size * 0.020);
  c.beginPath();
  c.arc(size * 0.32, -h * 0.42, h * 0.58, -Math.PI / 2, Math.PI / 2);
  c.stroke();

  // R — tapered leg
  c.beginPath();
  c.moveTo(size * 0.32, h * 0.10);
  c.lineTo(size * 0.32 + h * 0.60, h * 0.10);
  c.lineTo(size * 0.50, h);
  c.lineTo(size * 0.44, h);
  c.closePath();
  c.fill();

  // Didone serif caps on M outer stem
  c.lineWidth = Math.max(2, size * 0.007);
  c.beginPath();
  c.moveTo(-size * 0.37, -h); c.lineTo(-size * 0.27, -h);
  c.moveTo(-size * 0.37,  h); c.lineTo(-size * 0.27,  h);
  c.stroke();

  c.restore();

  // Tiny wordmark anchor below the ring
  c.save();
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = `300 ${Math.max(9, size * 0.026)}px ui-monospace, "JetBrains Mono", monospace`;
  c.fillText("M  ·  R", cx, cy + size * 0.72);
  c.restore();
}

export function BrandRevealV2({ row1Ref, row2Ref, portraitRef, onWake, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skippedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onWake();
      onDone();
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;

    // Custom monogram sampling
    const mrSize = Math.min(W * 0.40, H * 0.60);
    const mrRaw = samplePoints((c) => drawMonogram(c, cx, cy, mrSize), W, H, 4);

    // Portrait halo sampling — particles draw the circumference of the
    // portrait so it feels born from the fragments themselves.
    const portraitTargets: { x: number; y: number }[] = [];
    if (portraitRef.current) {
      const r = portraitRef.current.getBoundingClientRect();
      const pcx = r.left + r.width / 2;
      const pcy = r.top + r.height / 2;
      const radius = Math.min(r.width, r.height) / 2;
      // Dense outer ring + sparse inner scatter for soft volume
      const RING_COUNT = 1200;
      for (let i = 0; i < RING_COUNT; i++) {
        const a = (i / RING_COUNT) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 6;
        portraitTargets.push({
          x: pcx + Math.cos(a) * (radius + jitter),
          y: pcy + Math.sin(a) * (radius + jitter),
        });
      }
      // Inner soft scatter (sparse, biased to upper-light area)
      const INNER = 300;
      for (let i = 0; i < INNER; i++) {
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random()) * radius * 0.92;
        portraitTargets.push({ x: pcx + Math.cos(a) * rr, y: pcy + Math.sin(a) * rr });
      }
    }

    // Final headline sampling from live DOM
    const nameTargets: { x: number; y: number }[] = [];
    const drawRow = (el: HTMLElement | null, text: string) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      const pts = samplePoints((c) => {
        c.fillStyle = "#fff";
        c.textBaseline = "alphabetic";
        c.textAlign = "left";
        c.font = `italic ${cs.fontWeight} ${fs}px "Instrument Serif", "Fraunces Variable", serif`;
        c.fillText(text, r.left, r.top + fs * 0.82);
      }, W, H, 5);
      nameTargets.push(...pts);
    };
    drawRow(row1Ref.current, "Manikanta");
    drawRow(row2Ref.current, "R.");

    const portraitCount = Math.floor(PARTICLE_COUNT * PORTRAIT_RATIO);
    const nameCount = PARTICLE_COUNT - portraitCount;

    const mrTargets = distribute(mrRaw, PARTICLE_COUNT);
    const portraitDist = distribute(portraitTargets, portraitCount);
    const nameDist = distribute(nameTargets, nameCount);

    const particles: Particle[] = new Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isPortrait = i < portraitCount;
      const finalT = isPortrait ? portraitDist[i] : nameDist[i - portraitCount];
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 220;
      particles[i] = {
        x: cx + (Math.random() - 0.5) * 4,
        y: cy + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ox: cx,
        oy: cy,
        mrX: mrTargets[i].x,
        mrY: mrTargets[i].y,
        finalX: finalT.x,
        finalY: finalT.y,
        size: isPortrait ? 0.7 + Math.random() * 1.2 : 0.5 + Math.random() * 1.4,
        baseAlpha: 0.55 + Math.random() * 0.45,
        alpha: 0,
        shade: 0.7 + Math.random() * 0.3,
        warm: isPortrait ? 0.6 + Math.random() * 0.4 : Math.random() * 0.35,
      };
    }

    // Cinematic timing — entire reveal ≈ 5.2s
    const T = {
  veil: 0.40,
  assemble: 1.40,
  hold: 2.20,
  fracture: 3.60,
  handoff: 5.20,
};

    let wakeFired = false;
    let start = 0;
    let raf = 0;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const draw = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      // Subtle motion trail for fluid feel (no harsh wipe)
      ctx.fillStyle = "rgba(10,9,8,0.22)";
      ctx.fillRect(0, 0, W, H);

      // Soft vignette
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      grd.addColorStop(0, "rgba(10,9,8,0)");
      grd.addColorStop(1, "rgba(10,9,8,0.55)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      if (t < T.veil) {
        const k = t / T.veil;
        const slow = 1 - k * 0.5;
        const a = Math.min(1, k * 2.2);
        for (const p of particles) {
          p.x += p.vx * 0.016 * slow;
          p.y += p.vy * 0.016 * slow;
          p.alpha = p.baseAlpha * a * 0.65;
        }
      } else if (t < T.assemble) {
        const k = (t - T.veil) / (T.assemble - T.veil);
        const e = ease(k);
        for (const p of particles) {
          if (k < 0.02) { p.ox = p.x; p.oy = p.y; }
          p.x = p.ox + (p.mrX - p.ox) * e;
          p.y = p.oy + (p.mrY - p.oy) * e;
          p.alpha = p.baseAlpha;
        }
      } else if (t < T.hold) {
        // Quiet breath on the monogram
        const breath = Math.sin((t - T.assemble) * Math.PI * 2) * 0.4;
        for (const p of particles) {
          p.x = p.mrX + (Math.random() - 0.5) * 0.6 + breath * 0.2;
          p.y = p.mrY + (Math.random() - 0.5) * 0.6;
          p.alpha = p.baseAlpha;
        }
      } else if (t < T.fracture) {
        // Wake hero early so portrait iris opens AS particles arrive
        const k = (t - T.hold) / (T.fracture - T.hold);
        const e = easeInOut(k);
        for (const p of particles) {
          p.x = p.mrX + (p.finalX - p.mrX) * e;
          p.y = p.mrY + (p.finalY - p.mrY) * e;
          p.alpha = p.baseAlpha;
        }
        if (!wakeFired) {
  wakeFired = true;
  onWake();
}
      } else if (t < T.handoff) {
        const k = (t - T.fracture) / (T.handoff - T.fracture);
        const fade = 1 - k;
        for (const p of particles) {
          p.x = p.finalX + (Math.random() - 0.5) * 0.4;
          p.y = p.finalY + (Math.random() - 0.5) * 0.4;
          p.alpha = p.baseAlpha * fade;
        }
      } else {
        cancelAnimationFrame(raf);
        onDone();
        return;
      }

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        if (p.alpha <= 0.02) continue;
        const s = p.shade;
        // Warm gold (portrait halo) ↔ cool ivory (name) blend
        const r = Math.round((230 + s * 25) * (1 - p.warm) + 232 * p.warm);
        const g = Math.round((228 + s * 22) * (1 - p.warm) + 198 * p.warm);
        const b = Math.round((220 + s * 25) * (1 - p.warm) + 140 * p.warm);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalCompositeOperation = "source-over";
      

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const skip = () => {
      if (skippedRef.current) return;
      skippedRef.current = true;
      cancelAnimationFrame(raf);
      if (!wakeFired) onWake();
      onDone();
    };
    window.addEventListener("click", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchstart", skip, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: "none",
        background: "rgba(10,9,8,0.94)",
      }}
    />
  );
}
