"use client";
import { useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

export interface MRMonogramHandle {
  dominateM: () => gsap.core.Timeline;
  burstR: () => gsap.core.Timeline;
  lockMonogram: () => gsap.core.Timeline;
  reset: () => void;
}

interface Props {
  size?: number;
}

/**
 * MR Monogram — LIGHT THEME VERSION.
 * Uses website light theme colors:
 *   - Ink (#181818) for strokes
 *   - Vermilion (#D46A2E) for accent
 *   - Bone (#F8F5EF) background
 */
const MRMonogram = forwardRef<MRMonogramHandle, Props>(({ size = 500 }, ref) => {
  const mPathRef = useRef<SVGPathElement>(null);
  const rBowlRef = useRef<SVGPathElement>(null);
  const rLegRef = useRef<SVGLineElement>(null);
  const arrowRef = useRef<SVGPolylineElement>(null);
  const mGroupRef = useRef<SVGGElement>(null);
  const rGroupRef = useRef<SVGGElement>(null);
  const monoGroupRef = useRef<SVGGElement>(null);
  const mFlashRef = useRef<SVGCircleElement>(null);
  const rFlashRef = useRef<SVGCircleElement>(null);

  useImperativeHandle(ref, () => ({
    dominateM() {
      const tl = gsap.timeline();
      if (!mGroupRef.current || !mPathRef.current || !arrowRef.current) return tl;

      const mLen = mPathRef.current.getTotalLength();

      gsap.set(mGroupRef.current, {
        opacity: 0,
        scale: 2.5,
        y: -250,
        x: 0,
      });
      gsap.set(mPathRef.current, {
        strokeDasharray: mLen,
        strokeDashoffset: mLen,
        opacity: 1,
      });
      gsap.set(arrowRef.current, {
        strokeDasharray: arrowRef.current.getTotalLength(),
        strokeDashoffset: arrowRef.current.getTotalLength(),
        opacity: 1,
      });
      if (mFlashRef.current) gsap.set(mFlashRef.current, { opacity: 0, scale: 0.5 });

      tl.to(mGroupRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      tl.to(mPathRef.current, {
        strokeDashoffset: 0,
        duration: 0.35,
        ease: "power2.out",
      }, "-=0.4");

      tl.to(arrowRef.current, {
        strokeDashoffset: 0,
        duration: 0.25,
        ease: "power2.out",
      }, "-=0.2");

      if (mFlashRef.current) {
        tl.fromTo(mFlashRef.current, {
          opacity: 0, scale: 0.3,
        }, {
          opacity: 0.6, scale: 2.5,
          duration: 0.3, ease: "power2.out",
        }, "-=0.3");
        tl.to(mFlashRef.current, {
          opacity: 0, scale: 3,
          duration: 0.3, ease: "power2.in",
        }, "-=0.1");
      }

      return tl;
    },

    burstR() {
      const tl = gsap.timeline();
      if (!rGroupRef.current || !rBowlRef.current || !rLegRef.current) return tl;

      gsap.set(rGroupRef.current, {
        opacity: 0,
        scale: 2,
        x: 300,
        y: 0,
        rotation: 10,
      });
      gsap.set(rBowlRef.current, {
        strokeDasharray: rBowlRef.current.getTotalLength(),
        strokeDashoffset: rBowlRef.current.getTotalLength(),
        opacity: 1,
      });
      gsap.set(rLegRef.current, {
        strokeDasharray: rLegRef.current.getTotalLength(),
        strokeDashoffset: rLegRef.current.getTotalLength(),
        opacity: 1,
      });
      if (rFlashRef.current) gsap.set(rFlashRef.current, { opacity: 0, scale: 0.5 });

      tl.to(rGroupRef.current, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.45,
        ease: "power3.out",
      });

      tl.to(rBowlRef.current, {
        strokeDashoffset: 0,
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.35");

      tl.to(rLegRef.current, {
        strokeDashoffset: 0,
        duration: 0.2,
        ease: "power2.out",
      }, "-=0.15");

      if (rFlashRef.current) {
        tl.fromTo(rFlashRef.current, {
          opacity: 0, scale: 0.3,
        }, {
          opacity: 0.6, scale: 2.5,
          duration: 0.25, ease: "power2.out",
        }, "-=0.25");
        tl.to(rFlashRef.current, {
          opacity: 0, scale: 3,
          duration: 0.25, ease: "power2.in",
        }, "-=0.1");
      }

      return tl;
    },

    lockMonogram() {
      const tl = gsap.timeline();
      if (!mGroupRef.current || !rGroupRef.current || !monoGroupRef.current) return tl;

      tl.to(mGroupRef.current, {
        x: 25,
        y: -3,
        scale: 0.6,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
      tl.to(rGroupRef.current, {
        x: -18,
        y: 3,
        scale: 0.6,
        duration: 0.4,
        ease: "back.out(1.7)",
      }, "<");

      tl.to(monoGroupRef.current, {
        scale: 0.85,
        duration: 0.2,
        ease: "power2.out",
      }, "-=0.15");

      return tl;
    },

    reset() {
      if (mGroupRef.current) gsap.set(mGroupRef.current, { opacity: 0, scale: 1, y: 0, x: 0 });
      if (rGroupRef.current) gsap.set(rGroupRef.current, { opacity: 0, scale: 1, y: 0, x: 0, rotation: 0 });
      if (mPathRef.current) gsap.set(mPathRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (arrowRef.current) gsap.set(arrowRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (rBowlRef.current) gsap.set(rBowlRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (rLegRef.current) gsap.set(rLegRef.current, { strokeDashoffset: 0, opacity: 0 });
      if (mFlashRef.current) gsap.set(mFlashRef.current, { opacity: 0, scale: 1 });
      if (rFlashRef.current) gsap.set(rFlashRef.current, { opacity: 0, scale: 1 });
      if (monoGroupRef.current) gsap.set(monoGroupRef.current, { scale: 1 });
    },
  }));

  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 600 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block mx-auto"
      style={{ maxWidth: "85vw", height: "auto" }}
    >
      <defs>
        <filter id="giant-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ink → Vermilion gradient for M (light theme) */}
        <linearGradient id="m-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#181818" />
          <stop offset="40%" stopColor="#D46A2E" />
          <stop offset="80%" stopColor="#181818" />
          <stop offset="100%" stopColor="#555555" />
        </linearGradient>

        {/* R gradient */}
        <linearGradient id="r-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D46A2E" />
          <stop offset="50%" stopColor="#181818" />
          <stop offset="100%" stopColor="#555555" />
        </linearGradient>

        <radialGradient id="flash-grad-big" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D46A2E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D46A2E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g ref={monoGroupRef} style={{ filter: "url(#giant-glow)" }}>
        {/* M GROUP */}
        <g ref={mGroupRef}>
          <circle ref={mFlashRef} cx="170" cy="150" r="90" fill="url(#flash-grad-big)" opacity="0" />
          <path
            ref={mPathRef}
            d="M 100 290
               L 100 60
               L 180 170
               L 260 45
               L 260 290"
            stroke="url(#m-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
          <polyline
            ref={arrowRef}
            points="205,8 260,45 278,15"
            stroke="#D46A2E"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
        </g>

        {/* R GROUP */}
        <g ref={rGroupRef}>
          <circle ref={rFlashRef} cx="400" cy="150" r="90" fill="url(#flash-grad-big)" opacity="0" />
          <line
            x1="330"
            y1="290"
            x2="330"
            y2="45"
            stroke="url(#r-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0"
          />
          <path
            ref={rBowlRef}
            d="M 330 45
               Q 420 45 420 110
               Q 420 175 330 175"
            stroke="url(#r-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0"
          />
          <line
            ref={rLegRef}
            x1="330"
            y1="175"
            x2="420"
            y2="290"
            stroke="#D46A2E"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0"
          />
        </g>
      </g>
    </svg>
  );
});

MRMonogram.displayName = "MRMonogram";
export default MRMonogram;